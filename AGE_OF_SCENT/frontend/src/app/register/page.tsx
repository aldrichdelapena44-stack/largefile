"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "@/components/layout/PageShell";
import { api } from "@/lib/api";
import { saveAuth } from "@/lib/auth";

export default function RegisterPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await api.post<{
                success: boolean;
                message: string;
                data: {
                    token: string;
                    user: {
                        id: number;
                        fullName: string;
                        email: string;
                        role?: string;
                        verificationStatus?: string;
                    };
                };
            }>("/auth/register", {
                fullName,
                email,
                password
            });

            saveAuth(response.data.token, response.data.user);
            setMessage("Registration successful.");
            router.push("/");
            router.refresh();
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Registration failed.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <PageShell title="Register" description="Create your AGE OF SCENT account.">
            <form className="card form-card auth-card" onSubmit={handleSubmit}>
                <div>
                    <p className="eyebrow">Client Profile</p>
                    <h2>Begin your perfume wardrobe.</h2>
                    <p className="muted">
                        Registration still uses the original backend route, preserving account,
                        token, verification, and admin behavior.
                    </p>
                </div>

                <div className="form-group">
                    <label>Full name</label>
                    <input
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        type="text"
                        placeholder="Enter your full name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        type="email"
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        type="password"
                        placeholder="Create a password"
                        required
                    />
                </div>

                <button className="btn" type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Register"}
                </button>

                {message ? <p className="muted">{message}</p> : null}
            </form>
        </PageShell>
    );
}
