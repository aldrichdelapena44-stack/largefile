"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import AdminGuard from "@/components/admin/AdminGuard";
import { api } from "@/lib/api";

type AdminOrder = {
    id: number;
    userId: number;
    fullName: string;
    address: string;
    gcashNumber: string;
    total: number;
    status: string;
    paymentProvider?: string;
    paymentReference?: string;
    createdAt: string;
};

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<AdminOrder[]>([]);
    const [message, setMessage] = useState("Loading orders...");

    useEffect(() => {
        async function loadOrders() {
            try {
                const response = await api.get<{
                    success: boolean;
                    message: string;
                    data: AdminOrder[];
                }>("/admin/orders");

                setOrders(response.data || []);
                setMessage("");
            } catch (error) {
                setMessage(error instanceof Error ? error.message : "Failed to load orders.");
            }
        }

        loadOrders();
    }, []);

    return (
        <PageShell title="Admin Orders" description="Perfume order submissions overview.">
            <AdminGuard>
                {message ? <p className="muted">{message}</p> : null}

                <div className="grid">
                    {orders.map((order) => (
                        <div className="card admin-row-card" key={order.id}>
                            <div>
                                <h3>Order #{order.id}</h3>
                                <p className="muted">{order.fullName}</p>
                            </div>

                            <div>
                                <p>
                                    <strong>Total:</strong> PHP {Number(order.total).toFixed(2)}
                                </p>
                                <p>
                                    <strong>Status:</strong> {order.status}
                                </p>
                                <p className="muted">
                                    <strong>Reference:</strong> {order.paymentReference || "N/A"}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </AdminGuard>
        </PageShell>
    );
}
