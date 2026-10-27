import { readFile, mkdir, writeFile, copyFile } from 'node:fs/promises';
import path from 'node:path';

const args = process.argv.slice(2);
const at = args.indexOf('--config');
const configPath = at >= 0 ? args[at + 1] : 'client.json';
if (!configPath) throw new Error('Missing --config path');
const c = JSON.parse(await readFile(configPath, 'utf8'));
const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const url = value => {
  if (!value) return '';
  const u = new URL(value);
  if (u.protocol !== 'https:') throw new Error('URLs must use HTTPS');
  return u.href;
};
const phone = value => {
  if (!value) return '';
  if (!/^\+?[\d().\s-]+$/.test(value)) throw new Error('Invalid phone number');
  return (value.trim().startsWith('+') ? '+' : '') + value.replace(/\D/g, '');
};
const email = value => {
  if (!value) return '';
  if (!/^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value)) throw new Error('Invalid email');
  return value;
};
if (!c.name || !c.headline || !c.description || !Array.isArray(c.services)) throw new Error('Missing required client fields');
if (!/^[a-zA-Z]{2,3}(?:-[a-zA-Z0-9]{2,8})*$/.test(c.lang || '')) throw new Error('Invalid language');
const canonical = url(c.url); const image = url(c.ogImage); const logo = url(c.logo);
const colors = [c.colors?.primary || '#126257', c.colors?.background || '#e8f2ed'];
if (colors.some(x => !/^#[0-9a-f]{6}$/i.test(x))) throw new Error('Colors must be six-digit hex');
const labels = c.labels || {};
const routes = [c.email && ['mailto:' + email(c.email),labels.email || 'Email us'], c.phone && ['tel:' + phone(c.phone),labels.phone || 'Call us'], c.sms && ['sms:' + phone(c.sms),labels.sms || 'Text us'], c.booking && [url(c.booking),labels.booking || 'Book']].filter(Boolean);
const links = routes.map(([href,label],i) => `<a${i===0?' class="button"':''} href="${esc(href)}">${esc(label)}</a>`).join('');
const services = c.services.map(s=>`<article><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p></article>`).join('');
const social = (c.social || []).map(s => `<a href="${esc(url(s.url))}">${esc(s.label)}</a>`).join(' ');
const credentials = (c.credentials || []).map(x=>`<li>${esc(x)}</li>`).join('');
const leadForm = c.leadForm?.enabled ? `<form id="lead-form"><label>Name <input name="name" required maxlength="120"></label><label>Email <input name="email" type="email" required maxlength="200"></label><label>Phone (optional) <input name="phone" type="tel" maxlength="25"></label><label>Message <textarea name="message" required minlength="5" maxlength="5000"></textarea></label><label class="honey" aria-hidden="true">Leave empty <input name="company" tabindex="-1" autocomplete="off"></label><button class="button" type="submit">Send message</button><p id="form-status" role="status"></p></form>` : '';
const tracking = c.tracking?.enabled ? {enabled:true,hosts:c.tracking.hosts || [],googleTagId:c.tracking.googleTagId || '',conversionId:c.tracking.conversionId || ''} : {enabled:false};
// Escape '<' to keep JSON data from terminating its script element.
const js = JSON.stringify(tracking).replace(/</g,'\\u003c');
const meta = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${c.noindex?'noindex,nofollow':'index,follow'}"><title>${esc(c.name)} | ${esc(c.headline)}</title><meta name="description" content="${esc(c.description)}">${canonical?`<link rel="canonical" href="${esc(canonical)}">`:''}<meta property="og:title" content="${esc(c.name)} | ${esc(c.headline)}"><meta property="og:description" content="${esc(c.description)}">${canonical?`<meta property="og:url" content="${esc(canonical)}">`:''}${image?`<meta property="og:image" content="${esc(image)}">`:''}`;
const html = `<!doctype html><html lang="${esc(c.lang)}"><head>${meta}<link rel="stylesheet" href="/styles.css"><style>:root{--primary:${colors[0]};--hero:${colors[1]}}</style><script type="application/json" id="tracking-config">${js}</script><script defer src="/site.js"></script></head><body><a class="skip" href="#main">Skip to content</a><header class="header"><a class="brand" href="/">${logo?`<img src="${esc(logo)}" alt="${esc(c.name)}" class="logo">`:esc(c.name)}</a><nav aria-label="Main navigation"><a href="#services">Services</a><a href="#about">About</a><a href="#contact">Contact</a></nav></header><main id="main"><section class="hero"><div class="wrap"><p class="eyebrow">${esc(c.eyebrow)}</p><h1>${esc(c.headline)}</h1><p class="intro">${esc(c.description)}</p><a class="button" href="#contact">${esc(c.cta)}</a></div></section><section id="services" class="wrap section"><p class="eyebrow">How we help</p><h2>${esc(c.headings?.services)}</h2><div class="cards">${services}</div></section><section id="about" class="about"><div class="wrap section"><p class="eyebrow">About</p><h2>${esc(c.headings?.about)}</h2><p>${esc(c.about)}</p>${credentials?`<ul>${credentials}</ul>`:''}</div></section><section id="contact" class="wrap section contact"><div><p class="eyebrow">Get in touch</p><h2>${esc(c.headings?.contact)}</h2>${c.serviceArea?`<p>${esc(c.serviceArea)}</p>`:''}${c.address?`<p>${esc(c.address)}</p>`:''}${c.hours?`<p>${esc(c.hours)}</p>`:''}</div><div class="contact-links">${links || '<p>Contact details are not configured yet.</p>'}${social}${leadForm}</div></section></main><footer><div class="wrap">${esc(c.name)} &middot; <a href="/privacy.html">Privacy</a></div></footer></body></html>`;
const privacy = `<!doctype html><html lang="${esc(c.lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="${c.noindex?'noindex,nofollow':'index,follow'}"><title>Privacy | ${esc(c.name)}</title><link rel="stylesheet" href="/styles.css"></head><body><main class="wrap section"><h1>Privacy</h1><p>${esc(c.privacyText || 'This is a template. Replace this notice with a client-specific privacy policy reviewed before launch, including contact details, data collection, retention, third parties, and consent choices.')}</p><a href="/">Return home</a></main></body></html>`;
await mkdir('dist',{recursive:true});
await Promise.all([writeFile('dist/index.html',html),writeFile('dist/privacy.html',privacy),copyFile('styles.css','dist/styles.css'),copyFile('site.js','dist/site.js')]);
console.log(`Built ${configPath} into dist/`);
