"use client";

import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Error({
    error,
}: {
    error: Error
    reset: () => void
}) {
    return <div className="flex flex-col gap-6 h-full w-full items-center justify-center">
        <span className="font-semibold">{error.message}</span>
        <Link href="/leagues">
            <Button className="p-6">Come back</Button>
        </Link>
    </div>
}