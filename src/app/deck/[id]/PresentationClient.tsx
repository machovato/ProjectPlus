"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { SlideRenderer } from "@/components/SlideRenderer";
import type { LooseDeck, LooseSlide } from "@/lib/schema";
import { processSlides, type DensityMode } from "@/lib/paginate";

// ─── Slide Grid Overlay ───────────────────────────────────────────────────────

// Layout 1 applies to hero slides. Used to decide dot and overlay accent colors.
const HERO_LAYOUTS = new Set(["hero"]);

function SlideGridOverlay({
    slides,
    currentIndex,
    density,
    onSelect,
    onClose,
}: {
    slides: LooseSlide[];
    currentIndex: number;
    density: DensityMode;
    onSelect: (i: number) => void;
    onClose: () => void;
}) {
    // Scale factor: thumbnails are 240x135, design space is 1200x675 → scale = 0.2
    const THUMB_W = 240;
    const THUMB_H = 135;
    const DESIGN_W = 1200;
    const DESIGN_H = 675;
    const SCALE = THUMB_W / DESIGN_W;

    return (
        <motion.div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ background: "rgba(13,34,64,0.96)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onKeyDown={(e) => e.key === "Escape" && onClose()}
            tabIndex={-1}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-white/10">
                <div>
                    <p className="text-white font-semibold text-sm">Slide Overview</p>
                    <p className="text-white/40 text-xs mt-0.5">
                        {slides.length} slide{slides.length !== 1 ? "s" : ""} · Click to jump
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="text-white/50 hover:text-white text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                    <span className="bg-white/10 rounded px-2 py-1 font-mono">Esc</span>
                    Close
                </button>
            </div>

            {/* Thumbnail grid */}
            <div className="flex-1 overflow-auto px-8 py-6">
                <div className="flex flex-wrap gap-5">
                    {slides.map((slide, i) => {
                        const isCurrent = i === currentIndex;
                        return (
                            <motion.button
                                key={slide.id ?? i}
                                onClick={() => onSelect(i)}
                                className="group relative flex flex-col gap-2 items-start cursor-pointer"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: i * 0.025 }}
                                whileHover={{ scale: 1.03 }}
                            >
                                {/* Thumbnail frame */}
                                <div
                                    className={`relative overflow-hidden rounded-lg transition-all ${isCurrent
                                        ? "ring-2 ring-[#1B8FE0] ring-offset-2 ring-offset-[#0D2240]"
                                        : "ring-1 ring-white/10 hover:ring-white/30"
                                        }`}
                                    style={{ width: THUMB_W, height: THUMB_H }}
                                >
                                    {/* Scaled slide render */}
                                    <div
                                        className="absolute top-0 left-0 pointer-events-none"
                                        style={{
                                            width: DESIGN_W,
                                            height: DESIGN_H,
                                            transform: `scale(${SCALE})`,
                                            transformOrigin: "top left",
                                        }}
                                    >
                                        <SlideRenderer slide={slide} density={density} />
                                    </div>

                                    {/* Current slide highlight overlay */}
                                    {isCurrent && (
                                        <div className="absolute inset-0 border-2 border-[#1B8FE0] rounded-lg pointer-events-none" />
                                    )}
                                </div>

                                {/* Slide number + title below */}
                                <div className="flex items-center gap-1.5 max-w-[240px]">
                                    <span className="text-[10px] font-bold text-white/30 tabular-nums w-5 shrink-0">
                                        {i + 1}
                                    </span>
                                    <span className="text-[11px] text-white/60 group-hover:text-white/80 transition-colors truncate">
                                        {slide.title}
                                    </span>
                                </div>
                            </motion.button>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

// ─── Speaker Notes Overlay ─────────────────────────────────────────────────────

function SpeakerNotesOverlay({
    notes,
    onClose,
}: {
    notes?: string;
    onClose: () => void;
}) {
    return (
        <motion.div
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: "rgba(13,34,64,0.75)", backdropFilter: "blur(4px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
        >
            <motion.div
                className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-6 shadow-2xl"
                initial={{ scale: 0.95, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 10 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
            >
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1B8FE0] mb-4">
                    Speaker Notes
                </p>
                <p className="text-[#0D2240] text-base leading-relaxed">
                    {notes || (
                        <span className="text-gray-400 italic">No speaker notes for this slide.</span>
                    )}
                </p>
                <button
                    onClick={onClose}
                    className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                    Press N or click outside to close
                </button>
            </motion.div>
        </motion.div>
    );
}

// ─── Dot Progress Indicator ───────────────────────────────────────────────────

function DotProgress({
    total,
    current,
    isHero,
}: {
    total: number;
    current: number;
    isHero: boolean;
}) {
    const dotBase = isHero ? "bg-white/30" : "bg-[#003057]/20";
    const dotActive = isHero ? "bg-white" : "bg-[var(--dtn-blue)]";

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${i === current
                        ? `w-4 h-1.5 ${dotActive}`
                        : `w-1.5 h-1.5 ${dotBase}`
                        }`}
                />
            ))}
        </div>
    );
}

// ─── Main Presentation Client ─────────────────────────────────────────────────

interface PresentationClientProps {
    deck: LooseDeck;
    deckId: string;
}

const slideVariants = {
    enter: (dir: number) => ({
        x: dir > 0 ? "100%" : "-100%",
        opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
        x: dir > 0 ? "-100%" : "100%",
        opacity: 0,
    }),
};

export function PresentationClient({ deck, deckId }: PresentationClientProps) {
    const router = useRouter();
    const [density, setDensity] = useState<DensityMode>("full");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(1);
    const [showNotes, setShowNotes] = useState(false);
    const [showGrid, setShowGrid] = useState(false);

    const slides = processSlides(deck.slides, density);
    const total = slides.length;

    const navigate = useCallback(
        (delta: number) => {
            setDirection(delta);
            setCurrentIndex((i) => Math.max(0, Math.min(total - 1, i + delta)));
        },
        [total]
    );

    const goTo = useCallback(
        (i: number) => {
            const clamped = Math.max(0, Math.min(total - 1, i));
            setDirection(clamped > currentIndex ? 1 : -1);
            setCurrentIndex(clamped);
        },
        [total, currentIndex]
    );

    // Keyboard handler
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            // Dismiss overlays first
            if (e.key === "Escape") {
                if (showGrid) { setShowGrid(false); return; }
                if (showNotes) { setShowNotes(false); return; }
                return;
            }
            // Don't navigate when overlays are open
            if (showGrid || showNotes) return;

            switch (e.key) {
                case "ArrowRight":
                case "ArrowDown":
                    navigate(1);
                    break;
                case "ArrowLeft":
                case "ArrowUp":
                    navigate(-1);
                    break;
                case "n":
                case "N":
                    setShowNotes((v) => !v);
                    break;
                case "e":
                case "E":
                    if (e.shiftKey) {
                        router.push(`/editor?editId=${deckId}`);
                    } else {
                        router.push("/");
                    }
                    break;
                case "g":
                case "G":
                    setShowGrid((v) => !v);
                    break;
                case "d":
                case "D":
                    setDensity((d) => (d === "full" ? "executive" : "full"));
                    break;
                case "p":
                case "P":
                    window.print();
                    break;
            }
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [navigate, router, deckId, showNotes, showGrid]);

    const currentSlide = slides[Math.min(currentIndex, total - 1)];
    const isHero = currentSlide ? HERO_LAYOUTS.has(currentSlide.type) : false;

    if (!currentSlide) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-gray-50">
                <p className="text-gray-400">No slides to display.</p>
            </div>
        );
    }

    return (
        <>
            {/* Full-viewport slide stage */}
            <div className="fixed inset-0 overflow-hidden bg-white">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.div
                        key={currentIndex}
                        className="absolute inset-0"
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
                    >
                        <SlideRenderer slide={currentSlide} density={density} />
                    </motion.div>
                </AnimatePresence>

                {/* Click zones — invisible, no hover state */}
                <div
                    className="absolute top-0 left-0 h-full w-[30%] z-20 cursor-pointer"
                    onClick={() => navigate(-1)}
                    aria-label="Previous slide"
                />
                <div
                    className="absolute top-0 right-0 h-full w-[30%] z-20 cursor-pointer"
                    onClick={() => navigate(1)}
                    aria-label="Next slide"
                />

                {/* Density mode badge — subtle, upper-left, only when executive */}
                {density === "executive" && (
                    <div
                        className={`fixed top-4 left-4 z-30 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${isHero
                            ? "bg-white/15 text-white/70"
                            : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        Executive Mode
                    </div>
                )}

                {/* Dot progress */}
                <DotProgress total={total} current={currentIndex} isHero={isHero} />
            </div>

            {/* Overlays */}
            <AnimatePresence>
                {showNotes && (
                    <SpeakerNotesOverlay
                        key="notes"
                        notes={currentSlide.notes}
                        onClose={() => setShowNotes(false)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showGrid && (
                    <SlideGridOverlay
                        key="grid"
                        slides={slides}
                        currentIndex={currentIndex}
                        density={density}
                        onSelect={(i) => { goTo(i); setShowGrid(false); }}
                        onClose={() => setShowGrid(false)}
                    />
                )}
            </AnimatePresence>

        </>
    );
}
