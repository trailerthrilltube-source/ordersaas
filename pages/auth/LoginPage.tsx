import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseActive } from '../../lib/supabaseClient';
import { CoffeeIcon } from '../../components/icons';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!isSupabaseActive) {
            setError('Database connection is not configured. Please update `lib/supabaseCredentials.ts` with your Supabase URL and Key.');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            navigate('/dashboard');
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
                        <h2 className="text-2xl font-bold text-center text-card-foreground mb-1">Welcome Back!</h2>
                        <p className="text-center text-muted-foreground mb-6">Login as Store Owner / Staff</p>
                        {error && <p className="bg-destructive/20 text-destructive text-center p-3 rounded-md mb-4 text-sm">{error}</p>}
                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="block text-card-foreground text-sm font-medium mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <div className="flex justify-between items-baseline">
                                    <label className="block text-card-foreground text-sm font-medium mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
                                </div>
                                <input
                                    className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring"
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-75"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <p className="text-center text-sm text-muted-foreground mt-8">
                            Don't have an account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
                        </p>
                    </div>
                </div>
            </main>
            <footer className="text-center py-4 text-xs text-muted-foreground">
                Powered by AppVanta Digital
            </footer>
        </div>
    );
};

export default LoginPage;