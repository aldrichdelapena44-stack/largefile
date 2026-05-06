import { Request, Response } from "express";
import {
    getAdminFeedback,
    getAdminOrders,
    getAdminProductList,
    getAdminSummary,
    getAdminUsers,
    getAdminVerifications
} from "../services/admin.service";
import { deleteFeedback, markFeedbackReviewed } from "../services/feedback.service";
import { updateProduct } from "../services/product.service";
import {
    approveVerification,
    keepVerificationFile,
    rejectVerification,
    removeVerificationFile
} from "../services/verification.service";
import { fail, ok } from "../utils/response";

export function summary(_req: Request, res: Response) {
    return ok(res, getAdminSummary(), "Admin summary fetched.");
}

export function users(_req: Request, res: Response) {
    return ok(res, getAdminUsers(), "Admin users fetched.");
}

export function orders(_req: Request, res: Response) {
    return ok(res, getAdminOrders(), "Admin orders fetched.");
}

export function verifications(_req: Request, res: Response) {
    return ok(res, getAdminVerifications(), "Admin verifications fetched.");
}

export function products(_req: Request, res: Response) {
    return ok(res, getAdminProductList(), "Admin products fetched.");
}

export function updateAdminProduct(req: Request, res: Response) {
    try {
        const record = updateProduct(Number(req.params.id), req.body);
        if (!record) return fail(res, "Product not found.", 404);
        return ok(res, record, "Product updated.");
    } catch (error) {
        return fail(res, error instanceof Error ? error.message : "Product update failed.", 400);
    }
}

export function feedback(_req: Request, res: Response) {
    return ok(res, getAdminFeedback(), "Feedback fetched.");
}

export function reviewFeedback(req: Request, res: Response) {
    const record = markFeedbackReviewed(Number(req.params.id));
    if (!record) return fail(res, "Feedback record not found.", 404);
    return ok(res, record, "Feedback marked as reviewed.");
}

export function removeFeedback(req: Request, res: Response) {
    const record = deleteFeedback(Number(req.params.id));
    if (!record) return fail(res, "Feedback record not found.", 404);
    return ok(res, record, "Feedback removed.");
}

export function approveVerificationSubmission(req: Request, res: Response) {
    const record = approveVerification(Number(req.params.id));
    if (!record) return fail(res, "Verification record not found.", 404);
    return ok(res, record, "Verification approved.");
}

export function rejectVerificationSubmission(req: Request, res: Response) {
    const record = rejectVerification(Number(req.params.id));
    if (!record) return fail(res, "Verification record not found.", 404);
    return ok(res, record, "Verification rejected.");
}

export function keepVerificationSubmissionFile(req: Request, res: Response) {
    try {
        const record = keepVerificationFile(Number(req.params.id));
        if (!record) return fail(res, "Verification record not found.", 404);
        return ok(res, record, "Client file kept in admin storage.");
    } catch (error) {
        return fail(res, error instanceof Error ? error.message : "Unable to keep file.", 400);
    }
}

export function removeVerificationSubmissionFile(req: Request, res: Response) {
    const record = removeVerificationFile(Number(req.params.id));
    if (!record) return fail(res, "Verification record not found.", 404);
    return ok(res, record, "Client file removed from storage.");
}
