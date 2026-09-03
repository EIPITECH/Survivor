# 🗺️ GéoEmploi

L'application GéoEmploi s'inscrit dans une démarche de modernisation du service public de l'emploi, visant à fluidifier l'accès aux opportunités professionnelles via des outils mobiles géolocalisés. Elle complète les dispositifs existants (FranceTravail, Apec) sans s'y substituer, en ciblant une population active mobile et connectée.

## Déploiement

### 1. Remplir le fichier `.env` avec de vraies valeurs (à partir de `.env.example`)

```bash
cp .env.example .env
```

### 2. Lancer avec Docker

```bash
docker compose up --build
```

## Exécuter l'artefact de build CI

À chaque push/PR, l'application est construite de bout en bout via GitHub Actions, et le résultat est publié sous forme d'images Docker en tant qu'artefact téléchargeable ; permettant ainsi de lancer exactement le build produit par la CI, sans avoir à tout reconstruire en local.

### 1. Télécharger l'artefact

1. Aller dans l'onglet [**Actions**](https://github.com/EIPITECH/Survivor/actions) du dépôt.
2. Ouvrir le run du workflow souhaité (par exemple le dernier run sur `main`).
3. Descendre en bas de la page de résumé du run et télécharger l'artefact nommé `docker-images-<commit-sha>.zip`.

### 2. Décompresser et charger les images

```bash
unzip docker-images-<commit-sha>.zip -d docker-images
cd docker-images

docker load -i frontend.tar
docker load -i backend.tar
```

Vérifier que les deux images sont bien disponibles en local :

```bash
docker images
```

Vous devriez voir `astro-frontend:latest` et `nest-backend:latest`.

### 3. Configurer les variables d'environnement

Revenir à la racine du projet (là où se trouve `docker-compose.yml`) et remplir le fichier `.env` avec de vraies valeurs (à partir de `.env.example`).

### 4. Démarrer d'abord la base de données

```bash
docker compose up -d db
```

Attendre qu'elle soit en bonne santé avant de continuer :

```bash
docker ps
```

### 5. Démarrer l'application avec les images chargées (sans reconstruire)

```bash
docker compose up frontend backend --no-build
```

`--no-build` est indispensable ici : sans cette option, `compose` ignore les images chargées et reconstruit tout depuis les sources.

### 6. Vérifier que tout fonctionne

- Vérification du backend : `curl http://localhost:3000/health`
- Frontend : ouvrir [http://localhost:4321](http://localhost:4321) dans un navigateur

### Dépannage

**Le backend n'arrive pas à joindre la base de données** : vérifier que `DB_HOST` dans `.env` correspond bien au nom du service/conteneur Postgres sur le réseau `backtier` (par exemple `db`), et non à `localhost`.
