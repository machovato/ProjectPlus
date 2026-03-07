"use client";

import { motion } from "framer-motion";
import { LayoutSplit } from "./layouts/LayoutSplit";
import type { LooseSlide } from "@/lib/schema";

interface DecisionItem {
    decision: string;
    owner?: string;
    date?: string;
    status?: "proposed" | "approved" | "blocked" | "done";
}

interface DecisionLogData {
    items: DecisionItem[];
}

// approved  = DTN Green       #4CB944 — yes, decided, positive
// blocked    = DTN Red         #C8192B — held up, escalation needed
// proposed   = DTN Teal        #007074 — pending decision, informational
// done       = DTN Dark Green  #005741 — archived/complete (historical)
const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; label: string }> = {
    proposed: { bg: "var(--surface-muted)", text: "var(--text-primary)", border: "var(--border-muted)", label: "Proposed" },
    approved: { bg: "var(--surface-secondary)", text: "var(--accent-success)", border: "var(--accent-success)", label: "Approved" },
    blocked: { bg: "var(--badge-action-bg)", text: "var(--badge-action-text)", border: "var(--accent-danger)", label: "Blocked" },
    done: { bg: "var(--surface-muted)", text: "var(--text-muted)", border: "var(--border-muted)", label: "Done" },
};

export function DecisionLogSlide({ slide }: { slide: LooseSlide }) {
    const data = (slide.data ?? { items: [] }) as unknown as DecisionLogData;
    const items = data.items ?? [];

    const left = (
        <div className="flex flex-col gap-4">
            <p className="text-badge font-semibold uppercase tracking-[0.18em] text-accent-info opacity-60">
                Decision Log
            </p>
            <h2
                className="font-bold text-text-on-emphasis leading-tight"
                style={{ fontSize: "clamp(24px, 3vw, 40px)" }}
            >
                {slide.title}
            </h2>
            <div className="w-8 h-0.5 bg-text-on-emphasis opacity-30 mt-2" />
            <p className="text-text-on-emphasis opacity-55 text-xs mt-1">
                {items.length} decision{items.length !== 1 ? "s" : ""} recorded
            </p>
        </div>
    );

    const right = (
        <div className="w-full h-full flex flex-col justify-center">
            <div className="w-full bg-surface-secondary rounded-card border border-border-default shadow-card overflow-hidden">
                <div className="p-card overflow-auto">
                    {/* Header row */}
                    <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 pb-4 border-b border-border-default mb-1">
                        {["Decision", "Owner", "Date", "Status"].map((h) => (
                            <span
                                key={h}
                                className="font-bold uppercase tracking-wider text-text-secondary"
                                style={{ fontSize: "var(--type-badge)" }}
                            >
                                {h}
                            </span>
                        ))}
                    </div>

                    {/* Rows */}
                    <div className="flex flex-col">
                        {items.map((item, i) => {
                            const cfg = STATUS_CONFIG[item.status ?? "proposed"];
                            return (
                                <motion.div
                                    key={i}
                                    className="grid grid-cols-[1fr_auto_auto_auto] gap-3 py-4 border-b border-border-default/50 last:border-0 items-start"
                                    initial={{ opacity: 0, y: 6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.15, delay: 0.1 + i * 0.05 }}
                                >
                                    <p
                                        className="text-text-primary font-semibold leading-snug"
                                        style={{ fontSize: "var(--type-card-title)" }}
                                    >
                                        {item.decision}
                                    </p>
                                    <span
                                        className="text-text-secondary whitespace-nowrap pt-1"
                                        style={{ fontSize: "var(--type-card-body)" }}
                                    >
                                        {item.owner ?? "—"}
                                    </span>
                                    <span
                                        className="text-text-muted whitespace-nowrap pt-1"
                                        style={{ fontSize: "var(--type-card-body)" }}
                                    >
                                        {item.date ?? "—"}
                                    </span>
                                    <span
                                        className="font-bold uppercase tracking-wider px-2.5 py-1 rounded whitespace-nowrap border"
                                        style={{
                                            background: cfg.bg,
                                            color: cfg.text,
                                            borderColor: cfg.border,
                                            fontSize: "var(--type-badge)",
                                        }}
                                    >
                                        {cfg.label}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

    return <LayoutSplit leftContent={left} rightContent={right} />;
}
