# Slide 1

Bonjour, je m'appelle Louis De Wilde et je suis ici pour vous présenter mon projet de TFE Clever Party Thrower.

# Slide 2

Ce projet vise à résoudre un problème spécifique : la complexité de la création d'événements. Cela implique d'inviter
tous les participants, de trouver une date et un lieu qui conviennent à un maximum d'invités, de répartir les coûts
entre les utilisateurs si nécessaire, et de savoir qui participe parmi les invités.

Cette application s'adresse à deux types d'utilisateurs. Le premier est une personne lambda qui souhaite organiser un
événement. Le second est une personne plus technique qui souhaite héberger l'application pour garantir la protection de
ses données et celles de ses utilisateurs, comme un étudiant dans un cercle. Je suis également mon propre client pour
cette application.

# Slide 3

L'application est respectueuse de la vie privée, permet de tout centraliser, est gratuite et facile d'accès, ce qui la
distingue des autres applications similaires.

# Slide 4

Pour répondre à ce problème et aux différentes contraintes de mon client, j'ai décidé de créer une application web. Le
web simplifie l'accès et facilite l'auto-hébergement. Ce projet web nécessite deux sous-projets : un serveur pour gérer
les données et un client pour afficher l'interface. Ils sont distincts et non liés, ce qui permet d'ajouter d'autres
types d'interfaces, comme des applications natives, à l'avenir.

Pour l'interface (ou le frontend), j'ai choisi JavaScript sur WebAssembly. J'ai utilisé Angular car il utilise
TypeScript, ce qui permet une plus grande robustesse grâce à des erreurs à la compilation plutôt qu'à l'exécution.

Pour le serveur (ou backend ou API), j'ai utilisé NestJs. Il me permet d'utiliser TypeScript et donc de conserver du
code en frontend et en backend. Il offre également les mêmes avantages qu'Angular sur le serveur.

# Slide 5

L'API est développée avec NestJs et TypeScript. J'ai choisi GraphQL plutôt qu'une interface REST pour conserver les
avantages de TypeScript tout au long de l'application. De plus, GraphQL n'envoie au client que les données dont il a
besoin et qu'il demande.

Nest et Angular permettent de créer des modules qui gèrent chacun une tâche à la manière d'un micro-service.
L'application serveur, étant la pièce maîtresse de Clever Party Thrower, a été rigoureusement testée avec des tests
unitaires et d'intégration par module.

L'algorithme de résolution de dettes est simple : on crée une balance pour chaque participant qui doit être remise à
zéro pour répartir les coûts. Par exemple, si j'avance un verre à Timi pour 5 euros, ma balance passe à -5 et celle de
Timi à 5. Sur la base de ces balances, je fais correspondre les utilisateurs au sein de l'événement pour avoir le moins
de transactions nécessaires pour revenir à 0.

# Slide 6

J'ai implémenté des workflows d'intégration continue pour tester automatiquement l'application. Le code est testé sur ma
machine de développement avant un commit git et une fois push, il est également testé. Cette intégration continue m'a
permis de déployer automatiquement mon application avec confiance à l'aide d'un
conteneur appelé WatchTower sur mon infrastructure.

En ce qui concerne l'infrastructure, j'avais initialement prévu de déployer Kubernetes sur mes deux serveurs pour
assurer une haute disponibilité. Cependant, cela s'est avéré impossible car mes machines étaient sous-dimensionnées.
J'ai tout de même créé et déployé ce cluster.

Pour éviter que mes configurations et mon installation ne soient
vulnérables à la perte d'une de mes machines, j'ai utilisé Ansible pour définir mon infrastructure en tant que code.
Cela m'a également permis d'appliquer les principes GitOps. Malheureusement, le sous-dimensionnement de mes serveurs ne
me permet pas de déployer le cluster en production car il est trop lent.
J'ai découvert cela après avoir adapté le playbook Ansible à mes besoins. Vous trouverez plus de détails à ce sujet dans
mon rapport.

# Slide 7

L'interface utilisateur est assez basique, à part l'utilisation de RxJS qui permet d'utiliser le pattern Redux pour la
gestion des données et Apollo client pour contacter le serveur.

Un défi majeur lors du développement du frontend a été de déterminer comment le client web peut contacter l'API sans
connaître son adresse ou son nom DNS.
Après une longue réflexion, j'ai décidé que le serveur web qui héberge mon application web (que le client connaît)
servirait de pont.

Il peut fournir directement le nom DNS de l'API que le client doit contacter par la suite, ou il peut rediriger le
trafic
du client sur un chemin spécifique vers l'API. Les deux solutions ont été implémentées, mais j'ai choisi la première,
car
la seconde créait des problèmes dans ma chaîne SSL.

# Slide 8

En ce qui concerne la sécurité, j'ai décidé de ne pas implémenter directement l'HTTPS car je veux que les certificats
soient gérés au niveau de l'infrastructure d'hébergement.

Cependant, la sécurité reste une priorité. Mon pipeline d'intégration continue effectue des audits réguliers de mes
dépendances et me force à les mettre à jour.
De plus, les données sensibles comme les mots de passe sont chiffrées avec Argon 2 avant d'être stockées en base de
données.
Nest, Angular et mon ORM TypeOrm me protègent également des injections SQL.

En ce qui concerne le RGPD, un minimum de données
est collecté et toutes les données sont supprimables. Aucune donnée n'est partagée avec un tiers.

# Slide 9

Passons maintenant à la démo. Je vous invite à scanner le QR code et à vous enregistrer dans l'application. Une fois
enregistré, vous verrez que vous faites déjà partie d'un événement (le QR code était un lien d'ajout à l'événement). Je
vous invite donc à explorer l'interface.

[Expliquer chaque onglet un à un.]

# Slide 10

Je suis bien conscient qu'il y a des points d'amélioration pour ce projet. L'interface utilisateur pourrait être
améliorée. De nouvelles fonctionnalités comme un chat instantané ou des covoiturages pourraient être ajoutées.
J'aimerais vraiment déployer cette application via Kubernetes. Une page d'accueil expliquant le concept de l'application
serait également la bienvenue.

# Slide 11

Place à vos questions.