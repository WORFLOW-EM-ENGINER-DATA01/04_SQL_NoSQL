# Collection de départ students

Supposons que vous avez la collection `students` suivante qui enregistre les scores des étudiants dans différents examens :

```js
const students = 
[
    {
        "_id": 1,
        "name": "John Doe",
        "scores": [
            {"subject": "math", "score": 88},
            {"subject": "english", "score": 76},
            {"subject": "science", "score": 91}
        ]
    },
    {
        "_id": 2,
        "name": "Jane Smith",
        "scores": [
            {"subject": "math", "score": 92},
            {"subject": "english", "score": 81},
            {"subject": "science", "score": 89}
        ]
    },
    {
        "_id": 3,
        "name": "Alice Brown",
        "scores": [
            {"subject": "math", "score": 84},
            {"subject": "english", "score": 85},
            {"subject": "science", "score": 88}
        ]
    },
    {
        "_id": 4,
        "name": "Bob Johnson",
        "scores": [
            {"subject": "math", "score": 78},
            {"subject": "english", "score": 74},
            {"subject": "science", "score": 80}
        ]
    }
]
```

- Créez la collection dans la base de données school.

## Questions 

Vous devez utiliser une agrégation pour :

1. Décomposer les documents `students` en fonction des éléments du tableau `scores`.
2. Calculer la moyenne des scores pour chaque étudiant.
3. Calculer l'écart-type des scores pour chaque étudiant.
4. Déterminer le rang de chaque étudiant basé sur leur score moyen.
5. Trier les résultats par score moyen en ordre décroissant et inclure le rang.
