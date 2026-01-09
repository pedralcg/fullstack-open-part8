import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genre, setGenre] = useState("all genres");

  // Usamos la propiedad 'variables' para filtrar desde el servidor
  const result = useQuery(ALL_BOOKS, {
    variables: { genre: genre === "all genres" ? undefined : genre },
  });

  // Necesitamos obtener la lista completa una vez para saber qué botones de género mostrar
  const allBooksResult = useQuery(ALL_BOOKS);

  if (!props.show) return null;
  if (result.loading || allBooksResult.loading) return <div>loading...</div>;

  const booksToShow = result.data.allBooks;
  const allBooks = allBooksResult.data.allBooks;

  // Extraemos géneros de la lista completa para los botones
  const genres = ["all genres", ...new Set(allBooks.flatMap((b) => b.genres))];

  return (
    <div>
      <h2>books</h2>
      <p>
        in genre <strong>{genre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Renderizar botones para cada género */}
      <div>
        {genres.map((g) => (
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Books;
