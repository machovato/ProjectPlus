"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ChevronRight, AlertTriangle, Circle } from "lucide-react";
import { LayoutWhite } from "./layouts/LayoutWhite";
import type { LooseSlide } from "@/lib/schema";
import { cn } from "@/lib/utils";
import { useTemplate } from "@/components/TemplateContext";

interface Step {
    label: string;
    icon?: string;
    status?: "done" | "current" | "next";
    badges?: string[];
    blockers?: string[];
}

interface PipelineData {
    steps: Step[];
}

function resolveIconFromLabel(label: string): React.ElementType {
    const lower = label.toLowerCase();
    if (lower.match(/triage|review|validate/)) return LucideIcons.ClipboardCheck;
    if (lower.match(/schema|metadata|architect/)) return LucideIcons.Layers;
    if (lower.match(/language|scope|international/)) return LucideIcons.Globe;
    if (lower.match(/convert|migrate|move/)) return LucideIcons.ArrowRightLeft;
    if (lower.match(/governance|policy|workflow/)) return LucideIcons.GitBranch;
    if (lower.match(/qa|test|quality/)) return LucideIcons.BadgeCheck;
    if (lower.match(/deliver|launch|release/)) return LucideIcons.Rocket;
    if (lower.match(/design|blueprint|template/)) return LucideIcons.PenTool;
    return Circle;
}

const STATUS_CONFIG = {
    done: {
        dotClass: "border-accent-success bg-accent-success text-surface-page",
        iconClass: "text-surface-page",
        labelClass: "text-accent-success font-semibold",
        statusText: "Done",
        statusClass: "text-accent-success",
    },
    current: {
        dotClass: "border-accent-info bg-accent-info text-surface-page shadow-md",
        iconClass: "text-surface-page",
        labelClass: "text-text-primary font-extrabold tracking-tight",
        statusText: "In Progress",
        statusClass: "text-accent-info font-bold",
    },
    next: {
        dotClass: "border-border-muted bg-surface-page text-border-muted",
        iconClass: "text-border-muted",
        labelClass: "text-text-secondary font-medium",
        statusText: "Up Next",
        statusClass: "text-text-muted",
    },
} as const;

