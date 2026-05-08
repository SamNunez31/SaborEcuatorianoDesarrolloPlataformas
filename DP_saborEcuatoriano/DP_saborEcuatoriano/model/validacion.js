// =====================================================
//  MODELO: Validación con expresiones regulares
//  Ref: Sem 5 sec 5.2 (RegExp)
//       Sem 5 sec 5.4 (ARIA: aria-invalid, aria-describedby)
// =====================================================

var Modelo = Modelo || {};

(function () {
  "use strict";

  var REGEX = {
    nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    telefono: /^\d{10}$/,
    cedula: /^\d{10}$/
  };

  var MENSAJES = {
    nombre: "El nombre solo debe contener letras (3 a 50 caracteres).",
    email: "El correo no tiene un formato válido.",
    telefono: "El teléfono debe tener exactamente 10 dígitos.",
    cedula: "La cédula debe tener exactamente 10 dígitos."
  };

  Modelo.validarCampo = function (id) {
    var $input = $("#" + id);
    var $error = $("#error-" + id);
    var valor = $input.val().trim();
    var regex = REGEX[id];

    if (!regex) return true;

    var valido = regex.test(valor);
    $input.attr("aria-invalid", !valido);

    if (!valido && valor.length > 0) {
      $error.text(MENSAJES[id]);
      $input.removeClass("valido").addClass("invalido");
    } else if (valido) {
      $error.text("");
      $input.removeClass("invalido").addClass("valido");
    } else {
      $error.text("");
      $input.removeClass("valido invalido");
    }

    return valido;
  };

  Modelo.validarFormulario = function () {
    var ids = ["nombre", "email", "telefono", "cedula"];
    var todosValidos = true;
    for (var i = 0; i < ids.length; i++) {
      var $input = $("#" + ids[i]);
      var valor = $input.val().trim();
      if (valor.length === 0) {
        $input.attr("aria-invalid", "true").addClass("invalido");
        $("#error-" + ids[i]).text("Este campo es obligatorio.");
        todosValidos = false;
      } else if (!Modelo.validarCampo(ids[i])) {
        todosValidos = false;
      }
    }
    return todosValidos;
  };

  // Bloquea caracteres no numéricos en teléfono y cédula
  Modelo.bloquearNoNumericos = function (event) {
    var tecla = event.key;
    var teclasPermitidas = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight",
      "Tab", "Home", "End"
    ];
    if (teclasPermitidas.indexOf(tecla) !== -1) return;
    if (!/^\d$/.test(tecla)) {
      event.preventDefault();
    }
  };

  Modelo.limpiarNoNumericos = function ($input) {
    var valor = $input.val().replace(/\D/g, "").slice(0, 10);
    $input.val(valor);
  };

  // Bloquea caracteres no-letra en el nombre
  // Ref: Sem 5 (eventos del teclado) + Sem 4 (regex)
  Modelo.bloquearNoLetras = function (event) {
    var tecla = event.key;
    var teclasPermitidas = [
      "Backspace", "Delete", "ArrowLeft", "ArrowRight",
      "Tab", "Home", "End", " "
    ];
    if (teclasPermitidas.indexOf(tecla) !== -1) return;
    // Solo permite letras (incluyendo tildes, ñ y espacios)
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ]$/.test(tecla)) {
      event.preventDefault();
    }
  };

  Modelo.limpiarNoLetras = function ($input) {
    var valor = $input.val().replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").slice(0, 50);
    $input.val(valor);
  };

})();