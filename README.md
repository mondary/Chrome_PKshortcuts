# PK Chrome Shortcuts

![Project icon](icon2.png)

[🇫🇷 FR](README.md) · [🇬🇧 EN](README_en.md)

✨ Extension Chrome pour piloter les onglets, la navigation et le split view via raccourcis clavier. Made by PK-Labs.

> Version **2026.10.1** — historique : [CHANGELOG.md](CHANGELOG.md)

## ✅ Fonctionnalités
- Badge sur l'icône extension: compteur du nombre total d'onglets ouverts.
- `Cmd + Option + clic` sur un lien: split view simulé (fenêtres côte à côte).
- Détacher l'onglet actif dans une nouvelle fenêtre.
- Navigation d'onglets: précédent/suivant, premier/dernier, dernier onglet actif.
- Actions onglet: move, pin/unpin, mute/unmute, reload/hard reload, duplicate, unload.
- Ouverture rapide des pages Chrome (`chrome://bookmarks`, `history`, `flags`, etc.).
- Libellés de commandes groupés avec emojis dans `chrome://extensions/shortcuts`.
- 🧹 URL Cleaner: nettoie les URLs du tracking (utm, fbclid, gclid, etc.) avec modes strict/balanced/light/custom.
- ♻️ Tab Deduplicator: détecte et ferme les onglets en double.
- 🌐 Traduction inline: traduit la sélection à la volée (Google + MyMemory).
- 📑 Auto-collapse: referme automatiquement les groupes d'onglets quand on les quitte.
- 💾 Sauvegarde: import/export/reset de la configuration.

## 🧠 Utilisation
- Charge le dossier `src/` dans `chrome://extensions` (`Load unpacked`).
- Ouvre `chrome://extensions/shortcuts` pour voir/modifier les raccourcis.
- Le raccourci gestuel `Cmd + Option + clic` fonctionne directement sur les liens.
- Clique sur l'icône extension pour ouvrir la page d'options.

## 🗂️ Structure
- `src/`: source canonique de l'extension Chrome.
- `release/`: ZIPs de release générés localement.
- `scripts/`: build et publication Chrome Web Store.
- `secrets/`: fichiers locaux sensibles non versionnés.
- `icon.png` et `icon2.png`: assets de projet conservés à la racine.

## ⚙️ Réglages
- Les raccourcis sont gérés nativement par Chrome dans `chrome://extensions/shortcuts`.
- Certaines combinaisons peuvent être réservées par macOS/Chrome.
- Page d'options: features, URL Cleaner, Tab Dedup, Traduction, Sauvegarde.

## 🧾 Commandes
- 🗂️ Onglets: new, close, duplicate, move left/right/first/last, pin, mute, reload, hard reload, unload, detach.
- 🧭 Navigation: previous/next tab, first/last tab, last active tab, back/forward page, search and jump.
- ↔️ Split: split simulé + entrée split view natif Chrome.
- 🪟 Fenêtres: nouvelle fenêtre, nouvelle fenêtre privée.
- 🌐 Chrome pages: bookmarks, downloads, history, settings, extensions, shortcuts, flags, help.
- 🧹 URL Cleaner: copy cleaned URL.
- ♻️ Tab Dedup: auto-close duplicate tabs.
- 🌐 Traduction: translate current selection.

## 📦 Build & Package
- Générer un ZIP release local:
```bash
./scripts/build-release.sh
```
- Le ZIP est écrit dans `release/` (`release/PK-Chrome-Shortcuts-v<version>.zip`).

## 🔒 Confidentialite
- Politique de confidentialite repo: [PRIVACY.md](PRIVACY.md)
- Page HTML publiee pour le Chrome Web Store: [privacy-policy.html](privacy-policy.html)

## 🧪 Installation (Chrome)
1. Ouvre `chrome://extensions`
2. Active `Developer mode`
3. Clique `Load unpacked`
4. Sélectionne `.../Chrome_PKshortcuts/src`

## 📋 Changelog
Voir le [CHANGELOG.md](CHANGELOG.md) pour l'historique complet.

## ❤️ Soutenir
Soutenir ce projet sur [Ko-fi](https://ko-fi.com/pouark).

## 🔗 Liens
- **Chrome Web Store** : [PK Chrome Shortcuts](https://chromewebstore.google.com/detail/pk-chrome-shortcuts/cjgecoangnnoihcdplnoanbmajpanned)
- **GitHub** : [mondary/Chrome_PKshortcuts](https://github.com/mondary/Chrome_PKshortcuts)
- **Politique de confidentialité** : [privacy-policy.html](privacy-policy.html)
- **Politique de confidentialité repo** : [PRIVACY.md](PRIVACY.md)
- **Site** : [mondary.design](https://mondary.design)
- **Landing promo** : [store2/](store2/index.html) (bilingue FR/EN, playground interactif)
- **Description** : [store/DESCRIPTION.md](store/DESCRIPTION.md)
- 🇬🇧 EN README: [README_en.md](README_en.md)
