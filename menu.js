const menuButtons = document.querySelectorAll(".menu-button");
const menuDialog = document.querySelector(".menu-dialog");
const closeButton = document.querySelector(".dialog-close");

const dialogImage = document.querySelector(".dialog-image");
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

    const image = item.dataset.image;
    const detail = item.querySelector(".menu-detail");

    // 写真：まだないメニューは写真の場所ごと隠す
    if (image) {
      dialogImage.src = image;
      dialogImage.alt = name;
      dialogImage.hidden = false;
    } else {
      dialogImage.hidden = true;
    }

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