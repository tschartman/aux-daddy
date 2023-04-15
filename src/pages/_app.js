import React from "react"
import '@/styles/globals.css'
import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppLayout from "@/components/Layout";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const [queryClient] = React.useState(() => new QueryClient());
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </QueryClientProvider>
    </SessionProvider>
  )
}
