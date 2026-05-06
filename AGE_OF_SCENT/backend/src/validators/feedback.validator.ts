import { z } from "zod";

export const feedbackSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    rating: z.coerce.number().int().min(1).max(5),
    message: z.string().min(10).max(1000)
});
