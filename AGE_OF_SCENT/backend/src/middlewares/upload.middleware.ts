import multer from "multer";
import path from "path";
import { env } from "../config/env";

const imageFilter: multer.Options["fileFilter"] = (_req, file, callback) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];

    if (!allowed.includes(file.mimetype)) {
        return callback(new Error("Only JPG, PNG, and WEBP files are allowed."));
    }

    callback(null, true);
};

const idStorage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, path.join(process.cwd(), "uploads", "ids"));
    },
    filename: (_req, file, callback) => {
        const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        callback(null, safeName);
    }
});

const productStorage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, path.join(process.cwd(), "uploads", "products"));
    },
    filename: (_req, file, callback) => {
        const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`;
        callback(null, safeName);
    }
});

export const uploadIdImage = multer({
    storage: idStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: env.maxFileSizeMb * 1024 * 1024
    }
});

export const uploadProductImage = multer({
    storage: productStorage,
    fileFilter: imageFilter,
    limits: {
        fileSize: env.maxFileSizeMb * 1024 * 1024
    }
});