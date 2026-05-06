"use client";

import { useState } from "react";

type ProductVisualProps = {
    name: string;
    imageUrl?: string;
    className?: string;
};

export default function ProductVisual({
    name,
    imageUrl,
    className = ""
}: ProductVisualProps) {
    const [imageFailed, setImageFailed] = useState(false);
    const showImage = Boolean(imageUrl) && !imageFailed;

    return (
        <div className={`product-visual ${className}`.trim()} aria-label={name}>
            <div className="product-visual__halo" />
            {showImage ? (
                <img
                    src={imageUrl}
                    alt={name}
                    className="product-visual__image"
                    onError={() => setImageFailed(true)}
                />
            ) : (
                <div className="product-visual__bottle" aria-hidden="true">
                    <span className="product-visual__cap" />
                    <span className="product-visual__neck" />
                    <span className="product-visual__glass">
                        <span className="product-visual__shine" />
                        <span className="product-visual__label">{name.split(" ")[0]}</span>
                    </span>
                </div>
            )}
        </div>
    );
}
