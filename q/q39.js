const options = document.querySelectorAll('.option');
const msg = document.getElementById('msg');
let selected = null;

// mouse click -> select and highlight the option
options.forEach(opt => opt.addEventListener('click', () => {
  options.forEach(o => o.classList.remove('selected'));
  opt.classList.add('selected');
  selected = opt.dataset.value;
  msg.textContent = '';
}));

function submitAnswer() {
  if (!selected) { msg.style.color = '#b91c1c'; msg.textContent = 'Please select an answer first.'; return; }
  msg.style.color = '#166534';
  msg.textContent = 'Answer Submitted Successfully (Option ' + selected + ')';
}

// keyboard -> Enter submits the selected answer
document.addEventListener('keydown', event => { if (event.key === 'Enter') submitAnswer(); });
document.getElementById('submit').addEventListener('click', submitAnswer);
