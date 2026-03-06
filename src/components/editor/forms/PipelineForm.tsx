import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, SelectField, IconField, RepeatableGroup, TextAreaField } from "../FormFields";

export function PipelineForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};
    const steps = Array.isArray(data.steps) ? data.steps : [];

    const handleChange = (key: string, value: any) => {
        onChange({
            ...slide,
            data: {
                ...slide.data,
                [key]: value,
            },
        });
    };

    const handleStepUpdate = (index: number, key: string, value: any) => {
        const newSteps = [...steps];
        newSteps[index] = { ...newSteps[index], [key]: value };
        handleChange("steps", newSteps);
    };

    const handleArrayUpdate = (index: number, key: "badges" | "blockers", val: string) => {
        // Simple comma-separated sync
        const items = val.split(",").map(s => s.trim()).filter(Boolean);
        handleStepUpdate(index, key, items);
    };

    const renderStep = (step: any, index: number) => (
        <div className="space-y-3">
            <TextField label="Label" value={step.label || ""} onChange={(val) => handleStepUpdate(index, "label", val)} error={errors[`data.steps.${index}.label`]} />
            <div className="grid grid-cols-2 gap-3">
                <IconField label="Icon" value={step.icon || ""} onChange={(val) => handleStepUpdate(index, "icon", val)} error={errors[`data.steps.${index}.icon`]} />
                <SelectField label="Status" value={step.status || ""} options={[{ value: "", label: "None" }, { value: "done", label: "Done" }, { value: "current", label: "Current" }, { value: "next", label: "Next" }]} onChange={(val) => handleStepUpdate(index, "status", val || undefined)} error={errors[`data.steps.${index}.status`]} />
            </div>
            <TextField label="Badges (comma separated)" value={(step.badges || []).join(", ")} onChange={(val) => handleArrayUpdate(index, "badges", val)} error={errors[`data.steps.${index}.badges`]} />
            <TextAreaField label="Blockers (comma separated)" value={(step.blockers || []).join(", ")} onChange={(val) => handleArrayUpdate(index, "blockers", val)} error={errors[`data.steps.${index}.blockers`]} rows={2} />
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>
            <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />
            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Pipeline Steps</h3>
                <RepeatableGroup
                    items={steps.map((step: any, i: number) => ({ ...step, id: `step-${i}` }))}
                    onReorder={(newItems) => handleChange("steps", newItems.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newItems = [...steps]; newItems.splice(parseInt(id.replace("step-", "")), 1); handleChange("steps", newItems); }}
                    onAdd={() => handleChange("steps", [...steps, { label: "New Step", status: "next" }])}
                    renderItem={renderStep}
                    addButtonText="Add Step"
                />
            </div>
        </div>
    );
}
