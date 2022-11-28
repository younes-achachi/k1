const graphql = require('graphql');
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLNonNull, GraphQLID, GraphQLInt, GraphQLList } = graphql;
const Author = require('../models/author');
const Book = require('../models/book');
const _ = require('lodash');
const book = require('../models/book');
const author = require('../models/author');
var books = [
	{ name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
	{ name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '1' },
	{ name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '2' },
	{ name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '2' },
	{ name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '3' },
	{ name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' }
];

var authors = [
	{ name: 'Patrick Rothfuss', age: 44, authorId: '1', id: '1' },
	{ name: 'Brandon Sanderson', age: 42, authorId: '2', id: '2' },
	{ name: 'Terry Pratchett', age: 66, authorId: '3', id: '3' }
];
const AuthorType = new GraphQLObjectType({
	name: 'Author',
	fields: () => ({
		authorId: { type: GraphQLString },
		name: { type: GraphQLString },
		age: { type: GraphQLInt },
		books: {
			type: new GraphQLList(BookType),
			resolve(parent, args) {
				// return _.filter(books, { id: parrent.authorId });
				return Book.find({ authorId: parent.authorId });
			}
		}
	})
});
const BookType = new GraphQLObjectType({
	name: 'Book',
	fields: () => ({
		authorId: { type: GraphQLString },

		name: { type: GraphQLString },
		genre: { type: GraphQLString },

		author: {
			type: AuthorType,
			resolve(parent, args) {
				console.log(parent);
				// return _.find(authors, { authorId: parrent.authorId });
				return Author.findOne({ authorId: parent.authorId });
			}
		}
	})
});

const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: () => ({
		book: {
			type: new GraphQLList(BookType),
			args: {
				id: {
					type: GraphQLString
				},
				authorId: {
					type: GraphQLString
				}
			},
			resolve(parent, args) {
				return Book.find({ authorId: args.authorId });
			}
		},
		author: {
			type: new GraphQLList(AuthorType),
			args: { authorId: { type: GraphQLString } },
			resolve(parent, args) {
				console.log(parent, ' rt');
				return Author.find({ authorId: args.authorId });
			}
		},
		books: {
			type: new GraphQLList(BookType),
			resolve() {
				return Book.find({});
			}
		},
		authors: {
			type: new GraphQLList(AuthorType),
			resolve() {
				return Author.find({});
			}
		}
	})
});
const Mutation = new GraphQLObjectType({
	name: 'Mutation',
	fields: {
		addBook: {
			type: BookType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				genre: { type: new GraphQLNonNull(GraphQLString) },
				authorId: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parent, args) {
				const book = new Book({
					name: args.name,
					genre: args.genre,
					authorId: args.authorId
				});
				return book.save();
			}
		},
		addAuthor: {
			type: AuthorType,
			args: {
				name: { type: new GraphQLNonNull(GraphQLString) },
				age: { type: new GraphQLNonNull(GraphQLInt) },
				authorId: { type: new GraphQLNonNull(GraphQLID) }
			},
			resolve(parrent, args) {
				let author = new Author({
					name: args.name,
					age: args.age,
					authorId: args.authorId
				});
				const d = author.save();
				console.log(
					d.then((d) => {
						console.log(d);
					})
				);
				return d;
			}
		}
	}
});
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation
});
