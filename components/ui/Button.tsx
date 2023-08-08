"use client"
import { PropsWithClassName } from "@/lib/types/common";
import { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
    onClick?: MouseEventHandler<HTMLDivElement>
}

export function Button({ children, className, onClick }: PropsWithClassName<PropsWithChildren<ButtonProps>>) {
    return <div
        className={twMerge(
            "transition-all text-center whitespace-nowrap w-min cursor-pointer select-none p-4 bg-custom-purple-100 rounded-lg font-semibold hover:bg-custom-purple-200",
            className
        )}
        onClick={onClick}
    >
        {children}
    </div>
}