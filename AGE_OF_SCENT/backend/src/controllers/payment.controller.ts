import { Request, Response } from "express";
import { createCheckoutOrder } from "../services/order.service";
import { createGcashCheckout } from "../services/payment.service";
import { fail, ok } from "../utils/response";

type RequestWithUser = Request & {
    user?: {
        id: number;
    };
};

export async function createGcashPayment(
    req: RequestWithUser,
    res: Response
) {
    try {
        const order = createCheckoutOrder({
            userId: req.user!.id,
            fullName: req.body.fullName,
            address: req.body.address,
            gcashNumber: req.body.gcashNumber,
            items: req.body.items
        });

        const payment = await createGcashCheckout(order);

        return ok(
            res,
            {
                order,
                payment
            },
            "GCash checkout initialized.",
            201
        );
    } catch (error) {
        return fail(
            res,
            error instanceof Error ? error.message : "Payment initialization failed.",
            400
        );
    }
}