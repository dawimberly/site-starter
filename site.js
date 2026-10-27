(() => {
  const c = window.CLIENT_CONFIG;
  if (!c || !Array.isArray(c.services)) return;
  document.title = `${c.name} | ${c.headline}`;
  document.querySelector('meta[name="description"]').content = c.description;
  document.querySelectorAll('[data-field]').forEach(el => {
    const value = c[el.dataset.field];
    if (typeof value === 'string') el.textContent = value;
  });
  const list = document.getElementById('services-list');
  c.services.forEach(service => {
    const card = document.createElement('article');
    const title = document.createElement('h3');
    const description = document.createElement('p');
    title.textContent = service.title; description.textContent = service.description;
    card.append(title, description); list.append(card);
  });
  const contacts = [ ['email-link', c.email, 'mailto:'], ['phone-link', c.phone, 'tel:'], ['sms-link', c.sms, 'sms:'] ];
  let visible = false;
  contacts.forEach(([id, value, protocol]) => {
    if (typeof value !== 'string' || !value.trim()) return;
    const link = document.getElementById(id);
    // Reject URI control characters and unexpected link content.
    const valid = protocol === 'mailto:' ? /^[^\s@?&#]+@[^\s@?&#]+\.[^\s@?&#]+$/.test(value) : /^\+?[0-9(). -]{7,25}$/.test(value);
    if (!valid) return;
    link.href = protocol + value; link.hidden = false; visible = true;
  });
  document.getElementById('contact-placeholder').hidden = visible;
})();
