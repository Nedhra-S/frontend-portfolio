// Rules (regular expressions)
// Username: 4-20 letters, digits, dot, underscore  OR  a valid email address
const userRegex  = /^[A-Za-z][A-Za-z0-9._]{3,19}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
// Password: 8-20 chars with upper, lower, digit and special character (no spaces)
const passRegex  = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,20}$/;

const form = document.getElementById('login');
const msg = document.getElementById('msg');

form.addEventListener('submit', event => {
  event.preventDefault();
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value;
  let ok = true;

  // username check
  let uMsg = '';
  if (user === '') uMsg = 'Username or email must not be empty.';
  else if (!userRegex.test(user) && !emailRegex.test(user))
    uMsg = 'Enter a valid email, or a 4-20 character username (letters, digits, . or _).';
  document.getElementById('uErr').textContent = uMsg;

  // password check
  let pMsg = '';
  if (pass === '') pMsg = 'Password must not be empty.';
  else if (!passRegex.test(pass))
    pMsg = '8-20 characters with uppercase, lowercase, a digit and a special character.';
  document.getElementById('pErr').textContent = pMsg;

  ok = !uMsg && !pMsg;
  msg.className = ok ? 'msg ok' : 'msg err';
  msg.textContent = ok ? 'Login details are valid. Welcome, ' + user + '!' : 'Please correct the highlighted fields.';
});

form.addEventListener('reset', () => {
  document.getElementById('uErr').textContent = '';
  document.getElementById('pErr').textContent = '';
  msg.className = 'msg';
});
