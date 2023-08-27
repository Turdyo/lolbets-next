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
        "flex flex-col w-full h-full bg-custom-blue-500 rounded-xl ",
        className
    )}>
        <div className="rounded-t-lg p-4 text-lg font-semibold">
            {title}
        </div>
        <div className="overflow-auto">
            {children}
        </div>
    </div>
}