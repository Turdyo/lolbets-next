"use client"
import { PropsWithClassName } from "@/lib/types/common";
import { useRef } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "@/components/ui/Button";

interface BetInputProps {
    onClick: (amount: number) => void
    color: "blue" | "red",
}

export function BetInput({
    className,
    onClick,
    color
}: PropsWithClassName<BetInputProps>) {
    const amount = useRef<HTMLInputElement>(null)
    return <div className={twMerge(
        "flex h-8 rounded-md",
        className
    )}>
        <input ref={amount} className={twMerge(
            "rounded-l-md p-2 w-20 text-base outline-none bg-transparent border border-r-0 border-opacity-60 text-custom-white-200",
            color === "red" ? "border-custom-red-400" : "border-custom-blue-400"
        )} />
        <Button
            onClick={() => {
                const value = amount.current?.value
                if (value && !Number.isNaN(parseInt(value))) {
                    onClick(parseInt(value))
                }
            }}
            className={twMerge(
                "rounded-md rounded-l-none h-full flex items-center p-2 text-sm bg-opacity-50",
                color === "red" ? "text-custom-red-400 border-custom-red-400 bg-custom-red-300 " : "text-custom-blue-400 border-custom-blue-400 bg-custom-blue-300"
            )}>
            Bet
        </Button>
    </div>
}