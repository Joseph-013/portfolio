// Builds public/resume.pdf from the site content plus private résumé data.
//   Public:  src/app/content/portfolio.json   (contact links, skills, education, project summaries)
//   Private: resume/resume.private.json        (phone, project dates, experience)
// The private file lives outside src/, so it is never bundled into the website.
// Usage:
//   npm run resume              -> public/<resume.href>, no phone number (served on the site)
//   npm run resume -- --private -> resume/<resume.href>, with phone number (gitignored, for sending directly)
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';

const root = fileURLToPath(new URL('..', import.meta.url));
const site = JSON.parse(await readFile(`${root}src/app/content/portfolio.json`, 'utf8'));
const cv = JSON.parse(await readFile(`${root}resume/resume.private.json`, 'utf8'));
const isPrivate = process.argv.includes('--private');
const out = `${root}${isPrivate ? 'resume' : 'public'}/${site.resume?.href ?? 'resume.pdf'}`;

const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Contact line: site links (email, GitHub, LinkedIn) with the private phone after the email.
const shortLabel = (label) => label.replace(/^linkedin\.com\//, '').replace(/\/$/, '');
const contact = [];
for (const link of site.contact?.links ?? []) {
  contact.push(`<a href="${esc(link.href)}">${esc(shortLabel(link.label))}</a>`);
  if (link.href.startsWith('mailto:') && cv.phone && isPrivate) contact.push(esc(cv.phone));
}

// Projects: entries with an `id` reuse the site's title/summary; others are résumé-only.
const siteProjects = new Map((site.projects?.projects ?? []).map((p) => [p.id, p]));
const projects = cv.projects.map((entry) => {
  const base = entry.id ? siteProjects.get(entry.id) : undefined;
  if (entry.id && !base) throw new Error(`resume.private.json: no site project with id "${entry.id}"`);
  return { ...base, ...entry };
});

const row = (left, right) =>
  `<div class="row"><span>${left}</span>${right ? `<span class="date">${esc(right)}</span>` : ''}</div>`;
const labelled = (item) => (item.label ? `<b>${esc(item.label)}:</b> ` : '') + esc(item.text);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(cv.name)}</title>
<style>
  @page { size: Letter; margin: 0.6in 0.75in; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font: 11pt/1.3 "Times New Roman", "Liberation Serif", Tinos, Times, serif; color: #000; }
  a { color: #1155cc; }
  header { text-align: center; margin-bottom: 8pt; }
  h1 { font-size: 18pt; font-weight: bold; }
  h2 { font-size: 13pt; font-weight: bold; text-transform: uppercase; margin: 10pt 0 3pt; }
  ul { padding-left: 0.3in; }
  ul ul { list-style: circle; padding-left: 0.3in; }
  li { margin-bottom: 1pt; }
  p, li li { text-align: justify; }
  .row { display: flex; justify-content: space-between; gap: 12pt; }
  .date { white-space: nowrap; }
  section, li { break-inside: avoid; }
</style>
</head>
<body>
<header>
  <h1>${esc(cv.name)}</h1>
  <div>${contact.join(' | ')}</div>
  ${site.site.url ? `<div>Portfolio: <a href="${esc(site.site.url)}">${esc(site.site.url.replace(/^https?:\/\//, '').replace(/\/$/, ''))}</a></div>` : ''}
</header>

<section>
  <h2>Technical Skills</h2>
  <ul>${(site.about?.skillGroups ?? []).map((g) => `<li>${labelled({ label: g.label, text: g.items.join(', ') })}</li>`).join('')}</ul>
</section>

<section>
  <h2>Projects</h2>
  <ul>${projects
    .map(
      (p) => `<li>
      ${row(`<b>${p.label ? `[${esc(p.label)}] ` : ''}${esc(p.title)}</b>`, p.date)}
      ${p.summary ? `<p>${esc(p.summary)}</p>` : ''}
    </li>`,
    )
    .join('')}</ul>
</section>

<section>
  <h2>Education</h2>
  <ul>${(site.about?.education ?? [])
    .map(
      (e) => `<li>
      ${row(`<b>${esc(e.school)}</b>${e.location ? `, ${esc(e.location)}` : ''}`, e.date)}
      <ul>${(e.items ?? []).map((i) => `<li>${labelled(i)}</li>`).join('')}</ul>
    </li>`,
    )
    .join('')}</ul>
</section>

<section>
  <h2>Relevant Experience</h2>
  <ul>${cv.experience
    .map(
      (x) => `<li>
      ${row(`<b>${esc(x.company)}</b>`, x.date)}
      <ul><li><b>${esc(x.role)}</b></li></ul>
      <p>${esc(x.summary)}</p>
    </li>`,
    )
    .join('')}</ul>
</section>
</body>
</html>`;

const browser = await puppeteer.launch();
try {
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await writeFile(out, await page.pdf({ preferCSSPageSize: true, printBackground: false }));
  console.log(`Wrote ${out}`);
} finally {
  await browser.close();
}
