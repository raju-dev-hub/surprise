const phrase = document.getElementById("phrase");
const enterBtn = document.getElementById("enter-btn");

window.addEventListener("heartDone", () => {
  // show text
  phrase.style.opacity = "1";
  phrase.style.letterSpacing = "0.15em";

  // show ENTER button after text settles
  setTimeout(() => {
    enterBtn.classList.add("show");
  }, 2500); // wait after text animation
});

// click → next page
enterBtn.addEventListener("click", () => {
  window.location.href = "enter.html";
});
