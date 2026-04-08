// common.js
// LP共通のJavaScript

function toggleFaq(btn) {
  const item = btn.closest('.faq-item');
  item.classList.toggle('on');
}

// Heroスライドショー（5秒ごとにクロスフェード）
const slides = document.querySelectorAll('.hero-slide');
let currentSlide = 0;
if (slides.length > 1) {
  setInterval(() => {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }, 5000);
}

// カップ画像：スクロールのたびにフェードイン（繰り返し）
const giftImg = document.querySelector('.gift-img');
if (giftImg) {
  giftImg.classList.add('fade-hidden');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('fade-hidden');
      } else {
        entry.target.classList.add('fade-hidden');
      }
    });
  }, { threshold: 0.3 });
  observer.observe(giftImg);
}
