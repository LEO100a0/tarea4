let torneoSeleccionado = null;
const precios = {
    lol: 50,
    fortnite: 60,
    valorant: 70
};

function seleccionarTorneo(torneo, elemento) {
    torneoSeleccionado = torneo;
    
    document.querySelectorAll('.torneo-card').forEach(card => {
        card.classList.remove('selected');
    });
    if (elemento) {
        elemento.classList.add('selected');
    }
    
    document.getElementById('selectTorneo').value = torneo;
    mostrarSeccion('torneo');
}

function validarInscripcion(event) {
    event.preventDefault();

    const correo = document.getElementById('correo');
    const nombre = document.getElementById('nombre');
    const fechaNacimiento = document.getElementById('fechaNacimiento');
    const torneo = document.getElementById('selectTorneo');
    const pago = document.getElementById('pago');

    if (!correo.value || !nombre.value || !fechaNacimiento.value || !torneo.value || !pago.value) {
        mostrarModal("Por favor complete todos los campos del formulario.", "error");
        return;
    }
    
    if (!validarEmail(correo.value)) {
        mostrarModal("Por favor ingrese un correo electrónico válido.", "error");
        correo.focus();
        return;
    }
    
    const fechaNac = new Date(fechaNacimiento.value);
    const edad = calcularEdad(fechaNac);
    
    if (edad < 14) {
        mostrarModal("Debes tener al menos 14 años para participar en el torneo.", "error");
        fechaNacimiento.focus();
        return;
    }
    
    const costo = precios[torneo.value] || 0;
    const montoPago = parseFloat(pago.value);
    
    if (montoPago < costo) {
        const falta = costo - montoPago;
        mostrarModal(`El pago es insuficiente. Faltan S/${falta.toFixed(2)} para completar la inscripción.`, "error");
        pago.focus();
        return;
    }
    
    let mensaje = `<h3>¡Inscripción exitosa!</h3>`;
    mensaje += `<p>Has sido registrado en el torneo de <strong>${getNombreTorneo(torneo.value)}</strong></p>`;
    mensaje += `<div class="detalles-inscripcion">`;
    mensaje += `<p><strong>Nombre:</strong> ${nombre.value}</p>`;
    mensaje += `<p><strong>Edad:</strong> ${edad} años</p>`;
    mensaje += `<p><strong>Correo:</strong> ${correo.value}</p>`;
    mensaje += `<p><strong>Torneo:</strong> ${getNombreTorneo(torneo.value)}</p>`;
    mensaje += `<p><strong>Costo:</strong> S/${costo.toFixed(2)}</p>`;
    mensaje += `<p><strong>Pago recibido:</strong> S/${montoPago.toFixed(2)}</p>`;
    
    if (montoPago > costo) {
        const vuelto = montoPago - costo;
        mensaje += `<p><strong>Cambio:</strong> S/${vuelto.toFixed(2)}</p>`;
    }
    
    mensaje += `</div>`;
    mensaje += `<p>Recibirás un correo con los detalles del torneo.</p>`;
    
    mostrarModal(mensaje, "success");
    
    document.getElementById('formInscripcion').reset();
    torneoSeleccionado = null;
    document.querySelectorAll('.torneo-card.selected').forEach(card => {
        card.classList.remove('selected');
    });
}

function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes = hoy.getMonth() - fechaNacimiento.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad--;
    }
    return edad;
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function mostrarModal(mensaje, tipo) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = mensaje;
    modalContent.className = 'modal-body ' + tipo;
    document.getElementById('resultModal').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('resultModal').style.display = 'none';
}

function getNombreTorneo(codigo) {
    switch(codigo) {
        case 'lol': return 'League of Legends';
        case 'fortnite': return 'Fortnite';
        case 'valorant': return 'Valorant';
        default: return '';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('formInscripcion').addEventListener('submit', validarInscripcion);
});

window.onclick = function(event) {
    const modal = document.getElementById('resultModal');
    if (event.target == modal) {
        cerrarModal();
    }
}