const menuButtons = document.querySelectorAll(".menu-button");
const menuDialog = document.querySelector(".menu-dialog");
const closeButton = document.querySelector(".dialog-close");

const dialogGallery = document.querySelector(".dialog-gallery");
const dialogSlides = document.querySelector(".dialog-slides");
const dialogDots = document.querySelector(".dialog-dots");
const dialogPrev = document.querySelector(".dialog-prev");
const dialogNext = document.querySelector(".dialog-next");
const dialogCount = document.querySelector(".dialog-count");
const dialogName = document.querySelector(".dialog-name");
const dialogPrice = document.querySelector(".dialog-price");
const dialogText = document.querySelector(".dialog-text");

// 写真があるメニューは、一覧にも小さく写真を出す。
// 一覧用には軽い小さな写真（images/menu/thumb/ の同じ名前のファイル）を使う
menuButtons.forEach((button) => {
  const image = button.closest("li").dataset.image;
  if (image) {
    const thumb = document.createElement("img");
    thumb.className = "menu-thumb";
    thumb.src = image.replace("images/menu/", "images/menu/thumb/");
    thumb.alt = "";
    thumb.loading = "lazy";
    button.prepend(thumb);
  }
});

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest("li");
    // 名前：data-name があればそれを使う（ホームの「当店人気No.1」のバッジを小窓の見出しに入れないため）
    const name = item.dataset.name || item.querySelector(".menu-name").textContent;

    const detail = item.querySelector(".menu-detail");

    // 写真：1枚目は data-image、2枚目からは data-gallery（カンマ区切り）
    const images = [];
    if (item.dataset.image) {
      images.push(item.dataset.image);
    }
    if (item.dataset.gallery) {
      images.push(...item.dataset.gallery.split(","));
    }
    showPhotos(images, name);

    dialogName.textContent = name;
    dialogPrice.textContent = item.querySelector(".menu-price").textContent;

    // 説明：まだ書いていないメニューは「準備中」と出す
    if (detail.textContent.trim() !== "") {
      dialogText.innerHTML = detail.innerHTML;
    } else {
      dialogText.innerHTML = "<p>詳しい説明は準備中です。</p>";
    }

    menuDialog.showModal();
    // 開いたときは一番上（写真）から見せる。
    // showModal は「閉じる」ボタンにフォーカスを当てるので、長い説明だと一番下まで自動でスクロールしてしまうため
    menuDialog.scrollTop = 0;
    // 写真も1枚目から見せる
    dialogSlides.scrollLeft = 0;
    updateGallery();
  });
});

closeButton.addEventListener("click", () => {
  menuDialog.close();
});

// 小窓の外側をタップしたら閉じる
menuDialog.addEventListener("click", (event) => {
  const rect = menuDialog.getBoundingClientRect();
  const isInside =
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom;

  if (!isInside) {
    menuDialog.close();
  }
});

// ===== 小窓の写真：横にスライドして2枚目・3枚目を見られるようにする =====
// 写真を並べて、2枚以上あるときだけ下に点（今何枚目か）を出す。まだ写真がないメニューは写真の場所ごと隠す
function showPhotos(images, name) {
  dialogSlides.innerHTML = "";
  dialogDots.innerHTML = "";
  dialogGallery.hidden = images.length === 0;

  images.forEach((src, index) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = index === 0 ? name : `${name}（${index + 1}枚目）`;
    dialogSlides.append(img);

    if (images.length > 1) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dialog-dot";
      dot.setAttribute("aria-label", `${index + 1}枚目の写真を見る`);
      // 点を押したら、その写真までスライドする
      dot.addEventListener("click", () => {
        goToPhoto(index);
      });
      dialogDots.append(dot);
    }
  });
  updateGallery();
}

// 今何枚目を見ているか（0 が1枚目）
function currentIndex() {
  const width = dialogSlides.clientWidth || 1; // 小窓が閉じているときは幅が0なので、0で割らないようにする
  return Math.round(dialogSlides.scrollLeft / width);
}

// 指定した写真までスライドする（1枚目より前・最後より後ろには行かない）
function goToPhoto(index) {
  const last = dialogSlides.children.length - 1;
  const target = Math.min(Math.max(index, 0), last);
  dialogSlides.scrollTo({ left: dialogSlides.clientWidth * target, behavior: "smooth" });
}

// 点・「何枚目／全部で何枚」・左右の矢印を、今見ている写真に合わせる
function updateGallery() {
  const total = dialogSlides.children.length;
  const current = currentIndex();

  // 今見ている写真の点だけ色を濃くする
  dialogDots.querySelectorAll(".dialog-dot").forEach((dot, index) => {
    dot.classList.toggle("is-active", index === current);
  });

  // 写真が2枚以上のときだけ「1 / 3」のように出す
  dialogCount.textContent = total > 1 ? `${current + 1} / ${total}` : "";

  // 1枚目では左の矢印、最後の写真では右の矢印を隠す
  dialogPrev.hidden = total <= 1 || current === 0;
  dialogNext.hidden = total <= 1 || current === total - 1;
}
dialogSlides.addEventListener("scroll", updateGallery);

// 矢印を押したら、前・次の写真へ
dialogPrev.addEventListener("click", () => {
  goToPhoto(currentIndex() - 1);
});
dialogNext.addEventListener("click", () => {
  goToPhoto(currentIndex() + 1);
});

// パソコンでは、キーボードの ← → でも写真を切り替えられるようにする
menuDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    goToPhoto(currentIndex() - 1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    goToPhoto(currentIndex() + 1);
  }
});
