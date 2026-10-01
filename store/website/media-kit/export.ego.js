// Run: ego-browser nodejs < store2/media-kit/export.ego.js
// Reuses the validation task space; updates only the export page it owns.
const task = await taskSpace(36);
const page = await task.newPage();
console.log({ exportPage: page.label });
await page.cdp('Emulation.setDeviceMetricsOverride', {width:1200,height:675,deviceScaleFactor:1,mobile:false});
await page.goto('http://127.0.0.1:4178/store2/media-kit/dynamic-demo.html');
await page.waitForSelector('[data-ready]');
const fs = await import('node:fs/promises');
const dir = '/var/folders/jb/07k9zyks6_d60c27tclhjd2h0000gn/T/opencode/shortcuts-frames';
await fs.mkdir(dir,{recursive:true});
for(let frame=0;frame<288;frame++){
  await page.evaluate(t=>window.seekDemo(t),frame/24);
  const shot=await page.cdp('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  await fs.writeFile(`${dir}/${String(frame).padStart(4,'0')}.png`,Buffer.from(shot.data,'base64'));
  if(frame%72===0)console.log({frame});
}
console.log({frames:288,fps:24,duration:12,directory:dir});
await page.close();
