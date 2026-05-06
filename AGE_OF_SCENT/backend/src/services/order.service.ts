export type CheckoutItem = {
    id: number;
    slug: string;
    name: string;
    price: number;
    quantity: number;
};

export type StoredOrder = {
    id: number;
    userId: number;
    fullName: string;
    address: string;
    gcashNumber: string;
    items: CheckoutItem[];
    total: number;
    status: "PENDING_PAYMENT" | "PAID" | "PROCESSING" | "CANCELLED";
    paymentProvider?: string;
    paymentReference?: string;
    createdAt: string;
};

const orders: StoredOrder[] = [];
let nextOrderId = 1;

export function createCheckoutOrder(input: {
    userId: number;
    fullName: string;
    address: string;
    gcashNumber: string;
    items: CheckoutItem[];
}) {
    const total = input.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const order: StoredOrder = {
        id: nextOrderId++,
        userId: input.userId,
        fullName: input.fullName,
        address: input.address,
        gcashNumber: input.gcashNumber,
        items: input.items,
        total,
        status: "PENDING_PAYMENT",
        createdAt: new Date().toISOString()
    };

    orders.push(order);
    return order;
}

export function attachPaymentToOrder(
    orderId: number,
    paymentProvider: string,
    paymentReference: string
) {
    const order = orders.find((item) => item.id === orderId);
    if (!order) return null;

    order.paymentProvider = paymentProvider;
    order.paymentReference = paymentReference;
    return order;
}

export function markOrderPaidByReference(reference: string) {
    const order = orders.find((item) => item.paymentReference === reference);
    if (!order) return null;

    order.status = "PAID";
    return order;
}

export function getOrdersByUser(userId: number) {
    return orders.filter((order) => order.userId === userId);
}

export function getOrderById(orderId: number) {
    return orders.find((order) => order.id === orderId) || null;
}

export function getAllOrders() {
    return orders;
}

export function countOrders() {
    return orders.length;
}