export function PipelineSlide({ slide }: { slide: LooseSlide }) {
    const { template } = useTemplate();
    const data = (slide.data ?? { steps: [] }) as unknown as PipelineData;
    const steps = data.steps ?? [];
    const isStrategy = template === "strategy";

    return (
        <LayoutWhite center={false}>
            <motion.p
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-info pt-10 pb-0 text-center w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
            >
                Pipeline
            </motion.p>

            <motion.h2
                className="font-bold text-text-primary text-center mb-0 mt-2"
                style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.06 }}
            >
                {slide.title}
            </motion.h2>

            <div className="flex-1 flex flex-col w-full h-full overflow-hidden">
                {!isStrategy ? (
                    /* Status Kanban Layout */
                    <div className="flex-1 flex gap-section overflow-x-auto px-slide pb-slide pt-8 items-stretch">
                        {steps.map((step, i) => {
                            const status = step.status ?? "next";
                            const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.next;
                            let IconComponent = resolveIconFromLabel(step.label);

                            return (
                                <motion.div
                                    key={i}
                                    className="flex flex-col gap-4 min-w-[280px] flex-1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.15, delay: 0.05 + i * 0.05 }}
                                >
                                    {/* Column Header */}
                                    <div className={cn(
                                        "px-4 py-3 rounded-t-lg border-b-2 flex items-center justify-between",
                                        status === "current" ? "bg-accent-info/5 border-accent-info" : "bg-surface-muted border-border-default"
                                    )}>
                                        <div className="flex items-center gap-2">
                                            <IconComponent className={cn("w-4 h-4", cfg.statusClass)} />
                                            <span className="font-bold text-sm text-text-primary uppercase tracking-wider">{step.label}</span>
                                        </div>
                                        <span className={cn("text-[10px] font-bold uppercase", cfg.statusClass)}>{cfg.statusText}</span>
                                    </div>

                                    {/* Item Card */}
                                    <div className={cn(
                                        "flex-1 bg-surface-secondary rounded-b-lg border border-t-0 p-4 shadow-sm flex flex-col gap-4",
                                        status === "current" ? "border-accent-info/20 shadow-md" : "border-border-default"
                                    )}>
                                        {status === "current" && (
                                            <div className="flex flex-col gap-1.5">
                                                <div className="flex justify-between items-end">
                                                    <span className="text-[10px] font-bold text-accent-info uppercase">Progress</span>
                                                    <span className="text-[10px] font-bold text-text-primary">65%</span>
                                                </div>
                                                <div className="w-full h-1.5 bg-surface-muted rounded-full overflow-hidden">
                                                    <motion.div
                                                        className="h-full bg-accent-info"
                                                        initial={{ width: 0 }}
                                                        animate={{ width: "65%" }}
                                                        transition={{ duration: 1, delay: 0.5 }}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {step.badges && step.badges.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {step.badges.map((b, bi) => (
                                                    <span key={bi} className="px-2 py-0.5 bg-surface-muted text-text-secondary text-[10px] font-bold rounded uppercase tracking-tight border border-border-default/50">
                                                        {b}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {step.blockers && step.blockers.length > 0 && (
                                            <div className="flex flex-col gap-2 mt-auto pt-4 border-t border-border-default/30">
                                                <span className="text-[9px] font-bold text-accent-danger uppercase tracking-widest">Attention Required</span>
                                                {step.blockers.map((bl, bli) => (
                                                    <div key={bli} className="flex items-start gap-2 bg-accent-danger/5 p-2 rounded border border-accent-danger/10">
                                                        <AlertTriangle className="w-3.5 h-3.5 text-accent-danger shrink-0 mt-0.5" />
                                                        <span className="text-xs font-medium text-text-primary leading-tight">{bl}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    /* Strategy Linear Flow (Legacy style) */
                    <div className="flex items-start justify-center gap-0 w-full px-12 pt-12" style={{ maxWidth: "88%", marginLeft: "auto", marginRight: "auto" }}>
                        {steps.map((step, i) => {
                            const status = step.status ?? "next";
                            const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.next;
                            let IconComponent = resolveIconFromLabel(step.label);
                            const isLast = i === steps.length - 1;

                            return (
                                <div key={i} className="flex items-start flex-1 min-w-0">
                                    <motion.div
                                        className="flex flex-col items-center gap-4 flex-1 px-4"
                                        initial={{ opacity: 0, y: 16 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.15, delay: 0.1 + i * 0.05 }}
                                    >
                                        <div
                                            className={cn(
                                                "rounded-full flex items-center justify-center shadow-md relative",
                                                status === "current" ? "pulse-ring-active" : "",
                                                cfg.dotClass
                                            )}
                                            style={{
                                                width: "clamp(64px, 7vw, 110px)",
                                                height: "clamp(64px, 7vw, 110px)",
                                                borderWidth: "clamp(4px, 0.4vw, 8px)"
                                            }}
                                        >
                                            <IconComponent className={cn("w-1/2 h-1/2", cfg.iconClass)} strokeWidth={status === "current" ? 2.5 : 2} />
                                        </div>

                                        <span
                                            className={cn("text-center leading-tight mt-2", cfg.labelClass)}
                                            style={{ fontSize: "clamp(16px, 1.8vw, 24px)" }}
                                        >
                                            {step.label}
                                        </span>

                                        {!isLast && (
                                            <div className="flex items-center absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-0 hidden">
                                                <ChevronRight className="w-8 h-8 text-border-muted" />
                                            </div>
                                        )}
                                    </motion.div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </LayoutWhite>
    );
}
