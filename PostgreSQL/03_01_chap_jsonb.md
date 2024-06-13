# SQL

## 1. Créer une table avec une colonne JSONB

```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    data JSONB
);
```

## 2. Insérer des données JSON

```sql
INSERT INTO products (data) VALUES 
('{
    "name": "Smartphone XYZ",
    "brand": "BrandA",
    "price": 299.99,
    "specs": {
        "screen_size": "6 inches",
        "battery": "4000mAh",
        "storage": "64GB"
    },
    "availability": true
}'),
('{
    "name": "Laptop ABC",
    "brand": "BrandB",
    "price": 999.99,
    "specs": {
        "screen_size": "15 inches",
        "battery": "5000mAh",
        "storage": "256GB"
    },
    "availability": false
}');
```

## 3. Requêtes avancées utilisant les concepts NoSQL

## a. Sélectionner tous les produits

```sql
SELECT * FROM products;
```

## b. Sélectionner des produits en fonction d'un champ JSON

Pour sélectionner tous les produits disponibles :

```sql
SELECT * FROM products
WHERE data ->> 'availability' = 'true';
```

## c. Accéder à des valeurs spécifiques dans les champs JSON imbriqués

Pour sélectionner les noms des produits avec leur prix :

```sql
SELECT data ->> 'name' AS product_name, data ->> 'price' AS price
FROM products;
```

## d. Utiliser des filtres sur des valeurs dans des objets JSON imbriqués

1. Exercice sélectionner des produits ayant une taille d'écran spécifique à l'aide de l'opérateur  #>>


Indications: #> est utilisé pour extraire des sous-objets JSON, tandis que #>> est utilisé pour extraire des valeurs scalaires à partir de ces sous-objets ou d'un tableau JSON.

## e. Mettre à jour des valeurs JSON

Pour mettre à jour le prix d'un produit :

```sql
UPDATE products
SET data = jsonb_set(data, '{price}', '1099.99')
WHERE data ->> 'name' = 'Laptop ABC';
```

## f. Ajouter une nouvelle clé dans l'objet JSON

Pour ajouter une nouvelle clé "color" avec la valeur "black" :

```sql
UPDATE products
SET data = jsonb_set(data, '{color}', '"black"')
WHERE data ->> 'name' = 'Smartphone XYZ';
```

## 4. Utilisation des opérateurs JSONB pour manipuler les données

## a. Suppression d'une clé dans un objet JSONB

Pour supprimer la clé "availability" de tous les produits :

```sql
UPDATE products
SET data = data - 'availability';
```

## b. Fusionner des objets JSONB

Pour ajouter ou mettre à jour des informations dans un objet JSONB en fusionnant deux objets JSONB :

```sql
UPDATE products
SET data = data || '{"new_key": "new_value", "price": 349.99}'::jsonb
WHERE data ->> 'name' = 'Smartphone XYZ';
```

Indication : l'opérateur `::jsonb` est utilisé pour convertir la chaîne JSON en type JSONB. Cela indique explicitement au moteur PostgreSQL de traiter la chaîne JSON comme un type JSONB.

## 5. Utilisation des fonctions d'agrégation et de regroupement

## a. Compter le nombre de produits par marque

1. Exercice compter le nombre de produits pour chaque marque :


## b. Calculer le prix moyen des produits par marque

Calculer le prix moyen des produits pour chaque marque.

## 6. Indexation des données JSONB

## a. Créer un index sur une clé spécifique

Pour accélérer les recherches sur la clé "brand" :

```sql
CREATE INDEX idx_products_brand ON products USING GIN ((data ->> 'brand'));
```

## b. Créer un index sur une clé imbriquée

Pour accélérer les recherches sur une clé imbriquée comme "specs.screen_size" :

```sql
CREATE INDEX idx_products_screen_size ON products USING GIN ((data #>> '{specs, screen_size}'));
```

Indication : Generalized Inverted Index GIN.

## 7. Utiliser des expressions JSON pour des calculs complexes

## a. Extraire des valeurs numériques et effectuer des calculs

1. Exercice calculer le prix total des produits disponibles.


## b. Requête imbriquée pour filtrer et transformer des données JSON

Sélectionner les produits avec des tailles d'écran spécifiques et les transformer en une liste JSON :


## 8. Fonctions utilisateur personnalisées

## a. Créer une fonction pour rechercher des produits par un critère dynamique

Pour créer une fonction permettant de rechercher des produits par une clé et une valeur dynamiques :

```sql
CREATE OR REPLACE FUNCTION search_products(key TEXT, value TEXT)
RETURNS TABLE(id INT, data JSONB) AS $$
BEGIN
    RETURN QUERY
    SELECT id, data
    FROM products
    WHERE data ->> key = value;
END;
$$ LANGUAGE plpgsql;
```

1. Exercice utilisez la fonction `search_products` pour rechercher des produits de la marque "BrandA" :

## 9. Travailler avec des tableaux JSON

## a. Sélectionner des produits avec des caractéristiques spécifiques dans un tableau JSON

Supposons que chaque produit ait une liste de tags sous la clé "tags" :

