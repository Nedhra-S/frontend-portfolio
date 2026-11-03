const message = document.getElementById('message');

document.querySelectorAll('.light').forEach(light => {
  light.addEventListener('mouseover', () => {
    light.classList.add('active');                 // highlight
    message.textContent = light.dataset.msg;       // STOP / READY / GO
    message.style.color = light.dataset.color;
  });
  light.addEventListener('mouseout', () => {
    light.classList.remove('active');              // restore
    message.innerHTML = '&nbsp;';
  });
});
