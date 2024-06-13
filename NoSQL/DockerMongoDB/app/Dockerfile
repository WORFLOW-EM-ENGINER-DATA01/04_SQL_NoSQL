# Utilisation de l'image officielle Node.js
FROM node:20.13.1

# Création du répertoire de travail
WORKDIR /app

# Copie des fichiers package.json et package-lock.json
COPY ./package*.json ./

# Installation des dépendances
RUN npm install

# Copie du reste des fichiers de l'application
COPY . .

# Exposition du port 3000
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "app.js"]