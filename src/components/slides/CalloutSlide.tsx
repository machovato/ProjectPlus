"use client";

import { motion } from "framer-motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { useTemplate } from "@/components/TemplateContext";
import { cn } from "@/lib/utils";

interface CalloutData {
    text: string;
    kind?: "decision" | "risk" | "quote" | "highlight";
    attribution?: string;
}

const LEFT_EYEBROW = {
    decision: "Decision",
    risk: "Risk",
    quote: "Quote",
    highlight: "Highlight",
};

// decision  = DTN Mid Blue #2255A4 — authoritative, binding
// risk       = DTN Red     #C8192B — danger signal, escalation needed
// highlight  = DTN Lime    #8DC63F — positive emphasis, good news
// quote      = DTN Teal    #007074 — neutral informational, voice
const RIGHT_ACCENT = {
    decision: "border-l-[12px] border-accent-info",
    risk: "border-l-[12px] border-accent-danger",
    quote: "",
    highlight: "border-l-[12px] border-accent-success",
};

const QUOTE_MARK_COLOR: Record<string, string> = {
    decision: "var(--accent-info)",
    risk: "var(--accent-danger)",
    highlight: "var(--accent-success)",
    quote: "var(--accent-info)",
};

export function CalloutSlide({ slide }: { slide: LooseSlide }) {
    const { template } = useTemplate();
    const data = (slide.data ?? {}) as unknown as CalloutData;
    const kind = data.kind ?? "highlight";
    const isQuote = kind === "quote";
    const isStrategy = template === "strategy";

    const left = (
        <div className="flex flex-col gap-4">
            <p className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info opacity-60">
                {LEFT_EYEBROW[kind]}
            </p>
            <h2
                className="font-bold text-text-on-emphasis leading-tight text-slide-subtitle"
            >
                {slide.title}
            </h2>
            <div className="w-8 h-0.5 bg-text-on-emphasis opacity-30 mt-3" />
        </div>
    );

    const right = (
        <div className={cn("flex flex-col justify-center h-full gap-5", isStrategy ? RIGHT_ACCENT[kind] : "")}>
            {isQuote && (
                <motion.div
                    className="text-[64px] leading-none font-serif select-none"
                    style={{ color: QUOTE_MARK_COLOR[kind] ?? "#007074", marginBottom: -16, lineHeight: 0.8 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15 }}
                >
                    "
                </motion.div>
            )}

            <div className={cn(isQuote ? "pl-0" : "pl-8")}>
                <motion.p
                    className={cn(
                        "text-text-primary leading-snug",
                        isQuote ? "italic font-bold" : "font-extrabold"
                    )}
                    style={{ fontSize: isQuote ? "var(--type-headline)" : "var(--type-headline)" }}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, delay: 0.1 }}
                >
                    {data.text}
                </motion.p>
            </div>

            {data.attribution && (
                <motion.p
                    className="text-caption text-text-secondary font-bold pl-8 mt-2 uppercase tracking-widest"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.15, delay: 0.2 }}
                >
                    — {data.attribution}
                </motion.p>
            )}
        </div>
    );

    if (!isStrategy) {
        return (
            <LayoutWhite center={true}>
                <div className="max-w-4xl w-full mx-auto p-12 bg-surface-secondary border border-border-default rounded-card shadow-lg relative overflow-hidden">
                    <div className={cn("absolute top-0 left-0 bottom-0 w-2",
                        kind === "decision" ? "bg-accent-info" :
                            kind === "risk" ? "bg-accent-danger" :
                                kind === "highlight" ? "bg-accent-success" : "bg-text-muted"
                    )} />
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center justify-between border-b border-border-default/50 pb-4">
                            <span className="text-badge font-bold uppercase tracking-widest text-text-secondary opacity-60">
                                {LEFT_EYEBROW[kind]}
                            </span>
                            <span className="text-caption font-semibold text-text-primary">{slide.title}</span>
                        </div>
                        {right}
                    </div>
                </div>
            </LayoutWhite>
        );
    }

    return <LayoutSplit leftContent={left} rightContent={right} />;
}
