"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { clearAuth, getAuthUser } from "@/lib/auth";
import { getCartCount } from "@/lib/cart";

const homeSections = ["home", "story", "signatures", "collection", "atelier", "contact"];

export default function SiteHeader() {
    const pathname = usePathname();
    const isAgeGatePage = pathname === "/age-gate";

    const [cartCount, setCartCount] = useState(0);
    const [userName, setUserName] = useState("");
    const [userRole, setUserRole] = useState("");
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("home");

    useEffect(() => {
        function syncState() {
            const user = getAuthUser();
            setCartCount(getCartCount());
            setUserName(user?.fullName || "");
            setUserRole(user?.role || "");
        }

        syncState();

        window.addEventListener("cart-updated", syncState);
        window.addEventListener("auth-updated", syncState);

        return () => {
            window.removeEventListener("cart-updated", syncState);
            window.removeEventListener("auth-updated", syncState);
        };
    }, []);

    useEffect(() => {
        function handleScroll() {
            setScrolled(window.scrollY > 24);
        }

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (pathname !== "/") {
            setActiveSection("");
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            {
                threshold: 0.42
            }
        );

        homeSections.forEach((id) => {
            const section = document.getElementById(id);
            if (section) observer.observe(section);
        });

        return () => observer.disconnect();
    }, [pathname]);

    function handleLogout() {
        clearAuth();
    }

    if (isAgeGatePage) {
        return (
            <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
                <div className="site-header__inner">
                    <span className="brand">AGE OF SCENT</span>
                </div>
            </header>
        );
    }

    return (
        <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
            <div className="site-header__inner">
                <Link href="/" className="brand" aria-label="AGE OF SCENT Home">
                    <span className="brand__mark">AS</span>
                    <span>AGE OF SCENT</span>
                </Link>

                <nav className="site-nav" aria-label="Main navigation">
                    <Link className={activeSection === "story" ? "is-active" : ""} href="/#story">
                        Story
                    </Link>
                    <Link
                        className={activeSection === "signatures" ? "is-active" : ""}
                        href="/#signatures"
                    >
                        Signatures
                    </Link>
                    <Link
                        className={activeSection === "collection" ? "is-active" : ""}
                        href="/#collection"
                    >
                        Collection
                    </Link>
                    <Link className={pathname === "/shop" ? "is-active" : ""} href="/shop">
                        Shop
                    </Link>
                    <Link className={pathname === "/cart" ? "is-active" : ""} href="/cart">
                        Cart <span className="cart-pill">{cartCount}</span>
                    </Link>

                    {userName ? (
                        <>
                            <Link className={pathname === "/account" ? "is-active" : ""} href="/account">
                                Account
                            </Link>
                            {userRole === "ADMIN" ? (
                                <Link className={pathname.startsWith("/admin") ? "is-active" : ""} href="/admin">
                                    Admin
                                </Link>
                            ) : null}
                            <Link className={pathname === "/feedback" ? "is-active" : ""} href="/feedback">
                                Feedback
                            </Link>
                            <span className="nav-user">Hi, {userName}</span>
                            <button
                                className="btn btn--small btn--ghost"
                                type="button"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link className={pathname === "/feedback" ? "is-active" : ""} href="/feedback">
                                Feedback
                            </Link>
                            <Link className={pathname === "/login" ? "is-active" : ""} href="/login">
                                Login
                            </Link>
                            <Link className={pathname === "/register" ? "is-active" : ""} href="/register">
                                Register
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
