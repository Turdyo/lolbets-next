"use client"
import { PropsWithClassName } from "@/lib/types/common";
import { MouseEventHandler, PropsWithChildren, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps {
    onClick?: MouseEventHandler<HTMLButtonElement>
}

export function Button({ children, className, onClick }: PropsWithClassName<PropsWithChildren<ButtonProps>>) {
    return <button
        className={twMerge(
            "transition-all text-center whitespace-nowrap w-min cursor-pointer select-none p-4 rounded-lg font-semibold border border-gray-600 bg-[#1e293b] border-opacity-60 hover:border-opacity-100",
            className
        )}
        onClick={onClick}
    >
        {children}
    </button>
}