```sql
UPDATE products
SET data = jsonb_set(data, '{tags}', '["new", "promotion"]')
WHERE data ->> 'name' = 'Smartphone XYZ';
```

1. Exercice sélectionner les produits ayant le tag "promotion" @>

Indication : L'opérateur @> est utilisé dans PostgreSQL pour vérifier si un objet JSON ou un tableau JSON contient un autre objet JSON ou un sous-ensemble de valeurs

## 10. Utilisation des requêtes JSONB Path

## a. Interroger les données JSONB en utilisant JSONPath

1. Exercice sélectionner les produits avec une capacité de batterie supérieure à 4000mAh à l'aide de l'opérateur @? 

Indication: L'opérateur @? est utilisé dans PostgreSQL pour effectuer une recherche de correspondance sur une expression JSON ou JSONB en utilisant JSONPath

## b. Utilisation de JSONPath pour trouver des tableaux imbriqués

1. Exercice sélectionner les produits qui ont le tag "new" :

## 11. Indexation avancée des données JSONB

## a. Créer des index d'expression

Pour créer un index sur une expression JSONB, comme le prix :

```sql
CREATE INDEX idx_products_price ON products (((data ->> 'price')::numeric));
```

## b. Indexation partielle

Pour créer un index uniquement pour les produits disponibles :

```sql
CREATE INDEX idx_available_products ON products
USING GIN (data)
WHERE data ->> 'availability' = 'true';
```

## 12. Contenu et existence JSONB

## a. Vérifier si JSONB contient une paire clé-valeur spécifique

1. Exercice sélectionner des produits qui contiennent une paire clé-valeur spécifique, comme avoir un stockage spécifique.


## b. Vérifier l'existence d'une clé

1. Exercice sélectionner les produits qui ont la clé "color" à l'aide de l'opérateur ?

## 13. Opérations de mise à jour JSONB

## a. Ajouter à des tableaux JSONB

Pour ajouter un nouveau tag au tableau des tags d'un produit :

```sql
UPDATE products
SET data = jsonb_set(data, '{tags}', (data->'tags')::jsonb || '"featured"')
WHERE data ->> 'name' = 'Smartphone XYZ';
```

## b. Supprimer un élément d'un tableau JSONB

Pour supprimer un tag du tableau des tags à l'aide de l'opérateur #-

```sql
UPDATE products
SET data = data #- '{tags,0}'
WHERE data ->> 'name' = 'Smartphone XYZ';
```

Indication: en PostgreSQL, l'opérateur #- est utilisé pour manipuler des types de données JSON. Plus précisément, il est utilisé pour supprimer une clé d'un objet JSON.

## 14. Fonctions et opérateurs JSONB

## a. Extraire et transformer des données JSONB

Pour extraire des données JSON imbriquées et les transformer en un format plus utilisable, comme convertir des objets JSON imbriqués en lignes de table :

```sql
SELECT jsonb_each_text(data -> 'specs')
FROM products;
```

## b. Agréger des données JSONB

Pour agréger des données JSONB, comme créer une liste de tous les noms de produits :

```sql
SELECT jsonb_agg(data ->> 'name') AS product_names
FROM products;
```

## 15. JSONB dans les expressions de table communes (CTE)

Utilisation des CTE pour travailler avec des données JSONB pour des requêtes complexes.

## a. Extraire et filtrer des données JSONB dans un CTE

Une Expression de Table Commune (CTE) est une requête nommée temporairement qui peut être référencée au sein de la requête principale. 

Les CTE sont définies à l'aide du mot-clé WITH.

Pour extraire des produits avec une taille d'écran spécifique et calculer leur prix moyen :

```sql
WITH filtered_products AS (
    SELECT data
    FROM products
    WHERE data #>> '{specs, screen_size}' = '6 inches'
)
SELECT AVG((data ->> 'price')::numeric) AS avg_price
FROM filtered_products;
```

## 16. JSONB et fonctions de fenêtre

Combiner JSONB avec des fonctions de fenêtre pour des analyses avancées.

### a. Classer les produits en fonction du prix au sein de chaque marque

Pour classer les produits par prix au sein de chaque marque :

```sql
SELECT data ->> 'name' AS product_name, 
       data ->> 'brand' AS brand,
       data ->> 'price' AS price,
       RANK() OVER (PARTITION BY data ->> 'brand' ORDER BY (data ->> 'price')::numeric DESC) AS price_rank
FROM products;
```

## 17. JSONB et requêtes récursives

Utilisation des requêtes récursives avec des données JSONB.

### a. Expansion de données JSONB hiérarchiques

Pour étendre et travailler avec des données JSONB hiérarchiques, comme un arbre de catégories :

```sql
WITH RECURSIVE category_tree AS (
    SELECT id, data
    FROM products
    WHERE data @> '{"category": "root"}'
    UNION ALL
    SELECT p.id, p.data
    FROM products p
    JOIN category_tree ct ON p.data ->> 'parent_id' = ct.data ->> 'id'
)
SELECT * FROM category_tree;
```
