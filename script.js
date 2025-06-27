// Guardar perfil
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-perfil');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const wallet = document.getElementById('wallet').value;
      const pass = document.getElementById('pass').value;
      localStorage.setItem('usuario', JSON.stringify({ wallet, pass, creado: Date.now() }));
      window.location.href = 'dashboard.html';
    });
  }

  // Si estamos en dashboard.html
  const userData = localStorage.getItem('usuario');
  if (userData && location.pathname.includes('dashboard')) {
    const user = JSON.parse(userData);
    document.getElementById('datos-usuario').innerText = `Wallet: ${user.wallet}`;
    
    // Simular staking con APY
    const base = 1000;  // Monto base simulado
    const apy = 0.30;
    const gainPerSec = base * apy / (365 * 24 * 60 * 60);
    const start = Date.now();

    setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const total = base + gainPerSec * elapsed;
      document.getElementById('reloj').innerText = `${total.toFixed(6)} TRX`;
    }, 1000);
  }
});

// Simular retiro
function realizarRetiro() {
  const monto = document.getElementById('monto-retiro').value;
  const retiros = document.getElementById('retiros');
  if (monto) {
    const p = document.createElement('p');
    p.textContent = `✅ Retiro simulado de ${monto} TRX`;
    retiros.appendChild(p);
  }
}
// Por ejemplo, aplicar el tema guardado
const perfil = JSON.parse(localStorage.getItem('usuario'));
if (perfil && perfil.tema) {
  document.body.classList.add(`tema-${perfil.tema}`);
} else {
  document.body.classList.add('tema-claro'); // por defecto
}
