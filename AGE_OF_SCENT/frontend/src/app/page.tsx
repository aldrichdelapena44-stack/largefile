"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState, type CSSProperties } from "react";
import ProductCard, { type ProductCardData } from "@/components/shop/ProductCard";
import ProductVisual from "@/components/shop/ProductVisual";
import { api } from "@/lib/api";
import { addToCart } from "@/lib/cart";

type Product = ProductCardData & {
    isActive?: boolean;
};

type ContactState = {
    name: string;
    email: string;
    message: string;
};

const fallbackProducts: Product[] = [
    {
        id: 1,
        slug: "aurum-noir-parfum",
        name: "Aurum Noir Parfum",
        description: "A velvet evening fragrance built around black orchid, smoked vanilla, and warm amber.",
        scentNotes: "Black orchid, vanilla, amber, cedar",
        volume: "50 ml",
        mood: "Evening signature",
        price: 3490,
        stock: 18,
        imageUrl: "/images/products/aurum-noir.svg"
    },
    {
        id: 2,
        slug: "rose-velours-eau-de-parfum",
        name: "Rose Velours Eau de Parfum",
        description: "A luminous rose composition softened with lychee, iris, and white musk.",
        scentNotes: "Damask rose, lychee, iris, white musk",
        volume: "75 ml",
        mood: "Romantic floral",
        price: 2890,
        stock: 24,
        imageUrl: "/images/products/rose-velours.svg"
    },
    {
        id: 3,
        slug: "citrus-atelier-eau-de-parfum",
        name: "Citrus Atelier Eau de Parfum",
        description: "Fresh bergamot and neroli wrapped in tea leaves, vetiver, and sunlit woods.",
        scentNotes: "Bergamot, neroli, tea, vetiver",
        volume: "50 ml",
        mood: "Daylight elegance",
        price: 2490,
        stock: 30,
        imageUrl: "/images/products/citrus-atelier.svg"
    }
];

