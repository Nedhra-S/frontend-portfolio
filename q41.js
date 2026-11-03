const places = [
  { src: '../assets/img/goa.svg',    name: 'Goa - Beaches' },
  { src: '../assets/img/manali.svg', name: 'Manali - Himalayas' },
  { src: '../assets/img/jaipur.svg', name: 'Jaipur - The Pink City' },
  { src: '../assets/img/kerala.svg', name: 'Kerala - Backwaters' }
];
let i = 0;
const pic = document.getElementById('pic');
const place = document.getElementById('place');

document.addEventListener('keydown', event => {
  const key = event.key.toLowerCase();
  if (key === 'n') { i = (i + 1) % places.length; pic.src = places[i].src; place.innerHTML = '&nbsp;'; }
  else if (key === 'p') { i = (i - 1 + places.length) % places.length; pic.src = places[i].src; place.innerHTML = '&nbsp;'; }
  else if (event.code === 'Space') { event.preventDefault(); place.textContent = places[i].name; }
});
