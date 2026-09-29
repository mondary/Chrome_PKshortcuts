"""Run with the repository served at localhost:4178. iris 0.4.1 + Pillow."""
from pathlib import Path
import subprocess
from PIL import Image, ImageOps, ImageDraw

SITE = Path(__file__).resolve().parents[1]
SCENES = [('01-features-dark', 'features', 'dark'), ('02-features-light', 'features', 'light'),
          ('03-url-cleaner', 'cleaner', 'dark'), ('04-custom-cleaner', 'custom', 'dark'),
          ('05-duplicates-before', 'dedup', 'dark'), ('06-duplicates-after', 'dedup-after', 'dark'),
          ('07-translation', 'translate', 'dark'), ('08-backup', 'backup', 'dark'),
          ('09-about', 'about', 'dark')]

def main():
    for name, scene, theme in SCENES:
        url = f'http://127.0.0.1:4178/store2/media-kit/production/options/options.html?scene={scene}&theme={theme}'
        subprocess.run(['iris', url, '--size', '1280x1120' if scene in ('cleaner', 'custom') else '1280x800',
                        '--scale', '2', '--wait-for', '[data-capture-ready]', '--json',
                        '-o', str(SITE / 'screenshots' / f'{name}.png')], check=True)
        image = Image.open(SITE / 'screenshots' / f'{name}.png').convert('RGB')
        image.thumbnail((1600, 1125))
        image.save(SITE / 'assets' / f'{name}.webp', quality=88)
    sheet = Image.new('RGB', (1500, 1050), '#e9e9e7')
    draw = ImageDraw.Draw(sheet)
    for i, (name, _, _) in enumerate(SCENES[:6]):
        image = Image.open(SITE / 'screenshots' / f'{name}.png').convert('RGB')
        image.thumbnail((720, 450))
        x, y = 20 + (i % 2) * 750, 20 + (i // 2) * 350
        image.thumbnail((710, 310))
        sheet.paste(image, (x, y))
        draw.text((x, y + 315), name, fill='#151719')
    sheet.save(SITE / 'screenshots/contact-sheet.jpg', quality=90)

if __name__ == '__main__':
    main()
