import React, { useState, useEffect, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Order, OrderStatus } from '../../types';
import { AppContext } from '../../App';
import { isSupabaseActive, supabase } from '../../lib/supabaseClient';

const salesData = [
  { name: 'Mon', Sales: 4000 },
  { name: 'Tue', Sales: 3000 },
  { name: 'Wed', Sales: 2000 },
  { name: 'Thu', Sales: 2780 },
  { name: 'Fri', Sales: 1890 },
  { name: 'Sat', Sales: 2390 },
  { name: 'Sun', Sales: 3490 },
];

interface StatCardProps {
    title: string;
    value: string;
    subtext?: string;
    loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtext, loading }) => (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {loading ? (
             <div className="h-9 mt-1 w-3/4 bg-muted rounded animate-pulse"></div>
        ) : (
            <p className="text-3xl font-bold text-card-foreground mt-1">{value}</p>
        )}
        {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
    </div>
);

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.Completed: return 'bg-green-100 text-green-800';
        case OrderStatus.Pending: return 'bg-yellow-100 text-yellow-800';
        case OrderStatus.Preparing: return 'bg-blue-100 text-blue-800';
        case OrderStatus.Ready: return 'bg-indigo-100 text-indigo-800';
        case OrderStatus.Cancelled: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const RecentOrdersTable: React.FC<{ orders: Order[], loading: boolean }> = ({ orders, loading }) => (
    <div className="bg-card p-6 rounded-lg border border-border shadow-sm">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-muted-foreground">
                <thead className="text-xs text-foreground uppercase bg-muted">
                    <tr>
                        <th scope="col" className="px-4 py-3">Customer</th>
                        <th scope="col" className="px-4 py-3">Total</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Time</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        [...Array(5)].map((_, i) => (
                            <tr key={i} className="bg-card border-b border-border">
                                <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                                <td className="px-4 py-3"><div className="h-4 bg-muted rounded animate-pulse"></div></td>
                            </tr>
                        ))
                    ) : orders.length > 0 ? (
                        orders.map(order => (
                            <tr key={order.id} className="bg-card border-b border-border hover:bg-muted">
                                <td className="px-4 py-3 font-medium text-card-foreground whitespace-nowrap">{order.customer.name}</td>
                                <td className="px-4 py-3">₱{order.total.toFixed(2)}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                            </tr>
                        ))
                    ) : (
                         <tr>
                            <td colSpan={4} className="text-center py-8 text-muted-foreground">No recent orders found.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const DashboardOverview: React.FC = () => {
    const context = useContext(AppContext);
    const [stats, setStats] = useState({
        totalSales: 0,
        orderCount: 0,
        avgOrderValue: 0
    });
    const [recentOrders, setRecentOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
             if (!context?.tenant?.id || !isSupabaseActive) {
                setLoading(false);
                setError("Could not retrieve store data. Please ensure you are logged in.");
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                // Fetch orders for today's stats
                const { data: todayOrders, error: todayError } = await supabase
                    .from('orders')
                    .select('total, status')
                    .eq('tenant_id', context.tenant.id)
                    .gte('created_at', today.toISOString())
                    .lt('created_at', tomorrow.toISOString());

                if (todayError) throw todayError;
                
                const completedOrders = todayOrders.filter(o => o.status === OrderStatus.Completed);
                const totalSales = completedOrders.reduce((sum, order) => sum + order.total, 0);
                const orderCount = todayOrders.length;
                const avgOrderValue = orderCount > 0 ? totalSales / orderCount : 0;
                
                setStats({
                    totalSales,
                    orderCount,
                    avgOrderValue
                });
                
                // Fetch recent orders
                const { data: recentOrdersData, error: recentError } = await supabase
                    .from('orders')
                    .select('*, customer:customers(*)')
                    .eq('tenant_id', context.tenant.id)
                    .order('created_at', { ascending: false })
                    .limit(5);

                if (recentError) throw recentError;
                
                setRecentOrders(recentOrdersData as unknown as Order[]);

            } catch (err: any) {
                console.error("Error fetching dashboard data:", err);
                setError("Failed to load dashboard data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [context?.tenant?.id]);


    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            
            {error && <div className="bg-destructive/20 text-destructive p-4 rounded-md">{error}</div>}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Sales (Today)" 
                    value={`₱${stats.totalSales.toFixed(2)}`}
                    loading={loading}
                />
                <StatCard 
                    title="Number of Orders (Today)" 
                    value={stats.orderCount.toString()}
                    loading={loading}
                />
                <StatCard 
                    title="Average Order Value (Today)" 
                    value={`₱${stats.avgOrderValue.toFixed(2)}`}
                    loading={loading}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-card p-6 rounded-lg border border-border shadow-sm">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">Sales This Week</h3>
                     <div className="w-full h-80">
                        <ResponsiveContainer>
                            <BarChart data={salesData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)"/>
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--muted-foreground)', fontSize: 12}} tickFormatter={(value) => `₱${value}`} />
                                <Tooltip cursor={{fill: 'var(--muted)'}} contentStyle={{backgroundColor: 'var(--popover)', borderRadius: 'var(--radius)', border: '1px solid var(--border)'}}/>
                                <Legend wrapperStyle={{fontSize: "14px"}}/>
                                <Bar dataKey="Sales" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="lg:col-span-1">
                    <RecentOrdersTable orders={recentOrders} loading={loading} />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;