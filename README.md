### Consignes JS:

- Si probleme de version pnpm, utiliser `corepack enable pnpm` qui devrait automatiquement utiliser la bonne version
- Ne pas modifier les classes qui ont un commentaire: `// WARN: Should not be changed during the exercise
`
- Pour lancer les tests: `pnpm test`
  - integration only in watch mode `pnpm test:integration`
  - unit only in watch mode `pnpm test:unit`

🛠 Notes de Refactorisation

Cette refactorisation vise à améliorer la maintenabilité, la lisibilité et la testabilité du code :

Extraction de la logique métier liée aux produits dans un service dédié : ProductProcessorService.

Application du principe de responsabilité unique (SRP) pour alléger le contrôleur my-controller.ts.

Ajout de tests unitaires ciblés sur le traitement des types de produits (NORMAL, SEASONAL, EXPIRABLE).

Garantie de non-régression fonctionnelle grâce aux tests d’intégration existants.

Pour lancer les tests : `pnpm test`
