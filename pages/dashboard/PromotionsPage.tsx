import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { supabase, isSupabaseActive } from '../../lib/supabaseClient';
import { Promotion, DiscountType } from '../../types';
import { PencilIcon, TrashIcon, TagIcon } from '../../components/icons';

const PromotionCard: React.FC<{
    promo: Promotion;
    onEdit: (promo: Promotion) => void;
    onDelete: (promo: Promotion) => void;
    onToggle: (promo: Promotion, isActive: boolean) => void;
}> = ({ promo, onEdit, onDelete, onToggle }) => {
    return (
        <div className="bg-card rounded-lg border border-border shadow-sm flex flex-col">
            <div className="p-4 border-b border-border">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <TagIcon className="h-5 w-5 text-primary"/>
                        <span className="font-mono text-lg font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">{promo.code}</span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${promo.is_active ? 'bg-green-100 text-green-800' : 'bg-muted text-muted-foreground'}`}>
                        {promo.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">{promo.description}</p>
            </div>
            <div className="p-4 flex-grow">
                <div className="text-center mb-4">
                    <span className="text-4xl font-extrabold text-card-foreground">
                        {promo.discount_type === DiscountType.Percent ? `${promo.discount_value}%` : `₱${promo.discount_value.toFixed(2)}`}
                    </span>
                    <span className="text-lg font-semibold text-muted-foreground ml-1">OFF</span>
                </div>
                 <div className="text-xs text-muted-foreground space-y-1">
                    <p><strong>Valid:</strong> {new Date(promo.starts_at).toLocaleDateString()} - {new Date(promo.ends_at).toLocaleDateString()}</p>
                    {promo.min_spend && <p><strong>Min. Spend:</strong> ₱{promo.min_spend.toFixed(2)}</p>}
                </div>
            </div>
            <div className="p-4 bg-muted/50 border-t border-border flex justify-between items-center">
                 <label htmlFor={`toggle-${promo.id}`} className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id={`toggle-${promo.id}`} className="sr-only peer" checked={promo.is_active} onChange={(e) => onToggle(promo, e.target.checked)} />
                        <div className="block bg-input w-10 h-6 rounded-full peer-checked:bg-primary"></div>
                        <div className="dot absolute left-1 top-1 bg-card w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
                    </div>
                </label>
                <div className="flex items-center space-x-2">
                    <button onClick={() => onEdit(promo)} className="p-2 text-muted-foreground hover:text-primary hover:bg-accent rounded-md"><PencilIcon className="h-4 w-4" /></button>
                    <button onClick={() => onDelete(promo)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-accent rounded-md"><TrashIcon className="h-4 w-4" /></button>
                </div>
            </div>
        </div>
    );
};

const PromotionModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSave: (promo: Omit<Promotion, 'id' | 'tenant_id'>) => void;
    promo: Promotion | null;
}> = ({ isOpen, onClose, onSave, promo }) => {
    
    const [formData, setFormData] = useState({
        code: promo?.code || '',
        description: promo?.description || '',
        discount_type: promo?.discount_type || DiscountType.Percent,
        discount_value: promo?.discount_value || 0,
        min_spend: promo?.min_spend || 0,
        starts_at: promo ? new Date(promo.starts_at).toISOString().split('T')[0] : '',
        ends_at: promo ? new Date(promo.ends_at).toISOString().split('T')[0] : '',
        is_active: promo?.is_active ?? true,
    });

    useEffect(() => {
        setFormData({
            code: promo?.code || '',
            description: promo?.description || '',
            discount_type: promo?.discount_type || DiscountType.Percent,
            discount_value: promo?.discount_value || 0,
            min_spend: promo?.min_spend || 0,
            starts_at: promo ? new Date(promo.starts_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            ends_at: promo ? new Date(promo.ends_at).toISOString().split('T')[0] : '',
            is_active: promo?.is_active ?? true,
        });
    }, [promo, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { id, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        const isNumber = type === 'number';

        setFormData(prev => ({
            ...prev,
            [id]: isCheckbox ? (e.target as HTMLInputElement).checked : (isNumber ? parseFloat(value) : value)
        }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dataToSave = {
            ...formData,
            starts_at: new Date(formData.starts_at).toISOString(),
            ends_at: new Date(formData.ends_at).toISOString(),
            min_spend: formData.min_spend > 0 ? formData.min_spend : undefined
        };
        onSave(dataToSave);
    }
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-lg border border-border">
                <form onSubmit={handleSubmit}>
                    <div className="p-6 border-b border-border">
                        <h3 className="text-lg font-semibold text-card-foreground">{promo ? 'Edit Promotion' : 'Create Promotion'}</h3>
                    </div>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-card-foreground text-sm font-medium mb-1" htmlFor="code">Promo Code</label>
                            <input value={formData.code} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="code" type="text" placeholder="e.g., SAVE10" required />
                        </div>
                        <div>
                            <label className="block text-card-foreground text-sm font-medium mb-1" htmlFor="description">Description</label>
                            <textarea value={formData.description} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="description" placeholder="e.g., 10% off on all coffee" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-card-foreground text-sm font-medium mb-1" htmlFor="discount_type">Discount Type</label>
                                <select value={formData.discount_type} onChange={handleChange} id="discount_type" className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" required>
                                    <option value={DiscountType.Percent}>Percentage</option>
                                    <option value={DiscountType.Fixed}>Fixed Amount</option>
                                </select>
                            </div>
                             <div>
                                <label className="block text-card-foreground text-sm font-medium mb-1" htmlFor="discount_value">Value</label>
                                <input value={formData.discount_value} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="discount_value" type="number" step="0.01" min="0" required />
                            </div>
                        </div>
                        <div>
                           <label className="block text-card-foreground text-sm font-medium mb-1" htmlFor="min_spend">Minimum Spend (optional)</label>
                           <input value={formData.min_spend} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="min_spend" type="number" step="0.01" min="0" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                                <label className="block text-card-foreground text-sm font-medium mb-1" htmlFor="starts_at">Start Date</label>
                                <input value={formData.starts_at} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="starts_at" type="date" required />
                           </div>
                           <div>
                                <label className="block text-card-foreground text-sm font-medium mb-1" htmlFor="ends_at">End Date</label>
                                <input value={formData.ends_at} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="ends_at" type="date" required />
                           </div>
                        </div>
                        <div className="flex items-center">
                            <input type="checkbox" id="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 rounded border-border text-primary focus:ring-primary"/>
                            <label htmlFor="is_active" className="ml-2 block text-sm text-card-foreground">Activate this promotion</label>
                        </div>
                    </div>
                     <div className="p-4 bg-muted/50 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">Save Promotion</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const PromotionsPage: React.FC = () => {
    const context = useContext(AppContext);
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

    useEffect(() => {
        const fetchPromotions = async () => {
             if (!context?.tenant?.id || !isSupabaseActive) {
                setLoading(false);
                setError("Store not found. Cannot load promotions.");
                return;
            }
            setLoading(true);
            const { data, error } = await supabase
                .from('promotions')
                .select('*')
                .eq('tenant_id', context.tenant.id)
                .order('created_at', { ascending: false });

            if (error) {
                setError('Failed to fetch promotions.');
                console.error(error);
            } else {
                setPromotions(data);
            }
            setLoading(false);
        };
        fetchPromotions();
    }, [context?.tenant?.id]);

    const handleCreate = () => {
        setEditingPromo(null);
        setIsModalOpen(true);
    };

    const handleEdit = (promo: Promotion) => {
        setEditingPromo(promo);
        setIsModalOpen(true);
    };

    const handleDelete = async (promo: Promotion) => {
        if (window.confirm(`Are you sure you want to delete the "${promo.code}" promotion?`)) {
             if (!isSupabaseActive) return;

            const { error } = await supabase.from('promotions').delete().eq('id', promo.id);
            if (error) {
                alert("Error deleting promotion: " + error.message);
            } else {
                setPromotions(prev => prev.filter(p => p.id !== promo.id));
            }
        }
    };
    
    const handleToggle = async (promo: Promotion, is_active: boolean) => {
         if (!isSupabaseActive) return;

        const { data, error } = await supabase
            .from('promotions')
            .update({ is_active })
            .eq('id', promo.id)
            .select()
            .single();

        if (error) {
            alert("Error updating promotion status.");
        } else {
             setPromotions(prev => prev.map(p => p.id === data.id ? data : p));
        }
    }

    const handleSave = async (formData: Omit<Promotion, 'id' | 'tenant_id'>) => {
        if (!context?.tenant?.id || !isSupabaseActive) return;
        
        if (editingPromo) { // Update
            const { data, error } = await supabase
                .from('promotions')
                .update(formData)
                .eq('id', editingPromo.id)
                .select()
                .single();
            if (error) { alert("Error: " + error.message); }
            else { setPromotions(prev => prev.map(p => p.id === data.id ? data : p)); }
        } else { // Create
            const { data, error } = await supabase
                .from('promotions')
                .insert({ ...formData, tenant_id: context.tenant.id })
                .select()
                .single();
            if (error) { alert("Error: " + error.message); }
            else { setPromotions(prev => [data, ...prev]); }
        }
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Promotions</h1>
                <button onClick={handleCreate} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg">
                    Create Promotion
                </button>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-destructive">{error}</p>}
            
            {!loading && !error && promotions.length === 0 && (
                 <div className="bg-card rounded-lg border border-border shadow-sm p-12 text-center text-muted-foreground">
                    <TagIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50"/>
                    <h3 className="text-lg font-semibold text-foreground">No Promotions Yet</h3>
                    <p className="mt-1">Click "Create Promotion" to add your first offer.</p>
                </div>
            )}
            
            {!loading && !error && promotions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {promotions.map(promo => (
                        <PromotionCard key={promo.id} promo={promo} onEdit={handleEdit} onDelete={handleDelete} onToggle={handleToggle} />
                    ))}
                </div>
            )}

            <PromotionModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
                promo={editingPromo}
            />

        </div>
    );
};

export default PromotionsPage;