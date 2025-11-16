import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../App';
import { supabase, isSupabaseActive } from '../../lib/supabaseClient';
import { Category, MenuItem } from '../../types';
import { PencilIcon, TrashIcon, PlusIcon } from '../../components/icons';

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgZmlsbD0iI2NjYyI+SW1hZ2U8L3RleHQ+PC9zdmc+';

// --- Reusable Modal Component ---
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-card rounded-lg shadow-xl w-full max-w-lg border border-border">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-card-foreground">{title}</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">&times;</button>
                </div>
                {children}
            </div>
        </div>
    );
};

// --- Category List Component ---
const CategoryList: React.FC<{
    categories: Category[];
    selectedCategoryId: string | null;
    onSelectCategory: (id: string | null) => void;
    onEdit: (category: Category) => void;
    onDelete: (category: Category) => void;
    onAdd: () => void;
}> = ({ categories, selectedCategoryId, onSelectCategory, onEdit, onDelete, onAdd }) => {
    return (
        <div className="bg-card rounded-lg border border-border shadow-sm p-4 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-card-foreground">Categories</h3>
                <button onClick={onAdd} className="bg-primary text-primary-foreground h-7 w-7 flex items-center justify-center rounded-md hover:bg-primary/90">
                    <PlusIcon className="h-4 w-4" />
                </button>
            </div>
            <ul>
                <li
                    onClick={() => onSelectCategory(null)}
                    className={`p-2 rounded-md cursor-pointer text-sm font-medium ${!selectedCategoryId ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                >
                    All Items
                </li>
                {categories.map(cat => (
                    <li
                        key={cat.id}
                        onClick={() => onSelectCategory(cat.id)}
                        className={`p-2 my-1 rounded-md cursor-pointer text-sm font-medium flex justify-between items-center group ${selectedCategoryId === cat.id ? 'bg-accent text-primary' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                        <span>{cat.name}</span>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1">
                            <button onClick={(e) => { e.stopPropagation(); onEdit(cat); }} className="p-1 hover:text-primary"><PencilIcon className="h-4 w-4" /></button>
                            <button onClick={(e) => { e.stopPropagation(); onDelete(cat); }} className="p-1 hover:text-destructive"><TrashIcon className="h-4 w-4" /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};


// --- Menu Item Card Component ---
const MenuItemCard: React.FC<{ item: MenuItem; onEdit: (item: MenuItem) => void; onDelete: (item: MenuItem) => void; onToggle: (item: MenuItem, isAvailable: boolean) => void; }> = ({ item, onEdit, onDelete, onToggle }) => {
    return (
        <div className="bg-card rounded-lg border border-border shadow-sm flex p-4 space-x-4 items-center">
            <img src={item.image_url || placeholderImage} alt={item.name} className="w-20 h-20 rounded-md object-cover flex-shrink-0" />
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-card-foreground truncate">{item.name}</h4>
                <p className="text-sm text-muted-foreground">₱{item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                    <button onClick={() => onEdit(item)} className="p-1 text-muted-foreground hover:text-primary"><PencilIcon className="h-4 w-4"/></button>
                    <button onClick={() => onDelete(item)} className="p-1 text-muted-foreground hover:text-destructive"><TrashIcon className="h-4 w-4"/></button>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                 <span className={`text-xs font-medium ${item.is_available ? 'text-green-600' : 'text-red-600'}`}>
                    {item.is_available ? 'Available' : 'Sold Out'}
                </span>
                <label htmlFor={`toggle-${item.id}`} className="flex items-center cursor-pointer">
                    <div className="relative">
                        <input type="checkbox" id={`toggle-${item.id}`} className="sr-only peer" checked={item.is_available} onChange={(e) => onToggle(item, e.target.checked)} />
                        <div className="block bg-input w-10 h-6 rounded-full peer-checked:bg-primary"></div>
                        <div className="dot absolute left-1 top-1 bg-card w-4 h-4 rounded-full transition-transform peer-checked:translate-x-full"></div>
                    </div>
                </label>
            </div>
        </div>
    );
};


// --- Menu Item Modal ---
const MenuItemModal: React.FC<{ 
    isOpen: boolean; 
    onClose: () => void;
    onSave: (item: Partial<MenuItem>) => void;
    item: Partial<MenuItem> | null;
    categories: Category[];
}> = ({ isOpen, onClose, onSave, item, categories }) => {
    const [formData, setFormData] = useState<Partial<MenuItem>>({});

    useEffect(() => {
        setFormData(item || { is_available: true, category_id: categories[0]?.id });
    }, [item, isOpen, categories]);

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
        onSave(formData);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={item?.id ? 'Edit Menu Item' : 'Add Menu Item'}>
            <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="name">Item Name</label>
                        <input id="name" type="text" value={formData.name || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="description">Description</label>
                        <textarea id="description" value={formData.description || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="price">Price</label>
                            <input id="price" type="number" step="0.01" min="0" value={formData.price || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1" htmlFor="category_id">Category</label>
                            <select id="category_id" value={formData.category_id || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" required>
                                <option value="" disabled>Select a category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="image_url">Image URL</label>
                        <input id="image_url" type="text" value={formData.image_url || ''} onChange={handleChange} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" />
                    </div>
                     <div className="flex items-center">
                        <input type="checkbox" id="is_available" checked={formData.is_available} onChange={handleChange} className="h-4 w-4 rounded border-border text-primary focus:ring-primary"/>
                        <label htmlFor="is_available" className="ml-2 block text-sm">Item is available</label>
                    </div>
                </div>
                <div className="p-4 bg-muted/50 flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">Save Item</button>
                </div>
            </form>
        </Modal>
    )
}

// --- Main Menu Page ---
const MenuPage: React.FC = () => {
    const context = useContext(AppContext);
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
    const [categoryName, setCategoryName] = useState('');

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<Partial<MenuItem> | null>(null);

    // --- Data Fetching ---
    useEffect(() => {
        const fetchData = async () => {
            if (!context?.tenant?.id || !isSupabaseActive) {
                setLoading(false);
                setError("Store not found. Cannot load menu.");
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const catPromise = supabase.from('categories').select('*').eq('tenant_id', context.tenant.id).order('name', { ascending: true });
                const itemPromise = supabase.from('menu_items').select('*').eq('tenant_id', context.tenant.id);
                const [{ data: catData, error: catError }, { data: itemData, error: itemError }] = await Promise.all([catPromise, itemPromise]);
                
                if (catError) throw catError;
                if (itemError) throw itemError;

                setCategories(catData || []);
                setMenuItems(itemData || []);
            } catch (err: any) {
                setError("Failed to load menu data.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [context?.tenant?.id]);

    // --- Category CRUD ---
    const handleAddCategory = () => { setModalMode('add'); setCurrentCategory(null); setCategoryName(''); setIsCategoryModalOpen(true); };
    const handleEditCategory = (category: Category) => { setModalMode('edit'); setCurrentCategory(category); setCategoryName(category.name); setIsCategoryModalOpen(true); };
    const handleDeleteCategory = async (category: Category) => {
        if (window.confirm(`Are you sure you want to delete "${category.name}"? This will also delete all items in it.`)) {
            if (!isSupabaseActive) return;

            const { error: itemError } = await supabase.from('menu_items').delete().eq('category_id', category.id);
            if (itemError) {
                alert("Error deleting menu items: " + itemError.message);
                return;
            }

            const { error } = await supabase.from('categories').delete().eq('id', category.id);
            if (error) { alert("Error: " + error.message); } 
            else { 
                setMenuItems(items => items.filter(item => item.category_id !== category.id));
                setCategories(c => c.filter(i => i.id !== category.id)); 
            }
        }
    };
    const handleCategoryFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName.trim() || !isSupabaseActive || !context?.tenant?.id) return;

        if (modalMode === 'add') {
            const { data, error } = await supabase.from('categories').insert({ name: categoryName, tenant_id: context.tenant.id }).select().single();
            if (error) { alert("Error: " + error.message); } 
            else if (data) { setCategories(c => [...c, data].sort((a,b) => a.name.localeCompare(b.name))); }
        } else if (modalMode === 'edit' && currentCategory) {
            const { data, error } = await supabase.from('categories').update({ name: categoryName }).eq('id', currentCategory.id).select().single();
            if (error) { alert("Error: " + error.message); } 
            else if (data) { setCategories(c => c.map(i => i.id === data.id ? data : i).sort((a,b) => a.name.localeCompare(b.name))); }
        }
        setIsCategoryModalOpen(false);
    };

    // --- Menu Item CRUD ---
    const handleAddItem = () => { setEditingItem(null); setIsItemModalOpen(true); };
    const handleEditItem = (item: MenuItem) => { setEditingItem(item); setIsItemModalOpen(true); };
    const handleDeleteItem = async (item: MenuItem) => {
        if (window.confirm(`Delete "${item.name}"?`)) {
            if (!isSupabaseActive) return;
            const { error } = await supabase.from('menu_items').delete().eq('id', item.id);
            if (error) { alert("Error: " + error.message); }
             else { setMenuItems(items => items.filter(i => i.id !== item.id)); }
        }
    };
    const handleToggleAvailability = async (item: MenuItem, is_available: boolean) => {
        if (!isSupabaseActive) return;
        const { data, error } = await supabase.from('menu_items').update({ is_available }).eq('id', item.id).select().single();
        if (error) { alert("Error: " + error.message); }
        else if (data) { setMenuItems(items => items.map(i => i.id === data.id ? data : i)); }
    };
    const handleItemSave = async (formData: Partial<MenuItem>) => {
        if (!isSupabaseActive) return;

        const dataToSave = { ...formData, price: Number(formData.price), tenant_id: context?.tenant?.id };
        if (formData.id) { // Update
            const { data, error } = await supabase.from('menu_items').update(dataToSave).eq('id', formData.id).select().single();
            if (error) { alert("Error: " + error.message); }
            else if (data) { setMenuItems(items => items.map(i => i.id === data.id ? data : i)); }
        } else { // Create
             const { data, error } = await supabase.from('menu_items').insert(dataToSave).select().single();
             if (error) { alert("Error: " + error.message); }
             else if (data) { setMenuItems(items => [...items, data]); }
        }
        setIsItemModalOpen(false);
    };

    // --- Rendering ---
    const filteredItems = selectedCategoryId ? menuItems.filter(item => item.category_id === selectedCategoryId) : menuItems;

    const renderContent = () => {
        if (loading) return (
            <div className="lg:col-span-3 space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="bg-card rounded-lg h-28 border animate-pulse"></div>)}</div>
        );
        if (error) return <div className="lg:col-span-3 text-destructive">{error}</div>;
        return (
            <div className="lg:col-span-3 space-y-4">
                {filteredItems.map(item => <MenuItemCard key={item.id} item={item} onEdit={handleEditItem} onDelete={handleDeleteItem} onToggle={handleToggleAvailability} />)}
                {filteredItems.length === 0 && (
                    <div className="bg-card rounded-lg border border-border shadow-sm text-center py-20 text-muted-foreground">No items in this category.</div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-foreground">Menu & Categories</h1>
                <button onClick={handleAddItem} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded-lg flex items-center gap-2">
                    <PlusIcon className="h-5 w-5"/> Add New Item
                </button>
            </div>
            {error && <p className="text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
                <div className="lg:col-span-1">
                    <CategoryList categories={categories} selectedCategoryId={selectedCategoryId} onSelectCategory={setSelectedCategoryId} onAdd={handleAddCategory} onEdit={handleEditCategory} onDelete={handleDeleteCategory} />
                </div>
                {renderContent()}
            </div>
            
            <Modal isOpen={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} title={modalMode === 'add' ? 'Add Category' : 'Edit Category'}>
                <form onSubmit={handleCategoryFormSubmit}>
                    <div className="p-6">
                        <input type="text" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full px-4 py-3 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" placeholder="Category Name" required />
                    </div>
                    <div className="p-4 bg-muted/50 flex justify-end space-x-2">
                        <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">Save</button>
                    </div>
                </form>
            </Modal>

            <MenuItemModal isOpen={isItemModalOpen} onClose={() => setIsItemModalOpen(false)} onSave={handleItemSave} item={editingItem} categories={categories} />
        </div>
    );
};

export default MenuPage;