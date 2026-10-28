import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase-config.js';

document.addEventListener('error', event => {
  const img = event.target;
  if (!(img instanceof HTMLImageElement) || img.dataset.imageFallback) return;
  if (!/^https?:$/.test(new URL(img.src, location.href).protocol)) return;
  const label = `${img.alt} ${img.src}`.toLowerCase();
  let fallback = 'hero-safari.png';
  let fallbackAlt = 'Tanzanian wildlife gathered at a waterhole';
  if (/zanzibar|island|coast|beach|ocean/.test(label)) {
    fallback = 'zanzibar.jfif';
    fallbackAlt = 'Boats on the turquoise coast of Zanzibar';
  } else if (/kilimanjaro|mountain|summit/.test(label)) {
    fallback = 'kilimanjaro.jfif';
    fallbackAlt = 'Mount Kilimanjaro rising above the plains';
  }
  img.dataset.imageFallback = 'true';
  img.src = fallback;
  img.alt = fallbackAlt;
}, true);

const configured = /^https:\/\/[\w.-]+\.supabase\.co$/.test(SUPABASE_URL) && SUPABASE_ANON_KEY.length > 20;
let client = null;
const authStorage = {
  getItem: key => (localStorage.getItem('safariya_remember_me') === 'true' ? localStorage : sessionStorage).getItem(key),
  setItem: (key, value) => (localStorage.getItem('safariya_remember_me') === 'true' ? localStorage : sessionStorage).setItem(key, value),
  removeItem: key => { localStorage.removeItem(key); sessionStorage.removeItem(key); }
};
const clientPromise = configured
  ? import('https://esm.sh/@supabase/supabase-js@2').then(({ createClient }) => {
      client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { storage: authStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
      });
      return client;
    }).catch(() => null)
  : Promise.resolve(null);

