const text = document.getElementById('text');
const button = document.getElementById('btn');
const original = text.textContent;     // remember the original text

button.addEventListener('mouseover', () => { text.textContent = 'Welcome to VIT!'; });
button.addEventListener('mouseout',  () => { text.textContent = original; });
