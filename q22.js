// HTML5 has no "match another field" rule, so use the constraint-validation API.
const pw = document.getElementById('password');
const cpw = document.getElementById('cpassword');
function checkMatch() {
  cpw.setCustomValidity(pw.value === cpw.value ? '' : 'Passwords do not match');
}
pw.addEventListener('input', checkMatch);
cpw.addEventListener('input', checkMatch);
