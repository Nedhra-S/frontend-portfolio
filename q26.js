// Cart summary: subtotal = quantity x price, then the grand total
const fmt = n => '₹' + n.toLocaleString('en-IN');
let total = 0;
document.querySelectorAll('#cart tbody tr').forEach(row => {
  const qty = Number(row.cells[1].textContent);
  const price = Number(row.cells[2].dataset.price);
  const sub = qty * price;
  row.querySelector('.sub').textContent = fmt(sub);
  total += sub;
});
document.getElementById('total').textContent = fmt(total);

document.getElementById('place').addEventListener('click', () => {
  document.getElementById('msg').textContent = 'Order placed successfully! Total paid: ' + fmt(total);
});
