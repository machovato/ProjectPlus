import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
    title: "DTN Project Pulse",
    description: "Meeting presentation engine powered by DTN",
    robots: {
        index: false,
        follow: false,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="min-h-screen flex flex-col bg-[var(--dtn-bg)]">
                {children}
            </body>
        </html>
    );
}
