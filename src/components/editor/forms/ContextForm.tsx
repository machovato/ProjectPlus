import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, IconField, SelectField, RepeatableGroup } from "../FormFields";

export function ContextForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};

    // Note: Context slide has two versions:
    // V1 generic 'GridDataSchema' with 'cards' array
    // V2 'V2ContextDataSchema' with 'items' array

    // Auto-detect array based on what exists
    const isV2 = Array.isArray(data.items);
    const itemsKey = isV2 ? "items" : "cards";
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

    const renderItem = (item: any, index: number) => (
        <div className="space-y-3">
            <TextField
                label="Title"
                value={item.title || ""}
                onChange={(val) => handleItemUpdate(index, "title", val)}
                error={errors[`data.${itemsKey}.${index}.title`]}
            />
            <TextAreaField
                label="Body"
                value={item.body || ""}
                onChange={(val) => handleItemUpdate(index, "body", val)}
                error={errors[`data.${itemsKey}.${index}.body`]}
                wordLimit={20}
                rows={2}
            />
            <div className="grid grid-cols-2 gap-3">
                <IconField
                    label="Icon (Lucide)"
                    value={item.icon || ""}
                    onChange={(val) => handleItemUpdate(index, "icon", val)}
                    error={errors[`data.${itemsKey}.${index}.icon`]}
                />
                {isV2 && (
                    <SelectField
                        label="Status"
                        value={item.status || ""}
                        options={[
                            { value: "confirmed", label: "Confirmed" },
                            { value: "in-progress", label: "In Progress" },
                            { value: "pending", label: "Pending" },
                        ]}
                        onChange={(val) => handleItemUpdate(index, "status", val)}
                        error={errors[`data.${itemsKey}.${index}.status`]}
                    />
                )}
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

            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Context Items</h3>
                <RepeatableGroup
                    items={items.map((item: any, i: number) => ({ ...item, id: `item-${i}` }))}
                    onReorder={(newItems) => {
                        const stripped = newItems.map(({ id, ...rest }: any) => rest);
                        handleChange(itemsKey, stripped);
                    }}
                    onRemove={(id) => {
                        const index = parseInt(id.replace("item-", ""));
                        const newItems = [...items];
                        newItems.splice(index, 1);
                        handleChange(itemsKey, newItems);
                    }}
                    onAdd={() => {
                        const newItem = isV2
                            ? { title: "New Item", body: "", icon: "Circle", status: "pending" }
                            : { title: "New Card", body: "", icon: "Circle" };
                        handleChange(itemsKey, [...items, newItem]);
                    }}
                    renderItem={renderItem}
                    addButtonText="Add Context Item"
                />
            </div>
        </div>
    );
}
