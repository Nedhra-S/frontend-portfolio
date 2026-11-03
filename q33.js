const box = document.getElementById('box');
const info = document.getElementById('info');
const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'];
let index = 0;

box.addEventListener('click', () => {
  index = (index + 1) % colors.length;       // go to next colour
  box.style.backgroundColor = colors[index];
});
box.addEventListener('mouseover', () => { info.textContent = 'Mouse is over the box'; });
box.addEventListener('mouseout',  () => { info.innerHTML = '&nbsp;'; });
