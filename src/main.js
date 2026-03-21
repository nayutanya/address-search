//ボタンを押したときの処理
const searchButton = document.getElementById("searchButton");
const zipInput = document.getElementById("zipInput");
const resultDiv = document.getElementById("result");
zipInput.addEventListener("input", () => {
    searchButton.disabled = zipInput.value.trim() === "";
});
searchButton.addEventListener("click", async () => {
    const zip = zipInput.value.trim();
    const zipClean = zip.replace(/-/g, "");
    //エラー処理
    if (/[^\d-]/.test(zip)) {
        resultDiv.textContent = "郵便番号は半角数字のみまたは半角数字とハイフンのみで入力してください。";
        return;
    }
    if (!/^\d{7}$/.test(zip) && !/^\d{3}-\d{4}$/.test(zip)) {
        resultDiv.textContent = "郵便番号は半角数字とハイフンありの8桁かハイフンなしの7桁で入力してください。";
        return;
    }
    try {
        const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${zipClean}`);
        const data = await response.json();
        if (!data.results) {
            resultDiv.textContent = "郵便番号が存在しません。";
            return;
        }
        //結果を表示
        resultDiv.innerHTML = data.results.map(addr => `
        <p>郵便番号:${addr.zipcode}</p>
        <p>住所:${addr.address1}${addr.address2}${addr.address3}</p>
        <p>カナ:${addr.kana1}${addr.kana2}${addr.kana3}</p>
        <hr>
        `).join("");
    }
    catch (error) {
        resultDiv.textContent = "エラーが発生しました。";
    }
});
