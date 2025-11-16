import React, { useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { MenuItem, OrderStatus, OrderType, PaymentStatus, Tenant } from '../../types';
import { isSupabaseActive, supabase } from '../../lib/supabaseClient';

const CheckoutPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { slug } = useParams();

    const { cart, tenant } = (location.state as { cart: { item: MenuItem; quantity: number }[], tenant: Tenant }) || { cart: [], tenant: null };
    
    const [customerName, setCustomerName] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (cart.length === 0 || !tenant) {
        return (
            <div className="max-w-3xl mx-auto min-h-screen p-4 text-center">
                <p>Your cart is empty or the store is invalid.</p>
                <Link to={`/store/${slug}`} className="text-primary mt-4 inline-block">Go back to menu</Link>
            </div>
        )
    }

    const subtotal = cart.reduce((sum, cartItem) => sum + cartItem.item.price * cartItem.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!customerName || !customerPhone) {
            setError("Please enter your name and phone number.");
            return;
        }
        if (!isSupabaseActive) {
            setError("Cannot place order. Database not connected.");
            return;
        }

        setIsPlacingOrder(true);
        setError(null);

        try {
            // 1. Find or create the customer
            const { data: customerData, error: customerError } = await supabase
                .from('customers')
                .upsert(
                    { tenant_id: tenant.id, name: customerName, phone: customerPhone },
                    { onConflict: 'tenant_id, phone', ignoreDuplicates: false }
                )
                .select()
                .single();

            if (customerError) throw customerError;

            // 2. Create the order
            const orderNumber = `${tenant.name.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-4)}`;
            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .insert({
                    tenant_id: tenant.id,
                    customer_id: customerData.id,
                    order_number: orderNumber,
                    type: OrderType.Pickup, // Assuming pickup for now
                    status: OrderStatus.Pending,
                    pickup_reservation_at: new Date().toISOString(), // Use current time
                    total: subtotal,
                    payment_status: PaymentStatus.Unpaid, // Assuming pay on pickup
                })
                .select()
                .single();

            if (orderError) throw orderError;
            
            // 3. Create order items
            const orderItemsToInsert = cart.map(cartItem => ({
                order_id: orderData.id,
                menu_item_id: cartItem.item.id,
                quantity: cartItem.quantity,
                line_total: cartItem.item.price * cartItem.quantity
            }));
            
            const { error: orderItemsError } = await supabase.from('order_items').insert(orderItemsToInsert);

            if (orderItemsError) throw orderItemsError;

            // 4. Navigate to success page
            navigate(`/store/${slug}/success`, { state: { order: orderData } });

        } catch (err: any) {
            console.error("Error placing order:", err);
            setError("Could not place your order. Please try again.");
        } finally {
            setIsPlacingOrder(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto min-h-screen pb-24">
            <header className="bg-card/80 backdrop-blur-sm p-4 text-center border-b border-border sticky top-0 z-10">
                <h1 className="text-xl font-bold">Checkout</h1>
            </header>
            <main className="p-4 space-y-4">
                <div className="bg-card rounded-lg p-4 border border-border">
                    <h2 className="font-bold mb-2">Your Order</h2>
                    {cart.map(({ item, quantity }) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                            <div>
                                <p className="font-medium">{quantity}x {item.name}</p>
                            </div>
                            <p className="font-semibold">₱{(item.price * quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-bold text-lg">
                        <p>Total</p>
                        <p>₱{subtotal.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-card rounded-lg p-4 border border-border">
                     <h2 className="font-bold mb-2">Pickup Details</h2>
                     <div className="grid grid-cols-1 gap-4">
                         <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-1" htmlFor="name">Name</label>
                            <input value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="name" type="text" placeholder="Your Name" required />
                         </div>
                          <div>
                            <label className="block text-muted-foreground text-sm font-medium mb-1" htmlFor="phone">Phone Number</label>
                            <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} className="w-full px-3 py-2 rounded-md bg-input border border-border focus:outline-none focus:ring-2 focus:ring-ring" id="phone" type="tel" placeholder="Phone Number" required />
                         </div>
                     </div>
                </div>
                 <div className="bg-card rounded-lg p-4 border border-border">
                     <h2 className="font-bold mb-2">Payment Method</h2>
                     <p className="text-sm text-muted-foreground">Payment will be processed upon pickup.</p>
                </div>

                {error && <p className="text-sm text-center text-destructive bg-destructive/10 p-3 rounded-md">{error}</p>}
            </main>
             <div className="fixed bottom-0 left-0 right-0 max-w-3xl mx-auto p-4 bg-card/80 backdrop-blur-sm border-t border-border">
                <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg flex justify-between items-center text-center hover:bg-primary/90 disabled:opacity-70"
                >
                    <span>{isPlacingOrder ? 'Placing Order...' : 'Place Order'}</span>
                    <span>₱{subtotal.toFixed(2)}</span>
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;