import { PropsWithClassName } from "@/lib/types/common";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface SectionWithTitleProps {
    title: string
}

export function SectionWithTitle({
    className,
    children,
    title
}: PropsWithClassName<PropsWithChildren<SectionWithTitleProps>>) {
    return <div className={twMerge(
        "flex flex-col w-full h-full bg-custom-blue-500 rounded-lg shadow-md",
        className
    )}>
        <div className="bg-custom-purple-100 rounded-t-lg p-2 text-lg font-semibold">
            {title}
        </div>
        <div className="overflow-auto">
            {children}
        </div>
    </div>
}