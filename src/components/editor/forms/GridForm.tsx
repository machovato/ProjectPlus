import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, IconField, RepeatableGroup } from "../FormFields";

export function GridForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};
    const cards = Array.isArray(data.cards) ? data.cards : [];

    const handleChange = (key: string, value: any) => {
        onChange({
            ...slide,
            data: {
                ...slide.data,
                [key]: value,
            },
        });
    };

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
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>
            <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />
            <div className="space-y-3 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Grid Cards</h3>
                <RepeatableGroup
                    items={cards.map((c: any, i: number) => ({ ...c, id: `card-${i}` }))}
                    onReorder={(newCards) => handleChange("cards", newCards.map(({ id, ...rest }: any) => rest))}
                    onRemove={(id) => { const newCards = [...cards]; newCards.splice(parseInt(id.replace("card-", "")), 1); handleChange("cards", newCards); }}
                    onAdd={() => handleChange("cards", [...cards, { title: "New Card", body: "" }])}
                    renderItem={renderCard}
                    addButtonText="Add Card"
                />
            </div>
        </div>
    );
}
