// common.js
// LP共通のJavaScript

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  item.classList.toggle('on');
}
