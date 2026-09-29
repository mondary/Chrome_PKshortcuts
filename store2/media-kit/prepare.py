"""Prepare local assets and a faithful, isolated copy of the production options UI."""
from pathlib import Path
import hashlib
import json
import shutil
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[2]
SITE = ROOT / 'store2'
HUB = Path.home() / 'Documents/GitHub/-agent/skills/pk/premium-promo-media/assets/wallpapers'

def main():
    for folder in ('assets', 'screenshots', 'vendor', 'media-kit/production/options', 'media-kit/production/lib', 'gifs', 'videos'):
        (SITE / folder).mkdir(parents=True, exist_ok=True)
    wallpaper = HUB / 'originals/13995d87892a.png'
    image = Image.open(wallpaper).convert('RGB')
    image.save(SITE / 'assets/wallpaper.webp', quality=87)
    ImageOps.fit(image, (960, 540)).save(SITE / 'assets/landscape.webp', quality=83)
    Image.open(ROOT / 'icon.png').convert('RGBA').resize((256, 256)).save(SITE / 'assets/icon.png')
    provenance = {
        'id': '13995d87892a', 'sha256': hashlib.sha256(wallpaper.read_bytes()).hexdigest(),
        'source': 'file_000000005b248210bd0daadfa3796546.png',
        'collection': 'appWall / premium-promo-media local wallpaper catalog',
        'crop': 'center center, cover; original pixel illustration, no product UI embedded'
    }
    (SITE / 'assets/provenance.json').write_text(json.dumps(provenance, indent=2) + '\n')
    for name in ('options.html', 'options.css', 'options.js'):
        shutil.copyfile(ROOT / 'src/options' / name, SITE / 'media-kit/production/options' / name)
    html = SITE / 'media-kit/production/options/options.html'
    html.write_text(html.read_text().replace('<script src="options.js">', '<script src="../../capture-adapter.js"></script>\n  <script src="options.js">'))
    shutil.copyfile(ROOT / 'src/lib/url-cleaner.js', SITE / 'assets/url-cleaner.js')
    shutil.copyfile(ROOT / 'src/lib/url-cleaner.js', SITE / 'media-kit/production/lib/url-cleaner.js')
    shutil.copyfile(ROOT / 'src/content.js', SITE / 'media-kit/production/content.js')
    content = (ROOT / 'src/content.js').read_text()
    template = content[content.index('function buildTranslatePopupTemplate('):content.index('function positionPopup(')]
    (SITE / 'assets/translation-view.js').write_text('window.PK_TRANSLATION_TEMPLATE = ' + template.replace('function buildTranslatePopupTemplate', 'function', 1).rstrip() + ';\n')
    shutil.copyfile(ROOT / 'src/icon.png', SITE / 'media-kit/production/icon.png')
    manifest = json.loads((ROOT / 'src/manifest.json').read_text())
    (SITE / 'media-kit/production/manifest.json').write_text(json.dumps({'version': manifest['version']}) + '\n')
    # Generate a complete, translated command inventory from the actual manifest.
    fr = json.loads((ROOT / 'src/_locales/fr/messages.json').read_text())
    en = json.loads((ROOT / 'src/_locales/en/messages.json').read_text())
    commands = []
    for name, command in manifest['commands'].items():
        key = command['description'].removeprefix('__MSG_').removesuffix('__')
        commands.append({'id': name, 'fr': fr.get(key, en[key])['message'], 'en': en[key]['message'],
                         'native': '_memo_' in key or name == 'g02-native-split-view',
                         'shortcut': command.get('suggested_key', {}).get('mac', '')})
    (SITE / 'assets/commands.js').write_text('window.PK_COMMANDS = ' + json.dumps(commands, ensure_ascii=False) + ';\n')
    print('Prepared wallpaper, icon, production views and', len(commands), 'commands.')

if __name__ == '__main__':
    main()
