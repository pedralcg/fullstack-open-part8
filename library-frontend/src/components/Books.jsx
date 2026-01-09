import { useState } from "react";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genre, setGenre] = useState("all genres");
  const result = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  }

  if (result.loading) {
    return <div>loading...</div>;
  }

  const books = result.data.allBooks;

  // Extraer todos los géneros únicos de todos los libros
  const genres = ["all genres", ...new Set(books.flatMap((b) => b.genres))];

  // Filtrar la lista basada en el estado 'genre'
  const booksToShow =
    genre === "all genres"
      ? books
      : books.filter((b) => b.genres.includes(genre));

  return (
    <div>
      <h2>books</h2>
      {genre !== "all genres" && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}

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
