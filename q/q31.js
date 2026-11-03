const idRegex = /^EMP\d{4}$/;   // EMP followed by exactly four digits
const form = document.getElementById('emp');
const idBox = document.getElementById('empid');
const idMsg = document.getElementById('idMsg');
const typeMsg = document.getElementById('typeMsg');
const msg = document.getElementById('msg');

function checkId() {
  const ok = idRegex.test(idBox.value.trim());
  idBox.classList.toggle('valid', ok);
  idBox.classList.toggle('invalid', !ok);
  idMsg.style.color = ok ? '#16a34a' : '#dc2626';
  idMsg.textContent = ok ? 'Valid Employee ID.' : 'Employee ID must be EMP followed by exactly 4 digits (e.g. EMP1234).';
  return ok;
}
function checkType() {
  const chosen = document.querySelector('input[name="type"]:checked');
  typeMsg.textContent = chosen ? '' : 'Please select an employment type.';
  return chosen;
}

idBox.addEventListener('input', checkId);          // live feedback while typing
form.addEventListener('submit', event => {
  event.preventDefault();
  const idOk = checkId();
  const chosen = checkType();
  if (idOk && chosen) {
    msg.className = 'msg ok';
    msg.textContent = 'Registration accepted: ' + idBox.value.trim() + ' (' + chosen.value + ').';
  } else {
    msg.className = 'msg err';
    msg.textContent = 'Registration not accepted. Please fix the errors.';
  }
});
form.addEventListener('reset', () => {
  idMsg.textContent = typeMsg.textContent = '';
  idBox.classList.remove('valid', 'invalid');
  msg.className = 'msg';
});
