"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import { getAuthUser, isLoggedIn } from "@/lib/auth";

type UserState = {
    id: number;
    fullName: string;
    email: string;
    role?: string;
    verificationStatus?: string;
} | null;

export default function AccountPage() {
    const [user, setUser] = useState<UserState>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setUser(getAuthUser());
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <PageShell title="Account" description="Loading account.">
                <div className="card">
                    <p className="muted">Loading...</p>
                </div>
            </PageShell>
        );
    }

    if (!isLoggedIn()) {
        return (
            <PageShell title="Account" description="Login required.">
                <div className="card empty-state">
                    <h3>Access your private profile.</h3>
                    <p className="muted">Please log in to view orders, verification, and boutique details.</p>
                    <div className="button-row">
                        <Link href="/login" className="btn">
                            Login
                        </Link>
                        <Link href="/register" className="btn btn--ghost">
                            Register
                        </Link>
                    </div>
                </div>
            </PageShell>
        );
    }

    const verificationStatus = user?.verificationStatus || "UNVERIFIED";

    return (
        <PageShell title="Account" description="Your AGE OF SCENT profile overview.">
            <div className="grid grid--2">
                <div className="card account-card">
                    <p className="eyebrow">Profile</p>
                    <h3>{user?.fullName}</h3>
                    <p>
                        <strong>Email:</strong> {user?.email}
                    </p>
                    <p>
                        <strong>Role:</strong> {user?.role || "CUSTOMER"}
                    </p>
                </div>

                <div className="card account-card">
                    <p className="eyebrow">Verification</p>
                    <h3>Account review</h3>
                    <p>
                        <strong>Status:</strong>{" "}
                        <span className={`status-badge status-${verificationStatus.toLowerCase()}`}>
                            {verificationStatus}
                        </span>
                    </p>

                    <div className="button-row">
                        <Link href="/age-verification" className="btn">
                            Manage Verification
                        </Link>
                    </div>
                </div>
            </div>

            <div className="card">
                <p className="eyebrow">Next Steps</p>
                {verificationStatus === "APPROVED" ? (
                    <p className="muted">
                        Your account is verified. You may proceed with the perfume checkout flow.
                    </p>
                ) : verificationStatus === "PENDING" ? (
                    <p className="muted">
                        Your verification is under review. Admin approval remains preserved in the system.
                    </p>
                ) : verificationStatus === "REJECTED" ? (
                    <p className="muted">
                        Your verification was rejected. Please submit a new valid image for review.
                    </p>
                ) : (
                    <p className="muted">
                        Your account is not verified yet. Submit verification before full checkout.
                    </p>
                )}
            </div>
        </PageShell>
    );
}
