"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SessionProvider } from "next-auth/react";
import { PropsWithChildren, useState } from "react";

export function Providers({
    children
}: PropsWithChildren) {
    const [queryClient] = useState(() => new QueryClient())
    return <SessionProvider>
        <QueryClientProvider client={queryClient}>
            {children}
        <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    </SessionProvider>
}