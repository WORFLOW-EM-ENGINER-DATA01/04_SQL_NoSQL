# Exercices Supplémentaires pour la Collection `restaurants` dans la Base de Données NY

1. **Trouver les trois types de cuisine les plus populaires dans chaque quartier.**
   ```js

    // étape 1
    db.restaurants.aggregate([
    { $group: { _id: { quartier: "$borough", cuisine: "$cuisine" }, count: { $sum: 1 } } }
    ])

    // étape 2
    db.restaurants.aggregate([
        { $group: { _id: { quartier: "$borough", cuisine: "$cuisine" }, count: { $sum: 1 } } },
        { $sort: { "_id.quartier": 1, count: -1 } },
        { $group: { _id: "$_id.quartier", topCuisines: { $push: { cuisine: "$_id.cuisine", count: "$count" } } } },
        { $project: { topCuisines: { $slice: ["$topCuisines", 3] } } }
    ])
   ```

1. **Calculez le nombre total de grades "C" pour chaque type de cuisine.**
   ```js
   db.restaurants.aggregate([
       { $unwind: "$grades" },
       { $match: { "grades.grade": "C" } },
       { $group: { _id: "$cuisine", total: { $sum: 1 } } }
   ])
   ```

2. **Trouvez les cinq restaurants les mieux notés dans chaque type de cuisine.**
   ```js
    // étape 1
    db.restaurants.aggregate([
    { $unwind: "$grades" },
    { $group: { _id: { cuisine: "$cuisine", restaurant: "$name" }, averageScore: { $avg: "$grades.score" } } }
    ])

    // étape 2
   db.restaurants.aggregate([
       { $unwind: "$grades" },
       { $group: { _id: "$_id", name: { $first: "$name" }, cuisine: { $first: "$cuisine" }, averageScore: { $avg: "$grades.score" } } },
       { $sort: { cuisine: 1, averageScore: -1 } },
       { $group: { _id: "$cuisine", topRestaurants: { $push: { name: "$name", score: "$averageScore" } } } },
       { $project: { topRestaurants: { $slice: ["$topRestaurants", 5] } } }
   ])
   ```

3. **Trouvez les restaurants qui n'ont pas de grades "A".**
   ```js
   db.restaurants.aggregate([
       { $unwind: "$grades" },
       { $match: { "grades.grade": { $ne: "A" } } },
       { $group: { _id: "$_id", name: { $first: "$name" } } },
       { $project: { name: 1, _id: 0 } }
   ])
   ```

4. **Calculez le score total de chaque restaurant et classez-les du plus élevé au plus bas.**
   ```js
   db.restaurants.aggregate([
       { $unwind: "$grades" },
       { $group: { _id: "$_id", name: { $first: "$name" }, totalScore: { $sum: "$grades.score" } } },
       { $sort: { totalScore: -1 } }
   ])
   ```

5. **Trouvez les restaurants dont le nombre de grades est supérieur à la moyenne.**
   ```js
   db.restaurants.aggregate([
       { $project: { numberOfGrades: { $size: "$grades" } } },
       { $group: { _id: null, avgGrades: { $avg: "$numberOfGrades" } } },
       { $lookup: { from: "restaurants", localField: "_id", foreignField: "_id", as: "restaurantData" } },
       { $unwind: "$restaurantData" },
       { $project: { _id: "$restaurantData._id", name: "$restaurantData.name", numberOfGrades: "$restaurantData.numberOfGrades", avgGrades: 1 } },
       { $match: { numberOfGrades: { $gt: "$avgGrades" } } }
   ])
   ```

6. **Calculez la distribution des restaurants selon leur score moyen en intervalles de 5 (0-5, 6-10, 11-15, etc.).**
    ```js
    db.restaurants.aggregate([
        { $unwind: "$grades" },
        { $group: { _id: "$_id", averageScore: { $avg: "$grades.score" } } },
        { $bucket: { groupBy: "$averageScore", boundaries: [0, 5, 10, 15, 20, 25, 30], default: "Other", output: { count: { $sum: 1 } } } }
    ])
    ```