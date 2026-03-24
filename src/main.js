//ボタンを押したときの処理
const searchButton = document.getElementById("searchButton");
const zipInput = document.getElementById("zipInput");
const resultDiv = document.getElementById("result");
let histories = [];
//Swiper設定
import Swiper from "swiper";
const swiper = new Swiper(".swiper", {
    slidesPerView: 3,
    spaceBetween: 16,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    navigation: {
        prevEl: ".swiper-button-prev",
        nextEl: ".swiper-button-next",
    },
    allowTouchMove: true,
    loop: false,
    breakpoints: {
        0: {
            slidesPerView: 1,
        },
        768: {
            slidesPerView: 3,
        },
    },
});
//検索履歴
function addHistory(item) {
    histories.unshift(item);
    const wrapper = document.getElementById("historyWrapper");
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
        <div class="history-card">
            <p class="history-zip">郵便番号：${item.zipcode}</p>
            <hr>
            ${item.addresses
        .map((a) => `
                <p class="history-address">住所：${a.address}</p>
                <p class="history-kana">カナ：${a.kana}</p>
                <hr>
            `)
        .join("")}
        </div>
    `;
    wrapper.insertBefore(slide, wrapper.firstChild);
    swiper.update();
}
zipInput.addEventListener("input", () => {
    searchButton.disabled = zipInput.value.trim() === "";
});
searchButton.addEventListener("click", async () => {
    var _a, _b, _c;
    const zip = zipInput.value.trim();
    const zipClean = zip.replace(/-/g, "");
    //エラー処理
    if (/[^\d-]/.test(zip)) {
        resultDiv.textContent =
            "郵便番号は半角数字のみまたは半角数字とハイフンのみで入力してください。";
        return;
    }
    if (!/^\d{7}$/.test(zip) && !/^\d{3}-\d{4}$/.test(zip)) {
        resultDiv.textContent =
            "郵便番号は半角数字とハイフンありの8桁かハイフンなしの7桁で入力してください。";
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
        resultDiv.innerHTML = `
            <div class="result-card">
                <p>郵便番号：${(_b = (_a = data.results) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.zipcode}</p>
                <hr>
                ${data.results
            .map((addr) => `
                    <p>住所：${addr.address1}${addr.address2}${addr.address3}</p>
                    <p>カナ：${addr.kana1}${addr.kana2}${addr.kana3}</p>
                    <hr>
                `)
            .join("")}
            </div>
        `;
        const first = (_c = data.results) === null || _c === void 0 ? void 0 : _c[0];
        if (first) {
            addHistory({
                zipcode: first.zipcode,
                addresses: data.results.map((addr) => ({
                    address: `${addr.address1}${addr.address2}${addr.address3}`,
                    kana: `${addr.kana1}${addr.kana2}${addr.kana3}`,
                })),
            });
        }
    }
    catch (_error) {
        resultDiv.textContent = "エラーが発生しました。";
    }
});
