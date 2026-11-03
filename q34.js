const wrap = document.getElementById('wrap');
const extra = document.getElementById('extra');
const details = document.getElementById('details');

// mouse over the image -> change appearance + show extra info
wrap.addEventListener('mouseover', () => {
  wrap.classList.add('hover');
  extra.style.display = 'block';
});
// mouse leaves -> restore original appearance
wrap.addEventListener('mouseout', () => {
  wrap.classList.remove('hover');
  extra.style.display = 'none';
});
// click on the button -> show price and availability
document.getElementById('view').addEventListener('click', () => {
  details.innerHTML = 'Price: &#8377;2,499<br>Availability: In Stock (12 left)';
});
