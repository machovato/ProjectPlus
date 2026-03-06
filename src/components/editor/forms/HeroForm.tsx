import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, SelectField, IconField, RepeatableGroup } from "../FormFields";
import { RAG_VALUES } from "@/lib/schema";
import { Plus } from "lucide-react";

export function HeroForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};
    const kpis = Array.isArray(data.kpis) ? data.kpis : [];

    const handleChange = (key: string, value: any) => {
        onChange({
            ...slide,
            data: {
                ...slide.data,
                [key]: value,
            },
        });
    };

    const handleKPIUpdate = (index: number, key: string, value: any) => {
        const newKpis = [...kpis];
        newKpis[index] = { ...newKpis[index], [key]: value };
        handleChange("kpis", newKpis);
    };

    const renderKPI = (kpi: any, index: number) => (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <TextField
                    label="Label"
                    value={kpi.label || ""}
                    onChange={(val) => handleKPIUpdate(index, "label", val)}
                    error={errors[`data.kpis.${index}.label`]}
                />
                <TextField
                    label="Value"
                    value={kpi.value || ""}
                    onChange={(val) => handleKPIUpdate(index, "value", val)}
                    error={errors[`data.kpis.${index}.value`]}
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <IconField
                    label="Icon (Lucide)"
                    value={kpi.icon || ""}
                    onChange={(val) => handleKPIUpdate(index, "icon", val)}
                    error={errors[`data.kpis.${index}.icon`]}
                />
                <SelectField
                    label="Trend"
                    value={kpi.trend || ""}
                    options={[
                        { value: "", label: "None" },
                        { value: "up", label: "Up" },
                        { value: "down", label: "Down" },
                        { value: "flat", label: "Flat" },
                    ]}
                    onChange={(val) => handleKPIUpdate(index, "trend", val || undefined)}
                    error={errors[`data.kpis.${index}.trend`]}
                />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>

            <TextField
                label="Slide Title"
                value={slide.title || ""}
                onChange={(val) => onChange({ ...slide, title: val })}
                error={errors["title"]}
            />

            <TextAreaField
                label="Subtitle (Punchline)"
                value={data.subtitle || ""}
                onChange={(val) => handleChange("subtitle", val)}
                error={errors["data.subtitle"]}
                rows={2}
            />

            <SelectField
                label="Overall Status (RAG)"
                value={data.rag || ""}
                options={[
                    { value: "", label: "None" },
                    ...RAG_VALUES.map(r => ({ value: r, label: r.charAt(0).toUpperCase() + r.slice(1) }))
                ]}
                onChange={(val) => handleChange("rag", val || undefined)}
                error={errors["data.rag"]}
            />

            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Key Performance Indicators</h3>
                <RepeatableGroup
                    items={kpis.map((kpi: any, i: number) => ({ ...kpi, id: `kpi-${i}` }))}
                    onReorder={(newItems) => {
                        // Strip internal IDs back out before saving to state
                        const stripped = newItems.map(({ id, ...rest }: any) => rest);
                        handleChange("kpis", stripped);
                    }}
                    onRemove={(id) => {
                        const index = parseInt(id.replace("kpi-", ""));
                        const newKpis = [...kpis];
                        newKpis.splice(index, 1);
                        handleChange("kpis", newKpis);
                    }}
                    onAdd={() => {
                        handleChange("kpis", [...kpis, { label: "New KPI", value: "-" }]);
                    }}
                    renderItem={renderKPI}
                    addButtonText="Add KPI"
                />
            </div>
        </div>
    );
}
