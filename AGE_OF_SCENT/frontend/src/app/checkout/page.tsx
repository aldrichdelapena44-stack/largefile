"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import { api } from "@/lib/api";
import { clearCart, getCart, type CartItem } from "@/lib/cart";
import { getAuthUser, isLoggedIn } from "@/lib/auth";

export default function CheckoutPage() {
    const [fullName, setFullName] = useState("");
    const [address, setAddress] = useState("");
    const [gcashNumber, setGcashNumber] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setCart(getCart());
        setMounted(true);
    }, []);

    const total = useMemo(
        () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [cart]
    );
    const user = mounted ? getAuthUser() : null;
    const verificationStatus = user?.verificationStatus || "UNVERIFIED";

    async function handleCheckout(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await api.post<{
                success: boolean;
                message: string;
                data: {
                    order: unknown;
                    payment: {
                        provider: string;
                        providerReference: string;
                        checkoutUrl: string;
                        amount: number;
                        status: string;
                    };
                };
            }>("/payments/gcash/checkout", {
                fullName,
                address,
                gcashNumber,
                items: cart,
                total
            });

            clearCart();
            setCart([]);
            setMessage(
                `${response.message} Reference: ${response.data.payment.providerReference}`
            );
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Checkout failed.");
        } finally {
            setLoading(false);
        }
    }

    if (!mounted) {
        return (
            <PageShell title="Checkout" description="Preparing secure checkout.">
                <div className="card">
                    <p className="muted">Loading checkout...</p>
                </div>
            </PageShell>
        );
    }

    if (!isLoggedIn()) {
        return (
            <PageShell title="Checkout" description="Login is required before checkout.">
                <div className="card empty-state">
                    <h3>Sign in to continue.</h3>
                    <p className="muted">Your account keeps orders, verification, and checkout secure.</p>
                    <div className="button-row">
                        <Link href="/login" className="btn">
                            Login
                        </Link>
                    </div>
                </div>
            </PageShell>
        );
    }

    if (verificationStatus === "UNVERIFIED" || verificationStatus === "REJECTED") {
        return (
            <PageShell
                title="Checkout"
                description="Account verification is required before checkout."
            >
                <div className="card empty-state">
                    <h3>Verification needed.</h3>
                    <p className="muted">
                        Complete identity verification before placing a perfume order.
                    </p>
                    <div className="button-row">
                        <Link href="/age-verification" className="btn">
                            Go to Verification
                        </Link>
                    </div>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell title="Checkout" description="Submit your GCash-ready AGE OF SCENT order.">
            {verificationStatus === "PENDING" ? (
                <div className="card">
                    <p className="muted">
                        Your verification is currently pending review. Checkout can be completed
                        after admin approval.
                    </p>
                </div>
            ) : null}

            <form className="card form-card checkout-form" onSubmit={handleCheckout}>
                <div className="form-group">
                    <label>Full name</label>
                    <input
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder={user?.fullName || "Full name"}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Delivery address</label>
                    <textarea
                        value={address}
                        onChange={(event) => setAddress(event.target.value)}
                        placeholder="Delivery address"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>GCash number</label>
                    <input
                        value={gcashNumber}
                        onChange={(event) => setGcashNumber(event.target.value)}
                        placeholder="09XXXXXXXXX"
                        required
                    />
                </div>

                <div className="card checkout-summary">
                    <span>Items</span>
                    <strong>{cart.length}</strong>
                    <span>Total</span>
                    <strong>PHP {total.toFixed(2)}</strong>
                </div>

                <button className="btn" type="submit" disabled={loading || cart.length === 0}>
                    {loading ? "Submitting..." : "Pay with GCash"}
                </button>

                {message ? <p className="muted">{message}</p> : null}
            </form>
        </PageShell>
    );
}
