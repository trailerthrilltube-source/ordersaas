import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App';
import { supabase, isSupabaseActive } from '../../lib/supabaseClient';
import { Tenant } from '../../types';

const Input = ({ label, id, ...props }: { label: string, id: string, [key: string]: any }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-muted-foreground mb-1">{label}</label>
        <input id={id} {...props} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring text-card-foreground" />
    </div>
);

const StoreSettingsPage: React.FC = () => {
    const context = useContext(AppContext);
    const [formData, setFormData] = useState<Partial<Tenant>>({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        if (context?.tenant) {
            setFormData(context.tenant);
        }
    }, [context?.tenant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };
    
    const handleColorChange = (color: string) => {
        setFormData({ ...formData, primary_color: color });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isSupabaseActive || !context?.tenant) return;
        
        setLoading(true);
        setMessage(null);

        const { error } = await supabase
            .from('tenants')
            .update({
                name: formData.name,
                logo_url: formData.logo_url,
                contact_email: formData.contact_email,
                contact_phone: formData.contact_phone,
                address: formData.address,
                primary_color: formData.primary_color,
            })
            .eq('id', context.tenant.id);

        if (error) {
            setMessage({ type: 'error', text: 'Failed to save settings: ' + error.message });
        } else {
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            // Note: In a real app, we'd update the context here to reflect changes immediately
        }
        setLoading(false);
    };

    if (!context?.tenant) {
        return <div>Loading tenant data...</div>;
    }

    const colorSwatches = ['#6d4c41', '#ef6c00', '#c2185b', '#2e7d32', '#1565c0', '#5e35b1'];

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-foreground">Store Settings</h1>
            
            <form onSubmit={handleSubmit}>
                <div className="bg-card rounded-lg border border-border shadow-sm">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-semibold text-card-foreground">Store Details</h2>
                        <p className="text-sm text-muted-foreground mt-1">Update your store's public information.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <Input label="Store Name" id="name" type="text" value={formData.name || ''} onChange={handleChange} required />
                        <Input label="Contact Email" id="contact_email" type="email" value={formData.contact_email || ''} onChange={handleChange} required />
                        <Input label="Contact Phone" id="contact_phone" type="tel" value={formData.contact_phone || ''} onChange={handleChange} />
                        <Input label="Address" id="address" type="text" value={formData.address || ''} onChange={handleChange} />
                    </div>
                </div>

                <div className="bg-card rounded-lg border border-border shadow-sm mt-6">
                    <div className="p-6 border-b border-border">
                        <h2 className="text-lg font-semibold text-card-foreground">Branding</h2>
                        <p className="text-sm text-muted-foreground mt-1">Customize the look of your storefront.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <Input label="Logo URL" id="logo_url" type="text" value={formData.logo_url || ''} onChange={handleChange} placeholder="https://example.com/logo.png" />
                        <div>
                           <label className="block text-sm font-medium text-muted-foreground mb-1">Primary Color</label>
                           <div className="flex items-center gap-2">
                               {colorSwatches.map(color => (
                                   <button type="button" key={color} onClick={() => handleColorChange(color)} className={`w-8 h-8 rounded-full border-2 ${formData.primary_color === color ? 'border-ring' : 'border-transparent'}`} style={{ backgroundColor: color }} />
                               ))}
                               <div className="relative">
                                  <input type="color" value={formData.primary_color || '#000000'} onChange={e => handleColorChange(e.target.value)} className="w-8 h-8 rounded-full overflow-hidden appearance-none bg-transparent border-2 border-border cursor-pointer" />
                               </div>
                                <input type="text" value={formData.primary_color || ''} onChange={handleChange} id="primary_color" className="w-28 px-2 py-1 rounded-md bg-input border border-border focus:outline-none focus:ring-1 focus:ring-ring text-card-foreground text-sm" />
                           </div>
                        </div>
                    </div>
                </div>
                
                 {message && (
                    <div className={`mt-4 text-sm p-3 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-destructive/20 text-destructive'}`}>
                        {message.text}
                    </div>
                )}

                <div className="mt-6 flex justify-end">
                    <button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-6 rounded-lg disabled:opacity-75" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default StoreSettingsPage;