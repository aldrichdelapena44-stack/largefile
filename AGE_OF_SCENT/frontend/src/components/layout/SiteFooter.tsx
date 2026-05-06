"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
    const pathname = usePathname();

    if (pathname === "/age-gate") {
        return (
            <footer className="site-footer site-footer--quiet">
                <div className="site-footer__inner site-footer__stack">
                    <p>AGE OF SCENT private boutique access.</p>
                    <p className="muted footer-warning">
                        Continue only if you are eligible to create an account and complete secure checkout.
                    </p>
                </div>
            </footer>
        );
    }

    return (
        <footer className="site-footer" id="footer">
            <div className="site-footer__inner footer-grid">
                <div>
                    <Link href="/" className="brand footer-brand">
                        <span className="brand__mark">AS</span>
                        <span>AGE OF SCENT</span>
                    </Link>
                    <p className="muted">
                        Luxury perfume, cinematic storytelling, and a preserved full-stack
                        shopping system.
                    </p>
                </div>

                <div className="footer-links">
                    <Link href="/#story">Brand Story</Link>
                    <Link href="/#collection">Collection</Link>
                    <Link href="/shop">Shop</Link>
                    <Link href="/feedback">Feedback</Link>
                    <Link href="/privacy">Privacy Policy</Link>
                    <Link href="/terms">Terms and Conditions</Link>
                </div>

                <div className="footer-newsletter">
                    <p className="eyebrow">Atelier Notes</p>
                    <p className="muted">
                        Polished amber, rare florals, soft woods, and private consultation for your
                        next signature fragrance.
                    </p>
                </div>
            </div>
        </footer>
    );
}
