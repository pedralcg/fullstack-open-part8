import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// 1. Definimos el enlace HTTP normal
const httpLink = createHttpLink({
  uri: "http://localhost:4000",
});

// 2. Creamos un middleware que añade el token a los headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("library-user-token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

// 3. Inicializamos el cliente uniendo ambos enlaces
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Primero auth, luego http
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
