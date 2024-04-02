import {useEffect, useState} from 'react';
import { Provider as AppBridgeProvider } from "@shopify/app-bridge-react";
import PolarisProvider from '@components/PolarisProvider';
import SessionProvider from '@components/SessionProvider';
import ApolloProvider from '@components/ApolloProvider';
import RoutePropagator from '@components/RoutePropagator';
import ErrorBoundary from "@components/ErrorBoundary";

export default function EmbeddedApp({children}) {
  const API_KEY = process.env.NEXT_PUBLIC_SHOPIFY_APP_API_KEY;
  const [host, setHost] = useState("");

  useEffect(() => {
    const url = new URL(window.location.href)
    const host = url.searchParams.get('host');

    if (host) {
      setHost(host)
    } else {
      console.log("Shopify always provide Host in the url. If not present, then the page is loaded outside of App Bridge #hack. Proceed with OAuth");
      window.location.pathname = `/api/auth/shopify/login`;
    }
  }, [])

  return <>
    {host && <>
      <ErrorBoundary>
        <PolarisProvider>
          <AppBridgeProvider config={{ apiKey:API_KEY, host, forceRedirect: true }}>
            <SessionProvider>
              <RoutePropagator/>
              <ApolloProvider>
                {children}
              </ApolloProvider>
            </SessionProvider>
          </AppBridgeProvider>
        </PolarisProvider>
      </ErrorBoundary>
    </>}
  </>
}
