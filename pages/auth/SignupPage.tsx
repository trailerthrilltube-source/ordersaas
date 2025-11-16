import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, isSupabaseActive } from '../../lib/supabaseClient';
import { CoffeeIcon } from '../../components/icons';
import { StoreType } from '../../types';

const SignupPage: React.FC = () => {
    const [formData, setFormData] = useState({
        storeName: '',
        storeType: StoreType.CoffeeShop,
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setLoading(true);
        setError(null);
        setSuccess(false);

        if (!isSupabaseActive) {
            setError('Database connection is not configured. Running in offline mode.');
            setLoading(false);
            return;
        }
        
        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                data: {
                    full_name: formData.fullName,
                    store_name: formData.storeName,
                    store_type: formData.storeType,
                }
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex flex-col p-4">
            <main className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                         <Link to="/" className="inline-flex items-center">
                            <CoffeeIcon className="h-10 w-10 text-primary" />
                            <span className="text-3xl font-bold ml-2 text-foreground">Orderly</span>
                        </Link>
                    </div>
                    <div className="bg-card rounded-lg shadow-lg p-8">
                        {success ? (
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-card-foreground mb-2">Check your email!</h2>
                                <p className="text-muted-foreground">We've sent a confirmation link to <span className="font-semibold text-foreground">{formData.email}</span>. Please click the link to complete your registration.</p>
                            </div>
                        ) : (
                        <>
                            <h2 className="text-2xl font-bold text-center text-card-foreground mb-1">Create Your Store</h2>
                            <p className="text-center text-muted-foreground mb-6">It's free to get started!</p>
                            {error && <p className="bg-destructive/20 text-destructive text-center p-3 rounded-md mb-4 text-sm">{error}</p>}
                            <form onSubmit={handleSignup}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-card-foreground text-sm font-medium mb-2" htmlFor="storeName">Store Name</label>
                                        <input value={formData.storeName} onChange={handleChange} className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="storeName" type="text" placeholder="e.g., The Daily Grind" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-card-foreground text-sm font-medium mb-2" htmlFor="storeType">Store Type</label>
                                        <select value={formData.storeType} onChange={handleChange} id="storeType" className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" required>
                                            <option value={StoreType.CoffeeShop}>Coffee Shop</option>
                                            <option value={StoreType.Restaurant}>Restaurant</option>
                                            <option value={StoreType.MilkTea}>Milk Tea Shop</option>
                                            <option value={StoreType.Other}>Other</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-card-foreground text-sm font-medium mb-2" htmlFor="fullName">Full Name</label>
                                        <input value={formData.fullName} onChange={handleChange} className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="fullName" type="text" placeholder="Jane Doe" required />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-card-foreground text-sm font-medium mb-2" htmlFor="email">Email</label>
                                        <input value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="email" type="email" placeholder="you@example.com" required />
                                    </div>
                                    <div>
                                        <label className="block text-card-foreground text-sm font-medium mb-2" htmlFor="password">Password</label>
                                        <input value={formData.password} onChange={handleChange} className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="password" type="password" placeholder="••••••••" required />
                                    </div>
                                    <div>
                                        <label className="block text-card-foreground text-sm font-medium mb-2" htmlFor="confirmPassword">Confirm Password</label>
                                        <input value={formData.confirmPassword} onChange={handleChange} className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="confirmPassword" type="password" placeholder="••••••••" required />
                                    </div>
                                </div>
                                <button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-colors mt-6 disabled:opacity-75" type="submit" disabled={loading}>
                                    {loading ? 'Creating account...' : 'Create My Store'}
                                </button>
                            </form>
                            <p className="text-center text-sm text-muted-foreground mt-8">
                                Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Log in</Link>
                            </p>
                        </>
                        )}
                    </div>
                </div>
            </main>
            <footer className="text-center py-4 text-xs text-muted-foreground">
                Powered by AppVanta Digital
            </footer>
        </div>
    );
};

export default SignupPage;