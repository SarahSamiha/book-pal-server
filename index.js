const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tsr7owr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        // collections
        const categoryCollection = client.db('bookPalDB').collection('categories');
        const bookCollection = client.db('bookPalDB').collection('books');

        // categories
        app.get('/categories', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/categories/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoryCollection.findOne(query);
            res.send(result);
        })

        // books
        app.get('/books', async (req, res) => {
            let query = {};
            if (req.query?.categoryName) {
                query = { categoryName: req.query.categoryName }
            }
            const result = await bookCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/books', async (req, res) => {
            const newBook = req.body;
            console.log(newBook);
            const result = await bookCollection.insertOne(newBook);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('BookPal is running');
})

app.listen(port, () => {
    console.log(`BookPal is running on port: ${port}`)
})