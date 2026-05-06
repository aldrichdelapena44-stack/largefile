import { z } from "zod";

const checkoutItemSchema = z.object({
    id: z.number().int().positive(),
    slug: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional(),
    price: z.number().nonnegative(),
    stock: z.number().int().min(0).optional(),
    imageUrl: z.string().optional(),
    quantity: z.number().int().positive()
});

export const checkoutSchema = z.object({
    fullName: z.string().min(2, "Full name is required."),
    address: z.string().min(8, "Delivery address is required."),
    gcashNumber: z.string().min(10, "GCash number is required."),
    items: z.array(checkoutItemSchema).min(1, "Cart must contain at least one item."),
    total: z.number().nonnegative().optional()
});
