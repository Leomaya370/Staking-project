// 🏗️ Generar dirección virtual TRON simulada
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

let perfilActivo = null;
let base = 0;
let apy = 0.30;
let start = Date.now();

// 📦 Guardar cambios en perfil en localStorage
function guardarPerfil(perfilActualizado) {
  const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
  const index = lista.findIndex(u => u.wallet === perfilActualizado.wallet);
  if (index !== -1) {
    lista[index] = perfilActualizado;
    localStorage.setItem('usuarios', JSON.stringify(lista));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-perfil');
  const datosUsuario = document.getElementById('datos-usuario');
  const direccionDeposito = document.getElementById('direccion-deposito');

  // 📝 Registro de usuario nuevo
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const wallet = document.getElementById('wallet').value.trim();
      const pass = document.getElementById('pass').value.trim();

      if (!wallet || !pass) return;

      const lista = JSON.parse(localStorage.getItem('usuarios')) || [];

      if (lista.find(u => u.wallet === wallet)) {
        alert("⚠️ Esta wallet ya está registrada.");
        return;
      }

      const tema = 'claro'; // Puedes permitir elegirlo luego
      const direccion = generarDireccionVirtual();

      lista.push({
        wallet,
        pass,
        tema,
        direccionDeposito: direccion,
        bloqueo: null
      });

      localStorage.setItem('usuarios', JSON.stringify(lista));
      localStorage.setItem('usuarioActivo', wallet);
      window.location.href = 'dashboard.html';
    });
  }

  // 🧭 Dashboard
  const ruta = window.location.pathname;
  if (ruta.includes('dashboard')) {
    const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
    const walletActiva = localStorage.getItem('usuarioActivo');
    const perfil = lista.find(u => u.wallet === walletActiva);
    perfilActivo = perfil;

    if (!perfil) {
      alert("No se encontró un perfil activo.");
      window.location.href = 'index.html';
      return;
    }

    // 🧑‍🎨 Aplicar tema
    document.body.classList.add(`tema-${perfil.tema}`);

    // 👤 Datos usuario
    const datosUsuario = document.getElementById('datos-usuario');
    if (datosUsuario) {
      datosUsuario.innerHTML = `
        <strong>Wallet:</strong> ${perfil.wallet}<br>
        <strong>Tema:</strong> ${perfil.tema}
      `;
    }

    // 🪪 Dirección de depósito
    if (direccionDeposito) {
      direccionDeposito.innerText = perfil.direccionDeposito;
    }

    // 📈 Iniciar staking
    base = 0;
    start = Date.now();

    setInterval(() => {
      actualizarGanancia();
      actualizarRelojDesbloqueo();
      actualizarRelojGlobal();
    }, 1000);
  }
});

// ⏱ Actualiza reloj de ganancia
function actualizarGanancia() {
  const reloj = document.getElementById('reloj');
  if (!reloj) return;

  const elapsed = (Date.now() - start) / 1000;
  const gainPerSec = base * apy / (365 * 24 * 60 * 60);
  const total = base + gainPerSec * elapsed;
  reloj.innerText = `${total.toFixed(6)} TRX`;
}

// 🔓 Reloj de desbloqueo (24h)
function actualizarRelojDesbloqueo() {
  const relojBloqueo = document.getElementById('reloj-desbloqueo');
  if (!relojBloqueo) return;

  if (!perfilActivo?.bloqueo) {
    relojBloqueo.innerText = "– No hay fondos bloqueados aún.";
    return;
  }

  const ahora = Date.now();
  const restante = perfilActivo.bloqueo + (24 * 60 * 60 * 1000) - ahora;

  if (restante <= 0) {
    relojBloqueo.innerText = "✅ Retiro disponible";
    return;
  }

  const horas = Math.floor(restante / (1000 * 60 * 60));
  const minutos = Math.floor((restante % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((restante % (1000 * 60)) / 1000);
  relojBloqueo.innerText = `⏳ Faltan ${horas}h ${minutos}m ${segundos}s para desbloqueo`;
}

// 🌐 Reloj global del proyecto
const fechaInicioProyecto = new Date("2025-07-01T00:00:00Z");
function actualizarRelojGlobal() {
  const elem = document.getElementById('reloj-global');
  if (!elem) return;

  const ahora = new Date();
  const delta = Math.floor((ahora - fechaInicioProyecto) / 1000);

  const dias = Math.floor(delta / (60 * 60 * 24));
  const horas = Math.floor((delta % (60 * 60 * 24)) / 3600);
  const minutos = Math.floor((delta % 3600) / 60);
  const segundos = delta % 60;

  elem.innerText = `${dias}d ${horas}h ${minutos}m ${segundos}s activos`;
}

// 📋 Copiar dirección
function copiarDireccion() {
  const direccion = document.getElementById('direccion-deposito')?.innerText;
  navigator.clipboard.writeText(direccion)
    .then(() => alert("📎 Dirección copiada al portapapeles"))
    .catch(() => alert("❌ Error al copiar"));
}

// 📥 Simular depósito
function simularDeposito() {
  const input = document.getElementById('monto-deposito');
  const monto = parseFloat(input.value);
  const div = document.getElementById('depositos');

  if (!isNaN(monto) && monto > 0) {
    base += monto;
    start = Date.now();

    const p = document.createElement('p');
    p.textContent = `🟢 Depósito simulado: ${monto.toFixed(2)} TRX`;
    div.appendChild(p);
    input.value = '';

    if (!perfilActivo.bloqueo) {
      perfilActivo.bloqueo = Date.now();
      guardarPerfil(perfilActivo);
    }
  } else {
    alert("❗ Ingresa un monto válido.");
  }
}

// 📤 Simular retiro con bloqueo de 24h
function realizarRetiro() {
  const monto = parseFloat(document.getElementById('monto-retiro').value);
  const retiros = document.getElementById('retiros');
  const ahora = Date.now();
  const bloqueo = perfilActivo?.bloqueo || 0;
  const diferencia = ahora - bloqueo;
  const horas = diferencia / (1000 * 60 * 60);

  if (bloqueo && horas < 24) {
    alert(`⏳ Tus fondos estarán disponibles en ${(24 - horas).toFixed(2)} horas.`);
    return;
  }

  if (!isNaN(monto) && monto > 0 && retiros) {
    const p = document.createElement('p');
    p.textContent = `✅ Retiro simulado de ${monto.toFixed(2)} TRX`;
    retiros.appendChild(p);
  }
}
