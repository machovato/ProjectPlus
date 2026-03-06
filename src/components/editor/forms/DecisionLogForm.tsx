import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, SelectField, RepeatableGroup } from "../FormFields";

interface DecisionLogItem {
    id?: string;
    decision: string;
    status: "proposed" | "approved" | "blocked" | "done" | string;
    owner?: string;
    date?: string;
}

interface DecisionLogData {
    items: DecisionLogItem[];
}

export function DecisionLogForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = (slide.data || { items: [] }) as DecisionLogData;
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

    const handleItemUpdate = (index: number, key: keyof DecisionLogItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [key]: value };
        handleChange("items", newItems);
    };

    const renderItem = (item: DecisionLogItem, index: number) => (
        <div className="space-y-3">
            <TextField
                label="Decision"
                value={item.decision || ""}
                onChange={(val) => handleItemUpdate(index, "decision", val)}
                error={errors[`data.items.${index}.decision`]}
            />
            <div className="grid grid-cols-2 gap-3">
                <SelectField
                    label="Status"
                    value={item.status || ""}
                    options={[
                        { value: "", label: "None" },
                        { value: "proposed", label: "Proposed" },
                        { value: "approved", label: "Approved" },
                        { value: "blocked", label: "Blocked" },
                        { value: "done", label: "Done" }
                    ]}
                    onChange={(val) => handleItemUpdate(index, "status", val)}
                    error={errors[`data.items.${index}.status`]}
                />
                <TextField
                    label="Owner"
                    value={item.owner || ""}
                    onChange={(val) => handleItemUpdate(index, "owner", val)}
                    error={errors[`data.items.${index}.owner`]}
                />
            </div>
            <TextField
                label="Date"
                value={item.date || ""}
                onChange={(val) => handleItemUpdate(index, "date", val)}
                error={errors[`data.items.${index}.date`]}
                placeholder="e.g. YYYY-MM-DD"
            />
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
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Decisions</h3>
                <RepeatableGroup
                    items={items.map((item, i) => ({ ...item, id: item.id || `dl-${i}` }))}
                    onReorder={(newItems) => handleChange("items", newItems.map(({ id, ...rest }) => rest))}
                    onRemove={(id) => {
                        const index = items.findIndex((_, i) => `dl-${i}` === id || items[i].id === id);
                        if (index !== -1) {
                            const newItems = [...items];
                            newItems.splice(index, 1);
                            handleChange("items", newItems);
                        }
                    }}
                    onAdd={() => handleChange("items", [...items, { decision: "New Decision", status: "proposed" }])}
                    renderItem={renderItem}
                    addButtonText="Add Decision"
                />
            </div>
        </div>
    );
}
