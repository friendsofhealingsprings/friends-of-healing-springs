/** Mobile navigation toggle, gallery filtering, and contact form submission */
document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initGalleryFilter();
  initContactForms();
  initNewsletterForms();
  initRsvpForms();
});

function initMobileMenu() {
  const button = document.getElementById('mobile-menu-button');
  const menu = document.getElementById('mobile-menu');
  if (!button || !menu) return;

  button.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    menu.classList.toggle('hidden');
    button.setAttribute('aria-expanded', String(!isOpen));
    button.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  });
}

function initGalleryFilter() {
  const buttons = document.querySelectorAll('.gallery-filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!buttons.length || !items.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-category');

      buttons.forEach((b) => {
        b.classList.remove('active', 'bg-water-600', 'text-white', 'border-transparent');
        b.classList.add('border', 'border-stone-200', 'bg-sand-100', 'text-stone-700');
        b.setAttribute('aria-selected', 'false');
      });

      btn.classList.add('active', 'bg-water-600', 'text-white', 'border-transparent');
      btn.classList.remove('border', 'border-stone-200', 'bg-sand-100', 'text-stone-700');
      btn.setAttribute('aria-selected', 'true');

      items.forEach((item) => {
        const itemCategory = item.getAttribute('data-category');
        const show = category === 'all' || itemCategory === category;
        item.classList.toggle('hidden', !show);
      });
    });
  });
}

function initContactForms() {
  document.querySelectorAll('.contact-form').forEach((form) => {
    if (!(form instanceof HTMLFormElement)) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const wrapper = form.closest('.brand-card');
      const status = wrapper?.querySelector('.contact-form-status');
      const submitBtn = form.querySelector('.contact-form-submit');

      if (!(status instanceof HTMLElement)) return;

      const formData = new FormData(form);
      const payload = {
        name: String(formData.get('name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        subject: String(formData.get('subject') ?? '').trim(),
        message: String(formData.get('message') ?? '').trim(),
        website: String(formData.get('website') ?? '').trim(),
        formType: form.dataset.formType ?? 'general',
      };

      status.classList.remove('hidden', 'text-red-700', 'text-forest-700');
      status.classList.add('text-stone-600');
      status.textContent = 'Sending…';

      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const contentType = response.headers.get('content-type') ?? '';
        const result = contentType.includes('application/json')
          ? await response.json().catch(() => ({}))
          : {};

        if (response.ok && result.ok) {
          status.textContent = 'Thank you — your message has been sent. We will be in touch soon.';
          status.classList.remove('text-stone-600');
          status.classList.add('text-forest-700');
          form.reset();
        } else if (!contentType.includes('application/json')) {
          throw new Error(
            response.status === 404
              ? 'Contact form is not available on this preview.'
              : 'Unable to send message.'
          );
        } else {
          throw new Error(result.error ?? 'Unable to send message.');
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Unable to send message.';
        status.textContent = `${message} Please email info@friendsofhealingsprings.org directly.`;
        status.classList.remove('text-stone-600');
        status.classList.add('text-red-700');
      } finally {
        if (submitBtn instanceof HTMLButtonElement) {
          submitBtn.disabled = false;
        }
      }
    });
  });
}

function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach((form) => {
    if (!(form instanceof HTMLFormElement)) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const status = form.querySelector('.newsletter-form-status');
      const submitBtn = form.querySelector('.newsletter-form-submit');

      if (!(status instanceof HTMLElement)) return;

      const formData = new FormData(form);
      const payload = {
        name: String(formData.get('name') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        website: String(formData.get('website') ?? '').trim(),
      };

      status.classList.remove('hidden', 'text-red-300', 'text-teal-200');
      status.classList.add('text-sand-200');
      status.textContent = 'Subscribing…';

      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));

        if (response.ok && result.ok) {
          status.textContent = 'Thank you for subscribing — we will be in touch.';
          status.classList.remove('text-sand-200');
          status.classList.add('text-teal-200');
          form.reset();
        } else {
          throw new Error(result.error ?? 'Unable to complete signup.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to complete signup.';
        status.textContent = `${message} Please email info@friendsofhealingsprings.org directly.`;
        status.classList.remove('text-sand-200');
        status.classList.add('text-red-300');
      } finally {
        if (submitBtn instanceof HTMLButtonElement) {
          submitBtn.disabled = false;
        }
      }
    });
  });
}

function selectedValues(form, name) {
  return Array.from(form.querySelectorAll(`input[name="${name}"]:checked`))
    .map((input) => (input instanceof HTMLInputElement ? input.value : ''))
    .filter(Boolean);
}

function initRsvpForms() {
  document.querySelectorAll('.rsvp-form').forEach((form) => {
    if (!(form instanceof HTMLFormElement)) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const status = form.querySelector('.rsvp-form-status');
      const submitBtn = form.querySelector('.rsvp-form-submit');
      if (!(status instanceof HTMLElement)) return;

      const formData = new FormData(form);
      const payload = {
        firstName: String(formData.get('firstName') ?? '').trim(),
        lastName: String(formData.get('lastName') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim(),
        attending: String(formData.get('attending') ?? '').trim(),
        participation: String(formData.get('participation') ?? '').trim(),
        interests: selectedValues(form, 'interests'),
        equipment: selectedValues(form, 'equipment'),
        equipmentNotes: String(formData.get('equipmentNotes') ?? '').trim(),
        notes: String(formData.get('notes') ?? '').trim(),
        website: String(formData.get('website') ?? '').trim(),
      };

      status.classList.remove('hidden', 'text-red-700', 'text-forest-700');
      status.classList.add('text-stone-600');
      status.textContent = 'Sending…';

      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = true;
      }

      try {
        const response = await fetch('/api/rsvp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const contentType = response.headers.get('content-type') ?? '';
        const result = contentType.includes('application/json')
          ? await response.json().catch(() => ({}))
          : {};

        if (response.ok && result.ok) {
          status.textContent = 'Thank you — we have your RSVP. See you at the pond!';
          status.classList.remove('text-stone-600');
          status.classList.add('text-forest-700');
          form.reset();
        } else if (!contentType.includes('application/json')) {
          throw new Error(
            response.status === 404
              ? 'RSVP form is not available on this preview.'
              : 'Unable to send RSVP.'
          );
        } else {
          throw new Error(result.error ?? 'Unable to send RSVP.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to send RSVP.';
        status.textContent = `${message} Please email info@friendsofhealingsprings.org directly.`;
        status.classList.remove('text-stone-600');
        status.classList.add('text-red-700');
      } finally {
        if (submitBtn instanceof HTMLButtonElement) {
          submitBtn.disabled = false;
        }
      }
    });
  });
}
