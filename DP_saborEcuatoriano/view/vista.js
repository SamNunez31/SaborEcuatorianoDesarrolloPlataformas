// =====================================================
//  VISTA: Renderizado con jQuery + efectos
//  Ref: Semana 6 sec 6.2 (manipulación DOM con jQuery)
//       Semana 6 sec 6.3 (efectos y animaciones)
// =====================================================

var Vista = Vista || {};

(function () {
  "use strict";

  /**
   * Renderiza el catálogo de productos como tarjetas.
   * Usa selectores y métodos jQuery (Sem 6 sec 6.2).
   */
  Vista.renderCatalogo = function (productos, alAgregar) {
    var $lista = $("#lista-productos");
    var $estado = $("#estado-catalogo");

    $lista.empty();

    if (!productos || productos.length === 0) {
      $estado.text("No hay productos disponibles.").attr("aria-busy", "false");
      return;
    }

    // Oculta el estado de carga (efecto fadeOut - Sem 6 sec 6.3)
    $estado.attr("aria-busy", "false").fadeOut(300);

    // Crea cada tarjeta (Sem 6 sec 6.2 punto 4: inserción de elementos)
    productos.forEach(function (p) {
      var $li = $("<li>").addClass("tarjeta");

      var $imgWrap = $("<div>").addClass("tarjeta-img-wrap");
      var $img = $("<img>")
        .addClass("tarjeta-img")
        .attr("src", p.imagen)
        .attr("alt", "Foto de " + p.nombre)
        .attr("loading", "lazy")
        .on("error", function () {
          // Si la imagen falla, mostramos un placeholder
          $(this).replaceWith(
            $("<div>").addClass("tarjeta-img-placeholder").text("🍽️")
          );
        });
      $imgWrap.append($img);

      var $body = $("<div>").addClass("tarjeta-body");
      $body.append($("<span>").addClass("tarjeta-categoria").text(p.categoria));
      $body.append($("<h3>").addClass("tarjeta-titulo").text(p.nombre));
      $body.append($("<p>").addClass("tarjeta-desc").text(p.descripcion));
      $body.append($("<p>").addClass("tarjeta-precio").text("$" + p.precio.toFixed(2)));

      // Botón agregar (Sem 6 sec 6.2 punto 6: eventos)
      var $btn = $("<button>")
        .attr("type", "button")
        .addClass("btn btn-primario")
        .text("Agregar al carrito")
        .attr("aria-label", "Agregar " + p.nombre + " al carrito")
        .on("click", function () { alAgregar(p); });
      $body.append($btn);

      // Encadenamiento jQuery (Sem 6 sec 6.1: chaining)
      $li.append($imgWrap).append($body).hide().appendTo($lista).fadeIn(300);
    });
  };

  /**
   * Renderiza el contenido del carrito con jQuery.
   */
  Vista.renderCarrito = function (alActualizar, alEliminar) {
    var $contenido = $("#contenido-carrito");
    var $resumen = $("#resumen-carrito");
    var items = Modelo.obtenerCarrito();
    var totales = Modelo.calcularTotales();

    // Actualiza contador del nav
    $("#contador-carrito").text(totales.cantidadItems);

    // Estado vacío
    if (items.length === 0) {
      $contenido.html('<p class="texto-vacio">Aún no has agregado platos.</p>');
      $resumen.prop("hidden", true);
      return;
    }

    // Construye tabla
    var html =
      '<table class="tabla-carrito" aria-label="Productos en el carrito">' +
      '<thead><tr>' +
      '<th>Producto</th><th>Precio</th><th>Cantidad</th>' +
      '<th>Subtotal</th><th>Acción</th>' +
      '</tr></thead><tbody>';

    items.forEach(function (item) {
      var sub = (item.precio * item.cantidad).toFixed(2);
      html +=
        '<tr>' +
        '<td>' + item.nombre + '</td>' +
        '<td>$' + item.precio.toFixed(2) + '</td>' +
        '<td>' +
          '<div class="cantidad-control">' +
            '<button type="button" class="btn-icono" data-accion="restar" data-id="' + item.id + '" aria-label="Disminuir ' + item.nombre + '">−</button>' +
            '<span aria-live="polite">' + item.cantidad + '</span>' +
            '<button type="button" class="btn-icono" data-accion="sumar" data-id="' + item.id + '" aria-label="Aumentar ' + item.nombre + '">+</button>' +
          '</div>' +
        '</td>' +
        '<td>$' + sub + '</td>' +
        '<td>' +
          '<button type="button" class="btn-icono" data-accion="eliminar" data-id="' + item.id + '" aria-label="Eliminar ' + item.nombre + '">🗑️</button>' +
        '</td>' +
        '</tr>';
    });
    html += '</tbody></table>';

    $contenido.html(html);

    // Totales
    $("#subtotal").text(totales.subtotal);
    $("#iva").text(totales.iva);
    $("#total").text(totales.total);
    $resumen.prop("hidden", false);

    // Delegación de eventos (Sem 6 sec 6.2 punto 6)
    // ESTO ARREGLA EL BUG DEL "+": releemos el carrito FRESCO en cada click
    $contenido.off("click", "[data-accion]").on("click", "[data-accion]", function () {
      var id = parseInt($(this).attr("data-id"), 10);
      var accion = $(this).attr("data-accion");
      var itemsActuales = Modelo.obtenerCarrito();
      var item = null;
      for (var i = 0; i < itemsActuales.length; i++) {
        if (itemsActuales[i].id === id) { item = itemsActuales[i]; break; }
      }
      if (!item) return;

      if (accion === "sumar") alActualizar(id, item.cantidad + 1);
      else if (accion === "restar") alActualizar(id, item.cantidad - 1);
      else if (accion === "eliminar") alEliminar(id);
    });

    // Última actualización (lee la cookie)
    var fecha = Modelo.obtenerFechaActualizacion();
    if (fecha) {
      var f = new Date(fecha);
      $("#info-actualizacion").text("Última actualización: " + f.toLocaleString("es-EC"));
    }
  };

  /**
   * Animación cuando se agrega un producto al carrito (Sem 6 sec 6.3).
   */
  Vista.animarContador = function () {
    $("#contador-carrito")
      .stop(true)
      .animate({ opacity: 0.3 }, 100)
      .animate({ opacity: 1 }, 300);
  };

  /**
   * Muestra error en el catálogo (cuando falla la carga).
   */
  Vista.mostrarErrorCatalogo = function (mensaje) {
    $("#estado-catalogo")
      .text("⚠️ " + mensaje)
      .attr("aria-busy", "false")
      .addClass("error");
  };

  /**
   * Muestra resultado del formulario con efecto.
   * Sem 6 sec 6.3: combinación de fadeIn + delay + fadeOut.
   */
  Vista.mostrarResultadoFormulario = function (mensaje, tipo) {
    var $el = $("#resultado-formulario");
    $el.removeClass("ok error")
       .addClass(tipo)
       .html(mensaje)
       .hide()
       .fadeIn(400);
  };

  Vista.limpiarResultadoFormulario = function () {
    $("#resultado-formulario").fadeOut(300, function () {
      $(this).empty().removeClass("ok error");
    });
  };
})();