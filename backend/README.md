# Mon vieux Grimoire

## Comment lancer le projet ? 

### Etape 1 : Pour que l'application soit fonctionnelle, il faudra créer un dossier "backend/images" qui sera responsable du stockage des fichiers images téléchargés sur le site.

### Etape 2 : pour lancer l'application, placez-vous sur le dossier "/backend" et faites la commande `npm install` pour installer les dépendances puis `nodemon server` pour lancer le backend.

### Etape 3 : placez-vous sur le dossier "/frontend" et faites la commande `npm install` pour installer les dépendances puis `npm start` pour lancer le projet. 


"Mon Vieux Grimoire" est un site web permettant aux utilisateurs de créer un compte afin de publier des livres qu'ils ont lus en y ajoutant les informations suivantes : 
-le titre
-l'auteur
-l'année de publication
-le genre
-une image
-une note allant de 1 à 5. 

Les livres et les utilisateurs créés seront stockés dans une base de données utilisant MONGO DB à l'aide de Mongoose et de schémas de données.