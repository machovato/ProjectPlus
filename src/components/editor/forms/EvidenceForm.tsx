import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, SelectField, RepeatableGroup, IconField } from "../FormFields";

export function EvidenceForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};

    // Auto-detect V1 GridDataSchema vs V2 EvidenceDataSchema
    const isV2 = Array.isArray(data.points);
    const itemsKey = isV2 ? "points" : "cards";
    const items = Array.isArray(data[itemsKey]) ? data[itemsKey] : [];

    const handleChange = (key: string, value: any) => {
        onChange({
            ...slide,
            data: {
                ...slide.data,
                [key]: value,
            },
        });
    };

    const handleItemUpdate = (index: number, key: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        handleChange(itemsKey, newItems);
    };

    const renderItem = (item: any, index: number) => {
        if (!isV2) {
            return (
                <div className="space-y-3">
                    <TextField label="Title" value={item.title || ""} onChange={(val) => handleItemUpdate(index, "title", val)} error={errors[`data.cards.${index}.title`]} />
                    <TextAreaField label="Body" value={item.body || ""} onChange={(val) => handleItemUpdate(index, "body", val)} error={errors[`data.cards.${index}.body`]} wordLimit={20} />
                    <IconField label="Icon" value={item.icon || ""} onChange={(val) => handleItemUpdate(index, "icon", val)} error={errors[`data.cards.${index}.icon`]} />
                </div>
            );
        }

        return (
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <TextField label="Metric" value={item.metric || ""} onChange={(val) => handleItemUpdate(index, "metric", val)} error={errors[`data.points.${index}.metric`]} />
                    <TextField label="Label" value={item.label || ""} onChange={(val) => handleItemUpdate(index, "label", val)} error={errors[`data.points.${index}.label`]} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <TextField label="Source" value={item.source || ""} onChange={(val) => handleItemUpdate(index, "source", val)} error={errors[`data.points.${index}.source`]} />
                    <SelectField label="Type" value={item.type || ""} options={[{ value: "quantified", label: "Quantified" }, { value: "qualitative", label: "Qualitative" }]} onChange={(val) => handleItemUpdate(index, "type", val)} error={errors[`data.points.${index}.type`]} />
                </div>
                <TextAreaField label="Body" value={item.body || ""} onChange={(val) => handleItemUpdate(index, "body", val)} error={errors[`data.points.${index}.body`]} wordLimit={20} rows={2} />
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>
            <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />
            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Evidence Points</h3>
                <RepeatableGroup
                    items={items.map((item: any, i: number) => ({ ...item, id: `ev-${i}` }))}
                    onReorder={(newItems) => handleChange(itemsKey, newItems.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newItems = [...items]; newItems.splice(parseInt(id.replace("ev-", "")), 1); handleChange(itemsKey, newItems); }}
                    onAdd={() => {
                        const newItem = isV2
                            ? { metric: "0", label: "New Metric", source: "Data", type: "quantified", body: "" }
                            : { title: "New Card", body: "", icon: "File" };
                        handleChange(itemsKey, [...items, newItem]);
                    }}
                    renderItem={renderItem}
                    addButtonText="Add Evidence Point"
                />
            </div>
        </div>
    );
}
