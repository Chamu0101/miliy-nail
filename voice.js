// ===== お客様の声：スプレッドシート（公開用シート）から読み込む =====
const voiceUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRoWpB6U_rP-zQCAHGKo95U8IBP_e7wRhIGZ_bxxK8nQmvAmYwm7JYa7ssN-nlNROhy5gaPaH0oWna7/pub?gid=856810045&single=true&output=csv";
const voiceMax = 9; // HPに表示する最大件数（新しい順）。パソコンでは3件ずつ切り替わる
const voiceSection = document.querySelector("#voice");
const voiceList = document.querySelector(".voice-list");
const voicePrev = document.querySelector(".voice-prev");
const voiceNext = document.querySelector(".voice-next");

// CSVを「行」と「列」に分ける
// 本文の中にカンマ・改行・ダブルクォートが入っていても正しく分けられるようにしている
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// "2026/10/13 22:56:56" → "2026年10月"
function formatMonth(stamp) {
  const m = stamp.match(/^(\d{4})\/(\d{1,2})/);
  return m ? `${m[1]}年${Number(m[2])}月` : "";
}

// 要素を作って文字を入れる
// textContent を使うので、お客様が書いた文章はHTMLとして解釈されない（安全対策）
function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

// 1件分のカードを作る
function createVoiceCard(cols) {
  const [stamp, name, age, menu, mood, service, skill, comment] = cols;
  const card = el("li", "voice-card");

  const head = el("div", "voice-head");
  const nameLine = el("p", "voice-name", name || "お客様");
  if (age) nameLine.append(el("span", "voice-age", age));
  head.append(nameLine, el("span", "voice-date", formatMonth(stamp)));
  card.append(head);

  if (menu) card.append(el("p", "voice-menu", menu));

  const rating = el("ul", "voice-rating");
  [
    ["雰囲気・居心地", mood],
    ["接客・サービス", service],
    ["技術・仕上がり", skill],
  ].forEach(([label, value]) => {
    if (!value) return;
    const li = el("li");
    li.append(el("span", "", label), el("span", "", value));
    rating.append(li);
  });
  if (rating.children.length > 0) card.append(rating);

  card.append(el("p", "voice-text", comment));
  return card;
}

// 読み込んで表示する
fetch(voiceUrl)
  .then((response) => response.text())
  .then((csv) => {
    const rows = parseCsv(csv)
      .slice(1) // 1行目（見出し）を除く
      .filter((cols) => cols.length >= 8 && cols[7].trim() !== "");

    // 1件もないときは、セクションごと非表示のままにする
    if (rows.length === 0) return;

    rows.slice(0, voiceMax).forEach((cols) => {
      voiceList.append(createVoiceCard(cols));
    });
    voiceSection.hidden = false;
    updateVoiceArrows();
  })
  .catch(() => {
    // 読み込めなかったときも、セクションを非表示のままにする
  });

// ===== 矢印ボタン（パソコン） =====
// 箱に収まりきらないときだけ矢印を出し、端まで来たら押せなくする
function updateVoiceArrows() {
  const max = voiceList.scrollWidth - voiceList.clientWidth;
  const scrollable = max > 1;
  voicePrev.hidden = !scrollable;
  voiceNext.hidden = !scrollable;
  voicePrev.disabled = voiceList.scrollLeft <= 1;
  voiceNext.disabled = voiceList.scrollLeft >= max - 1;
}

// 1回押すと、見えている分（3件）だけ横に送る
function slideVoice(direction) {
  const gap = parseFloat(getComputedStyle(voiceList).columnGap) || 0;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  voiceList.scrollBy({
    left: direction * (voiceList.clientWidth + gap),
    behavior: reduceMotion ? "auto" : "smooth",
  });
}

voicePrev.addEventListener("click", () => slideVoice(-1));
voiceNext.addEventListener("click", () => slideVoice(1));
voiceList.addEventListener("scroll", updateVoiceArrows);
window.addEventListener("resize", updateVoiceArrows);
