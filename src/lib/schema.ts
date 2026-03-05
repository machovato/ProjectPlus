import { z } from "zod";

// ─── Shared primitives ───────────────────────────────────────────────────────

const RAGSchema = z.enum(["green", "yellow", "red"]);
const TrendSchema = z.enum(["up", "down", "flat"]);

const KPIItemSchema = z.object({
    label: z.string(),
    value: z.string(),
    icon: z.string().optional(),
    trend: TrendSchema.optional(),
    note: z.string().optional(),
});

// ─── Slide data schemas ───────────────────────────────────────────────────────

const HeroDataSchema = z.object({
    subtitle: z.string().optional(),
    headline: z.string().optional(),
    rag: RAGSchema.optional(),
    kpis: z
        .array(
            z.object({
                label: z.string(),
                value: z.string(),
                icon: z.string().optional(),
                trend: TrendSchema.optional(),
            })
        )
        .optional(),
});

const KpisDataSchema = z.object({
    items: z.array(KPIItemSchema),
});

const PipelineDataSchema = z.object({
    steps: z.array(
        z.object({
            label: z.string(),
            icon: z.string().optional(),
            status: z.enum(["done", "current", "next"]).optional(),
            badges: z.array(z.string()).optional(),
            blockers: z.array(z.string()).optional(),
        })
    ),
});

const GridDataSchema = z.object({
    cards: z.array(
        z.object({
            title: z.string(),
            body: z.string(),
            icon: z.string().optional(),
        })
    ),
});

const TimelineDataSchema = z.object({
    milestones: z.array(
        z.object({
            label: z.string(),
            date: z.string().optional(),
            state: z.enum(["done", "current", "upcoming"]),
            detail: z.string().optional(),
        })
    ),
});

const BlockersDataSchema = z.object({
    items: z.array(
        z.object({
            text: z.string(),
            severity: z.enum(["action", "approval", "fyi"]),
            owner: z.string().optional(),
            due: z.string().optional(),
        })
    ),
});

const CalloutDataSchema = z.object({
    text: z.string(),
    kind: z.enum(["decision", "risk", "quote", "highlight"]).optional(),
    attribution: z.string().optional(),
});

const AgendaDataSchema = z.object({
    items: z.array(
        z.object({
            topic: z.string(),
            time: z.string().optional(),
            owner: z.string().optional(),
        })
    ),
});

const DecisionLogDataSchema = z.object({
    items: z.array(
        z.object({
            decision: z.string(),
            owner: z.string().optional(),
            date: z.string().optional(),
            status: z
                .enum(["proposed", "approved", "blocked", "done"])
                .optional(),
        })
    ),
});

// ─── Base slide fields ────────────────────────────────────────────────────────

const BaseSlideSchema = z.object({
    id: z.string().optional(),
    title: z.string(),
    notes: z.string().optional(),
});

// ─── Discriminated union ──────────────────────────────────────────────────────

export const SlideSchema = z.discriminatedUnion("type", [
    BaseSlideSchema.extend({ type: z.literal("hero"), data: HeroDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("kpis"), data: KpisDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("pipeline"), data: PipelineDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("grid"), data: GridDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("timeline"), data: TimelineDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("blockers"), data: BlockersDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("callout"), data: CalloutDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("agenda"), data: AgendaDataSchema }),
    BaseSlideSchema.extend({ type: z.literal("decision_log"), data: DecisionLogDataSchema }),
]);

export type Slide = z.infer<typeof SlideSchema>;
export type SlideType = Slide["type"];

// A relaxed version for unknown types — used in the renderer fallback
export const LooseSlideSchema = z.object({
    id: z.string().optional(),
    type: z.string(),
    title: z.string(),
    notes: z.string().optional(),
    data: z.record(z.unknown()).optional(),
});
export type LooseSlide = z.infer<typeof LooseSlideSchema>;

// ─── Meta schema ─────────────────────────────────────────────────────────────

export const MetaSchema = z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
    audience: z.enum(["exec", "team", "customer", "mixed"]),
    template: z.enum(["status", "allHands", "requirements", "custom"]),
    rag: RAGSchema.optional(),
    headline: z.string().optional(),
});

export type Meta = z.infer<typeof MetaSchema>;

// ─── Full deck schema ─────────────────────────────────────────────────────────

export const DeckSchema = z.object({
    schemaVersion: z.literal(1),
    meta: MetaSchema,
    slides: z.array(SlideSchema),
});

export type Deck = z.infer<typeof DeckSchema>;

// ─── Loose deck (for parsing with unknown slide types) ────────────────────────

export const LooseDeckSchema = z.object({
    schemaVersion: z.literal(1),
    meta: MetaSchema,
    slides: z.array(LooseSlideSchema),
});

export type LooseDeck = z.infer<typeof LooseDeckSchema>;

// ─── Exports for schema page ──────────────────────────────────────────────────

export const SLIDE_TYPES: SlideType[] = [
    "hero",
    "kpis",
    "pipeline",
    "grid",
    "timeline",
    "blockers",
    "callout",
    "agenda",
    "decision_log",
];

export const RAG_VALUES = ["green", "yellow", "red"] as const;
export type RAG = (typeof RAG_VALUES)[number];
