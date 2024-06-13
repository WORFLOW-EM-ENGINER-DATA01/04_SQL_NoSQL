# Exercices find

## Première liste d'exercices

1. Trouver tous les restaurants à Brooklyn
```js
db.restaurants.find({ borough: "Brooklyn" })
```

1. Trouver tous les restaurants qui servent de la cuisine américaine :
```js
db.restaurants.find({ cuisine: "American" })
```

1. Trouver tous les restaurants qui ont reçu une note "A" :
```js
db.restaurants.find({ "grades.grade": "A" })
```

1. Trouver tous les restaurants qui ont obtenu un score supérieur à 10 :
```js
db.restaurants.find({ "grades.score": { $gt: 10 } })
```

1. Trouver tous les restaurants qui ont reçu une note "A" avec un score de 5 :
```js
db.restaurants.find({ "grades.grade": "A", "grades.score": 5 })
```

1. Trouver tous les restaurants qui ont une adresse dans la rue "Stillwell Avenue" :
```js
db.restaurants.find({ "address.street": "Stillwell Avenue" })
```

1. Trouver tous les restaurants qui ont été inspectés en 2014 :
```js
db.restaurants.find({ "grades.date": { $gte: ISODate("2014-01-01"), $lt: ISODate("2015-01-01") } })
```

1. Trouver tous les restaurants qui ont obtenu une note "A" après 2010 :
```js
db.restaurants.find({ "grades.grade": "A", "grades.date": { $gte: ISODate("2011-01-01") } })

// avec restriction
db.restaurants.find({ "grades.grade": "A", "grades.date": { $gte: ISODate("2011-01-01") } }, {"grades.date" : 1, "grades.grade" : 1})
```

1. Trouver tous les restaurants qui ont un code postal (zipcode) égal à "11224" :
```js
db.restaurants.find({ "address.zipcode": "11224" })
```

1. Trouver tous les restaurants dont le nom contient le mot "Riviera" :
```js
db.restaurants.find({ name: /Riviera/ })
```

## Deuxième liste d'exercices

1. Trouvez tous les restaurants qui ont reçu une note "A" pour tous leurs grades.
```js
db.restaurant.find({ "grades.grade": { $not: { $nin: ["A"] } } })
```

1. Trouvez tous les restaurants qui ont reçu une note "A" pour au moins un de leurs grades et une note "B" pour au moins un autre grade.
```js
db.restaurants.find({ $and: [{ "grades.grade": "A" }, { "grades.grade": "B" }] })
```

1. Trouvez tous les restaurants qui n'ont jamais reçu une note "C" dans leurs grades.
```js
db.restaurants.find(
    { "grades.grade": { $not: { $eq: "C" } } }, 
    { "grades.grade" :1 }
)
```

1. Trouvez tous les restaurants qui ont reçu une note "A" pour leur dernier grade.
```js
db.restaurants.find(
    { "grades": { $elemMatch: { grade: "A" } } },
     {"grades" : 1, "names" : 1 }
)
```

1. Trouvez tous les restaurants qui ont reçu une note "A" dans leur premier grade et une note "B" dans leur dernier grade.
```js
db.restaurant.find(
    { "grades.0.grade": "A", "grades": { $elemMatch: { grade: "B" } } },
    {"grades" : 1, "names" : 1 }
)
```

1. Trouvez tous les restaurants qui ont reçu une note "A" pour leur premier grade et une note "B" pour leur deuxième grade, mais pas pour leur troisième grade.
```js
db.restaurants.find(
    { "grades.0.grade": "A", "grades.1.grade": "B", "grades.2.grade": { $not: { $eq: "B" } } },
    {"grades" : 1, "names" : 1 }
)
```

1. Trouvez tous les restaurants qui ont reçu une note "A" pour tous leurs grades et dont la somme des scores des grades est supérieure à 30.
```js
db.restaurants.find(
    { "grades.grade": { $not: { $nin: ["A"] } }, $expr: { $gt: [{ $sum: "$grades.score" }, 30] } },
    {"grades" : 1, "names" : 1 }
)
```

1. Trouvez tous les restaurants qui ont reçu une note "A" pour au moins un de leurs grades et dont la moyenne des scores des grades est supérieure à 8.
```js
db.restaurants.find(
    { "grades.grade": "A", $expr: { $gt: [{ $avg: "$grades.score" }, 8] } },
     {"grades" : 1, "names" : 1 }
)
```

1. Trouvez tous les restaurants qui ont reçu une note "A" pour tous leurs grades et dont la différence entre le score de leur premier et dernier grade est supérieure à 5.
```js
db.restaurants.find({ "grades.grade": { $not: { $nin: ["A"] } }, $expr: { $gt: [{ $subtract: [{ $arrayElemAt: ["$grades.score", -1] }, { $arrayElemAt: ["$grades.score", 0] }] }, 5] } }, {"grades" : 1, })
```

## Exercices approfondissement 4/4

Voici les corrections des exercices :

1. **Trouvez tous les restaurants dont le nom commence par "Pizza" en utilisant une expression régulière** :
```javascript
db.restaurant.find({ name: { $regex: /^Pizza/ } })
```

2. **Trouvez tous les restaurants dans un rayon de 5 km d'un point géographique donné (latitude, longitude) en utilisant un index géospatial sur les coordonnées** :
```javascript
// Supposons que vous ayez créé un index géospatial sur le champ "coord" avec la commande db.restaurant.createIndex({ coord: "2dsphere" })
// Supposons également que les coordonnées du point géographique donné sont [longitude, latitude]
db.restaurant.find({
    coord: {
        $near: {
            $geometry: {
                type: "Point",
                coordinates: [longitude, latitude]
            },
            $maxDistance: 5000 // 5 km
        }
    }
})
```

3. **Trouvez tous les restaurants et incluez uniquement les champs `name`, `borough` et `address` dans les résultats** :
```javascript
db.restaurant.find({}, { name: 1, borough: 1, "address.street": 1, _id: 0 })
```

4. **Trouvez tous les restaurants avec un nom contenant "Sushi" et dont le score moyen est supérieur à 7, en utilisant un index textuel pour accélérer la recherche du nom et une opération d'agrégation `$group` suivie d'une opération de filtrage avec `find` pour le calcul du score moyen** :
```javascript
// Supposons que vous ayez créé un index textuel sur le champ "name" avec la commande db.restaurant.createIndex({ name: "text" })
db.restaurant.aggregate([
    { $match: { $text: { $search: "Sushi" } } }, // Filtre avec un index textuel pour trouver les restaurants contenant "Sushi" dans leur nom
    { $group: { _id: "$_id", name: { $first: "$name" }, averageScore: { $avg: { $avg: "$grades.score" } } } }, // Calcule le score moyen pour chaque restaurant
    { $match: { averageScore: { $gt: 7 } } } // Filtre les restaurants avec un score moyen supérieur à 7
])
```
!