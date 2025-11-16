import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { isSupabaseActive, supabase } from '../../lib/supabaseClient';
import { Tenant, Category, MenuItem } from '../../types';

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2VlZSIgLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjRweCIgZmlsbD0iI2NjYyI+SW1hZ2U8L3RleHQ+PC9zdmc+';

const StorefrontHeader: React.FC<{tenant: Tenant}> = ({ tenant }) => (
    <header className="bg-card/80 backdrop-blur-sm p-4 text-center border-b border-border">
        <img src={tenant.logo_url || placeholderImage} alt="logo" className="w-16 h-16 rounded-full mx-auto mb-2"/>
        <h1 className="text-2xl font-bold text-foreground">{tenant.name}</h1>
        <p className="text-sm text-muted-foreground">{tenant.address}</p>
        <div className="mt-2 text-sm font-semibold text-green-600">Open now</div>
    </header>
);

const AnnouncementBanner: React.FC = () => (
    <div className="bg-accent text-accent-foreground p-3 text-center text-sm">
        <strong>Special Offer!</strong> Get 10% off on all pastries this weekend.
    </div>
);

const CategoryTabs: React.FC<{
    categories: Category[];
    selectedCategory: string | null;
    onSelect: (id: string | null) => void;
}> = ({ categories, selectedCategory, onSelect }) => (
    <div className="sticky top-0 bg-card/80 backdrop-blur-sm z-10 py-2 overflow-x-auto border-b border-border">
        <div className="flex space-x-2 px-4">
            <button
                onClick={() => onSelect(null)}
                className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${!selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
            >
                All
            </button>
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap ${selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}
                >
                    {cat.name}
                </button>
            ))}
        </div>
    </div>
);

const MenuItemGridCard: React.FC<{ item: MenuItem; onAddToCart: (item: MenuItem) => void }> = ({ item, onAddToCart }) => (
    <div className="bg-card rounded-lg overflow-hidden shadow-sm border border-border">
        <div className="relative">
            <img src={item.image_url || placeholderImage} alt={item.name} className="w-full h-40 object-cover" />
            {!item.is_available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold bg-black/70 px-3 py-1 rounded">Sold Out</span>
                </div>
            )}
        </div>
        <div className="p-4">
            <h3 className="font-semibold text-card-foreground">{item.name}</h3>
            <p className="text-sm text-muted-foreground mb-2 truncate">{item.description}</p>
            <div className="flex justify-between items-center">
                <span className="font-bold text-card-foreground">₱{item.price.toFixed(2)}</span>
                <button 
                    onClick={() => onAddToCart(item)}
                    disabled={!item.is_available}
                    className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm font-semibold hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed"
                >
                    Add
                </button>
            </div>
        </div>
    </div>
);


const StorefrontPage: React.FC = () => {
    const { slug } = useParams();
    const [tenant, setTenant] = useState<Tenant | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [cart, setCart] = useState<{item: MenuItem, quantity: number}[]>([]);
    
    useEffect(() => {
        const fetchStoreData = async () => {
            if (!slug || !isSupabaseActive) {
                setError("Store not found or database is not connected.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            
            try {
                // 1. Fetch tenant by slug
                const { data: tenantData, error: tenantError } = await supabase
                    .from('tenants')
                    .select('*')
                    .eq('slug', slug)
                    .single();

                if (tenantError || !tenantData) {
                    throw new Error("Store not found.");
                }
                setTenant(tenantData);
                document.documentElement.style.setProperty('--primary', tenantData.primary_color);

                // 2. Fetch categories and menu items
                const catPromise = supabase.from('categories').select('*').eq('tenant_id', tenantData.id).order('name', { ascending: true });
                const itemPromise = supabase.from('menu_items').select('*').eq('tenant_id', tenantData.id);
                const [{ data: catData, error: catError }, { data: itemData, error: itemError }] = await Promise.all([catPromise, itemPromise]);

                if (catError || itemError) {
                    throw new Error("Failed to load menu.");
                }

                setCategories(catData || []);
                setMenuItems(itemData || []);

            } catch (err: any) {
                setError(err.message);
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStoreData();
    }, [slug]);

    const handleAddToCart = (itemToAdd: MenuItem) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(ci => ci.item.id === itemToAdd.id);
            if(existingItem) {
                return prevCart.map(ci => ci.item.id === itemToAdd.id ? {...ci, quantity: ci.quantity + 1} : ci);
            }
            return [...prevCart, {item: itemToAdd, quantity: 1}];
        })
    };
    
    const cartTotalItems = cart.reduce((total, current) => total + current.quantity, 0);

    const filteredItems = selectedCategory
        ? menuItems.filter(item => item.category_id === selectedCategory)
        : menuItems;
    
    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading store...</div>;
    }
    
    if (error || !tenant) {
        return (
            <div className="min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold text-destructive">Error</h1>
                    <p className="text-muted-foreground">{error || "Could not find the requested store."}</p>
                    <Link to="/" className="text-primary mt-4 inline-block">Go to Homepage</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto min-h-screen relative pb-24">
            <StorefrontHeader tenant={tenant} />
            <AnnouncementBanner />
            <CategoryTabs categories={categories} selectedCategory={selectedCategory} onSelect={setSelectedCategory} />
            <main className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredItems.map(item => (
                        <MenuItemGridCard key={item.id} item={item} onAddToCart={handleAddToCart} />
                    ))}
                </div>
            </main>

            {cartTotalItems > 0 && (
                 <div className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto p-4 bg-card/80 backdrop-blur-sm border-t border-border">
                    <Link 
                        to={`/store/${slug}/checkout`}
                        state={{ cart, tenant }}
                        className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg flex justify-between items-center text-center"
                    >
                        <span>View Cart</span>
                        <span>{cartTotalItems} items</span>
                    </Link>
                </div>
            )}
        </div>
    );
};

export default StorefrontPage;