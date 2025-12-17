"use client";

import React, { useEffect, useState } from 'react';
import OrderTable from '@/components/order/OrderTable';
import { orderService } from '@/services/orderService';
import { Order } from '@/type/order';
import { toast } from 'sonner';

export default function OrderPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderService.listOrders(1, 100); // Fetch first 100 orders for now
                setOrders(response.data); // Assuming response.data is the array based on previous verify
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                toast.error('Failed to load orders');
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-6">Order Management</h1>
            {loading ? (
                <div>Loading...</div>
            ) : (
                <OrderTable orders={orders} />
            )}
        </div>
    );
}
