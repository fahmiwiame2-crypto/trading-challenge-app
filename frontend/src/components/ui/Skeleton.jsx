import React from 'react';
import { cn } from "../../lib/utils"; // Assuming utils exists, if not I'll just use template literals but usually it's there.

function Skeleton({
    className,
    ...props
}) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-slate-800/50", className)}
            {...props}
        />
    );
}

export { Skeleton };
