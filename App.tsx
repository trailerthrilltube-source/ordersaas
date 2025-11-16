

import React, { createContext, useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseActive } from './lib/supabaseClient';

import { ThemeProvider } from './components/ThemeProvider';
import LandingPage from './pages/marketing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import OrdersPage from './pages/dashboard/OrdersPage';
import MenuPage from './pages/dashboard/MenuPage';
import StorefrontPage from './pages/storefront/StorefrontPage';
import { Tenant, TenantUser, UserRole } from './types';
import PromotionsPage from './pages/dashboard/PromotionsPage';
import StaffPage from './pages/dashboard/StaffPage';
import AnnouncementsPage from './pages/dashboard/AnnouncementsPage';
import StoreHoursPage from './pages/dashboard/StoreHoursPage';
import StoreSettingsPage from './pages/dashboard/StoreSettingsPage';
import ReportsPage from './pages/dashboard/ReportsPage';
import CheckoutPage from './pages/storefront/CheckoutPage';
import SuccessPage from './pages/storefront/SuccessPage';

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgZmlsbD0iI2NjYyI+SW1hZ2U8L3RleHQ+PC9zdmc+';

interface AppContextType {
    session: Session | null;
    loading: boolean;
    tenant: Tenant | null;
    user: TenantUser | null;
    logout: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const App: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [user, setUser] = useState<TenantUser | null>(null);
    const [loading, setLoading] = useState(true);

    const createInitialUserData = async (user: User) => {
        try {
            // 1. Create Profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                    id: user.id,
                    full_name: user.user_metadata.full_name,
                    avatar_url: placeholderImage,
                });
            
            if (profileError) throw profileError;

            // 2. Create Tenant
            const slugBase = (user.user_metadata.store_name || 'new-store').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            const slug = `${slugBase}-${user.id.substring(0, 4)}`; // Add part of user ID for uniqueness

            const { data: tenantData, error: tenantError } = await supabase
                .from('tenants')
                .insert({
                    name: user.user_metadata.store_name,
                    type: user.user_metadata.store_type,
                    slug: slug,
                    contact_email: user.email,
                })
                .select()
                .single();

            if (tenantError) throw tenantError;

            // 3. Link them in TenantUser
            const { error: tenantUserError } = await supabase
                .from('tenant_users')
                .insert({
                    tenant_id: tenantData.id,
                    user_id: user.id,
                    role: UserRole.Owner,
                });
            
            if (tenantUserError) throw tenantUserError;

        } catch (error) {
            console.error("Error creating initial user data:", error);
        }
    };

    const fetchUserData = async (session: Session) => {
        try {
            const { data, error } = await supabase
                .from('tenant_users')
                .select(`
                    *,
                    tenants(*),
                    profiles(*)
                `)
                .eq('user_id', session.user.id)
                .single();

            // If no record is found, it's a new user who just confirmed their email.
            if (error && error.code === 'PGRST116') {
                await createInitialUserData(session.user);
                // Retry fetching the data after creation
                const { data: newData, error: newError } = await supabase
                    .from('tenant_users')
                    .select('*, tenants(*), profiles(*)')
                    .eq('user_id', session.user.id)
                    .single();
                
                if (newError) throw newError;
                
                if (newData) {
                    setTenant(newData.tenants as Tenant);
                    setUser({ ...newData, profile: newData.profiles } as TenantUser);
                }
                return;
            }

            if (error) throw error;

            if (data) {
                setTenant(data.tenants as Tenant);
                setUser({ ...data, profile: data.profiles } as TenantUser);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setTenant(null);
            setUser(null);
        }
    };

    useEffect(() => {
        if (!isSupabaseActive) {
            setLoading(false);
            return;
        }

        // Supabase's onAuthStateChange listener handles the initial session check on page load,
        // as well as subsequent auth events like login and logout.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setSession(session);
            if (session) {
                await fetchUserData(session);
            } else {
                setTenant(null);
                setUser(null);
            }
            // Once the initial auth state is determined (which happens on load), we can stop loading.
            setLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);
    
    const logout = () => {
        if (isSupabaseActive) {
            supabase.auth.signOut();
        }
    };

    const contextValue = useMemo(() => ({
        session,
        loading,
        tenant,
        user,
        logout,
    }), [session, loading, tenant, user]);
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <AppContext.Provider value={contextValue}>
            <ThemeProvider defaultTheme="system" storageKey="orderly-theme">
                <HashRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/login" element={!session ? <LoginPage /> : <Navigate to="/dashboard" />} />
                        <Route path="/signup" element={!session ? <SignupPage /> : <Navigate to="/dashboard" />} />
                        
                        {/* Customer Storefront Routes */}
                        <Route path="/store/:slug" element={<StorefrontPage />} />
                        <Route path="/store/:slug/checkout" element={<CheckoutPage />} />
                        <Route path="/store/:slug/success" element={<SuccessPage />} />

                        {/* Admin Dashboard Routes */}
                        <Route 
                            path="/dashboard" 
                            element={session ? <DashboardLayout /> : <Navigate to="/login" />}
                        >
                            <Route index element={<Navigate to="overview" />} />
                            <Route path="overview" element={<DashboardOverview />} />
                            <Route path="orders" element={<OrdersPage />} />
                            <Route path="menu" element={<MenuPage />} />
                            <Route path="promotions" element={<PromotionsPage />} />
                            <Route path="staff" element={<StaffPage />} />
                            <Route path="announcements" element={<AnnouncementsPage />} />
                            <Route path="store-hours" element={<StoreHoursPage />} />
                            <Route path="settings" element={<StoreSettingsPage />} />
                            <Route path="reports" element={<ReportsPage />} />
                        </Route>
                        
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </HashRouter>
            </ThemeProvider>
        </AppContext.Provider>
    );
}

export default App;