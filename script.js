// Simulação de giro de slots
const spinButtons = document.querySelectorAll(".spin-btn");

spinButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const slot = btn.parentElement.querySelector(".slot-display");
        const symbols = ["💰", "💎", "🍀", "🃏", "🎲", "🍒"];
        let spins = 10;

        const spinInterval = setInterval(() => {
            slot.textContent = `${symbols[Math.floor(Math.random() * symbols.length)]} ${symbols[Math.floor(Math.random() * symbols.length)]} ${symbols[Math.floor(Math.random() * symbols.length)]}`;
            spins--;
            if(spins <= 0) clearInterval(spinInterval);
        }, 150);
    });
});
