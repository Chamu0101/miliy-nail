const menuToggle = document.querySelector(".menu-toggle");
const siteHeader = document.querySelector("header");

menuToggle.addEventListener("click", () => {
  const isOpen = siteHeader.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

// ===== スクロールでふわっと出す =====
// html に js クラスを付ける（JS が動いたときだけ、CSS の .js .fade-up で隠す）
document.documentElement.classList.add("js");
// fade-up が付いた要素を全部集める
const fadeTargets = document.querySelectorAll(".fade-up");
// 見張り役：画面に15％入ったら is-visible を付けて、その要素の見張りをやめる
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 },
);
// 集めた要素を1つずつ見張り役に渡す
fadeTargets.forEach((target) => {
  fadeObserver.observe(target);
});
