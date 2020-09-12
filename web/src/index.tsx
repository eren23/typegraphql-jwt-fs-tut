import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "@apollo/react-hooks"
import { App } from './App';
import { getAccessToken } from './accessToken';

const client: any = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  credentials: "include",
  request: (operation) => {
    const accessToken = getAccessToken()
    if (accessToken) {
      operation.setContext({
        headers: {
          authorization: `bearer ${accessToken}`
        }
      })
    }

  }
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client} >
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

