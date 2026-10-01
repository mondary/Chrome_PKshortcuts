# store2 — kit média & reproduction

Landing bilingue FR/EN : `../index.html`. Tout est autoporté (vendor local, aucune ressource réseau au chargement).

## Reproduire

```bash
python3 media-kit/prepare.py        # fond + icône + vues de production + inventaire commandes
python3 -m http.server 4178         # à la racine du dépôt (file:// casse les assets)
python3 media-kit/capture.py        # 9 captures des réglages réels + planche contact
python3 media-kit/capture-scenes.py # 6 scènes du playground (naviguateur simulé)
ego-browser nodejs < media-kit/export.ego.js   # 288 frames de la boucle playground (24 fps, 12 s)
ego-browser nodejs < media-kit/qa.ego.js       # QA : 21 checks + 390/768/1440/1920 + mouvement réduit
# Montage vidéo + GIF depuis les frames :
ffmpeg -framerate 24 -i <frames>/%04d.png -vf scale=1280:720 -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart ../videos/playground-demo.mp4
# Bannière / card OG :
iris 'http://127.0.0.1:4178/store2/media-kit/cards.html' --size 1544x500 -o ../assets/banner-1544x500.png
iris 'http://127.0.0.1:4178/store2/media-kit/cards.html?format=card' --size 1200x630 -o ../assets/card-1200x630.png
```

## Sources

- Fond : catalogue premium-promo-media (appWall), id `13995d87892a` — voir `assets/provenance.json`.
- Réglages capturés : vues de production `src/options` (HTML/CSS/JS inchangés) + `capture-adapter.js`, données 100 % fictives, version affichée réelle.
- Nettoyeur d'URL : module de production `src/lib/url-cleaner.js` exécuté dans la page.
- Bulle de traduction : template exact de `src/content.js` ; traduction préenregistrée, aucune requête réseau.
- Inventaire commandes : généré depuis `src/manifest.json` + `_locales/{fr,en}` (70 entrées : 37 actions, 33 références natives).
- Fenêtres/onglets du playground : simulations annoncées (« données d'exemple »), jamais des captures natives.

## Limites connues

- L'UI d'origine des captures est en français (y compris rendu EN) — l'extension elle-même affiche ces réglages en français.
- La vidéo est un montage de la démo interactive, pas une capture de l'extension dans Chrome.
- Pas de lien Chrome Web Store tant que la fiche réelle n'existe pas ; l'installation pointe vers GitHub.
