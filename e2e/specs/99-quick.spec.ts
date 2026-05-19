import { test } from '@playwright/test';
test('quick load /', async ({ page }) => {
  page.on('console', m => console.log(`[${m.type()}]`, m.text().substring(0,250)));
  page.on('pageerror', e => console.log('PAGEERR:', e.message.substring(0,250)));
  const start = Date.now();
  try {
    await page.goto('http://18.232.27.199:9110/', { waitUntil: 'load', timeout: 60000 });
    console.log(`Loaded in ${Date.now()-start}ms`);
  } catch(e:any) { console.log('FAIL:', e.message.substring(0,200)); }
  console.log('URL:', page.url(), 'title:', await page.title());
});
