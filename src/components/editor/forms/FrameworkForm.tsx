import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, IconField, SelectField, RepeatableGroup } from "../FormFields";

export function FrameworkForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};

    // Auto-detect V1 GridDataSchema ('cards') vs V2 FrameworkDataSchema ('lanes')
    const isV2 = Array.isArray(data.lanes);
    const itemsKey = isV2 ? "lanes" : "cards";
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

    const handleItemUpdate = (index: number, key: string, value: any) => {
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
                <TextField label="Title" value={item.title || ""} onChange={(val) => handleItemUpdate(index, "title", val)} error={errors[`data.lanes.${index}.title`]} />
                <TextAreaField label="Body" value={item.body || ""} onChange={(val) => handleItemUpdate(index, "body", val)} error={errors[`data.lanes.${index}.body`]} wordLimit={20} rows={2} />
                <div className="grid grid-cols-2 gap-3">
                    <IconField label="Icon" value={item.icon || ""} onChange={(val) => handleItemUpdate(index, "icon", val)} error={errors[`data.lanes.${index}.icon`]} />
                    <SelectField label="Type" value={item.type || ""} options={[{ value: "control", label: "Control" }, { value: "influence", label: "Influence" }, { value: "concern", label: "Concern" }]} onChange={(val) => handleItemUpdate(index, "type", val)} error={errors[`data.lanes.${index}.type`]} />
                </div>
                <TextField label="Rank (1 = Foundation)" value={String(item.rank || "")} onChange={(val) => handleItemUpdate(index, "rank", parseInt(val) || 1)} error={errors[`data.lanes.${index}.rank`]} />
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
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Framework Lanes</h3>
                <RepeatableGroup
                    items={items.map((item: any, i: number) => ({ ...item, id: `lane-${i}` }))}
                    onReorder={(newItems) => handleChange(itemsKey, newItems.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newItems = [...items]; newItems.splice(parseInt(id.replace("lane-", "")), 1); handleChange(itemsKey, newItems); }}
                    onAdd={() => {
                        const newItem = isV2
                            ? { title: "New Lane", body: "", icon: "Layers", type: "concern", rank: items.length + 1 }
                            : { title: "New Card", body: "", icon: "Layers" };
                        handleChange(itemsKey, [...items, newItem]);
                    }}
                    renderItem={renderItem}
                    addButtonText="Add Framework Lane"
                />
            </div>
        </div>
    );
}