const storySteps = [
    {
        number: "01",
        title: "The first impression",
        text: "A quiet opening of citrus, petals, and polished glass sets the pace before the fragrance settles into skin."
    },
    {
        number: "02",
        title: "The heart of the house",
        text: "Rare florals, soft spice, and textured musks are layered to create depth without heaviness."
    },
    {
        number: "03",
        title: "The lasting trace",
        text: "Amber, woods, and vanilla leave a refined signature that feels intimate, modern, and memorable."
    }
];

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productMessage, setProductMessage] = useState("Loading boutique collection...");
    const [scrollY, setScrollY] = useState(0);
    const [heroAdded, setHeroAdded] = useState(false);
    const [contact, setContact] = useState<ContactState>({
        name: "",
        email: "",
        message: ""
    });
    const [contactMessage, setContactMessage] = useState("");
    const [contactLoading, setContactLoading] = useState(false);

    useEffect(() => {
        async function loadProducts() {
            try {
                const response = await api.get<{
                    success: boolean;
                    message: string;
                    data: Product[];
                }>("/products");

                setProducts(response.data || []);
                setProductMessage("");
            } catch (error) {
                setProductMessage(
                    error instanceof Error
                        ? `${error.message} Showing curated preview collection.`
                        : "Showing curated preview collection."
                );
            }
        }

        loadProducts();
    }, []);

    useEffect(() => {
        let ticking = false;

        function handleScroll() {
            if (ticking) return;
            ticking = true;

            window.requestAnimationFrame(() => {
                setScrollY(window.scrollY);
                ticking = false;
            });
        }

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const revealTargets = document.querySelectorAll<HTMLElement>(".reveal");
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.16,
                rootMargin: "0px 0px -8% 0px"
            }
        );

        revealTargets.forEach((target) => observer.observe(target));
        return () => observer.disconnect();
    }, [products.length]);

    useEffect(() => {
        if (!heroAdded) return;

        const timeout = window.setTimeout(() => setHeroAdded(false), 1500);
        return () => window.clearTimeout(timeout);
    }, [heroAdded]);

    const featuredProducts = useMemo(
        () => (products.length > 0 ? products : fallbackProducts),
        [products]
    );

    const heroProduct = featuredProducts[0] || fallbackProducts[0];

    function handleHeroAdd() {
        addToCart(heroProduct, 1);
        setHeroAdded(true);
    }

    async function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setContactLoading(true);
        setContactMessage("");

        try {
            const response = await api.post<{
                success: boolean;
                message: string;
                data: unknown;
            }>("/contact", contact);

            setContactMessage(response.message || "Your private consultation request has been received.");
            setContact({ name: "", email: "", message: "" });
        } catch (error) {
            setContactMessage(
                error instanceof Error
                    ? error.message
                    : "Unable to submit your consultation request right now."
            );
        } finally {
            setContactLoading(false);
        }
    }

    return (
        <div className="luxury-home">
            <section className="cinematic-hero" id="home">
                <div
                    className="hero-parallax hero-parallax--back"
                    style={{ transform: `translate3d(0, ${scrollY * 0.18}px, 0)` }}
                />
                <div
                    className="hero-parallax hero-parallax--mid"
                    style={{ transform: `translate3d(0, ${scrollY * 0.08}px, 0)` }}
                />

                <div className="cinematic-hero__content">
                    <div className="cinematic-hero__copy reveal is-visible">
                        <p className="eyebrow">AGE OF SCENT / Private Parfumerie</p>
                        <h1>Fragrance composed like a midnight film.</h1>
                        <p className="hero-lede">
                            A luxury perfume house for modern collectors, crafted with layered notes,
                            glowing bottles, and a cinematic shopping experience.
                        </p>

                        <div className="hero-actions">
                            <Link href="#collection" className="btn">
                                Explore Collection
                            </Link>
                            <Link href="/shop" className="btn btn--ghost">
                                Shop Perfumes
                            </Link>
                        </div>
                    </div>

                    <div
                        className="cinematic-hero__visual reveal is-visible"
                        style={{
                            "--parallax-lift": `${Math.min(scrollY * -0.1, 0)}px`
                        } as CSSProperties}
                    >
                        <div className="floating-badge">Signature extract</div>
                        <ProductVisual
                            name={heroProduct.name}
                            imageUrl={heroProduct.imageUrl}
                            className="product-visual--hero"
                        />
                        <div className="hero-product-card">
                            <span>{heroProduct.mood || "Iconic scent"}</span>
                            <strong>{heroProduct.name}</strong>
                            <button
                                className={`btn btn--small ${heroAdded ? "is-added" : ""}`}
                                type="button"
                                onClick={handleHeroAdd}
                            >
                                {heroAdded ? "Added to Cart" : `Add - PHP ${heroProduct.price.toFixed(2)}`}
                            </button>
                        </div>
                    </div>
                </div>

                <a className="scroll-cue" href="#story" aria-label="Scroll to brand story">
                    <span />
                    Begin the story
                </a>
            </section>

            <section className="story-section section-pad" id="story">
                <div className="section-kicker reveal">The Maison</div>
                <div className="story-grid">
                    <div className="story-copy reveal">
                        <p className="eyebrow">Brand Story</p>
                        <h2>Built for presence, not noise.</h2>
                        <p className="muted large-copy">
                            AGE OF SCENT transforms quiet rituals into memorable signatures. Each
                            fragrance moves from luminous opening to textured heart, then settles into
                            a warm, elegant trail that follows you through the night.
                        </p>
                    </div>

                    <div className="story-panel reveal">
                        <p>
                            We design each perfume as a sequence: first light, then emotion, then a
                            lasting memory. The result is premium, intimate, and deliberately slow.
                        </p>
                    </div>
                </div>

                <div className="story-steps">
                    {storySteps.map((step, index) => (
                        <article
                            className="story-step reveal"
                            key={step.number}
                            style={{ "--reveal-delay": `${index * 120}ms` } as CSSProperties}
                        >
                            <span>{step.number}</span>
                            <h3>{step.title}</h3>
                            <p className="muted">{step.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="signature-section section-pad" id="signatures">
                <div className="split-heading reveal">
                    <p className="eyebrow">Signature Perfumes</p>
                    <h2>Three moods. One unmistakable house style.</h2>
                    <p className="muted">
                        Deep glass, warm shadows, disciplined spacing, and slow scroll movement create
                        the same cinematic rhythm as the visual reference.
                    </p>
                </div>

                <div className="signature-grid">
                    {featuredProducts.slice(0, 3).map((product, index) => (
                        <article
                            className="signature-card reveal"
                            key={product.slug}
                            style={{ "--reveal-delay": `${index * 140}ms` } as CSSProperties}
                        >
                            <ProductVisual name={product.name} imageUrl={product.imageUrl} />
                            <span className="signature-card__index">0{index + 1}</span>
                            <h3>{product.name}</h3>
                            <p>{product.scentNotes || product.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="collection-section section-pad" id="collection">
                <div className="collection-backdrop" aria-hidden="true" />
                <div className="collection-copy reveal">
                    <p className="eyebrow">Featured Collection</p>
                    <h2>The velvet collection for nights that linger.</h2>
                    <p className="muted large-copy">
                        A scroll-driven showcase of polished bottles, warm amber highlights, and
                        layered parallax panels. Every card is connected to the existing backend
                        product API, so admin-managed inventory can continue to flow into the UI.
                    </p>
                    <Link href="/shop" className="btn">
                        View Full Boutique
                    </Link>
                </div>

                <div className="collection-visual reveal">
                    <ProductVisual
                        name={featuredProducts[1]?.name || fallbackProducts[1].name}
                        imageUrl={featuredProducts[1]?.imageUrl || fallbackProducts[1].imageUrl}
                        className="product-visual--feature"
                    />
                    <div className="collection-note">
                        <span>New season</span>
                        <strong>Floral amber, cashmere musk, polished woods.</strong>
                    </div>
                </div>
            </section>

            <section className="shop-story-section section-pad" id="atelier">
                <div className="section-heading reveal">
                    <p className="eyebrow">Admin Managed Product List</p>
                    <h2>Perfumes pulled from your backend API.</h2>
                    {productMessage ? <p className="muted">{productMessage}</p> : null}
                </div>

                <div className="product-grid product-grid--cinematic">
                    {featuredProducts.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            revealDelay={index * 110}
                        />
                    ))}
                </div>
            </section>

            <section className="contact-section section-pad" id="contact">
                <div className="contact-card reveal">
                    <div>
                        <p className="eyebrow">Private Consultation</p>
                        <h2>Let the atelier help you choose your signature.</h2>
                        <p className="muted">
                            Tell us the mood, occasion, or notes you love. Your message is submitted
                            through the backend API without changing the existing admin, auth, or order
                            routes.
                        </p>
                    </div>

                    <form className="form-card contact-form" onSubmit={handleContactSubmit}>
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                value={contact.name}
                                onChange={(event) =>
                                    setContact((current) => ({ ...current, name: event.target.value }))
                                }
                                placeholder="Your name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                value={contact.email}
                                onChange={(event) =>
                                    setContact((current) => ({ ...current, email: event.target.value }))
                                }
                                type="email"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Message</label>
                            <textarea
                                value={contact.message}
                                onChange={(event) =>
                                    setContact((current) => ({ ...current, message: event.target.value }))
                                }
                                placeholder="I want something warm, elegant, and long lasting..."
                                required
                            />
                        </div>

                        <button className="btn" type="submit" disabled={contactLoading}>
                            {contactLoading ? "Sending..." : "Request Consultation"}
                        </button>

                        {contactMessage ? <p className="muted">{contactMessage}</p> : null}
                    </form>
                </div>
            </section>
        </div>
    );
}
