// username@vit.ac.in  (username: letters, digits, dot, underscore, hyphen)
const emailRegex = /^[A-Za-z0-9._-]+@vit\.ac\.in$/;

document.getElementById('workshop').addEventListener('submit', event => {
  event.preventDefault();
  const msg = document.getElementById('msg');
  const email = document.getElementById('email').value.trim();
  const selected = document.querySelectorAll('input[name="interest"]:checked');
  const errors = [];

  if (!emailRegex.test(email)) errors.push('Enter a valid VIT email in the format username@vit.ac.in.');
  if (selected.length === 0) errors.push('Select at least one technical interest.');

  if (errors.length) {
    msg.className = 'msg err';
    msg.innerHTML = errors.join('<br>');
  } else {
    const names = Array.from(selected).map(box => box.value).join(', ');
    msg.className = 'msg ok';
    msg.textContent = 'Registration successful for ' + email + ' (' + names + ').';
  }
});
