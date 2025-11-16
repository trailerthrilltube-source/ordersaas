import React, { useContext, useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { AppContext } from '../../App';
import { useTheme } from '../ThemeProvider';
import { HomeIcon, PackageIcon, UtensilsCrossedIcon, TagIcon, UsersIcon, MegaphoneIcon, ClockIcon, SettingsIcon, BarChartIcon, BellIcon, CoffeeIcon, MoonIcon, SunIcon, ExternalLinkIcon, LogOutIcon } from '../icons';

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgZmlsbD0iI2NjYyI+SW1hZ2U8L3RleHQ+PC9zdmc+';

const navItems = [
    { to: 'overview', icon: HomeIcon, label: 'Dashboard' },
    { to: 'orders', icon: PackageIcon, label: 'Orders' },
    { to: 'menu', icon: UtensilsCrossedIcon, label: 'Menu & Categories' },
    { to: 'promotions', icon: TagIcon, label: 'Promotions' },
    { to: 'staff', icon: UsersIcon, label: 'Staff' },
    { to: 'announcements', icon: MegaphoneIcon, label: 'Announcements' },
    { to: 'store-hours', icon: ClockIcon, label: 'Store Hours' },
    { to: 'settings', icon: SettingsIcon, label: 'Store Settings' },
    { to: 'reports', icon: BarChartIcon, label: 'Reports & Analytics' },
];

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 flex-shrink-0 bg-card/80 backdrop-blur-sm border-r border-border flex-col hidden md:flex">
            <div className="h-16 flex items-center justify-center px-4 border-b border-border">
                <CoffeeIcon className="h-8 w-8 text-primary"/>
                <span className="text-xl font-bold ml-2 text-card-foreground">Orderly</span>
            </div>
            <nav className="flex-1 overflow-y-auto p-4">
                <ul>
                    {navItems.map(item => (
                        <li key={item.to}>
                            <NavLink
                                to={item.to}
                                className={({ isActive }) =>
                                    `flex items-center px-4 py-2.5 my-1 text-sm font-medium rounded-md transition-colors duration-200 ${
                                    isActive
                                        ? 'bg-accent text-primary font-semibold'
                                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`
                                }
                            >
                                <item.icon className="h-5 w-5 mr-3" />
                                {item.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
};

const TopBar: React.FC = () => {
    const context = useContext(AppContext);
    const { theme, setTheme } = useTheme();

    if (!context || !context.tenant || !context.user) return null;

    const { tenant, user, logout } = context;
    
    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    return (
        <header className="h-16 bg-card/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-6">
            <div className="flex items-center">
                 <img src={tenant.logo_url || placeholderImage} alt="Store Logo" className="h-9 w-9 rounded-full object-cover" />
                 <h1 className="text-lg font-semibold text-card-foreground ml-3">{tenant.name}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <Link
                    to={`/store/${tenant.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-muted"
                >
                    <ExternalLinkIcon className="h-5 w-5 mr-1.5" />
                    <span className="hidden sm:inline">View Store</span>
                </Link>
                <div className="w-px h-6 bg-border"></div>
                 <button onClick={toggleTheme} className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted focus:outline-none">
                    {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </button>
                <button className="relative p-2 text-muted-foreground hover:text-foreground focus:outline-none hover:bg-muted rounded-full">
                    <BellIcon className="h-6 w-6" />
                    <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-destructive ring-2 ring-card"></span>
                </button>
                <Link to="/dashboard/settings" className="flex items-center space-x-2 focus:outline-none group">
                    <img src={user.profile.avatar_url || placeholderImage} alt="User Avatar" className="h-9 w-9 rounded-full object-cover" />
                    <div className="hidden md:flex flex-col items-start">
                        <span className="text-sm font-medium text-card-foreground group-hover:text-primary">{user.profile.full_name}</span>
                        <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                    </div>
                </Link>
                 <button onClick={logout} className="p-2 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 focus:outline-none" title="Logout">
                    <LogOutIcon className="h-5 w-5" />
                </button>
            </div>
        </header>
    );
};

const DashboardLayout: React.FC = () => {
    return (
        <div className="flex h-screen bg-muted/30">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
                    <Outlet />
                </main>
                <footer className="p-2 text-center text-xs text-muted-foreground border-t border-border">
                    Powered by AppVanta Digital
                </footer>
            </div>
        </div>
    );
};

export default DashboardLayout;