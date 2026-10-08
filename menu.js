const menuButtons = document.querySelectorAll(".menu-button");
const menuDialog = document.querySelector(".menu-dialog");
const closeButton = document.querySelector(".dialog-close");

const dialogImage = document.querySelector(".dialog-image");
const dialogName = document.querySelector(".dialog-name");
const dialogPrice = document.querySelector(".dialog-price");
const dialogText = document.querySelector(".dialog-text");

menuButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const item = button.closest("li");
    const name = item.querySelector(".menu-name").textContent;

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