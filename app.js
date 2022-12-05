const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const cors = require('cors');
const { graphqlHTTP } = require('express-graphql');
const authorSchema = require('./models/author');
const bookSchema = require('./models/book');
// authorSchema.deleteMany().then((res) => console.log(res));
// bookSchema.deleteMany().then((res) => console.log(res));
//allow cross-origin requests
require('dotenv').config();
app.use(cors());
//  connect to mongdb  with credentiels
mongoose
	.connect(`mongodb+srv://${process.env.USER_MONGO}:${process.env.MDP}@cluster0.ptp5m.mongodb.net/dbyounes`)
	.then((data) => {
		console.log(data.connection.models.Author);
	});
//
mongoose.connection.once('open', (data) => {
	console.log('connected to db ');
});
const schema = require('./schema/schema');
const author = require('./models/author');
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/index.html'));
}); //enable graphql schema  on node server
app.use(
	'/',
	graphqlHTTP({
		schema,
		graphiql: true
	})
);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log('listening to port ', PORT, process.env.USER, process.env.MDP));
