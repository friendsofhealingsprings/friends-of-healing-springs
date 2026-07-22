/** Donation amount selection and Stripe Checkout redirect */
document.addEventListener('DOMContentLoaded', () => {
  initDonateForm();
});

function initDonateForm() {
  const form = document.getElementById('donate-form');
  if (!(form instanceof HTMLFormElement)) return;

  const amountButtons = form.querySelectorAll('.donate-amount-btn');
  const customInput = form.querySelector('#donate-custom-amount');
  const status = document.getElementById('donate-status');
  const submitBtn = document.getElementById('donate-submit');

  let selectedAmount = null;

  const clearAmountSelection = () => {
    selectedAmount = null;
    amountButtons.forEach((btn) => {
      btn.classList.remove('border-water-600', 'bg-water-50', 'text-water-800');
      btn.classList.add('border-stone-300', 'bg-base', 'text-forest-800');
    });
  };

  const selectAmount = (btn) => {
    clearAmountSelection();
    selectedAmount = Number(btn.getAttribute('data-amount'));
    btn.classList.remove('border-stone-300', 'bg-base', 'text-forest-800');
    btn.classList.add('border-water-600', 'bg-water-50', 'text-water-800');
    if (customInput instanceof HTMLInputElement) {
      customInput.value = '';
    }
  };

  amountButtons.forEach((btn) => {
    btn.addEventListener('click', () => selectAmount(btn));
  });

  if (customInput instanceof HTMLInputElement) {
    customInput.addEventListener('input', () => {
      if (customInput.value.trim()) {
        clearAmountSelection();
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!(status instanceof HTMLElement)) return;

    const customValue =
      customInput instanceof HTMLInputElement ? Number(customInput.value.trim()) : NaN;
    const amount = Number.isFinite(customValue) && customValue > 0 ? customValue : selectedAmount;

    if (!amount || amount < 5) {
      status.classList.remove('hidden', 'text-forest-700');
      status.classList.add('text-red-700');
      status.textContent = 'Please select or enter a donation of at least $5.';
      return;
    }

    const frequencyInput = form.querySelector('input[name="frequency"]:checked');
    const frequency =
      frequencyInput instanceof HTMLInputElement ? frequencyInput.value : 'once';

    status.classList.remove('hidden', 'text-red-700', 'text-forest-700');
    status.classList.add('text-stone-600');
    status.textContent = 'Redirecting to secure checkout…';

    if (submitBtn instanceof HTMLButtonElement) {
      submitBtn.disabled = true;
    }

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, frequency }),
      });

      const result = await response.json().catch(() => ({}));

      if (response.ok && result.ok && result.url) {
        window.location.href = result.url;
        return;
      }

      throw new Error(result.error ?? 'Unable to start checkout.');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to start checkout.';
      status.textContent = `${message} Please email info@healingsprings.org to donate offline.`;
      status.classList.remove('text-stone-600');
      status.classList.add('text-red-700');
    } finally {
      if (submitBtn instanceof HTMLButtonElement) {
        submitBtn.disabled = false;
      }
    }
  });
}
