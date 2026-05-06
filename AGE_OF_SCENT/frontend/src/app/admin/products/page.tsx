"use client";

import { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import AdminGuard from "@/components/admin/AdminGuard";
import { api } from "@/lib/api";

type AdminProduct = {
    id: number;
    slug: string;
    name: string;
    description: string;
    scentNotes: string;
    price: number;
    stock: number;
    isActive: boolean;
    updatedAt?: string;
};

type ProductDraft = {
    name: string;
    description: string;
    scentNotes: string;
    price: string;
    stock: string;
    isActive: boolean;
};

function toDraft(product: AdminProduct): ProductDraft {
    return {
        name: product.name,
        description: product.description,
        scentNotes: product.scentNotes || "",
        price: String(product.price),
        stock: String(product.stock),
        isActive: product.isActive
    };
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [drafts, setDrafts] = useState<Record<number, ProductDraft>>({});
    const [message, setMessage] = useState("Loading products...");
    const [savingId, setSavingId] = useState<number | null>(null);

    async function loadProducts() {
        try {
            const response = await api.get<{ success: boolean; message: string; data: AdminProduct[] }>(
                "/admin/products"
            );
            const productList = response.data || [];
            setProducts(productList);
            setDrafts(
                productList.reduce<Record<number, ProductDraft>>((acc, product) => {
                    acc[product.id] = toDraft(product);
                    return acc;
                }, {})
            );
            setMessage("");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to load products.");
        }
    }

    useEffect(() => {
        loadProducts();
    }, []);

    function updateDraft(id: number, field: keyof ProductDraft, value: string | boolean) {
        setDrafts((current) => ({
            ...current,
            [id]: {
                ...current[id],
                [field]: value
            }
        }));
    }

    async function saveProduct(id: number) {
        const draft = drafts[id];
        if (!draft) return;

        try {
            setSavingId(id);
            setMessage("");
            const response = await api.put<{ success: boolean; message: string; data: AdminProduct }>(
                `/admin/products/${id}`,
                {
                    name: draft.name,
                    description: draft.description,
                    scentNotes: draft.scentNotes,
                    price: Number(draft.price),
                    stock: Number(draft.stock),
                    isActive: draft.isActive
                }
            );
            setProducts((current) => current.map((product) => (product.id === id ? response.data : product)));
            setDrafts((current) => ({ ...current, [id]: toDraft(response.data) }));
            setMessage(response.message || "Product updated.");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Product update failed.");
        } finally {
            setSavingId(null);
        }
    }

    return (
        <PageShell
            title="Manage Products"
            description="Edit product name, price, stock, scent notes, visibility, and description without changing the backend structure."
        >
            <AdminGuard>
                {message ? <p className="muted">{message}</p> : null}

                <div className="grid admin-product-grid">
                    {products.map((product) => {
                        const draft = drafts[product.id];

                        return (
                            <article className="card admin-product-card" key={product.id}>
                                <div className="admin-product-card__heading">
                                    <div>
                                        <p className="eyebrow">Product #{product.id}</p>
                                        <h3>{product.name}</h3>
                                        <p className="muted">Slug: {product.slug}</p>
                                    </div>
                                    <span className={`status-badge ${product.isActive ? "status-approved" : "status-rejected"}`}>
                                        {product.isActive ? "Active" : "Hidden"}
                                    </span>
                                </div>

                                {draft ? (
                                    <div className="admin-edit-form">
                                        <div className="grid grid--2">
                                            <div className="form-group">
                                                <label htmlFor={`product-name-${product.id}`}>Name</label>
                                                <input
                                                    id={`product-name-${product.id}`}
                                                    value={draft.name}
                                                    onChange={(event) => updateDraft(product.id, "name", event.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={`product-price-${product.id}`}>Price</label>
                                                <input
                                                    id={`product-price-${product.id}`}
                                                    type="number"
                                                    min="1"
                                                    step="0.01"
                                                    value={draft.price}
                                                    onChange={(event) => updateDraft(product.id, "price", event.target.value)}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid--2">
                                            <div className="form-group">
                                                <label htmlFor={`product-stock-${product.id}`}>Stock</label>
                                                <input
                                                    id={`product-stock-${product.id}`}
                                                    type="number"
                                                    min="0"
                                                    step="1"
                                                    value={draft.stock}
                                                    onChange={(event) => updateDraft(product.id, "stock", event.target.value)}
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor={`product-active-${product.id}`}>Visibility</label>
                                                <select
                                                    id={`product-active-${product.id}`}
                                                    value={draft.isActive ? "true" : "false"}
                                                    onChange={(event) => updateDraft(product.id, "isActive", event.target.value === "true")}
                                                >
                                                    <option value="true">Show in shop</option>
                                                    <option value="false">Hide from shop</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor={`product-notes-${product.id}`}>Scent Notes</label>
                                            <input
                                                id={`product-notes-${product.id}`}
                                                value={draft.scentNotes}
                                                onChange={(event) => updateDraft(product.id, "scentNotes", event.target.value)}
                                            />
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor={`product-description-${product.id}`}>Description</label>
                                            <textarea
                                                id={`product-description-${product.id}`}
                                                value={draft.description}
                                                onChange={(event) => updateDraft(product.id, "description", event.target.value)}
                                            />
                                        </div>

                                        <div className="button-row">
                                            <button
                                                className="btn"
                                                type="button"
                                                onClick={() => saveProduct(product.id)}
                                                disabled={savingId === product.id}
                                            >
                                                {savingId === product.id ? "Saving..." : "Save Product"}
                                            </button>
                                        </div>
                                    </div>
                                ) : null}
                            </article>
                        );
                    })}
                </div>
            </AdminGuard>
        </PageShell>
    );
}
