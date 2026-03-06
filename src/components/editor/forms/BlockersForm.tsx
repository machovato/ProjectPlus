import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, SelectField, RepeatableGroup } from "../FormFields";

export function BlockersForm({ slide, onChange, errors }: BaseSlideFormProps) {
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

    const renderItem = (item: any, index: number) => (
        <div className="space-y-3">
            <TextAreaField label="Text" value={item.text || ""} onChange={(val) => handleItemUpdate(index, "text", val)} error={errors[`data.items.${index}.text`]} wordLimit={20} rows={2} />
            <div className="grid grid-cols-2 gap-3">
                <SelectField label="Severity" value={item.severity || "fyi"} options={[{ value: "action", label: "Action Needed" }, { value: "approval", label: "Approval Needed" }, { value: "fyi", label: "FYI" }]} onChange={(val) => handleItemUpdate(index, "severity", val)} error={errors[`data.items.${index}.severity`]} />
                <TextField label="Owner" value={item.owner || ""} onChange={(val) => handleItemUpdate(index, "owner", val)} error={errors[`data.items.${index}.owner`]} />
            </div>
            <TextField label="Due Date" value={item.due || ""} onChange={(val) => handleItemUpdate(index, "due", val)} error={errors[`data.items.${index}.due`]} placeholder="e.g. 2026-03-15" />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>
            <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />
            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Blockers</h3>
                <RepeatableGroup
                    items={items.map((item: any, i: number) => ({ ...item, id: `blocker-${i}` }))}
                    onReorder={(newProbs) => handleChange("items", newProbs.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newProbs = [...items]; newProbs.splice(parseInt(id.replace("blocker-", "")), 1); handleChange("items", newProbs); }}
                    onAdd={() => handleChange("items", [...items, { text: "New Blocker", severity: "fyi" }])}
                    renderItem={renderItem}
                    addButtonText="Add Blocker"
                />
            </div>
        </div>
    );
}
