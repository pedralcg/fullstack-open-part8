import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";

const Recommendations = ({ show }) => {
  const userResult = useQuery(ME);
  const booksResult = useQuery(ALL_BOOKS);

  if (!show) return null;

  // Manejo de carga de ambas consultas
  if (userResult.loading || booksResult.loading) {
    return <div>loading...</div>;
  }

  const user = userResult.data.me;
  const books = booksResult.data.allBooks;

  // Filtrado en React usando el género favorito del usuario
  const recommendedBooks = books.filter((b) =>
    b.genres.includes(user.favoriteGenre)
  );

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{user.favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommendations;
