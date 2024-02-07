// src/lib/client.ts
'use client';

import { HttpLink, InMemoryCache, ApolloLink } from '@apollo/client';
import {
  NextSSRApolloClient,
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  SSRMultipartLink
} from '@apollo/experimental-nextjs-app-support/ssr';
const STRAPI_URL =
  process.env.STRAPI_URL || 'http://todo-api-production-c166.up.railway.app';

function makeClient() {
  const httpLink = new HttpLink({
    uri: `${STRAPI_URL}/graphql`
  });

  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache(),
    link:
      typeof window === 'undefined'
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true
            }),
            httpLink
          ])
        : httpLink
  });
}

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
