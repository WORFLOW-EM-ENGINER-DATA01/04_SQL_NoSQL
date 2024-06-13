# Corrections aggregate 15/15

1. Calculez le nombre total de restaurants dans la collection.
```js
db.restaurants.aggregate([
    { $group: { _id: null, total: { $sum: 1 } } }
])
```

2. Trouvez le nombre de restaurants dans chaque quartier (borough).
```js
db.restaurants.aggregate([
    { $group: { _id: "$borough", total: { $sum: 1 } } }
])
```

3. Calculez le nombre moyen de grades par restaurant.
```js
db.restaurants.aggregate([
    { $project: { numberOfGrades: { $size: "$grades" } } },
    { $group: { _id: null, averageGrades: { $avg: "$numberOfGrades" } } }
])
```

4. Trouvez le nombre de restaurants ayant obtenu une note "A" dans chaque quartier.
```js
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $match: { "grades.grade": "A" } },
    { $group: { _id: "$borough", total: { $sum: 1 } } }
])
```

5. Calculez le score moyen de chaque restaurant.
```js
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $group: { 
            _id: "$_id", 
            averageScore: { $avg: "$grades.score" } , 
            name : { $addToSet: "$name" } 
        } 
    },
    { $project : { 
        _id : 0,
        averageScore : {$round : ["$averageScore", 2]} ,
        name: {
        $function: {
          body: function(name) {
            return name[0] ?? 'no restaurant name'
          },
          args: ["$name"], // la clé dans le JSON retournée
          lang: "js"
        }
      }
    }
    }
])
```

6. Trouvez les cinq restaurants ayant le plus grand nombre de grades.
```js
db.restaurants.aggregate([
    { $project: { numberOfGrades: { $size: "$grades" } } },
    { $sort: { numberOfGrades: -1 } },
    { $limit: 5 }
])
```

7. Calculez le nombre de restaurants par type de cuisine (cuisine).
```js
db.restaurants.aggregate([
    { $group: { _id: "$cuisine", total: { $sum: 1 } } }
])
```

8. Trouvez le restaurant le mieux noté dans chaque quartier.
```js

db.restaurants.aggregate([
     { $unwind: "$grades" },
     { $group: { 
         _id: { borough: "$borough", name: "$name" }, 
         maxScore: { $max: "$grades.score" } 
     }},
      { $sort: { maxScore: -1 }},
])

db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $group: { 
        _id: { borough: "$borough", name: "$name" }, 
        maxScore: { $max: "$grades.score" } 
    }},
    { $sort: { maxScore: -1 }},
    { $group: {
        _id: "$_id.borough",
        bestRestaurant: { $first: "$_id.name" },
        bestScore: { $first: "$maxScore" }
    }},
    { $project: {
        _id: 1,
        bestRestaurant: 1,
        bestScore: 1
    }}
])
```

1. Calculez le score moyen de chaque type de cuisine (cuisine).
```js
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $group: { _id: "$cuisine", averageScore: { $avg: "$grades.score" } } }
])
```

1.  Trouvez le quartier avec le plus grand nombre total de grades "A".
```js
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $match: { "grades.grade": "A" } },
    { $group: { _id: "$borough", total: { $sum: 1 } } },
    { $sort: { total: -1 } },
    { $limit: 1 }
])
```

1.  Calculez le nombre moyen de grades "A" par restaurant dans chaque quartier.
```js
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $match: { "grades.grade": "A" } },
    { $group: { _id: "$borough", average: { $avg: 1 } } }
])
```

1.  Trouvez les restaurants ayant un score moyen supérieur à 8.
```js
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $group: { _id: "$_id", averageScore: { $avg: "$grades.score" } } },
    { $match: { averageScore: { $gt: 8 } } },
])
```

1.  Calculez le nombre moyen de grades pour chaque type de cuisine (cuisine).
```js
db.restaurants.aggregate([
    { $project: { numberOfGrades: { $size: "$grades" }, cuisine: 1 } },
    { $group: { _id: "$cuisine", averageGrades: { $avg: "$numberOfGrades" } } },
    { $project : { _id : 1, averageGrades : {$round : ["$averageGrades", 2]} }}
])
```

1.  Trouvez le nombre de restaurants ayant plus de 3 grades "B" dans chaque quartier.
```js
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $match: { "grades.grade": "B" } },
    { $group: { _id: "$borough", total: { $sum: 1 } } },
    { $match: { total: { $gt: 3 } } }
])
```

1.  Calculez le score moyen de chaque quartier pour chaque type de cuisine (cuisine).

```js
db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $group: { 
        _id: { borough: "$borough", cuisine: "$cuisine" }, 
        averageScore: { $avg: "$grades.score" } 
    } },
    { $group: { 
        _id: "$_id.borough", 
        cuisineScores: { 
            $push: { 
                cuisine: "$_id.cuisine", 
                averageScore: { $round: ["$averageScore", 2] } // Arrondir le score moyen à deux décimales
            } 
        } 
    } }
])

```
