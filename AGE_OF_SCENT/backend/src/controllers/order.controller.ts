import { Request, Response } from "express";
import { getOrderById, getOrdersByUser } from "../services/order.service";
import { fail, ok } from "../utils/response";

type RequestWithUser = Request & {
    user?: {
        id: number;
    };
};

export function listMyOrders(req: RequestWithUser, res: Response) {
    return ok(res, getOrdersByUser(req.user!.id), "Orders fetched.");
}

export function getMyOrder(req: RequestWithUser, res: Response) {
    const order = getOrderById(Number(req.params.id));

    if (!order || order.userId !== req.user!.id) {
        return fail(res, "Order not found.", 404);
    }

    return ok(res, order, "Order fetched.");
}