import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, IconField, SelectField, RepeatableGroup } from "../FormFields";

export function ProblemForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};

    // Problem could be a V1 GridDataSchema ('cards') or a V2 problem schema ('primary' and 'secondary' arrays)
    const isV2 = !!data.primary;

    const handleChange = (key: string, value: any) => {
        onChange({
            ...slide,
            data: {
                ...slide.data,
                [key]: value,
            },
        });
    };

    if (!isV2) {
        // Drop back to V1 Grid editing style if it's an old schema
        const cards = Array.isArray(data.cards) ? data.cards : [];
        const handleCardUpdate = (index: number, key: string, value: string) => {
            const newCards = [...cards];
            newCards[index] = { ...newCards[index], [key]: value };
            handleChange("cards", newCards);
        };
        const renderCard = (card: any, index: number) => (
            <div className="space-y-3">
                <TextField label="Title" value={card.title || ""} onChange={(val) => handleCardUpdate(index, "title", val)} error={errors[`data.cards.${index}.title`]} />
                <TextAreaField label="Body" value={card.body || ""} onChange={(val) => handleCardUpdate(index, "body", val)} error={errors[`data.cards.${index}.body`]} wordLimit={20} />
                <IconField label="Icon" value={card.icon || ""} onChange={(val) => handleCardUpdate(index, "icon", val)} error={errors[`data.cards.${index}.icon`]} />
            </div>
        );
        return (
            <div className="space-y-6">
                <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />
                <RepeatableGroup items={cards.map((c: any, i: number) => ({ ...c, id: `card-${i}` }))}
                    onReorder={(newCards) => handleChange("cards", newCards.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newCards = [...cards]; newCards.splice(parseInt(id.replace("card-", "")), 1); handleChange("cards", newCards); }}
                    onAdd={() => handleChange("cards", [...cards, { title: "New Card", body: "" }])}
                    renderItem={renderCard} addButtonText="Add Problem Card" />
            </div>
        );
    }

    // V2 Data handling
    const primary = data.primary || {};
    const secondary = Array.isArray(data.secondary) ? data.secondary : [];

    const handlePrimaryChange = (key: string, value: string) => {
        handleChange("primary", { ...primary, [key]: value });
    };

    const handleSecondaryUpdate = (index: number, key: string, value: string) => {
        const newSecondary = [...secondary];
        newSecondary[index] = { ...newSecondary[index], [key]: value };
        handleChange("secondary", newSecondary);
    };

    const renderSecondary = (prob: any, index: number) => (
        <div className="space-y-3">
            <TextField label="Title" value={prob.title || ""} onChange={(val) => handleSecondaryUpdate(index, "title", val)} error={errors[`data.secondary.${index}.title`]} />
            <TextAreaField label="Body" value={prob.body || ""} onChange={(val) => handleSecondaryUpdate(index, "body", val)} error={errors[`data.secondary.${index}.body`]} wordLimit={20} rows={2} />
            <div className="grid grid-cols-2 gap-3">
                <IconField label="Icon" value={prob.icon || ""} onChange={(val) => handleSecondaryUpdate(index, "icon", val)} error={errors[`data.secondary.${index}.icon`]} />
                <SelectField label="Severity" value={prob.severity || ""} options={[{ value: "critical", label: "Critical" }, { value: "high", label: "High" }, { value: "moderate", label: "Moderate" }]} onChange={(val) => handleSecondaryUpdate(index, "severity", val)} error={errors[`data.secondary.${index}.severity`]} />
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>

            <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />

            <div className="space-y-4 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Primary Problem</h3>
                <div className="space-y-3 bg-red-50/50 p-4 rounded-lg border border-red-100">
                    <TextField label="Title" value={primary.title || ""} onChange={(val) => handlePrimaryChange("title", val)} error={errors["data.primary.title"]} />
                    <TextAreaField label="Body" value={primary.body || ""} onChange={(val) => handlePrimaryChange("body", val)} error={errors["data.primary.body"]} wordLimit={30} rows={3} />
                    <div className="grid grid-cols-2 gap-3">
                        <IconField label="Icon" value={primary.icon || ""} onChange={(val) => handlePrimaryChange("icon", val)} error={errors["data.primary.icon"]} />
                        <SelectField label="Severity" value={primary.severity || ""} options={[{ value: "critical", label: "Critical" }, { value: "high", label: "High" }, { value: "moderate", label: "Moderate" }]} onChange={(val) => handlePrimaryChange("severity", val)} error={errors["data.primary.severity"]} />
                    </div>
                </div>
            </div>

            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Secondary Problems</h3>
                <RepeatableGroup
                    items={secondary.map((prob: any, i: number) => ({ ...prob, id: `sec-${i}` }))}
                    onReorder={(newProbs) => handleChange("secondary", newProbs.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newProbs = [...secondary]; newProbs.splice(parseInt(id.replace("sec-", "")), 1); handleChange("secondary", newProbs); }}
                    onAdd={() => handleChange("secondary", [...secondary, { title: "New Issue", body: "", icon: "AlertCircle", severity: "moderate" }])}
                    renderItem={renderSecondary}
                    addButtonText="Add Secondary Problem"
                />
            </div>
        </div>
    );
}
