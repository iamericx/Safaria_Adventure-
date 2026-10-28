import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY
} from './supabase-config.js';

const journeyForm = document.querySelector('#journey-request');
const journeyStatus = document.querySelector('#journey-form-status');
const journeyDate = journeyForm?.elements.namedItem('date');

if (journeyDate) {
  const today = new Date();
  journeyDate.min = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  ).toISOString().slice(0, 10);
}

journeyForm?.addEventListener('submit', async (event) => {
  event.preventDefault();

  journeyStatus.textContent = '';
  journeyStatus.classList.remove('is-error');

  if (!journeyForm.checkValidity()) {
    journeyStatus.textContent = 'Please check the required fields and try again.';
    journeyStatus.classList.add('is-error');
    journeyForm.reportValidity();
    return;
  }

  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY ||
    !SUPABASE_URL.startsWith('https://')
  ) {
    journeyStatus.textContent =
      'Booking service is not configured. Please try again later.';
    journeyStatus.classList.add('is-error');
    return;
  }

  const formData = new FormData(journeyForm);

  const booking = {
    user_id: null,
    package_id: String(formData.get('package_id') || formData.get('package') || '').trim(),
    start_date: String(formData.get('date') || '').trim(),
    end_date: String(formData.get('end_date') || '').trim(),
    travellers: Number(formData.get('travellers')),
    phone: String(formData.get('phone') || '').trim(),
    special_requests: String(formData.get('special_requests') || '').trim() || null
  };

  if (
    !booking.package_id ||
    !booking.start_date ||
    !booking.end_date ||
    !Number.isInteger(booking.travellers) ||
    booking.travellers < 1 ||
    booking.travellers > 20 ||
    booking.end_date < booking.start_date ||
    booking.phone.length < 5 ||
    booking.phone.length > 40
  ) {
    journeyStatus.textContent =
      'Please check your trip details, dates, traveller count and phone number.';
    journeyStatus.classList.add('is-error');
    return;
  }

  journeyStatus.textContent = 'Sending your booking request…';

  try {
    const response = await fetch(
      `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/bookings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          Prefer: 'return=minimal'
        },
        body: JSON.stringify(booking)
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.details || `Request failed (${response.status})`);
    }

    journeyStatus.textContent =
      'Your request has been submitted successfully. Our team will contact you to confirm the details.';
    journeyStatus.classList.remove('is-error');
    journeyForm.reset();
  } catch (error) {
    console.error('Safariya booking submission failed:', error);
    journeyStatus.textContent =
      'We could not submit your request. Please check your connection and try again.';
    journeyStatus.classList.add('is-error');
  }
});