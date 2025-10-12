// Scroll reveal effect
const elements = document.querySelectorAll('[data-animate]');
window.addEventListener('scroll', () => {
const trigger = window.innerHeight * 0.85;
elements.forEach(el => {
const top = el.getBoundingClientRect().top;
if(top < trigger) el.classList.add('active');
});
});


