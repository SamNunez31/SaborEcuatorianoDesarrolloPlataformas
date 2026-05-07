// =====================================================
//  MODELO: Repositorio de productos
//  Ref: Sem 6 sec 6.5 (lectura JSON con $.getJSON)
//       Sem 4 sec 4.4 (Promesas + manejo de errores)
// =====================================================

var Modelo = Modelo || {};

(function () {
  "use strict";

  var URL_PRODUCTOS = "./model/productos.json";

  /**
   * Carga el catálogo desde JSON usando jQuery $.getJSON.
   * Devuelve una Promesa (Sem 4 sec 4.3).
   */
  Modelo.cargarProductos = function () {
    return new Promise(function (resolve, reject) {
      $.getJSON(URL_PRODUCTOS)
        .done(function (data) {
          console.log("✅ Productos cargados:", data.length);
          resolve(data);
        })
        .fail(function (jqxhr, status, error) {
          console.error("❌ Error al cargar productos:", error);
          reject(new Error("HTTP " + jqxhr.status + ": " + error));
        });
    });
  };

})();