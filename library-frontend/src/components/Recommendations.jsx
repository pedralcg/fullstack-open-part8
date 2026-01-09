import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";

const Recommendations = ({ show }) => {
  const userResult = useQuery(ME);

  // Obtenemos el género favorito si la consulta de usuario terminó
  const favoriteGenre = userResult.data?.me?.favoriteGenre;

  // Realizamos la consulta de libros filtrada por el género favorito del servidor
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genre: favoriteGenre },
    skip: !favoriteGenre, // No ejecuta la consulta hasta tener el género
    fetchPolicy: "cache-and-network", // Asegura datos frescos tras agregar libros
  });

  if (!show) return null;

  // Manejo de carga de ambas consultas
  if (userResult.loading || booksResult.loading) {
    return <div>loading...</div>;
  }

  // Manejo de caso donde el usuario no tiene género favorito o no está logueado
  if (!userResult.data?.me) {
    return <div>please log in to see recommendations</div>;
  }

  const booksToShow = booksResult.data.allBooks;

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
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
    </div>
  );
};

export default Recommendations;
