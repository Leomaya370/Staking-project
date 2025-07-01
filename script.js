// 🔧 CONFIGURACIÓN
const apy = 0.30;
const fechaInicioProyecto = new Date("2025-07-01T00:00:00Z");

let base = 0;
let start = Date.now();
let perfilActivo = null;

// 🏗️ Generar dirección virtual TRON simulada
function generarDireccionVirtual() {
  const letras = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numeros = '123456789';
  let direccion = 'T';
  for (let i = 0; i < 33; i++) {
    direccion += Math.random() < 0.5
      ? letras[Math.floor(Math.random() * letras.length)]
      : numeros[Math.floor(Math.random() * numeros.length)];
  }
  return direccion;
}

// 🧠 Guardar cambios en perfil
function guardarPerfil(perfilActualizado) {
  const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
  const idx = lista.findIndex(u => u.wallet === perfilActualizado.wallet);
  if (idx !== -1) {
    lista[idx] = perfilActualizado;
    localStorage.setItem('usuarios', JSON.stringify(lista));
  }
}

// 🧠 Utilidad para formato de reloj
const pad = n => n.toString().padStart(2, '0');

// 🕘 Reloj global de existencia del proyecto
function actualizarRelojGlobal() {
  const elem = document.getElementById('reloj-global');
  if (!elem) return;

  const ahora = new Date();
  const delta = Math.floor((ahora - fechaInicioProyecto) / 1000);

  const dias = Math.floor(delta / 86400);
  const horas = Math.floor((delta % 86400) / 3600);
  const minutos = Math.floor((delta % 3600) / 60);
  const segundos = delta % 60;

  elem.innerText = `${pad(dias)}d ${pad(horas)}h ${pad(minutos)}m ${pad(segundos)}s activos`;
}

// 📈 Ganancias en tiempo real
function actualizarGanancia() {
  const reloj = document.getElementById('reloj');
  if (!reloj) return;

  const elapsed = (Date.now() - start) / 1000;
  const ganancia = base * apy * (elapsed / (365 * 24 * 3600));
  const total = base + ganancia;

  reloj.innerText = `${total.toFixed(6)} TRX`;
}

// 🔒 Reloj de bloqueo 24h
function actualizarRelojDesbloqueo() {
  const elem = document.getElementById('reloj-desbloqueo');
  if (!elem || !perfilActivo) return;

  const tBloqueo = perfilActivo.bloqueo;
  if (!tBloqueo) {
    elem.innerText = "– No hay fondos bloqueados aún.";
    return;
  }

  const ahora = Date.now();
  const restante = tBloqueo + 86400000 - ahora;

  if (restante <= 0) {
    elem.innerText = "✅ Retiro disponible";
    return;
  }

  const h = Math.floor(restante / (1000 * 60 * 60));
  const m = Math.floor((restante % 3600000) / 60000);
  const s = Math.floor((restante % 60000) / 1000);
  elem.innerText = `⏳ Faltan ${pad(h)}h ${pad(m)}m ${pad(s)}s para desbloqueo`;
}

// 📋 Copiar dirección
function copiarDireccion() {
  const texto = document.getElementById('direccion-deposito')?.innerText;
  if (texto) {
    navigator.clipboard.writeText(texto)
      .then(() => alert("📎 Dirección copiada"))
      .catch(() => alert("❌ No se pudo copiar"));
  }
}

// 💳 Simular depósito
function simularDeposito() {
  const input = document.getElementById('monto-deposito');
  const div = document.getElementById('depositos');
  const monto = parseFloat(input.value);

  if (!isNaN(monto) && monto > 0) {
    base += monto;
    start = Date.now();

    if (perfilActivo && !perfilActivo.bloqueo) {
      perfilActivo.bloqueo = Date.now();
      guardarPerfil(perfilActivo);
    }

    const p = document.createElement('p');
    p.textContent = `🟢 Depósito simulado: ${monto.toFixed(2)} TRX`;
    div.appendChild(p);
    input.value = '';
  } else {
    alert("❗ Ingresa un monto válido.");
  }
}

// 💸 Simular retiro (tras 24h)
function realizarRetiro() {
  const monto = parseFloat(document.getElementById('monto-retiro').value);
  const ahora = Date.now();

  if (perfilActivo?.bloqueo && (ahora - perfilActivo.bloqueo) < 86400000) {
    const hRest = 24 - ((ahora - perfilActivo.bloqueo) / 3600000);
    alert(`⏳ Tus fondos estarán disponibles en ${hRest.toFixed(2)}h.`);
    return;
  }

  if (!isNaN(monto) && monto > 0) {
    const p = document.createElement('p');
    p.textContent = `✅ Retiro simulado de ${monto.toFixed(2)} TRX`;
    document.getElementById('retiros')?.appendChild(p);
  }
}

// 🧩 Inicialización
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-perfil');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const wallet = document.getElementById('wallet').value.trim();
      const pass = document.getElementById('pass').value.trim();
      if (!wallet || !pass) return;

      const lista = JSON.parse(localStorage.getItem('usuarios')) || [];
      if (lista.find(u => u.wallet === wallet)) {
        alert("⚠️ Esta wallet ya está registrada. Por favor usa una diferente o inicia sesión.");
        return;
}
