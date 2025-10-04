// Slots simulados
const spinButtons = document.querySelectorAll(".spin-btn");
spinButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const slot = btn.parentElement.querySelector(".slot-display");
        const symbols = ["💰","💎","🍀","🃏","🎲","🍒"];
        let spins = 10;
        const spinInterval = setInterval(() => {
            slot.textContent = `${symbols[Math.floor(Math.random()*symbols.length)]} ${symbols[Math.floor(Math.random()*symbols.length)]} ${symbols[Math.floor(Math.random()*symbols.length)]}`;
            spins--;
            if(spins<=0) clearInterval(spinInterval);
        },150);
    });
});

// Simulação de saldo
let balance = 100.00;
const balanceDisplay = document.getElementById("user-balance");
if(balanceDisplay) balanceDisplay.textContent = `R$ ${balance.toFixed(2)}`;

// Depositar / Sacar
const depositBtn = document.getElementById("deposit-btn");
const withdrawBtn = document.getElementById("withdraw-btn");
if(depositBtn) depositBtn.addEventListener("click", ()=>{
    let amount = prompt("Digite o valor para depositar:");
    if(amount) { balance += parseFloat(amount); balanceDisplay.textContent = `R$ ${balance.toFixed(2)}`;}
});
if(withdrawBtn) withdrawBtn.addEventListener("click", ()=>{
    let amount = prompt("Digite o valor para sacar:");
    if(amount) { balance -= parseFloat(amount); balanceDisplay.textContent = `R$ ${balance.toFixed(2)}`;}
});
