# Changelog

Historique des releases de PK Chrome Shortcuts.

---

## TODO — Roadmap

Statut : `2026.10.2`

---

## Releases

### [2026.10.2] - 2026-10-01

#### Changed
- réorganisation des ressources promotionnelles : ancien matériel store archivé sous `store/v1/`, landing et kit média déplacés dans `store/website/`
- synchronisation des chemins et de l'icône dans les README FR/EN

### [2026.10.1] - 2026-10-01

#### Changed
- politique de confidentialité FR/EN : divulgation du texte transmis à Google Translate ou MyMemory pour la traduction, uniquement à la demande de l'utilisateur
- liens Ko-fi visibles en rouge en haut et en bas de la landing, liens directs GitHub et Chrome Web Store
- fiche CWS : préparation de la publication de la version 2026.10.1

### [2026.9.4] - 2026-10-01

#### Changed
- landing `store2/` : liens Ko-fi rouges et visibles en haut et en bas, liens directs vers GitHub et la fiche Chrome Web Store
- synchronisation de la version de l'extension et des README en `2026.09.4`

### [2026.9.3] - 2026-09-29

#### Added
- landing promo bilingue FR/EN dans `store2/` : bureau Mac immersif, hero parallaxe GSAP/ScrollTrigger, keycaps Three.js différés, séquence scroll épinglée, playground interactif (navigation, déduplication, split, détachement, traduction démo), nettoyeur d'URL exécutant le moteur de production, catalogue des 70 entrées de commandes, galerie des captures réelles agrandissables
- kit média `store2/` : 15 captures (9 vues de production + 6 scènes playground), bannière 1544×500, card OG 1200×630, GIF large + compact, MP4 playground 12 s, planche contact
- pipeline de capture reproductible (`store2/media-kit/` : préparation, captures iris, export frames ego, QA 21 checks + 4 viewports + mouvement réduit)

#### Changed
- README.md / README_en.md : lien vers la landing store2, version 2026.09.3

### [2026.9.2] - 2026-09-29

#### Added
- kit média store : bannière 1544×500, card 1200×675, capture options, vidéo démo, laius `store/description-store.md`
- lien de soutien Ko-fi (https://ko-fi.com/pouark) dans README.md, README_en.md et l'onglet À propos de la page options
- section Liens du README_en synchronisée sur README.md

### [2026.9.1] - 2026-09-29

#### Changed
- publish-cws.sh : artefacts écrits dans `release/` au lieu de `extension/` (aligné sur build-release.sh)
- manifest.version sérialisé sans zéros initiaux (`2026.9.1`) + `version_name` `2026.09.1` (format valide Chrome Web Store)

#### Fixed
- suppression du fichier `VERSION` legacy : le CHANGELOG est la source de vérité (convention pk-commits)

### [2026.07.01] - 2026-07-30

#### Added
- page d'options avec navigation sidebar (features, url cleaner, tab dedup, traduction, sauvegarde, à propos)
- url cleaner avec modes strict / balanced / light / custom, suppression des paramètres tracking (utm, fbclid, gclid, etc.)
- tab deduplicator pour fermer les onglets en double
- traduction inline avec google translate + fallback mymemory
- auto-collapse des groupes d'onglets quand on quitte un groupe
- backup / import / reset de configuration
- thème dark / light dans les options
- commande c17 copy cleaned url (alt+shift+u suggéré)
- commande c18 dedup tabs
- commande c19 translate selection
- permission tabgroups pour l'api chrome.tabgroups

#### Changed
- format de version migré vers yyyymm.patch (skill pk-commits)
- build-release.sh : output dans release/, format pk-chrome-shortcuts-vversion.zip
- .gitignore : extension/ → release/
- suggested_key déplacées vers alt+shift pour éviter conflits chrome natif

#### Fixed
- permission tabgroups manquante (chrome.tabgroups était undefined)
- auto-collapse groupes : approche stateless (collapse tous les groupes sauf celui actif)
- raccourcis en conflit avec chrome natif (cmd+left, cmd+d, alt+left, etc.)

### [1.29] - 2026-07-01
- mise à jour branding pk-labs, noms cohérents et descriptions optimisées

### [1.26] - 2026-06-15
- délais augmentés pour la copie automatique (1.5s + 2s cooldown)

### [1.24] - 2026-06-10
- ajout copie automatique de texte sélectionné

### [1.19] - 2026-05-20
- ajout d'une politique de confidentialité dans le repo pour la publication chrome web store

### [1.10] - 2026-04-01
- renommage des identifiants de commandes pour imposer un tri logique par catégorie dans chrome

### [1.0] - 2026-03-15
- ajout du badge compteur d'onglets sur l'icône extension

### [0.45] - 2026-03-01
- structure projet en src/ (chargeable) + extension/ (artefacts release), scripts release/publish ajustés

### [0.43] - 2026-02-20
- hard reload par défaut en cmd+shift+r
