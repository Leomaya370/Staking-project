// 💡 Generador de dirección virtual tipo Tron (simulada)
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

// 📦 Variables globales para staking y acumulación
let perfilActivo = null;
let base = 0; // total depositado por el usuario
let apy = 0.30;
let gainPerSec = 0;
let start = Date.now();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-perfil');
  const datosUsuario = document.getElementById('datos-usuario');
  const reloj = document.getElementById('reloj');
  const direccionDeposito = document.getElementById('direccion-deposito');

  // 📝 Registro de nuevo usuario
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const wallet = document.getElementById('wallet').value.trim();
      const pass = document.getElementById('pass').value.trim();

      if (!wallet || !pass) return;

      let lista = JSON.parse(localStorage.getItem('usuarios')) || [];

      if (lista.find(u => u.wallet === wallet)) {
        alert("Esta wallet ya está registrada.");
        return;
      }

      const tema = 'claro';
      const direccionDeposito = generarDireccionVirtual();

      lista.push({ wallet, pass, tema, direccionDeposito });
      localStorage.setItem('usuarios', JSON.stringify(lista));
      localStorage.setItem('usuarioActivo', wallet);
      window.location.href = 'dashboard.html';
    });
  }

  // 👤 Cargar perfil en dashboard
  const ruta = window.location.pathname;
  if (ruta.includes('dashboard')) {
    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    const walletActiva = localStorage.getItem('usuarioActivo');
    const perfil = lista.find(u => u.wallet === walletActiva);
    perfilActivo = perfil;

    if (!perfil) {
      alert("Perfil no encontrado. Redirigiendo…");
      window.location.href = 'index.html';
      return;
    }

    document.body.classList.add(`tema-${perfil.tema}`);
    if (datosUsuario) {
      datosUsuario.innerHTML = `
        <strong>Wallet:</strong> ${perfil.wallet}<br>
        <strong>Tema:</strong> ${perfil.tema}
      `;
    }

    if (direccionDeposito) {
      direccionDeposito.innerText = perfil.direccionDeposito;
    }

    // Iniciar staking con base inicial
    base = 0;
    actualizarGanancia();
    setInterval(actualizarGanancia, 1000);
  }
});

// ⏱️ Actualizar reloj de staking
function actualizarGanancia() {
  if (!document.getElementById('reloj')) return;
  const elapsed = (Date.now() - start) / 1000;
  gainPerSec = base * apy / (365 * 24 * 60 * 60);
  const total = base + gainPerSec * elapsed;
  document.getElementById('reloj').innerText = `${total.toFixed(6)} TRX`;
}

// 📋 Copiar dirección
function copiarDireccion() {
  const direccion = document.getElementById('direccion-deposito').innerText;
  navigator.clipboard.writeText(direccion).then(() => {
    alert("✅ Dirección copiada al portapapeles.");
  }).catch(() => {
    alert("❌ Error al copiar.");
  });
}

// 💸 Simular depósito (afecta al staking)
function simularDeposito() {
  const input = document.getElementById('monto-deposito');
  const monto = parseFloat(input.value);
  const depositosDiv = document.getElementById('depositos');
  if (!isNaN(monto) && monto > 0) {
    base += monto;
    start = Date.now(); // reinicia acumulador
    const p = document.createElement('p');
    p.textContent = `🟢 Depósito simulado: ${monto.toFixed(2)} TRX`;
    depositosDiv.appendChild(p);
    input.value = '';
  } else {
    alert("❗ Ingresa un monto válido.");
  }
}

// 🚪 Simular retiro
function realizarRetiro() {
  const monto = parseFloat(document.getElementById('monto-retiro').value);
  const retiros = document.getElementById('retiros');
  if (!isNaN(monto) && monto > 0 && retiros) {
    const p = document.createElement('p');
    p.textContent = `✅ Retiro simulado de ${monto.toFixed(2)} TRX`;
    retiros.appendChild(p);
  }

