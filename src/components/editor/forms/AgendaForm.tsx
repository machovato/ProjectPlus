import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, RepeatableGroup } from "../FormFields";

export function AgendaForm({ slide, onChange, errors }: BaseSlideFormProps) {
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

    const handleItemUpdate = (index: number, key: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        handleChange("items", newItems);
    };

    const renderItem = (item: any, index: number) => (
        <div className="space-y-3">
            <TextField label="Topic" value={item.topic || ""} onChange={(val) => handleItemUpdate(index, "topic", val)} error={errors[`data.items.${index}.topic`]} />
            <div className="grid grid-cols-2 gap-3">
                <TextField label="Time" value={item.time || ""} onChange={(val) => handleItemUpdate(index, "time", val)} error={errors[`data.items.${index}.time`]} placeholder="e.g. 5m" />
                <TextField label="Owner" value={item.owner || ""} onChange={(val) => handleItemUpdate(index, "owner", val)} error={errors[`data.items.${index}.owner`]} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>
            <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />
            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Agenda Items</h3>
                <RepeatableGroup
                    items={items.map((item: any, i: number) => ({ ...item, id: `agenda-${i}` }))}
                    onReorder={(newItems) => handleChange("items", newItems.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newItems = [...items]; newItems.splice(parseInt(id.replace("agenda-", "")), 1); handleChange("items", newItems); }}
                    onAdd={() => handleChange("items", [...items, { topic: "New Topic", time: "5m" }])}
                    renderItem={renderItem}
                    addButtonText="Add Agenda Item"
                />
            </div>
        </div>
    );
}
