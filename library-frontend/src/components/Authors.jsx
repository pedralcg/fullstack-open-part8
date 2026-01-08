import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import Select from "react-select";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";

const Authors = (props) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [born, setBorn] = useState("");

  const result = useQuery(ALL_AUTHORS);

  // Implementación de la mutación
  const [changeBorn] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  // Si la pestaña no es la de autores, no renderizamos nada
  if (!props.show) {
    return null;
  }

  // Gestión de estados de la petición
  if (result.loading) {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  // Transformamos los autores para el select
  const options = authors.map((a) => ({
    value: a.name,
    label: a.name,
  }));

  const submit = async (event) => {
    event.preventDefault();

    // Evita que la app se rompa si no hay autor o año
    if (!selectedOption || !born) {
      console.log("Please select an author and provide a birth year");
      return;
    }

    changeBorn({
      variables: {
        name: selectedOption.value,
        setBornTo: parseInt(born),
      },
    });

    // Devolvemos los estados a su valor inicial
    setBorn("");
    setSelectedOption(null);
  };

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.token && (
        <div>
          <h3>Set birthyear</h3>
          <form onSubmit={submit}>
            <div style={{ marginBottom: "10px", width: "300px" }}>
              <Select
                value={selectedOption}
                onChange={setSelectedOption}
                options={options}
                placeholder="Select author..."
              />
            </div>
            <div>
              born
              <input
                type="number"
                value={born}
                onChange={({ target }) => setBorn(target.value)}
              />
            </div>
            <button type="submit">update author</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Authors;
