// ===== ご注文テンプレートの「コピーする」ボタン =====
// ボタンの data-target に書いた場所（テンプレートの枠）の文字を、スマホやパソコンにコピーする
document.querySelectorAll(".copy-button").forEach((button) => {
  const defaultText = button.textContent;

  button.addEventListener("click", async () => {
    const text = document.querySelector(button.dataset.target).textContent;
    try {
      await navigator.clipboard.writeText(text);
      button.textContent = "コピーしました♡";
    } catch {
      // コピーできない環境では、文字を長押しで選んでもらう
      button.textContent = "コピーできませんでした。長押しで選択してください";
    }
    // 2秒たったら、ボタンの文字を元に戻す
    setTimeout(() => {
      button.textContent = defaultText;
    }, 2000);
  });
});
