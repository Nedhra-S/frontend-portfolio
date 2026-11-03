const pin = document.getElementById('pin');
const status = document.getElementById('status');
const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'];

pin.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    status.className = 'ok';
    status.textContent = 'PIN Submitted Successfully';
    return;
  }
  if (allowed.includes(event.key)) return;

  if (/^[0-9]$/.test(event.key)) {
    status.className = 'ok';
    status.textContent = 'PIN Entry Started';
  } else {
    event.preventDefault();                       // block non-numeric characters
    status.className = 'warn';
    status.textContent = 'Warning: only numbers are allowed!';
  }
});
