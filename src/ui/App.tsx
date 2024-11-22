import { Surfaces, useNetlifyExtensionUIFetch } from "@netlify/sdk/ui/react";
import { SurfaceRoute, SurfaceRouter } from "@netlify/sdk/ui/react/components";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import { useState } from "react";
import { ConnectConfiguration } from "./surfaces/ConnectConfiguration";
import { SiteConfiguration } from "./surfaces/SiteConfiguration"
import { SiteGeneralConfiguration } from "./surfaces/SiteGeneralConfiguration";
import { TeamConfiguration } from "./surfaces/TeamConfiguration";

import { trpc } from "./trpc";

export const App = () => {
    const fetch = useNetlifyExtensionUIFetch();
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "/api/trpc",
                    fetch,
                }),
            ],
        }),
    );

    return (
        <trpc.Provider client={trpcClient} queryClient={queryClient}>
            <QueryClientProvider client={queryClient}>
                <SurfaceRouter>
                    <SurfaceRoute surface={Surfaces.TeamConfiguration}>
                        <TeamConfiguration />
                    </SurfaceRoute>
                    <SurfaceRoute surface={Surfaces.ConnectConfiguration}>
                        <ConnectConfiguration />
                    </SurfaceRoute>
                    <SurfaceRoute surface={Surfaces.SiteConfiguration}>
                        <SiteConfiguration />
                    </SurfaceRoute>
                    <SurfaceRoute surface={Surfaces.SiteGeneralConfiguration}>
                        <SiteGeneralConfiguration />
                    </SurfaceRoute>
                </SurfaceRouter>
            </QueryClientProvider>
        </trpc.Provider>
    );
};