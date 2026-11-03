// Regular expressions for each field
const rules = {
  pname:  { re: /^[A-Za-z ]+$/,            err: 'nErr', text: 'Name can contain only alphabets and spaces.' },
  regno:  { re: /^REG\d{6}$/,              err: 'rErr', text: 'Register number must be REG followed by exactly 6 digits.' },
  email:  { re: /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/, err: 'eErr', text: 'Enter a valid email address.' },
  mobile: { re: /^\d{10}$/,                err: 'mErr', text: 'Mobile number must contain exactly 10 digits.' }
};

const form = document.getElementById('reg');
const msg = document.getElementById('msg');
const output = document.getElementById('output');

form.addEventListener('submit', event => {
  event.preventDefault();
  output.innerHTML = '';
  let valid = true;

  for (const id in rules) {
    const value = document.getElementById(id).value.trim();
    const ok = rules[id].re.test(value);
    document.getElementById(rules[id].err).textContent = ok ? '' : rules[id].text;
    if (!ok) valid = false;
  }

  const dept = document.getElementById('dept').value;
  document.getElementById('dErr').textContent = dept ? '' : 'Please select a department.';
  if (!dept) valid = false;

  // Array that stores all the selected technical skills
  const skills = [];
  document.querySelectorAll('input[name="skills"]:checked').forEach(box => skills.push(box.value));

  if (!valid) {
    msg.className = 'msg err';
    msg.textContent = 'Registration failed. Please fix the errors shown above.';
    return;
  }

  msg.className = 'msg ok';
  msg.textContent = 'Registration successful! Thank you for registering.';

  const name = document.getElementById('pname').value.trim();
  output.innerHTML =
    '<table><tr><th>Participant Name</th><th>Department</th><th>Skills Selected</th></tr>' +
    '<tr><td>' + escapeHtml(name) + '</td><td>' + dept + '</td><td>' +
    (skills.length ? skills.join(', ') : 'None') + '</td></tr></table>';
});

form.addEventListener('reset', () => {
  document.querySelectorAll('.err-text').forEach(e => e.textContent = '');
  msg.className = 'msg';
  output.innerHTML = '';
});

// keep user text from being interpreted as HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
