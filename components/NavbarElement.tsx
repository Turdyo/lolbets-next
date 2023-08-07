import Link from "next/link";
import { ReactNode, PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

interface NavbarElementProps {
    icon: ReactNode;
    href: string;
    selected?: boolean;
}

export function NavbarElement({
    href,
    icon,
    selected = false,
    children
}: PropsWithChildren<NavbarElementProps>) {
    return <Link
        href={href}
        className={twMerge(
            "flex items-center gap-4 border border-gray-600 border-opacity-0 hover:border-opacity-100 transition-all rounded-lg p-4",
            selected ? "border-opacity-60" : ""
        )}
    >
        {icon}
        <span className={twMerge(
            "font-semibold text-custom-white-200 text-sm",
            selected ? "text-custom-white-100" : ""
        )}>
            {children}
        </span>
    </Link>
}