import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, SelectField, IconField, RepeatableGroup } from "../FormFields";

export function KpisForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};
    const items = Array.isArray(data.items) ? data.items : [];

    const handleChange = (key: string, value: any) => {
        onChange({
            ...slide,
            data: {
                ...slide.data,
                [key]: value,
            },
        });
    };

    const handleItemUpdate = (index: number, key: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        handleChange("items", newItems);
    };

    const renderItem = (kpi: any, index: number) => (
        <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <TextField label="Label" value={kpi.label || ""} onChange={(val) => handleItemUpdate(index, "label", val)} error={errors[`data.items.${index}.label`]} />
                <TextField label="Value" value={kpi.value || ""} onChange={(val) => handleItemUpdate(index, "value", val)} error={errors[`data.items.${index}.value`]} />
            </div>
            <div className="grid grid-cols-2 gap-3">
                <IconField label="Icon" value={kpi.icon || ""} onChange={(val) => handleItemUpdate(index, "icon", val)} error={errors[`data.items.${index}.icon`]} />
                <SelectField label="Trend" value={kpi.trend || ""} options={[{ value: "", label: "None" }, { value: "up", label: "Up" }, { value: "down", label: "Down" }, { value: "flat", label: "Flat" }]} onChange={(val) => handleItemUpdate(index, "trend", val || undefined)} error={errors[`data.items.${index}.trend`]} />
            </div>
            <TextAreaField label="Note" value={kpi.note || ""} onChange={(val) => handleItemUpdate(index, "note", val)} error={errors[`data.items.${index}.note`]} wordLimit={15} rows={1} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>
            <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />
            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">KPIs</h3>
                <RepeatableGroup
                    items={items.map((item: any, i: number) => ({ ...item, id: `kpi-${i}` }))}
                    onReorder={(newItems) => handleChange("items", newItems.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newItems = [...items]; newItems.splice(parseInt(id.replace("kpi-", "")), 1); handleChange("items", newItems); }}
                    onAdd={() => handleChange("items", [...items, { label: "New KPI", value: "-" }])}
                    renderItem={renderItem}
                    addButtonText="Add KPI"
                />
            </div>
        </div>
    );
}
