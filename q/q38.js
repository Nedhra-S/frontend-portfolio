const search = document.getElementById('search');
const typed = document.getElementById('typed');
const result = document.getElementById('result');

// keyup fires after each key is released, so input.value is already updated
search.addEventListener('keyup', event => {
  typed.textContent = search.value;
  search.classList.toggle('typing', search.value.length > 0);   // colour change when typing starts

  if (event.key === 'Enter') {
    result.textContent = 'Searching for: ' + search.value;
  }
});
