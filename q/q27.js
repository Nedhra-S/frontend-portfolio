const ids = ['m1', 'm2', 'm3'];
const msg = document.getElementById('msg');
const result = document.getElementById('result');

document.getElementById('calc').addEventListener('click', () => {
  const marks = ids.map(id => document.getElementById(id).value);

  // every box must contain a number between 0 and 100
  const bad = marks.some(v => v === '' || isNaN(v) || v < 0 || v > 100);
  if (bad) {
    result.classList.remove('show');
    msg.className = 'msg err';
    msg.textContent = 'Please enter valid marks (0 to 100) for all three subjects.';
    return;
  }

  const total = marks.reduce((sum, v) => sum + Number(v), 0);
  const average = total / marks.length;

  document.getElementById('total').textContent = total;
  document.getElementById('avg').textContent = average.toFixed(2);
  result.classList.add('show');
  msg.className = 'msg';
});

document.getElementById('form').addEventListener('reset', () => {
  result.classList.remove('show');
  msg.className = 'msg';
});