const packages = [
  { id:'serengeti-coast', title:'Serengeti to the Indian Ocean', duration:'10 days', kind:'Wildlife & coast', image:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Serengeti_National_Park_11_-_landscape.jpg/1280px-Serengeti_National_Park_11_-_landscape.jpg', alt:'Aerial view of a river and hippos in Serengeti National Park', summary:'A sample private safari followed by time on Zanzibar coast.', destinations:'Serengeti · Zanzibar', itinerary:'Sample outline: safari in the Serengeti, then time on Zanzibar. Day-by-day routing is not yet available and must be confirmed with SAFARIYA.', accommodation:'Not specified; request accommodation options.', inclusions:'Not specified; request a written inclusions list.', exclusions:'Not specified; request a written exclusions list.', requirements:'Travel documents, health guidance and park requirements depend on your itinerary and nationality. Confirm current requirements with qualified sources.' },
  { id:'northern-wild', title:'The northern wild', duration:'7 days', kind:'Safari', image:'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Serengeti_National_Park_11_-_landscape.jpg/1280px-Serengeti_National_Park_11_-_landscape.jpg', alt:'Open savannah and river landscape in Serengeti, northern Tanzania', summary:'A sample northern circuit through Tarangire, Ngorongoro and Serengeti.', destinations:'Tarangire · Ngorongoro · Serengeti', itinerary:'Sample outline only: Tarangire, Ngorongoro and Serengeti. Daily sequence and travel times are not published.', accommodation:'Not specified; request accommodation options.', inclusions:'Not specified; request a written inclusions list.', exclusions:'Not specified; request a written exclusions list.', requirements:'Confirm current park entry, travel document and health requirements when planning.' },
  { id:'above-clouds', title:'Above the clouds', duration:'9 days', kind:'Mountain', image:'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mount_Kilimanjaro.jpg/1280px-Mount_Kilimanjaro.jpg', alt:'Mount Kilimanjaro above the surrounding plains', summary:'A sample Kilimanjaro climb with an Arusha stay.', destinations:'Kilimanjaro · Arusha', itinerary:'Sample outline only: a Kilimanjaro climb and Arusha stay. Route and acclimatization schedule are not published.', accommodation:'Not specified; request accommodation and mountain camp details.', inclusions:'Not specified; request a written inclusions list.', exclusions:'Not specified; request a written exclusions list.', requirements:'Discuss altitude, fitness, equipment and route with qualified mountain professionals; summit success is never assured.' }
];

function message(el, text, kind='error') {
  if (!el) return;
  el.textContent = text;
  el.classList.remove('is-success', 'is-error');
  if (text) el.classList.add(kind === 'success' ? 'is-success' : 'is-error');
}
function esc(value='') {
  return String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
}
function safeReturn(value) {
  if (!value) return 'account.html';
  try {
    const target = new URL(value, location.origin);
    if (target.origin !== location.origin || target.pathname.endsWith('/auth.html')) return 'account.html';
    return `${target.pathname}${target.search}${target.hash}`;
  } catch { return 'account.html'; }
}
function friendlyAuthError(error) {
  const text = String(error?.message || 'Please try again.');
  if (/email not confirmed/i.test(text)) return 'Please verify your email using the link we sent before signing in.';
  if (/invalid login credentials/i.test(text)) return 'That email and password combination was not recognized.';
  if (/expired|invalid.*token|otp.*expired/i.test(text)) return 'This link has expired or was already used. Request a fresh email and try again.';
  if (/already registered|already been registered/i.test(text)) return 'An account may already use this email. Sign in or request a password reset.';
  return text;
}
async function requireSession(redirectTo=location.pathname + location.search) {
  if (!await clientPromise) {
    document.querySelector('#setup-note')?.removeAttribute('hidden');
    const status = document.querySelector('#package-status');
    if (status) message(status, 'Customer services are not connected yet. Follow the setup steps in README.md.');
    document.querySelector('#upcoming-bookings')?.replaceChildren(Object.assign(document.createElement('p'), { className:'empty-state', textContent:'Connect Supabase to view trip requests.' }));
    document.querySelector('#previous-bookings')?.replaceChildren(Object.assign(document.createElement('p'), { className:'empty-state', textContent:'Connect Supabase to view previous trips.' }));
    return null;
  }
  const { data, error } = await client.auth.getSession();
  if (error) {
    const status = document.querySelector('#package-status');
    if (status) message(status, friendlyAuthError(error));
    return null;
  }
  if (!data.session) {
    location.replace(`auth.html?return=${encodeURIComponent(redirectTo)}`);
    return null;
  }
  if (!data.session.user.email_confirmed_at) {
    await client.auth.signOut();
    location.replace(`auth.html?error=${encodeURIComponent('Please verify your email before opening your travel account.')}`);
    return null;
  }
  return data.session;
}
function setLoading(button, loading, label) {
  button.disabled = loading;
  const text = button.querySelector('span:first-child');
  if (text) text.textContent = label;
}

async function authPage() {
  const loginForm = document.querySelector('#auth-form');
  if (!loginForm) return;
  const signupForm = document.querySelector('#signup-form');
  const resetForm = document.querySelector('#reset-form');
  const params = new URLSearchParams(location.search);
  const tabs = document.querySelector('.login-mode-tabs');
  const divider = document.querySelector('.login-divider');
  const social = document.querySelector('.social-auth') || document.querySelector('#google-signin')?.parentElement;
  const createPrompt = document.querySelector('.login-create');
  const remember = document.querySelector('#remember-me');
  const signupStatus = signupForm.querySelector('.form-message');
  const resendButton = signupForm.querySelector('.resend-verification');
  let mode = params.get('mode') === 'register' ? 'register' : 'login';
  let verificationEmail = '';
  remember.checked = localStorage.getItem('safariya_remember_me') === 'true';

  function setMode(next) {
    mode = next;
    const registering = mode === 'register';
    loginForm.hidden = registering;
    signupForm.hidden = !registering;
    document.querySelector('#show-login').setAttribute('aria-selected', String(!registering));
    document.querySelector('#show-register').setAttribute('aria-selected', String(registering));
    document.querySelector('#auth-title').innerHTML = registering ? 'Begin your <em>journey.</em>' : 'Welcome <em>back.</em>';
    document.querySelector('.login-intro').textContent = registering
      ? 'Create your SAFARIYA account to save booking requests and travel plans.'
      : 'Sign in to return to your travel plans and booking requests.';
    document.querySelector('.login-create span').textContent = registering ? 'Already have an account?' : 'New to SAFARIYA?';
    document.querySelector('#create-account').innerHTML = registering ? 'Sign in <span aria-hidden="true">↗</span>' : 'Create an account <span aria-hidden="true">↗</span>';
    divider.hidden = false;
    if (social) social.hidden = false;
    document.querySelector('.login-options').hidden = registering;
    document.querySelector('.login-forgot').hidden = false;
    loginForm.elements.email.closest('label').hidden = false;
    loginForm.elements.email.required = true;
    loginForm.querySelector('.login-password-heading label').textContent = 'Password';
  }
  function showReset() {
    loginForm.hidden = true; signupForm.hidden = true; tabs.hidden = true;
    createPrompt.hidden = true; divider.hidden = true; if (social) social.hidden = true;
    resetForm.hidden = false;
    document.querySelector('#auth-title').innerHTML = 'Reset your <em>password.</em>';
    document.querySelector('.login-intro').textContent = 'Enter your email to receive a secure password reset link.';
  }
  function showRecovery() {
    signupForm.hidden = true; tabs.hidden = true; createPrompt.hidden = true;
    divider.hidden = true; if (social) social.hidden = true; loginForm.hidden = false;
    loginForm.elements.email.closest('label').hidden = true;
    loginForm.elements.email.required = false;
    document.querySelector('#auth-title').innerHTML = 'Choose a new <em>password.</em>';
    document.querySelector('.login-intro').textContent = 'Choose a new password for your SAFARIYA account.';
    loginForm.querySelector('.login-password-heading label').textContent = 'New password';
    loginForm.querySelector('.login-forgot').hidden = true;
    loginForm.querySelector('.login-options').hidden = true;
    loginForm.elements.password.autocomplete = 'new-password';
    loginForm.elements.password.minLength = 10;
  }
  setMode(mode);
  document.querySelector('#show-login').addEventListener('click', () => setMode('login'));
  document.querySelector('#show-register').addEventListener('click', () => setMode('register'));
  document.querySelector('#create-account').addEventListener('click', () => setMode(mode === 'register' ? 'login' : 'register'));
  document.querySelector('#forgot-password').addEventListener('click', showReset);
  document.querySelector('#reset-back').addEventListener('click', () => { resetForm.hidden = true; tabs.hidden = false; createPrompt.hidden = false; setMode('login'); });
  remember.addEventListener('change', () => localStorage.setItem('safariya_remember_me', String(remember.checked)));
  document.querySelectorAll('[data-toggle-password]').forEach(button => button.addEventListener('click', () => {
    const field = document.getElementById(button.dataset.togglePassword);
    const visible = field.type === 'password';
    field.type = visible ? 'text' : 'password';
    button.textContent = visible ? 'Hide' : 'Show';
    button.setAttribute('aria-label', visible ? 'Hide password' : 'Show password');
    button.setAttribute('aria-pressed', String(visible));
  }));
  for (const [id, provider] of [['google-signin', 'google'], ['apple-signin', 'apple']]) {
    document.getElementById(id)?.addEventListener('click', async event => {
      const button = event.currentTarget;
      const note = document.querySelector('#google-note');
      message(note, '');
      if (!await clientPromise) { if (note) { note.hidden = false; message(note, 'Connect Supabase and enable this provider to use social sign-in.'); } return; }
      button.disabled = true;
      try {
        const callback = new URL('auth.html', location.href);
        callback.searchParams.set('return', safeReturn(params.get('return')));
        sessionStorage.setItem('safariya_oauth_pending', '1');
        const { error } = await client.auth.signInWithOAuth({ provider, options: { redirectTo: callback.href, ...(provider === 'google' ? { queryParams: { prompt: 'select_account' } } : {}) } });
        if (error) throw error;
      } catch (error) { sessionStorage.removeItem('safariya_oauth_pending'); if (note) { note.hidden = false; message(note, friendlyAuthError(error)); } button.disabled = false; }
    });
  }

  const fragmentParams = new URLSearchParams(location.hash.replace(/^#/, ''));
  const callbackError = params.get('error_description') || params.get('error') || fragmentParams.get('error_description') || fragmentParams.get('error');
  if (callbackError) {
    const text = friendlyAuthError({ message: callbackError.replaceAll('+', ' ') });
    message(loginForm.querySelector('.form-message'), text);
    const cleanUrl = new URL(location.href);
    for (const key of ['error', 'error_description', 'error_code', 'error_status']) cleanUrl.searchParams.delete(key);
    cleanUrl.hash = '';
    history.replaceState({}, '', `${cleanUrl.pathname}${cleanUrl.search}`);
  }
  if (!await clientPromise) {
    document.querySelector('#setup-note')?.removeAttribute('hidden');
  } else {
    const { data, error } = await client.auth.getSession();
    if (error) message(loginForm.querySelector('.form-message'), friendlyAuthError(error));
    if (data.session && params.get('mode') !== 'recovery') {
      const confirmed = Boolean(data.session.user.email_confirmed_at);
      if (sessionStorage.getItem('safariya_oauth_pending') === '1') {
        sessionStorage.removeItem('safariya_oauth_pending');
        location.replace(safeReturn(params.get('return')));
        return;
      }
      if (params.has('code') || params.get('verified') === '1') {
        loginForm.hidden = true; signupForm.hidden = true; tabs.hidden = true; createPrompt.hidden = true;
        divider.hidden = true; if (social) social.hidden = true;
        document.querySelector('#auth-title').innerHTML = confirmed ? 'You are <em>signed in.</em>' : 'Check your <em>email.</em>';
        document.querySelector('.login-intro').textContent = confirmed ? 'Your account is ready. Continue to your SAFARIYA travel space.' : 'Complete email verification to activate your account.';
        if (confirmed) {
          const proceed = document.createElement('a');
          proceed.className = 'login-submit'; proceed.href = safeReturn(params.get('return')); proceed.textContent = 'Continue to your account ↗';
          document.querySelector('.login-intro').after(proceed);
        }
        return;
      }
      location.replace(safeReturn(params.get('return')));
      return;
    }
    if (params.get('mode') === 'recovery') showRecovery();
    else if (params.get('mode') === 'register') setMode('register');
  }

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    const status = loginForm.querySelector('.form-message'); message(status, '');
    if (!loginForm.reportValidity()) return;
    if (!client) { message(status, 'Account services are not connected yet. Follow the setup guide in README.md.'); return; }
    const button = loginForm.querySelector('[type=submit]');
    const recovery = params.get('mode') === 'recovery';
    setLoading(button, true, recovery ? 'Saving password…' : 'Signing in…');
    try {
      if (recovery) {
        const { error } = await client.auth.updateUser({ password: loginForm.elements.password.value });
        if (error) throw error;
        message(status, 'Your password has been updated. You can now continue to your account.', 'success');
        setTimeout(() => location.assign(safeReturn(params.get('return'))), 800);
      } else {
        const { error } = await client.auth.signInWithPassword({ email: loginForm.elements.email.value.trim(), password: loginForm.elements.password.value });
        if (error) throw error;
        localStorage.setItem('safariya_remember_me', String(remember.checked));
        location.replace(safeReturn(params.get('return')));
      }
    } catch (error) { message(status, friendlyAuthError(error)); }
    finally { setLoading(button, false, recovery ? 'Save new password' : 'Sign in to your account'); }
  });

  signupForm.addEventListener('submit', async event => {
    event.preventDefault(); message(signupStatus, ''); resendButton.hidden = true;
    if (!signupForm.reportValidity()) return;
    if (signupForm.elements.password.value.length < 10) { message(signupStatus, 'Use at least 10 characters for your password.'); return; }
    if (signupForm.elements.password.value !== signupForm.elements.confirm_password.value) { message(signupStatus, 'The passwords do not match.'); signupForm.elements.confirm_password.focus(); return; }
    if (!client) { message(signupStatus, 'Account services are not connected yet. Follow the setup guide in README.md.'); return; }
    const button = signupForm.querySelector('[type=submit]'); setLoading(button, true, 'Creating account…');
    verificationEmail = signupForm.elements.email.value.trim();
    try {
      const callback = new URL('auth.html', location.href);
      callback.searchParams.set('return', safeReturn(params.get('return')));
      const { data, error } = await client.auth.signUp({
        email: verificationEmail,
        password: signupForm.elements.password.value,
        options: { data: { full_name: signupForm.elements.full_name.value.trim() }, emailRedirectTo: callback.href }
      });
      if (error) throw error;
      if (!data.session?.user?.email_confirmed_at) {
        if (data.session) await client.auth.signOut();
        message(signupStatus, 'Account started. Check your inbox and verify your email before signing in.', 'success');
        resendButton.hidden = false;
      } else {
        location.replace(safeReturn(params.get('return')));
      }
    } catch (error) { message(signupStatus, friendlyAuthError(error)); if (/already registered/i.test(error.message || '')) resendButton.hidden = false; }
    finally { setLoading(button, false, 'Create your account'); }
  });
  resendButton.addEventListener('click', async () => {
    const status = signupStatus;
    if (!client || !verificationEmail) { message(status, 'Submit your email again to request a verification message.'); return; }
    const button = resendButton; button.disabled = true; button.textContent = 'Sending…';
    try {
      const callback = new URL('auth.html', location.href);
      callback.searchParams.set('return', safeReturn(params.get('return')));
      const { error } = await client.auth.resend({ type: 'signup', email: verificationEmail, options: { emailRedirectTo: callback.href } });
      if (error) throw error;
      message(status, 'If the address can be verified, a new confirmation email is on its way.', 'success');
    } catch (error) { message(status, friendlyAuthError(error)); }
    finally { button.disabled = false; button.textContent = 'Resend verification email'; }
  });
  resetForm.addEventListener('submit', async event => {
    event.preventDefault();
    const status = resetForm.querySelector('.form-message'); message(status, '');
    if (!resetForm.reportValidity()) return;
    if (!client) { message(status, 'Account services are not connected yet. Follow the setup guide in README.md.'); return; }
    const button = resetForm.querySelector('[type=submit]'); setLoading(button, true, 'Sending…');
    try {
      const callback = new URL('auth.html', location.href); callback.searchParams.set('mode', 'recovery'); callback.searchParams.set('return', safeReturn(params.get('return')));
      const { error } = await client.auth.resetPasswordForEmail(resetForm.elements.email.value.trim(), { redirectTo: callback.href });
      if (error) throw error;
      message(status, 'If an account exists for that email, a password reset link is on its way.', 'success');
    } catch (error) { message(status, friendlyAuthError(error)); }
    finally { setLoading(button, false, 'Send reset link'); }
  });
}

function packageCard(item) {
  return `<article class="package-card"><img src="${item.image}" alt="${esc(item.alt)}" loading="lazy"><div class="package-card-body"><p class="eyebrow">${esc(item.kind)} · ${esc(item.duration)}</p><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p><p class="price-note">Price on request</p><a class="button button-dark" href="package.html?id=${encodeURIComponent(item.id)}">Explore &amp; request <span>↗</span></a></div></article>`;
}
async function requestChange(bookingId, button) {
  const form = document.getElementById(`change-${bookingId}`);
  if (!form) return;
  form.hidden = !form.hidden;
  button.setAttribute('aria-expanded', String(!form.hidden));
}
async function dashboard() {
  const root = document.querySelector('#package-list');
  if (!root) return;
  const session = await requireSession(); if (!session) return;
  const user = session.user;
  const fallbackName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'traveller';
  let name = fallbackName;
  try {
    const { data, error } = await client.from('customer_profiles').select('full_name').eq('id', user.id).maybeSingle();
    if (!error && data?.full_name) name = data.full_name;
  } catch { /* Auth metadata remains a safe display fallback. */ }
  document.querySelector('#customer-name').textContent = name;
  document.querySelector('#customer-email').textContent = user.email || '';
  const profileForm = document.querySelector('#profile-form');
  const editProfile = document.querySelector('#edit-profile');
  profileForm.elements.full_name.value = name === 'traveller' ? '' : name;
  editProfile.addEventListener('click', () => {
    profileForm.hidden = !profileForm.hidden;
    editProfile.setAttribute('aria-expanded', String(!profileForm.hidden));
    if (!profileForm.hidden) profileForm.elements.full_name.focus();
  });
  profileForm.addEventListener('submit', async event => {
    event.preventDefault();
    const status = profileForm.querySelector('.form-message'); message(status, '');
    if (!profileForm.reportValidity()) return;
    const fullName = profileForm.elements.full_name.value.trim();
    if (fullName.length < 2) { message(status, 'Enter a name with at least two characters.'); profileForm.elements.full_name.focus(); return; }
    const button = profileForm.querySelector('[type=submit]'); button.disabled = true; button.textContent = 'Saving…';
    try {
      const { error } = await client.from('customer_profiles').update({ full_name:fullName }).eq('id', user.id);
      if (error) throw error;
      name = fullName;
      document.querySelector('#customer-name').textContent = name;
      message(status, 'Your profile has been updated.', 'success');
    } catch (error) { message(status, `Could not update your profile: ${friendlyAuthError(error)}`); }
    finally { button.disabled = false; button.textContent = 'Save profile'; }
  });
  root.innerHTML = packages.map(packageCard).join('');
  try {
    const { data, error } = await client.from('bookings').select('id,package_id,status,payment_status,start_date,end_date,travellers,special_requests,created_at').order('created_at', { ascending:false });
    if (error) throw error;
    if (!data.length) {
      document.querySelector('#upcoming-bookings').innerHTML = '<p class="empty-state">You have no trip requests yet. When you send one, it will appear here.</p>';
      document.querySelector('#previous-bookings').innerHTML = '<p class="empty-state">No previous trips yet.</p>';
      return;
    }
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = data.filter(item => !item.start_date || item.start_date >= today);
    const previous = data.filter(item => item.start_date && item.start_date < today);
    const renderRows = rows => rows.map(item => {
      const journey = packages.find(entry => entry.id === item.package_id);
      const date = item.start_date ? `${esc(item.start_date)}${item.end_date ? ` – ${esc(item.end_date)}` : ''}` : 'Dates to be confirmed';
      const payment = item.payment_status || 'not_started';
      return `<article class="booking-row"><div><p class="eyebrow">${esc(journey?.duration || 'Journey request')} · ${esc(date)}</p><h3>${esc(journey?.title || 'Travel request')}</h3><p>${Number(item.travellers)} traveller${Number(item.travellers) === 1 ? '' : 's'} · ${esc(item.status)}</p><p class="payment-state">Payment: ${esc(payment.replaceAll('_', ' '))}</p></div><button class="text-button change-request-toggle" type="button" data-booking="${esc(item.id)}" aria-expanded="false" aria-controls="change-${esc(item.id)}">Request a change</button><form class="change-request-form" id="change-${esc(item.id)}" data-booking="${esc(item.id)}" hidden><label>What would you like to change?<textarea name="request" maxlength="2000" rows="3" required></textarea></label><button class="button button-dark" type="submit">Send change request</button><p class="form-message" role="status" aria-live="polite"></p></form></article>`;
    }).join('');
    document.querySelector('#upcoming-bookings').innerHTML = upcoming.length ? renderRows(upcoming) : '<p class="empty-state">No upcoming trip requests.</p>';
    document.querySelector('#previous-bookings').innerHTML = previous.length ? renderRows(previous) : '<p class="empty-state">No previous trips yet.</p>';
    document.querySelectorAll('.change-request-toggle').forEach(button => button.addEventListener('click', () => requestChange(button.dataset.booking, button)));
    document.querySelectorAll('.change-request-form').forEach(form => form.addEventListener('submit', async event => {
      event.preventDefault(); const status = form.querySelector('.form-message'); message(status, '');
      if (!form.reportValidity()) return;
      const button = form.querySelector('[type=submit]'); button.disabled = true; button.textContent = 'Sending…';
      try {
        const { error } = await client.from('booking_change_requests').insert({ booking_id: form.dataset.booking, user_id: user.id, request_text: form.elements.request.value.trim() });
        if (error) throw error;
        message(status, 'Your change request has been sent to the SAFARIYA team. It is not yet applied to your trip.', 'success'); form.reset();
      } catch (error) { message(status, `Could not send the change request: ${friendlyAuthError(error)}`); }
      finally { button.disabled = false; button.textContent = 'Send change request'; }
    }));
  } catch (error) {
    const failure = `<p class="empty-state is-error">Could not load your trip requests: ${esc(error.message)}. Check the database setup.</p>`;
    document.querySelector('#upcoming-bookings').innerHTML = failure;
    document.querySelector('#previous-bookings').innerHTML = '';
  }
}

async function packagePage() {
  const root = document.querySelector('#package-detail'); if (!root) return;
  const journey = packages.find(item => item.id === new URLSearchParams(location.search).get('id'));
  if (!journey) { root.innerHTML = '<section class="empty-state"><h1>Journey not found</h1><a href="journeys.html">Browse journeys</a></section>'; return; }
  await clientPromise;
  let session = null;
  if (client) {
    const { data } = await client.auth.getSession();
    session = data.session;
    if (session && !session.user.email_confirmed_at) { await client.auth.signOut(); session = null; }
  }
  document.title = `${journey.title} | SAFARIYA`;
  root.innerHTML = `<section class="package-hero"><img src="${journey.image}" alt="${esc(journey.alt)}"><div><p class="eyebrow light">${esc(journey.kind)} · ${esc(journey.duration)}</p><h1>${esc(journey.title)}</h1><p>${esc(journey.summary)}</p><p class="price-note">Price on request · no published availability</p><a class="button button-light" href="#booking-panel">Request this journey <span>↓</span></a></div></section><section class="package-facts"><div><p class="eyebrow">DURATION</p><strong>${esc(journey.duration)}</strong></div><div><p class="eyebrow">DESTINATIONS</p><strong>${esc(journey.destinations)}</strong></div><div><p class="eyebrow">PRICE</p><strong>On request</strong></div></section><section class="package-editorial"><article><p class="eyebrow">SAMPLE ITINERARY</p><h2>A journey at <em>your pace.</em></h2><p>${esc(journey.itinerary)}</p><h3>Accommodation</h3><p>${esc(journey.accommodation)}</p><h3>Included</h3><p>${esc(journey.inclusions)}</p><h3>Not included</h3><p>${esc(journey.exclusions)}</p><h3>Travel requirements</h3><p>${esc(journey.requirements)}</p></article><aside class="package-note"><strong>Planning with care</strong><p>This sample has no confirmed dates, price or reservation. SAFARIYA must confirm the final itinerary, accommodation and availability directly with you.</p><p>Payment is not collected on this site.</p></aside></section>`;
  const form = document.querySelector('#booking-form');
  const today = new Date().toISOString().slice(0, 10);
  for (const fieldName of ['start_date', 'end_date']) {
    form.elements[fieldName].min = today;
    form.elements[fieldName].addEventListener('change', updateSummary);
  }
  form.elements.travellers.addEventListener('input', updateSummary);
  const draftKey = `safariya_trip_draft_${journey.id}`;
  try {
    const draft = JSON.parse(sessionStorage.getItem(draftKey) || 'null');
    if (draft) {
      form.elements.start_date.value = draft.start_date || '';
      form.elements.end_date.value = draft.end_date || '';
      form.elements.travellers.value = String(draft.travellers || 2);
      sessionStorage.removeItem(draftKey);
    }
  } catch { sessionStorage.removeItem(draftKey); }
  function updateSummary() {
    document.querySelector('#booking-summary').textContent = `${journey.title} · ${journey.duration} · ${form.elements.start_date.value || 'dates on request'} · ${form.elements.travellers.value} traveller(s) · price on request`;
  }
  updateSummary();
  form.addEventListener('submit', async event => {
    event.preventDefault(); const status = document.querySelector('#booking-message'); message(status, '');
    if (!form.reportValidity()) return;
    const start = form.elements.start_date.value || null; const end = form.elements.end_date.value || null;
    if (start && end && end < start) { message(status, 'Departure date must be on or after arrival.'); return; }
    if (!session) {
      sessionStorage.setItem(draftKey, JSON.stringify({ start_date:start, end_date:end, travellers:Number(form.elements.travellers.value) }));
      location.assign(`auth.html?return=${encodeURIComponent(location.pathname + location.search)}`);
      return;
    }
    if (!client) { message(status, 'Booking services are not connected yet. Follow README.md setup steps.'); return; }
    const button = form.querySelector('[type=submit]'); button.disabled = true; button.textContent = 'Recording request…';
    try {
      const { error } = await client.from('bookings').insert({ user_id:session.user.id, package_id:journey.id, start_date:start, end_date:end, travellers:Number(form.elements.travellers.value), phone:form.elements.phone.value.trim() || null, special_requests:form.elements.special_requests.value.trim() || null });
      if (error) throw error;
      message(status, 'Your trip request was recorded. It is not a confirmed reservation; our team must confirm availability and details with you.', 'success');
      form.reset(); form.elements.travellers.value = '2'; updateSummary();
    } catch (error) { message(status, `Request could not be recorded: ${friendlyAuthError(error)}. Check the database setup and try again.`); }
    finally { button.disabled = false; button.innerHTML = 'Submit booking request <span>↗</span>'; }
  });
}

document.querySelector('#sign-out')?.addEventListener('click', async () => {
  const button = document.querySelector('#sign-out'); button.disabled = true;
  if (!await clientPromise) { location.assign('auth.html'); return; }
  const { error } = await client.auth.signOut();
  if (error) { button.disabled = false; message(document.querySelector('#account-status'), friendlyAuthError(error)); return; }
  location.replace('auth.html');
});
authPage();
dashboard();
packagePage();
