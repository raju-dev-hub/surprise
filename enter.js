const track = document.querySelector(".gallery-track");
const cards = document.querySelectorAll(".card");
const wrapper = document.querySelector(".gallery-wrapper");

let index = 0;
let focusMode = false;

function update() {
  cards.forEach(c => c.classList.remove("active"));
  cards[index].classList.add("active");

  const offset =
    -(index * (cards[0].offsetWidth + 32)) +
    (window.innerWidth / 2 - cards[0].offsetWidth / 2);

  track.style.transform = `translateX(${offset}px)`;
}
update();

/* TOUCH LOGIC */
let sx = 0, sy = 0, moved = false;

track.addEventListener("touchstart", e => {
  if (e.target.closest(".comment-box")) return;
  sx = e.touches[0].clientX;
  sy = e.touches[0].clientY;
  moved = false;
});

track.addEventListener("touchmove", e => {
  if (e.target.closest(".comment-box")) return;

  const dx = e.touches[0].clientX - sx;
  const dy = e.touches[0].clientY - sy;

  if (Math.abs(dy) > Math.abs(dx)) return;

  if (Math.abs(dx) > 40) {
    moved = true;
    if (dx < 0 && index < cards.length - 1) index++;
    if (dx > 0 && index > 0) index--;
    sx = e.touches[0].clientX;
    update();
  }
});

cards.forEach(card => {
  card.addEventListener("touchend", () => {
    if (moved) return;
    if (!card.classList.contains("active")) return;

    focusMode = !focusMode;
    wrapper.classList.toggle("focus-mode", focusMode);
  });
});
