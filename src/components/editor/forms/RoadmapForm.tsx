import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, SelectField, RepeatableGroup } from "../FormFields";

export function RoadmapForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};
    const milestones = Array.isArray(data.milestones) ? data.milestones : [];

    const handleChange = (key: string, value: any) => {
        onChange({
            ...slide,
            data: {
                ...slide.data,
                [key]: value,
            },
        });
    };

    const handleMilestoneUpdate = (index: number, key: string, value: any) => {
        const newMilestones = [...milestones];
        newMilestones[index] = { ...newMilestones[index], [key]: value };
        handleChange("milestones", newMilestones);
    };

    const renderMilestone = (ms: any, index: number) => (
        <div className="space-y-3">
            <TextField label="Label" value={ms.label || ""} onChange={(val) => handleMilestoneUpdate(index, "label", val)} error={errors[`data.milestones.${index}.label`]} />
            <div className="grid grid-cols-2 gap-3">
                <TextField label="Date (YYYY-MM-DD)" value={ms.date || ""} onChange={(val) => handleMilestoneUpdate(index, "date", val)} error={errors[`data.milestones.${index}.date`]} />
                <SelectField label="State" value={ms.state || "upcoming"} options={[{ value: "done", label: "Done" }, { value: "current", label: "Current" }, { value: "upcoming", label: "Upcoming" }]} onChange={(val) => handleMilestoneUpdate(index, "state", val)} error={errors[`data.milestones.${index}.state`]} />
            </div>
            <TextAreaField label="Detail" value={ms.detail || ""} onChange={(val) => handleMilestoneUpdate(index, "detail", val)} error={errors[`data.milestones.${index}.detail`]} wordLimit={20} rows={2} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>
            <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />
            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Milestones</h3>
                <RepeatableGroup
                    items={milestones.map((ms: any, i: number) => ({ ...ms, id: `ms-${i}` }))}
                    onReorder={(newProbs) => handleChange("milestones", newProbs.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newProbs = [...milestones]; newProbs.splice(parseInt(id.replace("ms-", "")), 1); handleChange("milestones", newProbs); }}
                    onAdd={() => handleChange("milestones", [...milestones, { label: "New Milestone", state: "upcoming", detail: "" }])}
                    renderItem={renderMilestone}
                    addButtonText="Add Milestone"
                />
            </div>
        </div>
    );
}
