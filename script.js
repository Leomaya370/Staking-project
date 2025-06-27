// 💡 Generador de dirección virtual simulada tipo Tron
function generarDireccionVirtual() {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numeros = '123456789';
  let direccion = 'T';
  for (let i = 0; i < 33; i++) {
    direccion += Math.random() < 0.5
      ? letras.charAt(Math.floor(Math.random() * letras.length))
      : numeros.charAt(Math.floor(Math.random() * numeros.length));
  }
  return direccion;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-perfil');
  const datosUsuario = document.getElementById('datos-usuario');
  const reloj = document.getElementById('reloj');

  // 🎯 Registro de nuevo usuario (en index.html)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const wallet = document.getElementById('wallet').value.trim();
      const pass = document.getElementById('pass').value.trim();

      if (!wallet || !pass) return;

      let lista = JSON.parse(localStorage.getItem('usuarios')) || [];

      // 🚫 Evitar registros duplicados
      if (lista.find(u => u.wallet === wallet)) {
        alert("Esta wallet ya está registrada.");
        return;
      }

      // 🔧 Puedes personalizar el tema según el usuario
      const tema = 'claro';
      const direccionDeposito = generarDireccionVirtual();

      lista.push({ wallet, pass, tema, direccionDeposito });
      localStorage.setItem('usuarios', JSON.stringify(lista));
      localStorage.setItem('usuarioActivo', wallet);
      window.location.href = 'dashboard.html';
    });
  }

  // 📊 Cargar panel de usuario activo (en dashboard.html)
  const urlActual = window.location.pathname;
  if (urlActual.includes('dashboard')) {
    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    const walletActiva = localStorage.getItem('usuarioActivo');
    const perfil = lista.find(u => u.wallet === walletActiva);

    if (!perfil) {
      alert("No se encontró el perfil activo. Redirigiendo...");
      window.location.href = 'index.html';
      return;
    }

    // 🎨 Aplicar tema visual del usuario
    document.body.classList.add(`tema-${perfil.tema}`);

    // 🪪 Mostrar datos básicos
    if (datosUsuario) {
      datosUsuario.innerHTML = `
        <strong>Wallet:</strong> ${perfil.wallet}<br>
        <strong>Dirección de Depósito:</strong> ${perfil.direccionDeposito}<br>
        <strong>Tema:</strong> ${perfil.tema}
      `;
    }

    // ⏱️ Simulación de staking con APY
    const base = 1000;
    const apy = 0.30;
    const gainPerSec = base * apy / (365 * 24 * 60 * 60);
    const start = Date.now();

    if (reloj) {
      setInterval(() => {
        const elapsed = (Date.now() - start) / 1000;
        const total = base + gainPerSec * elapsed;
        reloj.innerText = `${total.toFixed(6)} TRX`;
      }, 1000);
    }
  }
});

// 💸 Simulación de retiro en dashboard.html
function realizarRetiro() {
  const monto = document.getElementById('monto-retiro').value;
  const retiros = document.getElementById('retiros');
  if (monto && retiros) {
    const p = document.createElement('p');
    p.textContent = `✅ Retiro simulado de ${monto} TRX`;
    retiros.appendChild(p);
  }
}
