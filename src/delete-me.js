const API_URL = 'https://api.theprocesstracker.com/api/v1/account';

// Same formats the server accepts (see Validator::isValidUuid / Auth::verifyToken)
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const SECRET_RE = /^[0-9a-f]{64}$/;

function showStatus(el, message, type) {
  el.textContent = message;
  el.className = `form-status form-status--${type}`;
  el.hidden = false;
}

async function deleteAccount(guid, secret) {
  let res;
  try {
    res = await fetch(API_URL, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${guid}.${secret}` },
    });
  } catch {
    throw new Error('Could not reach the server. Check your connection and try again.');
  }

  if (res.ok) return;
  if (res.status === 401) {
    throw new Error('GUID and secret were not recognised. Check them for typos — or the account may already be deleted.');
  }
  if (res.status === 429) {
    throw new Error('Too many attempts. Please wait a while before trying again.');
  }
  throw new Error(`The server could not delete the account (error ${res.status}). Please try again later.`);
}

function initDeleteForm() {
  const form = document.getElementById('deleteForm');
  if (!form) return;

  const guidInput = form.querySelector('#guid');
  const secretInput = form.querySelector('#secret');
  const confirmInput = form.querySelector('#confirm');
  const button = form.querySelector('#deleteBtn');
  const status = document.getElementById('formStatus');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const guid = guidInput.value.trim().toLowerCase();
    const secret = secretInput.value.trim().toLowerCase();

    if (!GUID_RE.test(guid)) {
      showStatus(status, 'That doesn\'t look like a valid GUID. It should look like xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx.', 'error');
      guidInput.focus();
      return;
    }
    if (!SECRET_RE.test(secret)) {
      showStatus(status, 'That doesn\'t look like a valid secret. It should be 64 characters of 0–9 and a–f.', 'error');
      secretInput.focus();
      return;
    }
    if (!confirmInput.checked) {
      showStatus(status, 'Please tick the box to confirm you understand the deletion is permanent.', 'error');
      confirmInput.focus();
      return;
    }

    button.disabled = true;
    button.textContent = 'Deleting…';
    status.hidden = true;

    try {
      await deleteAccount(guid, secret);
      form.reset();
      Array.from(form.elements).forEach(el => { el.disabled = true; });
      button.textContent = 'Account deleted';
      showStatus(status, 'Your account and all synced data have been deleted from the server. Any devices still linked to it will stop syncing — you can unlink them in Settings.', 'success');
    } catch (err) {
      button.disabled = false;
      button.textContent = 'Delete account permanently';
      showStatus(status, err.message, 'error');
    }
  });
}

document.addEventListener('DOMContentLoaded', initDeleteForm);
