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
            "flex items-center gap-6 border border-gray-600 border-opacity-0 hover:border-opacity-100 transition-all rounded-lg p-3",
            selected ? "border-opacity-60" : ""
        )}
    >
        <span className="w-6 h-6">
            {icon}
        </span>
        <span className={twMerge(
            "font-semibold text-custom-white-200 text-sm invisible group-hover:visible transition-all",
            selected ? "text-custom-white-100" : ""
        )}>
            {children}
        </span>
    </Link>
}