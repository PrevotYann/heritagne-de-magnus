# Traductions communautaires

Le module fonctionne en français sans Babele. Le raccordement a été testé dans Foundry **14.368** avec **Babele 2.9.1** et sa dépendance **lib-wrapper 1.13.5.1**. Babele demeure une dépendance du module de traduction, pas du module français.

1. Copier `examples/heritage-de-magnus-en` dans un nouveau module, changer son identifiant, sa langue et son titre dans `module.json` et `register.mjs`.
2. Exécuter `node tools/export-translations.mjs` pour les modèles à jour. Copier les JSON de `translations/templates` dans le dossier `translations` de votre module.
3. Traduire les valeurs textuelles dans `entries`. Les entrées et documents imbriqués sont indexés par identifiants stables, jamais par leurs noms français. Garder les mappings et noms des fichiers `heritage-de-magnus.<pack>.json`.
4. Installer Babele, lib-wrapper et le module externe ; sélectionner la langue dans Foundry. Importer l’Adventure traduite dans un nouveau monde, ou demander explicitement le remplacement du contenu déjà importé.

`magnus-text` protège les UUID. `magnus-tree` applique les traductions aux objets, biographies, notes, pages de journaux, objets embarqués, variantes, effets textuels, résultats, scènes, tokens, régions, dossiers et collections de l’Adventure. Il conserve les champs absents ou vides en français. Les convertisseurs sont enregistrés lors de `babele.init` et utilisés seulement par les mappings de ces packs ; aucun mapping global Actor, Item ou Adventure n’est modifié.

Ne changer aucun ID, UUID, `type`, formule, valeur mécanique, chemin de média, permission ou flag technique. Une modification des UUID d’un champ textuel fait conserver tout ce champ en français. Les libellés `{...}` des liens peuvent être traduits. Conserver aussi les liens des descriptions HTML : le générateur distingue les UUID de compendium des UUID de monde dans l’Adventure. Les secrets traduits gardent les permissions originales.

Traduire **aussi** `heritage-de-magnus.adventure.json` : la traduction d’un pack Actor ne se propage pas automatiquement à une copie embarquée dans Adventure. Le modèle Adventure fournit toutes ces copies. Les traducteurs peuvent retirer les champs non traduits plutôt que recopier le français, afin de bénéficier des futures corrections du texte source.

L’interface est distincte : ajouter une langue à `lang` et au manifeste du module français utilise `game.i18n`, tandis que le contenu des packs utilise Babele. Une traduction externe de contenu n’exige aucune reconstruction ou modification du module français.

`npm run test:babele` teste réellement l’Adventure et son import, deux pages et leur texte, un objet embarqué et sa description, une variante, une table, les IDs et permissions, la réimportation conservatrice et l’annulation. `npm test` vérifie aussi le repli et l’interdiction de changer les mécaniques. Les résultats sont conservés dans `test-results/babele.json`.
