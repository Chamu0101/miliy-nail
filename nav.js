const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector("header");

menuToggle.addEventListener("click", () => {
  const isOpen = siteHeader.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});
