// Show how this page is being served (file:// vs a real web server)
const loc = window.location;
document.getElementById('proto').textContent = loc.protocol;
document.getElementById('host').textContent = loc.hostname || '(none - opened as a file)';
document.getElementById('port').textContent = loc.port || (loc.protocol === 'https:' ? '443 (default)' : loc.protocol === 'http:' ? '80 (default)' : '-');
const mode = document.getElementById('mode');
if (loc.protocol.startsWith('http')) {
  mode.textContent = 'A web server (http) - local server is working';
  mode.className = 'ok';
} else {
  mode.textContent = 'Opened directly from disk (file://) - start a local server to see http://localhost';
  mode.className = 'warn';
}
