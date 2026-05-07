// =====================================================
//  VISTA: Renderizado con jQuery + animaciones
//  Ref: Sem 6 sec 6.2 (DOM jQuery)
//       Sem 6 sec 6.3 (efectos fadeIn/animate)
// =====================================================

var Vista = Vista || {};

(function () {
  "use strict";

  var todosProductos = [];
  var categoriaActiva = "Todos";

  Vista.guardarProductos = function (productos) { todosProductos = productos; };
  Vista.obtenerProductos = function () { return todosProductos; };

  Vista.renderCatalogo = function () {
    var $grid = $("#grid-platos");
    $grid.attr("aria-busy", "true").empty();

    var filtrados = (categoriaActiva === "Todos")
      ? todosProductos
      : todosProductos.filter(function (p) {
          return p.categoria === categoriaActiva;
        });

    if (filtrados.length === 0) {
      $grid.append('<p class="mensaje-vacio">No hay platos en esta categoría.</p>');
      $grid.attr("aria-busy", "false");
      return;
    }

    filtrados.forEach(function (producto) {
      var inicial = producto.nombre.charAt(0);
      var $tarjeta = $(
        '<article class="tarjeta-plato" data-id="' + producto.id + '">' +
          '<div class="tarjeta-imagen">' +
            '<img src="' + producto.imagen + '" alt="' + producto.nombre + '" ' +
                 'onerror="this.onerror=null; this.style.display=\'none\'; ' +
                 'this.parentElement.innerHTML=\'<div class=&quot;tarjeta-imagen-fallback&quot;>' + inicial + '</div>\';" />' +
          '</div>' +
          '<div class="tarjeta-cuerpo">' +
            '<span class="tarjeta-categoria">' + producto.categoria + '</span>' +
            '<h3>' + producto.nombre + '</h3>' +
            '<p class="tarjeta-descripcion">' + producto.descripcion + '</p>' +
            '<div class="tarjeta-footer">' +
              '<span class="tarjeta-precio">$' + producto.precio.toFixed(2) + '</span>' +
              '<button type="button" class="btn-anadir" data-id="' + producto.id + '">Añadir</button>' +
            '</div>' +
          '</div>' +
        '</article>'
      );

      $grid.append($tarjeta);
    });

    $grid.hide().fadeIn(250);
    $grid.attr("aria-busy", "false");
  };

  Vista.cambiarCategoria = function (cat) {
    categoriaActiva = cat;
    $(".btn-filtro").removeClass("activo").attr("aria-selected", "false");
    $(".btn-filtro[data-categoria='" + cat + "']").addClass("activo").attr("aria-selected", "true");
    Vista.renderCatalogo();
  };

  Vista.animarVuelo = function ($tarjeta, producto) {
    var $imgOrigen = $tarjeta.find(".tarjeta-imagen");
    var $destino = $("#btn-abrir-carrito");

    if (!$imgOrigen.length || !$destino.length) return;

    var origenRect = $imgOrigen[0].getBoundingClientRect();
    var destinoRect = $destino[0].getBoundingClientRect();

    var inicial = producto.nombre.charAt(0);
    var imgHTML = '<img src="' + producto.imagen + '" alt="" ' +
                  'onerror="this.onerror=null; this.style.display=\'none\'; ' +
                  'this.parentElement.innerHTML=\'<div class=&quot;imagen-voladora-fallback&quot;>' + inicial + '</div>\';" />';

    var $vuelo = $('<div class="imagen-voladora">' + imgHTML + '</div>');
    $vuelo.css({
      top: origenRect.top + (origenRect.height / 2) - 35 + "px",
      left: origenRect.left + (origenRect.width / 2) - 35 + "px"
    });

    $("body").append($vuelo);

    var destX = destinoRect.left + (destinoRect.width / 2) - 35;
    var destY = destinoRect.top + (destinoRect.height / 2) - 35;

    $vuelo.animate(
      {
        top: destY + "px",
        left: destX + "px",
        width: "20px",
        height: "20px",
        opacity: 0.3
      },
      {
        duration: 800,
        easing: "swing",
        complete: function () {
          $vuelo.remove();
          $("#btn-abrir-carrito").addClass("bump");
          setTimeout(function () {
            $("#btn-abrir-carrito").removeClass("bump");
          }, 600);
        }
      }
    );
  };

  Vista.renderCarrito = function (onActualizar, onEliminar) {
    var $body = $("#drawer-body");
    var $footer = $("#drawer-footer");
    var $contador = $("#contador-carrito");
    var carrito = Modelo.obtenerCarrito();
    var totales = Modelo.calcularTotales();

    $contador.text(totales.cantidadItems);
    $body.empty();

    if (carrito.length === 0) {
      $body.append(
        '<div class="estado-vacio">' +
          '<h3>Tu carrito está vacío</h3>' +
          '<p>Agrega platos del menú para empezar tu pedido.</p>' +
          '<button type="button" class="btn btn-secundario enlace-tab" data-tab="menu" id="btn-empty-menu">Ver el menú</button>' +
        '</div>'
      );
      $footer.hide();
      return;
    }

    carrito.forEach(function (item) {
      var $item = $(
        '<div class="item-carrito">' +
          '<div class="item-carrito-img">' +
            '<img src="' + item.imagen + '" alt="' + item.nombre + '" onerror="this.style.display=\'none\';" />' +
          '</div>' +
          '<div class="item-info">' +
            '<h4>' + item.nombre + '</h4>' +
            '<p>$' + (item.precio * item.cantidad).toFixed(2) + '</p>' +
            '<button type="button" class="btn-eliminar" data-accion="eliminar" data-id="' + item.id + '">Eliminar</button>' +
          '</div>' +
          '<div class="item-controles">' +
            '<button type="button" data-accion="restar" data-id="' + item.id + '" aria-label="Disminuir">−</button>' +
            '<span>' + item.cantidad + '</span>' +
            '<button type="button" data-accion="sumar" data-id="' + item.id + '" aria-label="Aumentar">+</button>' +
          '</div>' +
        '</div>'
      );
      $body.append($item);
    });

    $footer.show();
    $("#subtotal").text(totales.subtotal);
    $("#iva").text(totales.iva);
    $("#total").text(totales.total);

    var fecha = Modelo.obtenerFechaActualizacion();
    if (fecha) {
      var f = new Date(fecha);
      $("#ultima-actualizacion").text("Última actualización: " + f.toLocaleString("es-EC"));
    }
  };

  Vista.renderResumenPedir = function () {
    var $items = $("#resumen-items");
    var $totales = $("#resumen-totales");
    var carrito = Modelo.obtenerCarrito();
    var totales = Modelo.calcularTotales();

    $items.empty();

    if (carrito.length === 0) {
      $items.append('<p class="mensaje-vacio" style="padding: 1.5rem 0;">No hay productos en el carrito.</p>');
      $totales.attr("hidden", true);
      return;
    }

    carrito.forEach(function (item) {
      $items.append(
        '<div class="resumen-item">' +
          '<div>' +
            '<span class="resumen-item-cantidad">' + item.cantidad + '×</span>' +
            '<span class="resumen-item-nombre">' + item.nombre + '</span>' +
          '</div>' +
          '<span class="resumen-item-precio">$' + (item.precio * item.cantidad).toFixed(2) + '</span>' +
        '</div>'
      );
    });

    $totales.removeAttr("hidden");
    $("#resumen-subtotal").text(totales.subtotal);
    $("#resumen-iva").text(totales.iva);
    $("#resumen-total").text(totales.total);
  };

  // DRAWER
  Vista.abrirDrawer = function () {
    var $drawer = $("#drawer-carrito");
    var $overlay = $("#drawer-overlay");
    $drawer.prop("hidden", false);
    $overlay.prop("hidden", false);
    setTimeout(function () {
      $drawer.addClass("abierto");
      $overlay.addClass("visible");
      $drawer.attr("aria-hidden", "false");
    }, 10);
    document.body.style.overflow = "hidden";
    $("#btn-cerrar-carrito").focus();
  };

  Vista.cerrarDrawer = function () {
    var $drawer = $("#drawer-carrito");
    var $overlay = $("#drawer-overlay");
    $drawer.removeClass("abierto");
    $overlay.removeClass("visible");
    $drawer.attr("aria-hidden", "true");
    setTimeout(function () {
      $drawer.prop("hidden", true);
      $overlay.prop("hidden", true);
    }, 500);
    document.body.style.overflow = "";
    $("#btn-abrir-carrito").focus();
  };

  // MODAL CONFIRMACIÓN
  Vista.abrirModalConfirmar = function () {
    var carrito = Modelo.obtenerCarrito();
    var totales = Modelo.calcularTotales();
    var tipoEntrega = $("input[name='entrega']:checked").val() || "domicilio";
    var $resumen = $("#confirmar-resumen");
    $resumen.empty();

    var entregaTexto = (tipoEntrega === "domicilio")
      ? "🏠 A domicilio"
      : "🍽️ Recoger en local";

    $resumen.append(
      '<div class="resumen-item" style="border-bottom: 0.5px solid var(--linea); padding-bottom: 10px; margin-bottom: 6px;">' +
        '<strong style="color: var(--cafe-oscuro);">Tipo de entrega</strong>' +
        '<span style="font-weight: 700; color: var(--naranja);">' + entregaTexto + '</span>' +
      '</div>'
    );

    carrito.forEach(function (item) {
      $resumen.append(
        '<div class="resumen-item">' +
          '<div>' +
            '<span class="resumen-item-cantidad">' + item.cantidad + '×</span>' +
            '<span class="resumen-item-nombre">' + item.nombre + '</span>' +
          '</div>' +
          '<span class="resumen-item-precio">$' + (item.precio * item.cantidad).toFixed(2) + '</span>' +
        '</div>'
      );
    });

    $("#confirmar-total").text(totales.total);

    var $modal = $("#modal-confirmar");
    var $overlay = $("#modal-confirmar-overlay");
    $modal.prop("hidden", false);
    $overlay.prop("hidden", false);
    setTimeout(function () {
      $modal.addClass("abierto");
      $overlay.addClass("visible");
      $modal.attr("aria-hidden", "false");
    }, 10);
    document.body.style.overflow = "hidden";
    $("#btn-confirmar-pedido").focus();
  };

  Vista.cerrarModalConfirmar = function () {
    var $modal = $("#modal-confirmar");
    var $overlay = $("#modal-confirmar-overlay");
    $modal.removeClass("abierto");
    $overlay.removeClass("visible");
    $modal.attr("aria-hidden", "true");
    setTimeout(function () {
      $modal.prop("hidden", true);
      $overlay.prop("hidden", true);
    }, 350);
    document.body.style.overflow = "";
  };

  // MODAL ÉXITO
  Vista.abrirModalExito = function (numeroPedido, mensaje) {
    $("#exito-numero").text("#" + numeroPedido);
    if (mensaje) $("#exito-mensaje").text(mensaje);

    var $modal = $("#modal-exito");
    var $overlay = $("#modal-exito-overlay");
    $modal.prop("hidden", false);
    $overlay.prop("hidden", false);
    setTimeout(function () {
      $modal.addClass("abierto");
      $overlay.addClass("visible");
      $modal.attr("aria-hidden", "false");
    }, 10);
    document.body.style.overflow = "hidden";
    $("#btn-cerrar-exito").focus();
  };

  Vista.cerrarModalExito = function () {
    var $modal = $("#modal-exito");
    var $overlay = $("#modal-exito-overlay");
    $modal.removeClass("abierto");
    $overlay.removeClass("visible");
    $modal.attr("aria-hidden", "true");
    setTimeout(function () {
      $modal.prop("hidden", true);
      $overlay.prop("hidden", true);
    }, 350);
    document.body.style.overflow = "";
  };

  // TABS
  Vista.cambiarTab = function (nombreTab) {
    $(".tab-panel").removeClass("activa").attr("hidden", true);
    $("#tab-" + nombreTab).addClass("activa").removeAttr("hidden");

    $(".nav-principal a").removeClass("activo");
    $(".nav-principal a[data-tab='" + nombreTab + "']").addClass("activo");

    $("html, body").animate({ scrollTop: 0 }, 400);

    if (nombreTab === "pedir") {
      Vista.renderResumenPedir();
    }
  };

})();