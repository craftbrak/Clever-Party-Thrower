import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {HttpLink} from 'apollo-angular/http';
import {ApolloLink, InMemoryCache} from '@apollo/client/core';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';

// const uri = `https://${window.location.hostname}/api/config`;
const uri = `https://cpt.louisdewilde.be/api/config`;
console.log(uri)

export async function fetchApiUrl() {
  const response = await fetch(uri);
  return await response.json();
}

export function createApollo(httpLink: HttpLink) {
  const uriPromise = fetchApiUrl();
  const authLink = setContext(async (_, {headers}) => {
    const uri2 = (await uriPromise)?.apiUrl ?? "";
    const accessToken = localStorage.getItem('accessToken');
    return {
      uri2,
      headers: {
        ...headers,
        authorization: accessToken ? `Bearer ${accessToken}` : '',
      },
    };
  });

  const loggingLink = new ApolloLink((operation, forward) => {
    console.log(`GraphQL Request: ${operation.operationName}`, operation);

    return forward(operation).map((result) => {
      console.log(`GraphQL Response: ${operation.operationName}`, result);
      return result;
    });
  });

  const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({message}) =>
        console.error(`[GraphQL error]: ${message}`)
      );

    if (networkError) console.error(`[Network error]: ${networkError}`);
  });

  return {
    link: ApolloLink.from([
      loggingLink,
      errorLink,
      authLink,
    ]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [HttpClientModule, ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {
}
