const newsText = document.querySelector(".news-text");
const speed = 60;
const duration = newsText.offsetWidth / speed;
newsText.style.animationDuration = duration + "s";
