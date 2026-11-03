const images = [
  { src: '../assets/img/campus1.svg', name: 'Main Building' },
  { src: '../assets/img/campus2.svg', name: 'Central Library' },
  { src: '../assets/img/campus3.svg', name: 'Campus Garden' }
];
let current = 0;
const pic = document.getElementById('pic');
const caption = document.getElementById('caption');
const msg = document.getElementById('msg');

function show() {
  pic.src = images[current].src;
  caption.textContent = (current + 1) + ' / ' + images.length + ' - ' + images[current].name;
  msg.innerHTML = '&nbsp;';
}

document.addEventListener('keydown', event => {
  if (event.key === 'ArrowRight') { current = (current + 1) % images.length; show(); }
  else if (event.key === 'ArrowLeft') { current = (current - 1 + images.length) % images.length; show(); }
  else if (event.key === 'Enter') { msg.textContent = 'Image Selected'; }
});
show();
