import React from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { CheckCircleIcon } from '../../components/icons';
import { Order } from '../../types';

const SuccessPage: React.FC = () => {
    const { slug } = useParams();
    const location = useLocation();
    const order = location.state?.order as Order | undefined;

    return (
        <div className="max-w-3xl mx-auto min-h-screen flex items-center justify-center p-4">
            <div className="bg-card rounded-lg shadow-lg p-8 text-center max-w-sm w-full border border-border">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-card-foreground mb-2">Order Received!</h1>
                {order ? (
                    <>
                        <p className="text-muted-foreground mb-1">Your order number is <span className="font-mono font-semibold text-foreground">{order.order_number}</span>.</p>
                        <p className="text-muted-foreground mb-6">Your order is now <span className="font-semibold text-foreground">{order.status}</span>. We're waiting for the store to confirm it. You'll receive updates soon!</p>
                    </>
                ) : (
                    <p className="text-muted-foreground mb-6">Your order has been placed successfully. You will be notified when the store confirms it.</p>
                )}
                <Link 
                    to={`/store/${slug}`}
                    className="w-full bg-primary text-primary-foreground font-bold py-3 px-4 rounded-lg inline-block hover:bg-primary/90"
                >
                    Back to Menu
                </Link>
            </div>
        </div>
    );
};

export default SuccessPage;