const track = document.querySelector(".gallery-track");
const cards = document.querySelectorAll(".card");
const wrapper = document.querySelector(".gallery-wrapper");

let index = 0;
let direction = 1;
let isUserInteracting = false;
let focusMode = false;

/* ===============================
   CORE
   =============================== */
function updateCarousel() {
  cards.forEach(card => card.classList.remove("active"));
  cards[index].classList.add("active");

  const offset =
    -(index * 320) + (window.innerWidth / 2 - 140);

  track.style.transform = `translateX(${offset}px)`;
}

updateCarousel();

/* ===============================
   AUTO SLIDE (PAUSED IN FOCUS)
   =============================== */
setInterval(() => {
  if (isUserInteracting || focusMode) return;

  index += direction;
  if (index === cards.length - 1 || index === 0) {
    direction *= -1;
  }
  updateCarousel();
}, 3500);

/* ===============================
   DESKTOP WHEEL
   =============================== */
track.addEventListener("wheel", e => {
  if (e.target.closest(".comment-box")) return;
  e.preventDefault();

  isUserInteracting = true;

  if (e.deltaY > 0 && index < cards.length - 1) index++;
  else if (e.deltaY < 0 && index > 0) index--;

  updateCarousel();

  clearTimeout(track._t);
  track._t = setTimeout(() => isUserInteracting = false, 700);
}, { passive: false });

/* ===============================
   MOBILE TOUCH (CORRECTED)
   =============================== */
let startX = 0;
let startY = 0;
let moved = false;

track.addEventListener("touchstart", e => {
  if (e.target.closest(".comment-box")) return;

  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  moved = false;
});

track.addEventListener("touchmove", e => {
  if (e.target.closest(".comment-box")) return;

  const dx = e.touches[0].clientX - startX;
  const dy = e.touches[0].clientY - startY;

  // vertical swipe → ignore carousel
  if (Math.abs(dy) > Math.abs(dx)) return;

  if (Math.abs(dx) > 40) {
    moved = true;
    isUserInteracting = true;

    if (dx < 0 && index < cards.length - 1) index++;
    else if (dx > 0 && index > 0) index--;

    startX = e.touches[0].clientX;
    updateCarousel();
  }
});

track.addEventListener("touchend", () => {
  setTimeout(() => isUserInteracting = false, 500);
});

/* ===============================
   FOCUS MODE (RELIABLE TAP)
   =============================== */
cards.forEach(card => {
  card.addEventListener("click", () => {
    if (!card.classList.contains("active")) return;
    focusMode = !focusMode;
    wrapper.classList.toggle("focus-mode", focusMode);
  });

  card.addEventListener("touchend", e => {
    if (moved) return; // ❗ ignore swipe
    if (!card.classList.contains("active")) return;

    focusMode = !focusMode;
    wrapper.classList.toggle("focus-mode", focusMode);
  });
});
