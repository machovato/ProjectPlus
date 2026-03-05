"use client";

import type { LooseSlide } from "@/lib/schema";
import type { DensityMode } from "@/lib/paginate";
import { HeroSlide } from "./slides/HeroSlide";
import { KpisSlide } from "./slides/KpisSlide";
import { PipelineSlide } from "./slides/PipelineSlide";
import { GridSlide } from "./slides/GridSlide";
import { TimelineSlide } from "./slides/TimelineSlide";
import { BlockersSlide } from "./slides/BlockersSlide";
import { CalloutSlide } from "./slides/CalloutSlide";
import { AgendaSlide } from "./slides/AgendaSlide";
import { DecisionLogSlide } from "./slides/DecisionLogSlide";
import { UnknownSlide } from "./slides/UnknownSlide";

interface SlideRendererProps {
    slide: LooseSlide;
    density: DensityMode;
    deckMeta?: Record<string, string>;
}

/**
 * Pure switch rendering function. Always returns something — never throws.
 * The density mode has already been applied to slide.data by processSlides().
 */
export function SlideRenderer({ slide, density, deckMeta }: SlideRendererProps) {
    switch (slide.type) {
        case "hero": return <HeroSlide slide={slide} />;
        case "kpis": return <KpisSlide slide={slide} />;
        case "pipeline": return <PipelineSlide slide={slide} />;
        case "grid": return <GridSlide slide={slide} />;
        case "timeline": return <TimelineSlide slide={slide} />;
        case "blockers": return <BlockersSlide slide={slide} deckMeta={deckMeta} />;
        case "callout": return <CalloutSlide slide={slide} />;
        case "agenda": return <AgendaSlide slide={slide} />;
        case "decision_log": return <DecisionLogSlide slide={slide} />;
        default: return <UnknownSlide slide={slide} />;
    }
}
