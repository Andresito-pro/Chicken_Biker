(function(){
  // ----- Navbar scroll state -----
  const navbar = document.getElementById('navbar');
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
 
  // ----- Mobile menu -----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const toggleMenu = () => {
    const open = hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  hamburger.addEventListener('click', toggleMenu);
  hamburger.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){ e.preventDefault(); toggleMenu(); }});
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open'); mobileMenu.classList.remove('open'); document.body.style.overflow = '';
  }));
 
  // ----- Scroll reveal -----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:.15, rootMargin:'0px 0px -60px 0px'});
  document.querySelectorAll('.reveal, .reveal-scale').forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 70 + 'ms';
    io.observe(el);
  });
 
  // ----- Ripple on buttons -----
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size/2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size/2) + 'px';
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });
 
  // ----- Add to cart -----
  const badge = document.getElementById('cartBadge');
  let cartCount = 0;
  document.querySelectorAll('.add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      cartCount++;
      badge.textContent = cartCount;
      badge.classList.remove('bump');
      void badge.offsetWidth;
      badge.classList.add('bump');
    });
  });
 
  // ----- Countdown timer (demo: resets every 6 hours) -----
  const WINDOW_MS = 6 * 60 * 60 * 1000;
  function getTarget(){
    const now = Date.now();
    const remainder = now % WINDOW_MS;
    return now + (WINDOW_MS - remainder);
  }
  let target = getTarget();
  const hEl = document.getElementById('cd-h');
  const mEl = document.getElementById('cd-m');
  const sEl = document.getElementById('cd-s');
  function pad(n){ return String(n).padStart(2,'0'); }
  function tickCountdown(){
    let diff = target - Date.now();
    if(diff <= 0){ target = getTarget(); diff = target - Date.now(); }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    hEl.textContent = pad(h); mEl.textContent = pad(m); sEl.textContent = pad(s);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);
 
  // ----- Subtle hero parallax on pointer -----
  const heroArt = document.querySelector('.hero-art');
  if(heroArt && window.matchMedia('(hover:hover)').matches){
    document.querySelector('.hero').addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - .5) * 16;
      const y = (e.clientY / window.innerHeight - .5) * 16;
      heroArt.style.transform = `translate(${x}px, ${y}px)`;
    });
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const logoVideo = document.querySelector('.logo-video');
  
  if (logoVideo) {
    // Asegura la reproducción tan pronto carga la vista
    logoVideo.play().catch(error => {
      console.warn("El navegador pausó el autoplay. Se intentará reanudar al interactuar.", error);
      
      // Si fue bloqueado, lo reanuda con el primer clic o toque que el usuario haga en la pantalla
      const startVideoEvent = () => {
        logoVideo.play();
        document.removeEventListener('click', startVideoEvent);
        document.removeEventListener('touchstart', startVideoEvent);
      };
      
      document.addEventListener('click', startVideoEvent);
      document.addEventListener('touchstart', startVideoEvent);
    });
  }
});