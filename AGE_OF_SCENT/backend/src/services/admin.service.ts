import { getAllUsers } from "./auth.service";
import { getAllOrders, countOrders } from "./order.service";
import { countProducts, getAdminProducts } from "./product.service";
import { countNewFeedback, getAllFeedback } from "./feedback.service";
import { countPendingVerifications, getAllVerifications } from "./verification.service";

export function getAdminSummary() {
    return {
        users: getAllUsers().length,
        products: countProducts(),
        orders: countOrders(),
        pendingVerifications: countPendingVerifications(),
        newFeedback: countNewFeedback()
    };
}

export function getAdminUsers() {
    return getAllUsers();
}

export function getAdminOrders() {
    return getAllOrders();
}

export function getAdminVerifications() {
    return getAllVerifications();
}

export function getAdminProductList() {
    return getAdminProducts();
}

export function getAdminFeedback() {
    return getAllFeedback();
}
