const input = document.getElementById('search');
const keyOut = document.getElementById('key');
const status = document.getElementById('status');

input.addEventListener('keydown', event => {
  keyOut.textContent = event.key === ' ' ? 'Space' : event.key;   // show the key pressed

  if (event.key === 'Enter') {
    status.textContent = 'Searching for student\u2026';
  } else if (event.key === 'Escape') {
    input.value = '';          // clear the input field
    status.textContent = '';   // and the message
    keyOut.textContent = '-';
  }
});
