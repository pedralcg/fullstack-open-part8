import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import LoginForm from "./components/LoginForm";
import Recommendations from "./components/Recommendations";
import { useApolloClient, useSubscription } from "@apollo/client";
import { BOOK_ADDED, ALL_BOOKS } from "./queries";
import { updateCache } from "./cacheHelpers";

const App = () => {
  const [token, setToken] = useState(() => {
    // Esta función solo se ejecuta una vez al montar el componente
    return localStorage.getItem("library-user-token");
  });

  const [page, setPage] = useState("authors");
  const client = useApolloClient();

  const logout = () => {
    setToken(null);
    localStorage.clear();
    client.resetStore();
    setPage("authors");
  };

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded;
      window.alert(`Nuevo libro añadido: ${addedBook.title}`);

      // ACTUALIZACIÓN DE LA CACHÉ
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook);
    },
  });

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token ? (
          <>
            <button onClick={() => setPage("recommend")}>recommend</button>
            <button onClick={() => setPage("add")}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        ) : (
          <button onClick={() => setPage("login")}>login</button>
        )}
      </div>

      <Authors show={page === "authors"} token={token} />
      <Books show={page === "books"} />
      <Recommendations show={page === "recommend"} />
      <NewBook show={page === "add"} />
      <LoginForm
        show={page === "login"}
        setToken={(token) => {
          setToken(token);
          setPage("authors");
        }}
      />
    </div>
  );
};

export default App;
