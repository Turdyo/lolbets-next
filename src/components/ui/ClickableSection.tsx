import Link from "next/link";
import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface ClickableSectionProps {
    href: string
    className?: string
}

export function ClickableSection({
    children,
    className,
    href
}: PropsWithChildren<ClickableSectionProps>) {
    return <Link
        href={href}
        className={twMerge(
            "bg-[#1a2231] bg-green p-6 rounded-lg border border-gray-600 border-opacity-60 hover:border-opacity-100 transition-all cursor-pointer text-custom-white-200",
            className
        )}
    >
        {children}
    </Link>
}