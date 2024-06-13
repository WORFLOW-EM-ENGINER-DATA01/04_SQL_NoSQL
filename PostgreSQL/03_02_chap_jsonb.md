# Approfondissement Postgres 

## 1. JSONB avec recherche en texte intégral

Intégrer les données JSONB avec les capacités de recherche en texte intégral de PostgreSQL.

### a. Créer un index de recherche en texte intégral sur les données JSONB

Pour créer un index de recherche en texte intégral sur les noms et descriptions de produits :

```sql
CREATE INDEX idx_products_fulltext ON products
USING GIN (to_tsvector('english', data ->> 'name' || ' ' || data ->> 'description'));
```

### b. Effectuer des requêtes de recherche en texte intégral

Pour rechercher des produits correspondant à une requête de recherche en texte intégral.

En PostgreSQL, l'opérateur @@ est utilisé pour les recherches en texte intégral (full-text search). Cet opérateur permet de vérifier si une requête de recherche en texte intégral correspond à un document en texte intégral.

```sql
SELECT * FROM products
WHERE to_tsvector('english', data ->> 'name' || ' ' || data ->> 'description') @@ to_tsquery('smartphone');
```

## 2. JSONB avec fonctions PL/pgSQL

### a. Créer une fonction PL/pgSQL pour mettre à jour des données JSONB imbriquées

Pour créer une fonction qui met à jour un champ spécifique dans un objet JSONB imbriqué :

```sql
CREATE OR REPLACE FUNCTION update_product_spec(product_id INT, spec_key TEXT, spec_value TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE products
    SET data = jsonb_set(data, '{specs,' || spec_key || '}', to_jsonb(spec_value))
    WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;
```

Utilisation de la fonction pour mettre à jour la spécification de la batterie d'un produit :

```sql
SELECT update_product_spec(1, 'battery', '4500mAh');
```

### b. Créer une fonction PL/pgSQL pour extraire des valeurs JSONB imbriquées

Pour créer une fonction qui extrait une valeur imbriquée des données JSONB :

```sql
CREATE OR REPLACE FUNCTION get_product_spec(product_id INT, spec_key TEXT)
RETURNS TEXT AS $$
DECLARE
    spec_value TEXT;
BEGIN
    SELECT data #>> '{specs,' || spec_key || '}'
    INTO spec_value
    FROM products
    WHERE id = product_id;

    RETURN spec_value;
END;
$$ LANGUAGE plpgsql;
```

Utilisation de la fonction pour obtenir la spécification de stockage d'un produit :

```sql
SELECT get_product_spec(1, 'storage');
```

## 3. JSONB avec jointures latérales

Utilisation des jointures latérales pour travailler avec des tableaux et objets JSONB.

### a. Expansion des tableaux JSONB avec des jointures latérales

Pour étendre un tableau de tags en lignes individuelles :

```sql
SELECT p.id, p.data, tag
FROM products p,
LATERAL jsonb_array_elements_text(p.data -> 'tags') AS tag;
```

## 4. Transformation des données JSONB

### a. Transformation d'objets JSONB en tables relationnelles

Pour transformer des objets JSONB imbriqués en format de table relationnelle :

```sql
SELECT id, 
       data ->> 'name' AS product_name, 
       data ->> 'brand' AS brand, 
       (data -> 'specs') ->> 'screen_size' AS screen_size,
       (data -> 'specs') ->> 'battery' AS battery,
       (data -> 'specs') ->> 'storage' AS storage
FROM products;
```

### b. Agréger des données relationnelles en objets JSONB imbriqués

Pour agréger des données relationnelles en format JSONB :

```sql
SELECT jsonb_build_object(
           'brand', data ->> 'brand',
           'products', jsonb_agg(data - 'brand')
       ) AS brand_products
FROM products
GROUP BY data ->> 'brand';
```

## 5. JSONB avec des déclencheurs

Utilisation des déclencheurs pour appliquer des contraintes ou modifier automatiquement des données JSONB.

### a. Créer un déclencheur pour appliquer une contrainte sur les données JSONB

Pour créer un déclencheur qui assure que le champ "price" est toujours un nombre positif :

```sql
CREATE OR REPLACE FUNCTION check_price() 
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.data ->> 'price' IS NULL OR (NEW.data ->> 'price')::numeric <= 0 THEN
        RAISE EXCEPTION 'Price must be a positive number';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_price
BEFORE INSERT OR UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION check_price();
```

### b. Créer un déclencheur pour mettre à jour automatiquement les données JSONB

Pour créer un déclencheur qui ajoute un timestamp chaque fois qu'un produit est mis à jour :

```sql
CREATE OR REPLACE FUNCTION update_timestamp() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.data = jsonb_set(NEW.data, '{updated_at}', to_jsonb(now()::text));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON products
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

## 6. JSONB avec capacités de recherche avancées

Combinaison de JSONB avec la recherche en texte intégral de PostgreSQL pour des requêtes avancées.

### a. Créer un index de recherche en texte intégral sur plusieurs champs JSONB

Pour créer un index de recherche en texte intégral sur les noms, descriptions et tags des produits :

```sql
CREATE INDEX idx_products_fulltext ON products
USING GIN (to_tsvector('english', data ->> 'name' || ' ' || data ->> 'description' || ' ' || array_to_string(data -> 'tags', ' ')));
```

### b. Effectuer des requêtes complexes de recherche en texte intégral

Pour rechercher des produits correspondant à une requête de recherche en texte intégral sur plusieurs champs :

```sql
SELECT * FROM products
WHERE to_tsvector('english', data ->> 'name' || ' ' || data ->> 'description' || ' ' || array_to_string(data -> 'tags', ' '))
@@ to_tsquery('smartphone | promotion');
```

## 7. JSONB et données géographiques

Utilisation de JSONB avec des types de données géographiques pour des requêtes basées sur la localisation.

### a. Stocker des coordonnées géographiques dans JSONB et les indexer

Pour stocker des coordonnées géographiques dans les données JSONB et créer un index GIST :

```sql
CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    data JSONB
);

INSERT INTO locations (data) VALUES 
('{"name": "Store A", "location": {"type": "Point", "coordinates": [40.7128, -74.0060]}}'),
('{"name": "Store B", "location": {"type": "Point", "coordinates": [34.0522, -118.2437]}}');

CREATE INDEX idx_locations_gist ON locations USING GIST (
    ST_SetSRID(ST_GeomFromGeoJSON(data ->> 'location'), 4326)
);
```

### b. Effectuer des requêtes géographiques avec JSONB

Pour trouver des emplacements dans un certain rayon :

```sql
SELECT * FROM locations
WHERE ST_DWithin(
    ST_SetSRID(ST_GeomFromGeoJSON(data ->> 'location'), 4326),
    ST_SetSRID(ST_MakePoint(-74.0060, 40.7128), 4326),
    10000
);
```
