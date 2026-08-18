# HYBRID WOOD STUDIOS PROJECTION PROJECTION V8

## Ce que cette version fait
- Le site web et l’application Android lisent le même catalogue depuis `/api/catalog`.
- L’administrateur modifie les films depuis `admin.html`; les changements sont enregistrés sur le serveur.
- Les commandes sont créées par `/api/orders`.
- Le webhook `/api/payments/webhook` crée automatiquement un code d’accès après confirmation `paid`.
- `/api/access/verify` vérifie le code et renvoie le film autorisé.

## Démarrer sur ordinateur
1. Installer Node.js 18 ou plus.
2. Copier `.env.example` vers `.env` et choisir un mot de passe administrateur fort.
3. Lancer `npm start`.
4. Ouvrir `http://localhost:3000`.
5. Ouvrir `http://localhost:3000/admin.html` pour gérer les données.

## Important
Cette version ne contient pas encore les identifiants/API MonCash, NatCash ou carte. Il faut le compte marchand et la documentation/API du prestataire pour brancher le paiement réel. **Ne mettez jamais une clé secrète dans le HTML ou l’application.**

## Déploiement
Le dossier peut être déployé sur un hébergeur qui accepte Node.js. La base actuelle est un fichier JSON (`server-data.json`) : pour une vraie production avec beaucoup de clients, il faudra passer à PostgreSQL/Supabase ou une autre base de données.

## Application Android
L’application Android est une WebView qui ouvre le même domaine. Remplacer `https://VOTRE-DOMAINE.com` dans `android-app/.../MainActivity.kt` par le domaine réel. Ainsi, web et Android utilisent les mêmes films, prix et achats.
