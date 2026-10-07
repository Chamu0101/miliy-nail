const newsText = document.querySelector(".news-text");
const speed = 60;
const newsUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjsPH8bTh9hnokXZDoTFTkEu3N4Onl-6sk4veSvzcrT30z0cUBSyLgmomL5UQ92rP0FNmAWj54YYOU/pub?gid=0&single=true&output=csv";

// 帯の長さから、流れる秒数を決める
function setNewsSpeed() {
  const duration = newsText.offsetWidth / speed;
  newsText.style.animationDuration = duration + "s";
  newsText.classList.add("is-ready");
}

// スプレッドシートからお知らせを読み込む
fetch(newsUrl)
  .then((response) => response.text())
  .then((csv) => {
    const lines = csv
      .split(/\r?\n/)
      .slice(1)
      .map((line) => line.replace(/^"|"$/g, "").replace(/""/g, '"').trim())
      .filter((line) => line !== "");

    if (lines.length > 0) {
      newsText.textContent = lines.join("　　　");
    }
    setNewsSpeed();
  })
  .catch(() => {
    setNewsSpeed();
  });
