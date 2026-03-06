import React from "react";
import type { BaseSlideFormProps } from "../SlideFormEditor";
import { TextField, TextAreaField, SelectField } from "../FormFields";

export function CalloutForm({ slide, onChange, errors }: BaseSlideFormProps) {
    const data = slide.data || {};

    const handleChange = (key: string, value: any) => {
        onChange({
            ...slide,
            data: {
                ...slide.data,
                [key]: value,
            },
        });
    };

    return (
        <div className="space-y-6">
            <div className="space-y-1 mb-6">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Slide Settings</h3>
            </div>
            <TextField label="Slide Title" value={slide.title || ""} onChange={(val) => onChange({ ...slide, title: val })} error={errors["title"]} />

            <div className="space-y-4 pt-4">
                <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Callout Content</h3>
                <TextAreaField
                    label="Text"
                    value={data.text || ""}
                    onChange={(val) => handleChange("text", val)}
                    error={errors["data.text"]}
                    rows={4}
                    wordLimit={40}
                />
                <div className="grid grid-cols-2 gap-3">
                    <SelectField
                        label="Kind"
                        value={data.kind || ""}
                        options={[
                            { value: "", label: "None" },
                            { value: "decision", label: "Decision" },
                            { value: "risk", label: "Risk" },
                            { value: "quote", label: "Quote" },
                            { value: "highlight", label: "Highlight" }
                        ]}
                        onChange={(val) => handleChange("kind", val || undefined)}
                        error={errors["data.kind"]}
                    />
                    <TextField
                        label="Attribution"
                        value={data.attribution || ""}
                        onChange={(val) => handleChange("attribution", val)}
                        error={errors["data.attribution"]}
                    />
                </div>
            </div>
        </div>
    );
}
