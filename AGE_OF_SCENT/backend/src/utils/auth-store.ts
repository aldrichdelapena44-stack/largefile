import { randomUUID } from "crypto";

export type UserRole = "CUSTOMER" | "ADMIN";
export type VerificationState =
    | "UNVERIFIED"
    | "PENDING"
    | "APPROVED"
    | "REJECTED";

export type StoredUser = {
    id: number;
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    verificationStatus: VerificationState;
    createdAt: string;
};

const users: StoredUser[] = [];
const sessions = new Map<string, number>();
let nextUserId = 1;

export function sanitizeUser(user: StoredUser) {
    return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        verificationStatus: user.verificationStatus,
        createdAt: user.createdAt
    };
}

export function listUsers() {
    return users.map(sanitizeUser);
}

export function getUserById(id: number) {
    return users.find((user) => user.id === id) || null;
}

export function findUserByEmail(email: string) {
    const normalized = email.toLowerCase();

    return (
        users.find((user) => {
            const userEmail = user.email.toLowerCase();
            return (
                userEmail === normalized ||
                (userEmail === "admin@ageofscent.local" &&
                    normalized === "admin@maisonaurum.local")
            );
        }) || null
    );
}

export function createUser(fullName: string, email: string, password: string) {
    const user: StoredUser = {
        id: nextUserId++,
        fullName,
        email,
        password,
        role: "CUSTOMER",
        verificationStatus: "UNVERIFIED",
        createdAt: new Date().toISOString()
    };

    users.push(user);
    return user;
}

export function validateUser(email: string, password: string) {
    const user = findUserByEmail(email);
    if (!user) return null;
    return user.password === password ? user : null;
}

export function createSession(userId: number) {
    const token = randomUUID();
    sessions.set(token, userId);
    return token;
}

export function getUserByToken(token: string) {
    const userId = sessions.get(token);
    if (!userId) return null;
    return getUserById(userId);
}

export function updateUserVerificationStatus(
    userId: number,
    verificationStatus: VerificationState
) {
    const user = getUserById(userId);
    if (!user) return null;

    user.verificationStatus = verificationStatus;
    return user;
}

export function ensureAdminUser() {
    const existing = findUserByEmail("admin@ageofscent.local");
    if (existing) return existing;

    const admin: StoredUser = {
        id: nextUserId++,
        fullName: "AGE OF SCENT Admin",
        email: "admin@ageofscent.local",
        password: "admin12345",
        role: "ADMIN",
        verificationStatus: "APPROVED",
        createdAt: new Date().toISOString()
    };

    users.push(admin);
    return admin;
}