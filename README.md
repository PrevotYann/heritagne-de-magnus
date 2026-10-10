# L’héritage de Magnus

Module indépendant pour **Foundry VTT 14**, vérifié dans **14.368**, avec **jdr-runeterra ≥ 0.8.0**. Le système doit être installé séparément. Babele est facultatif pour jouer en français.

## Installation et première partie

1. Extraire `heritage-de-magnus-0.1.0.zip` dans `Data/modules/`. Le manifeste doit se trouver dans `Data/modules/heritage-de-magnus/module.json`.
2. Ouvrir un monde utilisant `jdr-runeterra`, activer **L’héritage de Magnus**.
3. MJ : cliquer **Importer la campagne** dans l’accueil. L’import utilise l’Adventure native. Il n’est jamais automatique.
4. Accepter l’ouverture de **Commencer la campagne** : préparation, navigation, conditions, ressources et limites des sources.

L’accueil reste accessible par **Configuration → Paramètres des modules → L’héritage de Magnus**. L’Adventure est également disponible dans les compendiums. Les autres compendiums permettent la consultation et l’import individuel : ne pas importer une seconde fois tout leur contenu après l’Adventure.

Pour installer directement dans Foundry : **Modules complémentaires → Installer un module → URL du manifeste**, saisir `https://github.com/PrevotYann/heritagne-de-magnus/releases/latest/download/module.json`. Le dépôt porte le nom `heritagne-de-magnus` ; l’identifiant technique du module reste `heritage-de-magnus`.

## Imports et mises à jour

Un nouvel import conserve les documents déjà présents avec leurs identifiants : notes MJ, inventaires, scènes et progression ne sont pas réinitialisés. Une mise à jour du module ne change pas le monde. Le bouton **Remplacer les documents existants** demande confirmation : il réécrit les documents appartenant à cette campagne, y compris leurs modifications. Sauvegarder le monde avant cette action. Une collision avec un document étranger est conservée.

Les acteurs, indices, plans MJ et scénario sont privés. Les menus et panneaux d’annonces sont publics. Partager les autres aides avec la macro **Révéler un document** après avoir choisi le moment. Les tokens d’ennemis préparés sont masqués.

## Utilisation des rencontres

Les quatre scènes tactiques sont des ajouts de préparation : col d’Isolda/Hgar, loups, approche d’Ott et laboratoire. Les cartes régionales et illustrations narratives restent sans grille de combat. Les trois phases d’Ott sont des acteurs distincts ; sélectionner son token puis utiliser la macro de transition. Les flammes vertes et le gaz s’activent explicitement sur les cibles du MJ ; leurs macros d’arrêt sont fournies. Les dégâts, conditions et tours utilisent le moteur du système.

Les valeurs absentes des sources sont signalées dans les notes des acteurs et `flags.heritage-de-magnus.proposals`. Les chances de maladie, choix narratifs, incantations non écrites et conditions contextuelles demandent l’arbitrage du MJ. Lire [le rapport de couverture](docs/COVERAGE.md) avant la partie.

## Reconstruction

Node.js 24 recommandé : `npm ci`, `npm run build`, `npm test`, `npm run release`. Exécuter ces commandes avec Foundry arrêté : ses compendiums LevelDB ne doivent pas être ouverts pendant la construction. `FOUNDRY_PATH` peut fournir la dépendance LevelDB de l’installation Foundry si son module natif local n’est pas disponible.

La reconstruction utilise les snapshots source et médias déjà locaux, sans compte Drive ni téléchargement. Elle restaure le résultat vérifié de l’Adventure Builder lorsque l’empreinte du contenu est identique. Après modification du contenu : `npm run build:draft`, lancer le monde de validation isolé au port 30145, `npm run build:native`, arrêter Foundry, reconstruire les packs avec `node tools/pack.mjs`, puis exporter les traductions. La validation native requiert une installation Foundry personnelle ; aucune licence n’est distribuée.

Les modèles et un module externe de démonstration sont fournis : [traduction avec Babele](docs/TRANSLATION.md). L’exemple anglais traduit volontairement quelques champs et conserve le français ailleurs.

Textes et médias : droits de leurs auteurs, voir [CREDITS.md](CREDITS.md). Sources et releases : [PrevotYann/heritagne-de-magnus](https://github.com/PrevotYann/heritagne-de-magnus).
