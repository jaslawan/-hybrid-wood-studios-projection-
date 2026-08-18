# Connexion du paiement

Le flux prévu est :

1. Le client choisit un film.
2. Le site crée une commande `POST /api/orders`.
3. Le client est envoyé vers le paiement du prestataire.
4. Le prestataire appelle `POST /api/payments/webhook` avec `orderId` et `status: paid` + son identifiant de transaction.
5. Le serveur crée un code `WOOD-XXXX-XXXX`.
6. Le client saisit le code et `/api/access/verify` autorise le film.

Il manque seulement les paramètres techniques du prestataire choisi (MonCash, NatCash ou carte). Une fois ces informations disponibles, l’adaptateur de paiement peut être ajouté sans refaire le catalogue.
