"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import ProductCard, { type ProductCardData } from "@/components/shop/ProductCard";
import { api } from "@/lib/api";

type Product = ProductCardData & {
    isActive?: boolean;
};

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [message, setMessage] = useState("Loading perfume collection...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await api.get<{
                    success: boolean;
                    message: string;
                    data: Product[];
                }>("/products");

                setProducts(response.data || []);
                setMessage("");
            } catch (error) {
                setMessage(
                    error instanceof Error ? error.message : "Failed to load perfumes."
                );
            } finally {
                setLoading(false);
            }
        }

        loadProducts();
    }, []);

    return (
        <PageShell
            title="Perfume Boutique"
            description="Browse the AGE OF SCENT fragrance catalog pulled directly from the existing backend API."
        >
            <section className="card boutique-intro">
                <p className="eyebrow">Collection</p>
                <h2>Fragrances for presence, memory, and quiet luxury.</h2>
                <p className="muted">
                    Choose from signature perfume bottles with detailed scent descriptions,
                    live stock, cart interaction, and the original checkout flow preserved.
                </p>
            </section>

            {loading ? <p className="muted">{message}</p> : null}
            {!loading && message ? <p className="muted">{message}</p> : null}

            <div className="product-grid">
                {products.map((product, index) => (
                    <ProductCard key={product.id} product={product} revealDelay={index * 90} />
                ))}
            </div>

            {!loading && products.length === 0 ? (
                <div className="card empty-state">
                    <h3>No perfumes available yet.</h3>
                    <p className="muted">
                        Add or activate products in the backend product service or database layer,
                        and they will appear here automatically.
                    </p>
                </div>
            ) : null}
        </PageShell>
    );
}
