# PK Shortcuts — Chrome, au bout des doigts

Direction validée le 29 septembre 2026. Landing autonome FR/EN dans `store2/`.

## Direction

Référence principale : getdroppy.app, pour la place donnée aux démonstrations.
Référence d'interaction : PKbrain/store/website, bureau et barre de menus Mac.
Wallpaper : catalogue premium-promo-media, 049 / 13995d87892a, paysage illustré
bleu nuit et coucher de soleil. Graphite #151719, papier #f5f5f3, ambre #ffb547.
Typographies système : SF Pro Display pour les titres, SF Pro Text pour la lecture,
SF Mono pour les raccourcis. Fenêtres lisibles, grande respiration, une scène signature.

## Storyboard

1. Bureau immersif : promesse, fenêtre Chrome de démonstration, installation et démo.
2. Navigation : le clavier active, déplace et épingle un onglet.
3. Organisation : dédoublonnage, compteur et repli des groupes.
4. Split : une fenêtre devient deux ; onglet détaché.
5. URL Cleaner : entrée utilisateur, vrai moteur, quatre modes.
6. Sélection : copie automatique et traduction ; vraie bulle de production.
7. Playground : navigation, organisation, split, nettoyage, traduction. Réinitialisable.
8. Galerie des vrais réglages et catalogue complet des fonctions.
9. Installation depuis les sources, confidentialité, GitHub et Ko-fi.

## Authenticité

- 70 entrées de commandes : 37 actions, 32 mémos Chrome, 1 entrée split natif sans action.
- Les fenêtres/onglets du playground sont des simulations annoncées.
- Les panneaux capturés réutilisent HTML, CSS et JS de production avec un pont Chrome
  fictif documenté ; pas de profil personnel, pas de faux test de l'API Chrome.
- Le nettoyage utilise le module de production. La traduction de démonstration est
  préenregistrée, sans requête réseau. La véritable extension utilise Google/MyMemory.
- Les captures originales des options sont en français, y compris dans la galerie EN.
- Ne pas utiliser le lien Web Store incomplet du README comme destination d'installation.

## Réception

- [x] Captures des réglages initialisés, version visible, données de démonstration.
- [x] Hero et scène au scroll, GSAP local, keycaps Three.js en enrichissement différé.
- [x] Playground et nettoyeur fonctionnels ; clavier ; reset ; textes FR/EN.
- [x] Galerie agrandissable, fermeture Échap, focus rendu au déclencheur.
- [x] Rendu 390 / 768 / 1440 / 1920, mouvement réduit et contenu sans JS.
- [x] Kit média reproductible et sources/provenance documentées.
- [x] Documentation FR/EN et version synchronisées ; vérifications enregistrées.

Vérifié le 2026-09-29 : 21 checks fonctionnels (media-kit/qa.ego.js), aucun débordement
horizontal sur les 4 tailles, bascule mouvement réduit, 70 entrées de commandes,
liaison FR/EN complète. Limites : captures d'origine en français ; vidéo = montage de
la démo interactive ; pas de fiche Chrome Web Store.
