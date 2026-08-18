HYBRID WOOD STUDIOS PROJECTION — V6

1. Ouvrir index.html pour voir la plateforme.
2. Ouvrir admin.html pour modifier le catalogue.
3. Dans Gestion : modifier titre, sous-titre, type, prix HTG, statut, résumé, image et lien vidéo.
4. Cliquer « Enregistrer ».
5. Exporter les données pour garder une copie.

IMPORTANT
Cette version permet de préparer et gérer les données localement dans le navigateur. Elle ne rend pas encore les paiements réels ni les vidéos payantes automatiquement accessibles.

VERSION WEB + APPLICATION
L’application Android incluse ouvre la plateforme en ligne. Dans MainActivity.kt, remplacer VOTRE-DOMAINE.com par le domaine réel de la plateforme.

POUR LE SYSTÈME FINAL
Il faudra connecter :
- base de données (films, utilisateurs, achats)
- serveur/API
- paiement marchand (MonCash/NatCash/carte selon disponibilité)
- webhook de confirmation
- stockage vidéo privé/streaming
- compte administrateur sécurisé

DONNÉES À PRÉPARER POUR L’APPLICATION
- nom de l’application
- logo/icône
- couleur principale
- adresse du site
- catalogue de films
- prix
- descriptions
- affiches
- liens vidéo privés
- contacts/support
- identifiants de version Android

NE JAMAIS mettre une clé secrète de paiement, un mot de passe ou un PIN dans les fichiers HTML/JavaScript publics.
