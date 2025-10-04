const inviteBtn = document.getElementById("invite-btn");
const openTreasureBtn = document.getElementById("open-treasure-btn");
const treasureResult = document.getElementById("treasure-result");

inviteBtn.addEventListener("click", () => {
    alert("Link de convite copiado! Compartilhe com seus amigos.");
});

openTreasureBtn.addEventListener("click", () => {
    const treasures = ["💰 100 moedas", "💎 50 gemas", "🎁 1 item raro", "😢 Nada"];
    const result = treasures[Math.floor(Math.random() * treasures.length)];
    treasureResult.textContent = "Você ganhou: " + result;
    treasureResult.classList.remove("show");
    setTimeout(() => {
        treasureResult.classList.add("show");
    }, 50);
});
