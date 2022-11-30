import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {environment} from "../environments/environment";
import {setContext} from "@apollo/client/link/context";
import {onError} from "@apollo/client/link/error";

const uri = 'localhost:4242'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  return {
    link: httpLink.create({uri}),
    cache: new InMemoryCache(),
  };
}

const errorLink = onError(({graphQLErrors, networkError, response}) => {
  // React only on graphql errors
  if (graphQLErrors && graphQLErrors.length > 0) {
    if (
      (graphQLErrors[0] as any)?.statusCode >= 400 &&
      (graphQLErrors[0] as any)?.statusCode < 500
    ) {
      // handle client side error
      console.error(`[Client side error]: ${graphQLErrors[0].message}`);
    } else {
      // handle server side error
      console.error(`[Server side error]: ${graphQLErrors[0].message}`);
    }
  }
  if (networkError) {
    // handle network error
    console.error(`[Network error]: ${networkError.message}`);
  }
});

const basicContext = setContext((_, {headers}) => {
  return {
    headers: {
      ...headers,
      Accept: 'charset=utf-8',
      authorization: `Bearer random token`,
      'Content-Type': 'application/json',
    },
  };
});

export function createDefaultApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const cache = new InMemoryCache({});

  // create http
  const http = httpLink.create({
    uri: 'http://localhost:3001/graphql',
  });

  return {
    connectToDevTools: !environment.production,
    assumeImmutableResults: true,
    cache,
    link: ApolloLink.from([basicContext, errorLink, http]),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
    },
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createDefaultApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
}
