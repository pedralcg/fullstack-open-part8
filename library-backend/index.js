const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");

const Author = require("./models/author");
const Book = require("./models/book");

const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.set("strictQuery", false);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("✅ connected to MongoDB");
  })
  .catch((error) => {
    console.log("❌ error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type Book {
    title: String!
    published: Int!
    author: Author! # Ahora devuelve el objeto Author completo
    id: ID!
    genres: [String!]!
  }

  type Author {
  name: String!
  id: ID!
  born: Int
  bookCount: Int!
}

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      const query = {};
      if (args.genre) {
        query.genres = { $in: [args.genre] };
      }
      // El enunciado dice que el parámetro 'author' no es necesario todavía
      return Book.find(query);
    },
  },

  Author: {
    bookCount: async (root) => {
      // 'root' es el autor que se está procesando
      // Contamos cuántos libros tienen su ID en el campo 'author'
      return Book.find({ author: root._id }).countDocuments();
    },
  },

  Book: {
    // Como en la BD 'author' es un ID, buscamos el objeto Author
    author: async (root) => {
      return Author.findById(root.author);
    },
  },

  Mutation: {
    addBook: async (root, args) => {
      // 1. Buscamos si el autor ya existe por su nombre
      let author = await Author.findOne({ name: args.author });
      // 2. Si no existe, lo creamos
      if (!author) {
        author = new Author({ name: args.author });
        await author.save();
      }
      // 3. Creamos el libro usando el ID del autor encontrado/creado
      const book = new Book({ ...args, author: author._id });
      return book.save();
    },

    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      return author.save();
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
