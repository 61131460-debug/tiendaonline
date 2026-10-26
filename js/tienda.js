// Array de Productos
const productos = [
  { id: 1, nombre: "Torta Tres Leches Frambuesa", precio: 55.00, categoria: "Dulces", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80" },
  { id: 2, nombre: "Alfajores de Manjar x12", precio: 22.00, categoria: "Dulces", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80" },
  { id: 3, nombre: "Empanada de Carne Gourmet", precio: 9.50, categoria: "Salados", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80" },
  { id: 4, nombre: "Pan con Chicharrón", precio: 18.00, categoria: "Salados", img: "https://images.unsplash.com/photo-1509722747041-616f39b57569?auto=format&fit=crop&w=600&q=80" },
  { id: 5, nombre: "Quiche de Jamón y Queso", precio: 14.00, categoria: "Salados", img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80" },
  { id: 6, nombre: "Pastel de Acelga Tradicional", precio: 11.00, categoria: "Salados", img: "https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=600&q=80" }
];

let carrito = [];

const soles = function(monto) {
  return "S/ " + monto.toFixed(2);
};

const aplicarDescuento = function(total, porcentaje) {
  if (porcentaje === undefined) porcentaje = 10;
  return total * (porcentaje / 100);
};

// Renderizado directo al cargar
function renderizarProductos(lista) {
  var productosAMostrar = lista || productos;
  var grid = document.getElementById("catalogoGrid");
  
  if (!grid) return;

  if (productosAMostrar.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center py-5"><p class="fs-5 text-muted">No se encontraron productos.</p></div>';
    return;
  }

  var html = "";
  for (var i = 0; i < productosAMostrar.length; i++) {
    var p = productosAMostrar[i];
    html += '<div class="col">' +
      '<article class="card-product">' +
        '<div class="card-img-wrapper">' +
          '<img src="' + p.img + '" alt="' + p.nombre + '" class="card-img-top">' +
        '</div>' +
        '<div class="card-body-custom">' +
          '<div>' +
            '<span class="badge-cat mb-2 d-inline-block">' + p.categoria + '</span>' +
            '<h3 class="card-product-title">' + p.nombre + '</h3>' +
            '<p class="fs-4 fw-bold text-primary-custom mb-3">' + soles(p.precio) + '</p>' +
          '</div>' +
          '<button class="btn btn-primary-custom w-100 btn-agregar" data-id="' + p.id + '">' +
            '+ Agregar al Carrito' +
          '</button>' +
        '</div>' +
      '</article>' +
    '</div>';
  }

  grid.innerHTML = html;

  var botones = document.querySelectorAll(".btn-agregar");
  botones.forEach(function(btn) {
    btn.addEventListener("click", function() {
      agregarAlCarrito(Number(btn.getAttribute("data-id")));
    });
  });
}

function agregarAlCarrito(id) {
  var producto = productos.find(function(p) { return p.id === id; });
  var existe = carrito.find(function(item) { return item.id === id; });

  if (existe) {
    existe.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  actualizarUI();
  lanzarToast("¡" + producto.nombre + " agregado!");
}

function actualizarUI() {
  var listaHtml = document.getElementById("listaCarrito");
  var badgeCant = document.getElementById("badgeCant");
  
  var totalUnidades = carrito.reduce(function(acc, item) { return acc + item.cantidad; }, 0);
  if (badgeCant) badgeCant.textContent = totalUnidades;

  if (listaHtml) {
    if (carrito.length === 0) {
      listaHtml.innerHTML = '<li class="text-center py-4 text-muted">El carrito está vacío 🥐</li>';
    } else {
      var html = "";
      carrito.forEach(function(item) {
        html += '<li class="list-group-item d-flex justify-content-between align-items-center py-2 border-bottom">' +
          '<div>' +
            '<h6 class="mb-0 fw-bold">' + item.nombre + '</h6>' +
            '<small class="text-muted">' + item.cantidad + ' x ' + soles(item.precio) + '</small>' +
          '</div>' +
          '<div class="d-flex align-items-center gap-2">' +
            '<span class="fw-bold">' + soles(item.precio * item.cantidad) + '</span>' +
            '<button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="' + item.id + '">✕</button>' +
          '</div>' +
        '</li>';
      });
      listaHtml.innerHTML = html;
    }
  }

  var btnsEliminar = document.querySelectorAll(".btn-eliminar");
  btnsEliminar.forEach(function(btn) {
    btn.addEventListener("click", function() {
      var id = Number(btn.getAttribute("data-id"));
      carrito = carrito.filter(function(item) { return item.id !== id; });
      actualizarUI();
    });
  });

  var subtotal = carrito.reduce(function(acc, item) { return acc + (item.precio * item.cantidad); }, 0);
  var descuento = 0;

  var meta = 100;
  var porcentajeProgreso = Math.min((subtotal / meta) * 100, 100);
  var barraProgreso = document.getElementById("barraProgreso");
  var txtProgreso = document.getElementById("txtBarraProgreso");
  var pctProgreso = document.getElementById("pctBarraProgreso");
  var filaDescuento = document.getElementById("filaDescuento");

  if (barraProgreso) barraProgreso.style.width = porcentajeProgreso + "%";
  if (pctProgreso) pctProgreso.textContent = porcentajeProgreso.toFixed(0) + "%";

  if (subtotal >= meta) {
    descuento = aplicarDescuento(subtotal, 10);
    if (txtProgreso) txtProgreso.textContent = "🎉 ¡Felicidades! Tienes 10% de descuento";
    if (filaDescuento) filaDescuento.style.setProperty("display", "flex", "important");
    var txtDesc = document.getElementById("txtDescuento");
    if (txtDesc) txtDesc.textContent = "-" + soles(descuento);
  } else {
    var falta = meta - subtotal;
    if (txtProgreso) txtProgreso.textContent = "Agrega " + soles(falta) + " más para 10% off";
    if (filaDescuento) filaDescuento.style.setProperty("display", "none", "important");
  }

  var totalFinal = subtotal - descuento;

  var txtSub = document.getElementById("txtSubtotal");
  var txtTot = document.getElementById("txtTotal");
  var inputMonto = document.getElementById("montoPagoModal");

  if (txtSub) txtSub.textContent = soles(subtotal);
  if (txtTot) txtTot.textContent = soles(totalFinal);
  if (inputMonto) inputMonto.value = soles(totalFinal);
}

function lanzarToast(mensaje) {
  var toastEl = document.getElementById("notifToast");
  var msgEl = document.getElementById("toastMensaje");
  if (msgEl) msgEl.textContent = mensaje;
  if (toastEl && window.bootstrap) {
    var instance = bootstrap.Toast.getOrCreateInstance(toastEl);
    instance.show();
  }
}

// Eventos tras cargar el documento
document.addEventListener("DOMContentLoaded", function () {
  renderizarProductos(productos);
  actualizarUI();

  // Filtros Dulces / Salados / Todos
  var contenedorFiltros = document.getElementById("filtrosCategoria");
  if (contenedorFiltros) {
    contenedorFiltros.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn-filter");
      if (btn) {
        document.querySelectorAll(".btn-filter").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");

        var cat = btn.getAttribute("data-cat");
        var filtrados = (cat === "Todos") ? productos : productos.filter(function(p) { return p.categoria === cat; });
        renderizarProductos(filtrados);
      }
    });
  }

  // Buscador en tiempo real
  var inputBuscar = document.getElementById("inputBuscar");
  if (inputBuscar) {
    inputBuscar.addEventListener("input", function (e) {
      var busqueda = e.target.value.toLowerCase().trim();
      var resultados = productos.filter(function(p) {
        return p.nombre.toLowerCase().indexOf(busqueda) !== -1;
      });
      renderizarProductos(resultados);
    });
  }

  // Abrir Pasarela de Pago desde el Carrito
  var btnCheckout = document.getElementById("btnAbrirCheckout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", function () {
      if (carrito.length === 0) {
        alert("Tu carrito está vacío.");
        return;
      }

      // Cerrar Offcanvas
      var offcanvasEl = document.getElementById("carritoOffcanvas");
      if (offcanvasEl && window.bootstrap) {
        var offInst = bootstrap.Offcanvas.getInstance(offcanvasEl);
        if (offInst) offInst.hide();
      }

      var form = document.getElementById("formTarjeta");
      if (form) {
        form.reset();
        form.style.display = "block";
      }
      var msg = document.getElementById("mensajeExito");
      if (msg) msg.style.display = "none";

      var modalEl = document.getElementById("modalPago");
      if (modalEl && window.bootstrap) {
        var modalInst = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInst.show();
      }
    });
  }

  // Procesar Pago
  var formTarjeta = document.getElementById("formTarjeta");
  if (formTarjeta) {
    formTarjeta.addEventListener("submit", function (e) {
      e.preventDefault();

      var btn = document.getElementById("btnPagar");
      if (btn) {
        btn.disabled = true;
        btn.textContent = "Procesando pago...";
      }

      setTimeout(function () {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Pagar Ahora";
        }

        var nombre = document.getElementById("nombreTitular").value;
        var numPedido = "#DEL-" + Math.floor(1000 + Math.random() * 9000);

        if (formTarjeta) formTarjeta.style.display = "none";
        var msg = document.getElementById("mensajeExito");
        if (msg) msg.style.display = "block";

        var titModal = document.getElementById("tituloModal");
        if (titModal) titModal.textContent = "¡Pago Confirmado!";

        var confTit = document.getElementById("confirmTitular");
        if (confTit) confTit.textContent = nombre;

        var numPed = document.getElementById("numPedido");
        if (numPed) numPed.textContent = numPedido;

        if (typeof confetti === "function") {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        }

        carrito = [];
        actualizarUI();
      }, 1500);
    });
  }

  // Formatear campo tarjeta
  var numTarj = document.getElementById("numTarjeta");
  if (numTarj) {
    numTarj.addEventListener("input", function (e) {
      e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
    });
  }
});