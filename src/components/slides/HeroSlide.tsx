"use client";

import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { LayoutBrand } from "./layouts/LayoutBrand";
import type { LooseSlide } from "@/lib/schema";

interface HeroData {
    subtitle?: string;
    headline?: string;
    rag?: "green" | "yellow" | "red";
    kpis?: { label: string; value: string; icon?: string; trend?: "up" | "down" | "flat" }[];
}

const RAG_LABELS = { green: "On Track", yellow: "At Risk", red: "Off Track" };
const RAG_DOTS = {
    green: "bg-[#4CB944]", // DTN Primary Green
    yellow: "bg-[#F5A400]", // DTN Secondary Orange (At Risk)
    red: "bg-[#C8192B]", // DTN Secondary Red
};

function TrendIcon({ trend }: { trend?: "up" | "down" | "flat" }) {
    if (!trend) return null;
    const size = { width: "clamp(16px, 1.5vw, 24px)", height: "clamp(16px, 1.5vw, 24px)" };
    if (trend === "up") return <LucideIcons.TrendingUp className="text-[#8DC63F]" style={size} />;
    if (trend === "down") return <LucideIcons.TrendingDown className="text-[#C8192B]" style={size} />;
    return <LucideIcons.Minus className="text-white/50" style={size} />;
}

function getIcon(name?: string) {
    if (!name) return null;
    const key = name.charAt(0).toUpperCase() + name.slice(1);
    const Icon = (LucideIcons as Record<string, unknown>)[key] as React.ComponentType<{ className?: string }>;
    return Icon ? <Icon className="w-5 h-5 text-white/70" /> : null;
}

export function HeroSlide({ slide }: { slide: LooseSlide }) {
    const data = (slide.data ?? {}) as HeroData;
    const rag = data.rag;

    return (
        <LayoutBrand>
            <div className="flex flex-col justify-center h-full px-16 py-12">
                {/* Eyebrow */}
                <motion.p
                    className="font-medium uppercase tracking-[0.18em] text-white/60 mb-5"
                    style={{ fontSize: "clamp(11px, 1vw, 15px)" }}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    Project Update
                </motion.p>

                {/* Title — Display size */}
                <motion.h1
                    className="font-bold text-white leading-tight mb-4"
                    style={{
                        fontSize: "clamp(40px, 5vw, 68px)",
                        lineHeight: 1.08,
                        fontFamily: "Inter, sans-serif",
                    }}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.07 }}
                >
                    {slide.title}
                </motion.h1>

                {/* Subtitle */}
                {data.subtitle && (
                    <motion.p
                        className="text-white/75 mb-3"
                        style={{ fontSize: "clamp(16px, 1.6vw, 22px)" }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.13 }}
                    >
                        {data.subtitle}
                    </motion.p>
                )}

                {/* Headline */}
                {data.headline && (
                    <motion.p
                        className="text-white/80 italic mb-6 border-l-2 border-white/30 pl-4 max-w-2xl"
                        style={{ fontSize: "clamp(15px, 1.4vw, 19px)" }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.17 }}
                    >
                        {data.headline}
                    </motion.p>
                )}

                {/* RAG pill — white variant */}
                {rag && (
                    <motion.div
                        className="mb-8 flex"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <span
                            className="inline-flex items-center gap-2.5 bg-white/15 border border-white/20 text-white font-semibold px-4 py-2 rounded-full backdrop-blur-sm"
                            style={{ fontSize: "clamp(13px, 1.2vw, 17px)" }}
                        >
                            <span className={`rounded-full ${RAG_DOTS[rag]}`} style={{ width: "clamp(10px, 0.9vw, 14px)", height: "clamp(10px, 0.9vw, 14px)" }} />
                            {RAG_LABELS[rag]}
                        </span>
                    </motion.div>
                )}

                {/* KPI Tiles — white bg, navy text, float on blue */}
                {data.kpis && data.kpis.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                        {data.kpis.map((kpi, i) => (
                            <motion.div
                                key={i}
                                className="flex flex-col gap-1 bg-white/12 border border-white/20 backdrop-blur-sm rounded-xl px-5 py-4 min-w-[140px]"
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.24 + i * 0.07 }}
                                whileHover={{ backgroundColor: "rgba(255,255,255,0.18)" }}
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    {getIcon(kpi.icon)}
                                    <span
                                        className="font-semibold uppercase tracking-widest text-white/60"
                                        style={{ fontSize: "clamp(10px, 0.9vw, 14px)" }}
                                    >
                                        {kpi.label}
                                    </span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-white font-bold" style={{ fontSize: "clamp(22px, 2.4vw, 32px)" }}>
                                        {kpi.value}
                                    </span>
                                    <TrendIcon trend={kpi.trend} />
                                </div>
                                {/* Fraction Progress Bar */}
                                {(() => {
                                    const match = kpi.value.match(/^(\d+(?:\.\d+)?)\s*(?:of|\/)\s*(\d+(?:\.\d+)?)$/i);
                                    if (match) {
                                        const num = parseFloat(match[1]);
                                        const den = parseFloat(match[2]);
                                        const pct = den > 0 ? Math.min(100, Math.max(0, (num / den) * 100)) : 0;
                                        return (
                                            <div className="w-full h-1 mt-1 bg-white/20 rounded-full overflow-hidden">
                                                <div className="h-full bg-white rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%` }} />
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </LayoutBrand>
    );
}
