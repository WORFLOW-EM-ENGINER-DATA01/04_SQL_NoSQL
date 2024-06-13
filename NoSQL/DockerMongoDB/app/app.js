import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');

const url = 'mongodb://root:example@mongo:27017';
const dbName = 'ny';

let db;

MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database');
        db = client.db(dbName);
    })
    .catch(error => console.error(error));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/restaurants', (req, res) => {
    const borough = req.query.borough;
    db.collection('restaurants').aggregate([
        { $match: { borough: borough } },
        { $unwind: "$grades" },
        { $group: { _id: "$name", averageScore: { $avg: "$grades.score" } } },
        { $sort: { averageScore: -1 } },
        { $limit: 5 }
    ]).toArray()
    .then(results => {
        res.render('restaurants', { borough: borough, restaurants: results });
    })
    .catch(err => {
        res.send(err);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});