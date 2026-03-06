"use client";

import React, { createContext, useContext, ReactNode } from "react";

type TemplateType = "status" | "strategy" | string;

interface TemplateContextType {
    template: TemplateType;
}

const TemplateContext = createContext<TemplateContextType>({ template: "status" });

export function TemplateProvider({
    template,
    children
}: {
    template: TemplateType;
    children: ReactNode
}) {
    return (
        <TemplateContext.Provider value={{ template }}>
            <div data-template={template} className="h-full w-full">
                {children}
            </div>
        </TemplateContext.Provider>
    );
}

export function useTemplate() {
    return useContext(TemplateContext);
}
