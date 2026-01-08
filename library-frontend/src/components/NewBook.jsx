import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_BOOK, ALL_BOOKS, ALL_AUTHORS } from "../queries";

const NewBook = (props) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [published, setPublished] = useState("");
  const [genre, setGenre] = useState("");
  const [genres, setGenres] = useState([]);

  // Hook de mutación con actualización de caché automática
  const [addBook] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: ALL_BOOKS }, { query: ALL_AUTHORS }],
    onError: (error) => {
      // Verificamos si existen errores de GraphQL específicos (como validación de Mongoose)
      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        console.log(error.graphQLErrors[0].message);
      } else {
        // Si es un error de red o un 400 Bad Request genérico (como falta de token)
        console.log(error.message);
      }
    },
  });

  if (!props.show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    // Llamamos a la función de la mutación pasando las variables
    addBook({
      variables: { title, author, published: parseInt(published), genres },
    });

    setTitle("");
    setPublished("");
    setAuthor("");
    setGenres([]);
    setGenre("");
  };

  const addGenre = () => {
    setGenres(genres.concat(genre));
    setGenre("");
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          title
          <input
            value={title}
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author
          <input
            value={author}
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          published
          <input
            type="number"
            value={published}
            onChange={({ target }) => setPublished(target.value)}
          />
        </div>
        <div>
          <input
            value={genre}
            onChange={({ target }) => setGenre(target.value)}
          />
          <button onClick={addGenre} type="button">
            add genre
          </button>
        </div>
        <div>genres: {genres.join(" ")}</div>
        <button type="submit">create book</button>
      </form>
    </div>
  );
};

export default NewBook;
