"""Additional labeled browser illustrations, captured from the interactive site itself."""
from pathlib import Path
import subprocess
from PIL import Image

SITE = Path(__file__).resolve().parents[1]
SCENES = [('10-browser-demo','navigate'), ('11-dedup-demo','dedup'), ('12-groups-demo','groups'),
          ('13-split-demo','split'), ('14-detached-demo','detach'), ('15-translation-demo','translate')]
for name, scene in SCENES:
    subprocess.run(['iris', f'http://127.0.0.1:4178/store2/?capture=1&lang=fr&demo={scene}',
                    '--selector','.playground-desktop','--size','1440x1000','--scale','2',
                    '--wait-for','[data-ready]','--json','-o',str(SITE/'screenshots'/f'{name}.png')], check=True)
    image=Image.open(SITE/'screenshots'/f'{name}.png').convert('RGB')
    image.thumbnail((1600,1200))
    image.save(SITE/'assets'/f'{name}.webp',quality=86)
