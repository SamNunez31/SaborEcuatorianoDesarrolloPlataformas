// =====================================================
//  MODELO: Repositorio de productos
//  Carga el catálogo desde JSON usando AJAX con jQuery
//  Ref: Semana 6 sec 6.5 (lectura del modelo)
//       Semana 6 sec 6.1 ("AJAX optimizado: $.getJSON")
// =====================================================

// Espacio de nombres global para no contaminar window
var Modelo = Modelo || {};

(function () {
  "use strict";

  /**
   * Carga los productos desde productos.json.
   * Usa $.getJSON (jQuery AJAX) tal como muestra Sem 6 sec 6.1.
   * Devuelve una Promesa para que el Controlador la consuma con .then/.catch.
   */
  Modelo.cargarProductos = function () {
    return new Promise(function (resolve, reject) {
      $.getJSON("./model/productos.json")
        .done(function (datos) {
          // Valida que sea un arreglo (Sem 6 sec 6.5 punto 6: validar estructura)
          if (!Array.isArray(datos)) {
            reject(new Error("Estructura inválida: se esperaba un arreglo."));
            return;
          }
          resolve(datos);
        })
        .fail(function (jqXHR, textStatus, errorThrown) {
          reject(new Error("No se pudo cargar productos.json: " + textStatus));
        });
    });
  };
})();