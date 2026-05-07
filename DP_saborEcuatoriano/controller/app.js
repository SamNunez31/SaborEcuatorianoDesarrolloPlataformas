// =====================================================
//  CONTROLADOR: Orquesta Modelo y Vista
//  Ref: Semana 6 sec 6.1 ($(document).ready)
//       Semana 6 sec 6.4 (flujo MVC: Vista ← Controlador ← Modelo)
// =====================================================

$(document).ready(function () {
  "use strict";

  // ============================================================
  //  1) Inicialización del estado
  // ============================================================
  Modelo.cargarCarrito();
  var visitas = Modelo.registrarVisita();
  console.log("Visitas en esta sesión: " + visitas);

  // Render inicial del carrito (puede tener items previos)
  Vista.renderCarrito(actualizarCantidad, eliminarProducto);
  conectarBtnVaciar();

  // ============================================================
  //  2) Carga del catálogo (AJAX con jQuery)
  //     Sem 6 sec 6.1: $.getJSON
  //     Sem 4 sec 4.4: manejo de errores
  // ============================================================
  Modelo.cargarProductos()
    .then(function (productos) {
      Vista.renderCatalogo(productos, agregarProducto);
    })
    .catch(function (error) {
      console.error("Error al cargar catálogo:", error);
      Vista.mostrarErrorCatalogo("No se pudo cargar el menú. Verifica tu conexión.");
    });

  // ============================================================
  //  3) Validación en vivo del formulario
  //     Sem 5 sec 5.2: validación con regex y eventos input/blur
  // ============================================================
  $("#formulario input").on("input blur", function () {
    Modelo.validarCampo($(this).attr("id"));
  });

  // ============================================================
  //  4) Envío del formulario
  // ============================================================
  $("#formulario").on("submit", function (e) {
    e.preventDefault();
    procesarPedido();
  });

  // ============================================================
  //  5) Service Worker (PWA - Sem 5 sec 5.3 punto 7)
  // ============================================================
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(function (err) {
      console.warn("Service Worker no registrado:", err);
    });
  }

  // ============================================================
  //  HANDLERS (controlador interno)
  // ============================================================

  function agregarProducto(producto) {
    Modelo.agregarProducto(producto);
    Vista.renderCarrito(actualizarCantidad, eliminarProducto);
    conectarBtnVaciar();
    Vista.animarContador(); // efecto Sem 6 sec 6.3
  }

  function actualizarCantidad(id, cantidad) {
    Modelo.actualizarCantidad(id, cantidad);
    Vista.renderCarrito(actualizarCantidad, eliminarProducto);
    conectarBtnVaciar();
  }

  function eliminarProducto(id) {
    Modelo.eliminarProducto(id);
    Vista.renderCarrito(actualizarCantidad, eliminarProducto);
    conectarBtnVaciar();
  }

  function conectarBtnVaciar() {
    $("#btn-vaciar").off("click").on("click", function () {
      if (confirm("¿Seguro que deseas vaciar el carrito?")) {
        Modelo.vaciarCarrito();
        Vista.renderCarrito(actualizarCantidad, eliminarProducto);
        conectarBtnVaciar();
      }
    });
  }

  function procesarPedido() {
    // Verifica que haya productos
    if (Modelo.obtenerCarrito().length === 0) {
      Vista.mostrarResultadoFormulario(
        "⚠️ Agrega productos al carrito antes de confirmar.",
        "error"
      );
      return;
    }

    // Valida formulario (Sem 5 sec 5.2)
    if (!Modelo.validarFormulario()) {
      Vista.mostrarResultadoFormulario(
        "❌ Por favor corrige los errores en el formulario.",
        "error"
      );
      return;
    }

    // Recoge datos
    var datos = {
      nombre: $("#nombre").val().trim(),
      email: $("#email").val().trim(),
      telefono: $("#telefono").val().trim(),
      cedula: $("#cedula").val().trim(),
      items: Modelo.obtenerCarrito(),
      totales: Modelo.calcularTotales()
    };

    // Guarda en IndexedDB (Sem 5 sec 5.3)
    Modelo.guardarPedido(datos)
      .then(function () {
        Vista.mostrarResultadoFormulario(
          "✅ ¡Pedido confirmado, <strong>" + datos.nombre + "</strong>!<br>" +
          "Total: <strong>$" + datos.totales.total + "</strong><br>" +
          "Te contactaremos al " + datos.telefono + ".",
          "ok"
        );
        Modelo.vaciarCarrito();
        Vista.renderCarrito(actualizarCantidad, eliminarProducto);
        conectarBtnVaciar();
        $("#formulario")[0].reset();
        $("#formulario input").removeClass("valido invalido").attr("aria-invalid", "false");

        // Limpia el mensaje después de 4s (Sem 6 sec 6.3: delay + fadeOut)
        setTimeout(Vista.limpiarResultadoFormulario, 4000);
      })
      .catch(function (err) {
        console.error("Error al guardar pedido:", err);
        Vista.mostrarResultadoFormulario(
          "❌ Error al guardar el pedido. Intenta de nuevo.",
          "error"
        );
      });
  }
});