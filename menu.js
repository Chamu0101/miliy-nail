const menuButton = document.querySelector(".menu-button");
const menuDialog = document.querySelector(".menu-dialog");
const closeButton = document.querySelector(".dialog-close");
menuButton.addEventListener("click", () => {
  menuDialog.showModal();
});
closeButton.addEventListener("click", () => {
  menuDialog.close();
});