import {
  ApolloClient,
  InMemoryCache
} from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.studio.thegraph.com/query/32176/drji/0.1.6",
  cache: new InMemoryCache(),
});

export default client;