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
   AUTO ANIMATION
   =============================== */
setInterval(() => {
  if (isUserInteracting || focusMode) return;

  index += direction;

  if (index === cards.length - 1 || index === 0) {
    direction *= -1;
  }

  updateCarousel();
}, 3500);

/* =====================================================
   DESKTOP SCROLL (mouse wheel)
   ===================================================== */
track.addEventListener("wheel", e => {
  // ⛔ allow comment box to scroll
  if (e.target.closest(".comment-box")) return;

  e.preventDefault();
  isUserInteracting = true;

  if (e.deltaY > 0 && index < cards.length - 1) {
    index++;
  } else if (e.deltaY < 0 && index > 0) {
    index--;
  }

  updateCarousel();

  clearTimeout(track._scrollTimeout);
  track._scrollTimeout = setTimeout(() => {
    isUserInteracting = false;
  }, 800);
}, { passive: false });

/* =====================================================
   MOBILE TOUCH SCROLL (horizontal)
   ===================================================== */
let startX = 0;

track.addEventListener("touchstart", e => {
  // ignore touches starting inside comment box
  if (e.target.closest(".comment-box")) return;

  isUserInteracting = true;
  startX = e.touches[0].clientX;
});

track.addEventListener("touchmove", e => {
  // ⛔ allow vertical swipe in comment box
  if (e.target.closest(".comment-box")) return;

  const currentX = e.touches[0].clientX;
  const diff = startX - currentX;

  if (Math.abs(diff) > 40) {
    if (diff > 0 && index < cards.length - 1) {
      index++;
    } else if (diff < 0 && index > 0) {
      index--;
    }

    startX = currentX;
    updateCarousel();
  }
});

track.addEventListener("touchend", () => {
  setTimeout(() => {
    isUserInteracting = false;
  }, 600);
});

/* =====================================================
   FOCUS MODE (click / tap on active card)
   ===================================================== */
cards.forEach(card => {
  card.addEventListener("click", () => {
    if (!card.classList.contains("active")) return;

    focusMode = !focusMode;
    wrapper.classList.toggle("focus-mode", focusMode);
  });

  card.addEventListener("touchend", () => {
    if (!card.classList.contains("active")) return;

    focusMode = !focusMode;
    wrapper.classList.toggle("focus-mode", focusMode);
  });
});
