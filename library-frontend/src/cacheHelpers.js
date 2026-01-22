// Función auxiliar para eliminar duplicados por título
export const uniqByName = (a) => {
  let seen = new Set();
  return a.filter((item) => {
    let k = item.title;
    return seen.has(k) ? false : seen.add(k);
  });
};

// Función para actualizar la caché de ALL_BOOKS
export const updateCache = (cache, query, addedBook) => {
  cache.updateQuery(query, (data) => {
    if (!data) return;
    return {
      allBooks: uniqByName(data.allBooks.concat(addedBook)),
    };
  });
};
