// =====================================================
//  MODELO: Validación con expresiones regulares
//  Ref: Semana 5 sec 5.2 (Validación dinámica con RegExp)
//       Semana 5 sec 5.4 (ARIA: aria-invalid, aria-describedby)
// =====================================================

var Modelo = Modelo || {};

(function () {
  "use strict";

  // Expresiones regulares (Sem 5, tabla 5)
  var REGEX = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefono: /^\d{10}$/,
    cedula: /^\d{10}$/
  };

  var MENSAJES = {
    nombre: "Debe tener entre 3 y 50 letras (sin números ni símbolos).",
    email: "Formato de correo inválido. Ejemplo: ejemplo@correo.com",
    telefono: "Debe tener exactamente 10 dígitos numéricos.",
    cedula: "Debe tener exactamente 10 dígitos numéricos."
  };

  /**
   * Valida un campo individual y actualiza ARIA + clases visuales.
   * Solo muestra error si el usuario YA escribió algo (mejor UX).
   */
  Modelo.validarCampo = function (id) {
    var $input = $("#" + id);
    var $error = $("#error-" + id);
    var valor = $input.val().trim();
    var regex = REGEX[id];

    if (!regex) return true;

    // Si está vacío, no muestra error todavía (no agredir al usuario)
    if (valor.length === 0) {
      $input.removeClass("valido invalido").attr("aria-invalid", "false");
      $error.text("");
      return false;
    }

    var valido = regex.test(valor);
    $input.attr("aria-invalid", !valido);

    if (!valido) {
      $error.text(MENSAJES[id]);
      $input.removeClass("valido").addClass("invalido");
    } else {
      $error.text("");
      $input.removeClass("invalido").addClass("valido");
    }

    return valido;
  };

  /**
   * Valida todos los campos al enviar.
   */
  Modelo.validarFormulario = function () {
    var ids = ["nombre", "email", "telefono", "cedula"];
    var todosValidos = true;
    for (var i = 0; i < ids.length; i++) {
      var $input = $("#" + ids[i]);
      var valor = $input.val().trim();
      var regex = REGEX[ids[i]];

      if (valor.length === 0 || !regex.test(valor)) {
        $input.attr("aria-invalid", "true").addClass("invalido");
        $("#error-" + ids[i]).text(
          valor.length === 0 ? "Este campo es obligatorio." : MENSAJES[ids[i]]
        );
        todosValidos = false;
      }
    }
    return todosValidos;
  };

  /**
   * Bloquea caracteres no numéricos en campos numéricos.
   * (No deja al usuario escribir letras en teléfono/cédula)
   */
  Modelo.bloquearNoNumericos = function (event) {
    var tecla = event.key;
    // Permite teclas de control (backspace, delete, flechas, tab)
    var teclasPermitidas = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight",
      "Tab", "Home", "End"
    ];
    if (teclasPermitidas.indexOf(tecla) !== -1) return;
    // Bloquea si no es dígito
    if (!/^\d$/.test(tecla)) {
      event.preventDefault();
    }
  };

  /**
   * Limpia caracteres no numéricos al pegar (paste).
   */
  Modelo.limpiarNoNumericos = function ($input) {
    var valor = $input.val().replace(/\D/g, "").slice(0, 10);
    $input.val(valor);
  };
})();