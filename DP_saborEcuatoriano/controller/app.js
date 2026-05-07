// =====================================================
//  CONTROLADOR: Orquestación con delegación de eventos
//  Ref: Sem 6 sec 6.4 (Patrón MVC)
// =====================================================

$(document).ready(function () {

  // 0) Header sticky con sombra al hacer scroll (Sem 5: eventos del DOM)
  $(window).on("scroll", function () {
    if ($(window).scrollTop() > 10) {
      $(".site-header").addClass("scrolled");
    } else {
      $(".site-header").removeClass("scrolled");
    }
  });

  // 1) Inicialización
  Modelo.cargarCarrito();
  Modelo.registrarVisita();
  Vista.renderCarrito(actualizarCantidad, eliminarProducto);

  // 2) Carga del catálogo
  Modelo.cargarProductos()
    .then(function (productos) {
      Vista.guardarProductos(productos);
      Vista.renderCatalogo();
    })
    .catch(function (error) {
      console.error("❌ Error cargando catálogo:", error);
      $("#grid-platos").html(
        '<p class="mensaje-vacio">⚠️ No se pudo cargar el menú. ' +
        'Verifica que estés usando Live Server (http://) y no doble clic (file://).</p>'
      );
    });

  // 3) Acciones del carrito
  function agregarProducto(producto, $tarjetaOrigen) {
    Modelo.agregarProducto(producto);
    Vista.renderCarrito(actualizarCantidad, eliminarProducto);
    if ($tarjetaOrigen) {
      Vista.animarVuelo($tarjetaOrigen, producto);
    }
  }

  function actualizarCantidad(id, cantidad) {
    Modelo.actualizarCantidad(id, cantidad);
    Vista.renderCarrito(actualizarCantidad, eliminarProducto);
    Vista.renderResumenPedir();
  }

  function eliminarProducto(id) {
    Modelo.eliminarProducto(id);
    Vista.renderCarrito(actualizarCantidad, eliminarProducto);
    Vista.renderResumenPedir();
  }

  // 4) DELEGACIÓN: botón "Añadir"
  $(document).on("click", ".btn-anadir", function (e) {
    e.preventDefault();
    var $btn = $(this);
    var id = parseInt($btn.data("id"), 10);
    var producto = Vista.obtenerProductos().find(function (p) { return p.id === id; });
    if (!producto) return;

    var $tarjeta = $btn.closest(".tarjeta-plato");

    $btn.addClass("rebote");
    $btn.text("✓ Añadido");
    setTimeout(function () {
      $btn.removeClass("rebote").text("Añadir");
    }, 800);

    agregarProducto(producto, $tarjeta);
  });

  // 5) DELEGACIÓN: filtros
  $(document).on("click", ".btn-filtro", function (e) {
    e.preventDefault();
    var cat = $(this).data("categoria");
    Vista.cambiarCategoria(cat);
  });

  // 6) DELEGACIÓN: pestañas
  $(document).on("click", ".enlace-tab", function (e) {
    e.preventDefault();
    var tab = $(this).data("tab");
    if (!tab) return;
    Vista.cambiarTab(tab);
    if ($("#drawer-carrito").hasClass("abierto")) {
      Vista.cerrarDrawer();
    }
  });

  // 7) DELEGACIÓN: controles del carrito
  $(document).on("click", "#drawer-body [data-accion]", function () {
    var id = parseInt($(this).data("id"), 10);
    var accion = $(this).data("accion");
    var actuales = Modelo.obtenerCarrito();
    var item = actuales.find(function (i) { return i.id === id; });
    if (!item && accion !== "eliminar") return;

    if (accion === "sumar") actualizarCantidad(id, item.cantidad + 1);
    if (accion === "restar") actualizarCantidad(id, item.cantidad - 1);
    if (accion === "eliminar") eliminarProducto(id);
  });

  // 8) Drawer
  $("#btn-abrir-carrito").on("click", Vista.abrirDrawer);
  $("#btn-cerrar-carrito").on("click", Vista.cerrarDrawer);
  $("#drawer-overlay").on("click", Vista.cerrarDrawer);

  $("#btn-vaciar").on("click", function () {
    if (confirm("¿Seguro que quieres vaciar el carrito?")) {
      Modelo.vaciarCarrito();
      Vista.renderCarrito(actualizarCantidad, eliminarProducto);
      Vista.renderResumenPedir();
    }
  });

  // 9) Cerrar con Escape
  $(document).on("keydown", function (e) {
    if (e.key === "Escape" && $("#drawer-carrito").hasClass("abierto")) {
      Vista.cerrarDrawer();
    }
  });

  // 10) Formulario
  $("#formulario input").on("input blur", function () {
    Modelo.validarCampo($(this).attr("id"));
  });

// Bloquea letras en teléfono/cédula (solo números)
  $("#telefono, #cedula").on("keydown", Modelo.bloquearNoNumericos);
  $("#telefono, #cedula").on("paste input", function () {
    Modelo.limpiarNoNumericos($(this));
  });

  // Bloquea números en el nombre (solo letras y espacios)
  $("#nombre").on("keydown", Modelo.bloquearNoLetras);
  $("#nombre").on("paste input", function () {
    Modelo.limpiarNoLetras($(this));
  });

  $("#formulario").on("submit", function (e) {
      e.preventDefault();
      var $feedback = $("#resultado-formulario");
      $feedback.removeClass("ok error").text("");

      var carrito = Modelo.obtenerCarrito();
      if (carrito.length === 0) {
        $feedback.addClass("error").text("⚠️ Tu carrito está vacío. Agrega platos primero.");
        return;
      }

      if (!Modelo.validarFormulario()) {
        $feedback.addClass("error").text("⚠️ Revisa los campos marcados.");
        return;
      }

      // Si pasa todas las validaciones, abre el modal de confirmación
      Vista.abrirModalConfirmar();
    });

    // Botón "Cancelar" del modal de confirmación
    $("#btn-cancelar-confirmar").on("click", Vista.cerrarModalConfirmar);
    $("#modal-confirmar-overlay").on("click", Vista.cerrarModalConfirmar);

    // Botón "Sí, confirmar" del modal de confirmación
    $("#btn-confirmar-pedido").on("click", function () {
      var pedido = {
        nombre: $("#nombre").val().trim(),
        email: $("#email").val().trim(),
        telefono: $("#telefono").val().trim(),
        cedula: $("#cedula").val().trim(),
        items: Modelo.obtenerCarrito(),
        totales: Modelo.calcularTotales()
      };

      Modelo.guardarPedido(pedido)
        .then(function () {
          Vista.cerrarModalConfirmar();

          // Genera número de pedido secuencial (#0001, #0002...)
          var numeroPedido = Modelo.obtenerSiguienteNumeroPedido();

          // Espera a que cierre el de confirmación, luego abre el de éxito
          setTimeout(function () {
            Vista.abrirModalExito(numeroPedido);
          }, 380);

          // Limpia carrito y formulario
          Modelo.vaciarCarrito();
          Vista.renderCarrito(actualizarCantidad, eliminarProducto);
          Vista.renderResumenPedir();
          $("#formulario")[0].reset();
          $(".campo input").removeClass("valido invalido");
          $("#resultado-formulario").removeClass("ok error").text("");
        })
        .catch(function (err) {
          console.error(err);
          Vista.cerrarModalConfirmar();
          $("#resultado-formulario").addClass("error").text("❌ Error al guardar el pedido.");
        });
    });

    // Botón "Aceptar" del modal de éxito
    $("#btn-cerrar-exito").on("click", function () {
      Vista.cerrarModalExito();
      Vista.cambiarTab("inicio");
    });

    $("#modal-exito-overlay").on("click", function () {
      Vista.cerrarModalExito();
      Vista.cambiarTab("inicio");
    });

    // Cerrar modales con Escape
    $(document).on("keydown", function (e) {
      if (e.key !== "Escape") return;
      if ($("#modal-exito").hasClass("abierto")) {
        Vista.cerrarModalExito();
        Vista.cambiarTab("inicio");
      } else if ($("#modal-confirmar").hasClass("abierto")) {
        Vista.cerrarModalConfirmar();
      }
    });

  });
