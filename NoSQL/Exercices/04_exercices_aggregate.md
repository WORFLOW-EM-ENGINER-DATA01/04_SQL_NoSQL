# Aggrégation pipelines

## Collection de départ

Supposons que vous avez la collection `sales` suivante :

```js
const sales = 
[
    {
        "store": "Store A",
        "date": ISODate("2023-06-01T00:00:00Z"),
        "items": [
            {"category": "fruit", "product": "apple", "quantity": 10, "price": 1.2},
            {"category": "fruit", "product": "banana", "quantity": 5, "price": 0.8},
            {"category": "beverage", "product": "orange juice", "quantity": 8, "price": 2.5}
        ]
    },
    {
        "store": "Store A",
        "date": ISODate("2023-06-05T00:00:00Z"),
        "items": [
            {"category": "fruit", "product": "grape", "quantity": 3, "price": 2.0},
            {"category": "beverage", "product": "watermelon juice", "quantity": 1, "price": 4.5}
        ]
    },
    {
        "store": "Store B",
        "date": ISODate("2023-06-10T00:00:00Z"),
        "items": [
            {"category": "fruit", "product": "orange", "quantity": 20, "price": 1.5},
            {"category": "beverage", "product": "apple juice", "quantity": 10, "price": 3.0}
        ]
    },
    {
        "store": "Store B",
        "date": ISODate("2023-06-15T00:00:00Z"),
        "items": [
            {"category": "fruit", "product": "banana", "quantity": 7, "price": 0.8},
            {"category": "beverage", "product": "grape juice", "quantity": 5, "price": 3.5}
        ]
    }
]
```

- Créez la collections dans une base de données shop.

## Questions

Vous devez utiliser une agrégation pour :

1. Décomposer les documents `sales` en fonction des éléments du tableau `items`.
2. Calculer le total des ventes (quantité * prix) par produit pour chaque magasin.
3. Calculer le total des ventes par catégorie de produit pour chaque magasin.
4. Calculer le total des ventes globales par magasin.
5. Trier les magasins par montant total des ventes en ordre décroissant.
