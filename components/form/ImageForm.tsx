import { imageService } from "@/services/imageService";
import { Image } from "@/type/image";
import React, { useEffect, useState, useCallback } from "react";


type ImageFormProps = {
    pageSize?: number;
    initialPage?: number;
    initialSelectedIds?: number[];
    // called when user submits the form with the selected images
    onSubmit: (images: Image[]) => void;
    // optional: called when selection changes
    onSelectionChange?: (images: Image[]) => void;
};

export default function ImageForm({
    pageSize = 12,
    initialPage = 1,
    initialSelectedIds = [],
    onSubmit,
    onSelectionChange,
}: ImageFormProps) {
    const [page, setPage] = useState(initialPage);
    const [images, setImages] = useState<Image[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(
        new Set(initialSelectedIds)
    );

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const fetchPage = useCallback(
        async (pageToLoad: number) => {
            setLoading(true);
            setError(null);
            try {
                const body = await imageService.getImages(pageToLoad, pageSize);
                setImages(body.data || []);
                setTotal(typeof body.total === "number" ? body.total : (body.data?.length || 0));
            } catch (err: any) {
                setError(err?.message || "Failed to load");
            } finally {
                setLoading(false);
            }
        },
        [pageSize]
    );

    useEffect(() => {
        fetchPage(page);
    }, [fetchPage, page]);

    useEffect(() => {
        // emit initial selection
        if (onSelectionChange) {
            const list = images.filter((i) => selectedIds.has(i.id));
            onSelectionChange(list);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // only once

    function toggleSelect(id: number) {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            // optionally trigger callback with currently loaded images
            if (onSelectionChange) {
                const selected = images.filter((i) => next.has(i.id));
                onSelectionChange(selected);
            }
            return next;
        });
    }

    function selectAllVisible() {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            images.forEach((i) => next.add(i.id));
            if (onSelectionChange) {
                const selected = images.filter((i) => next.has(i.id));
                onSelectionChange(selected);
            }
            return next;
        });
    }

    function clearSelectionVisible() {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            images.forEach((i) => next.delete(i.id));
            if (onSelectionChange) {
                const selected = images.filter((i) => next.has(i.id));
                onSelectionChange(selected);
            }
            return next;
        });
    }

    function handleSubmit(e?: React.FormEvent) {
        if (e) e.preventDefault();
        const selected = images.filter((i) => selectedIds.has(i.id));
        onSubmit(selected);
    }

    return (
        <form onSubmit={handleSubmit} style={{ fontFamily: "sans-serif" }}>
            <div style={{ marginBottom: 8, display: "flex", gap: 8, alignItems: "center" }}>
                <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading}>
                    Prev
                </button>
                <div>
                    Page {page} / {totalPages}
                </div>
                <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loading}>
                    Next
                </button>
                <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
                    <button type="button" onClick={selectAllVisible} disabled={images.length === 0}>
                        Select visible
                    </button>
                    <button type="button" onClick={clearSelectionVisible} disabled={images.length === 0}>
                        Clear visible
                    </button>
                    <button type="submit">Submit selection</button>
                </div>
            </div>

            {loading && <div>Loading images...</div>}
            {error && <div style={{ color: "red" }}>{error}</div>}

            <div
                style={{
                    display: "grid",
                    gap: 8,
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                }}
            >
                {images.map((img) => {
                    const checked = selectedIds.has(img.id);
                    return (
                        <label
                            key={img.id}
                            style={{
                                border: checked ? "2px solid #0366d6" : "1px solid #ddd",
                                borderRadius: 6,
                                padding: 6,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 6,
                                cursor: "pointer",
                                background: "#fff",
                            }}
                        >
                            <img
                                src={img.url}
                                alt={String(img.id)}
                                style={{ width: "100%", height: 90, objectFit: "cover", borderRadius: 4 }}
                            />
                            <div style={{ fontSize: 12, color: "#333", width: "100%", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {img.hash || String(img.id)}
                            </div>
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleSelect(img.id)}
                                style={{ alignSelf: "center" }}
                            />
                        </label>
                    );
                })}
            </div>

            <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button type="button" onClick={() => { setSelectedIds(new Set()); if (onSelectionChange) onSelectionChange([]); }}>
                    Clear all
                </button>
                <button type="submit">Submit</button>
            </div>
        </form>
    );
}