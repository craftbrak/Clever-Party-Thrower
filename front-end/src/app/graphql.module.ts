import {EventEmitter, NgModule} from '@angular/core';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {environment} from "../environments/environment";
import {setContext} from "@apollo/client/link/context";
import {onError} from "@apollo/client/link/error";
import {AuthService} from "./auth/auth.service";

const uri = 'http://localhost:4242/graphql'; // <-- add the URL of the GraphQL server here
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
let token

export function createDefaultApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const cache = new InMemoryCache({});
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8',
    },
  }));
  const auth = setContext((operation, context) => {
    const token = askForTokens();
    // const token = localStorage.getItem('authtoken');

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `JWT ${token}`,
        },
      };
    }
  });
  const link = ApolloLink.from([basic, auth, httpLink.create({uri})]);
  // create http

  return {
    connectToDevTools: !environment.production,
    assumeImmutableResults: true,
    cache: cache,
    link: ApolloLink.from([errorLink, link]),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
    },
  };
}

async function askForTokens() {
  const emiter = new EventEmitter()
  emiter.emit('verifyTokens')
  window.addEventListener('tokensSet', retrieveTokens)
  return
}

function retrieveTokens() {

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
  constructor(private authService: AuthService) {
  }

}
