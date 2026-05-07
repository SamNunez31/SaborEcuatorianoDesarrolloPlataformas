// =====================================================
//  MODELO: Carrito + Persistencia
//  Usa los 4 mecanismos de Web Storage de la Semana 5 (sec 5.2 y 5.3):
//    - localStorage   → carrito persistente
//    - sessionStorage → contador de visitas en la sesión
//    - IndexedDB      → historial de pedidos confirmados
//    - cookies        → fecha de última actualización
// =====================================================

var Modelo = Modelo || {};

(function () {
  "use strict";

  // --- Claves de almacenamiento ---
  var LS_CARRITO = "sabor_ec_carrito";
  var SS_VISITAS = "sabor_ec_visitas";
  var DB_NOMBRE = "saborEcDB";
  var DB_TABLA = "pedidos";

  // Estado en memoria (privado al módulo)
  var carrito = [];

  // ============================================================
  //  localStorage: carrito persistente entre sesiones
  // ============================================================
  Modelo.cargarCarrito = function () {
    try {
      var data = localStorage.getItem(LS_CARRITO);
      carrito = data ? JSON.parse(data) : [];
    } catch (e) {
      carrito = [];
    }
    return carrito;
  };

  function guardarCarrito() {
    localStorage.setItem(LS_CARRITO, JSON.stringify(carrito));
    actualizarCookieFecha(); // cada cambio actualiza la cookie
  }

  // ============================================================
  //  sessionStorage: visitas a la sesión actual
  // ============================================================
  Modelo.registrarVisita = function () {
    var actual = parseInt(sessionStorage.getItem(SS_VISITAS) || "0", 10);
    var nuevo = actual + 1;
    sessionStorage.setItem(SS_VISITAS, nuevo);
    return nuevo;
  };

  // ============================================================
  //  Cookies: fecha de última actualización
  //  Ref: Sem 5 sec 5.3 punto 8 (Cookies con SameSite=Strict)
  // ============================================================
  function actualizarCookieFecha() {
    var fecha = new Date().toISOString();
    document.cookie =
      "ultimaActualizacion=" + fecha +
      "; max-age=86400; path=/; SameSite=Strict";
  }

  Modelo.obtenerFechaActualizacion = function () {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var c = cookies[i].trim();
      if (c.indexOf("ultimaActualizacion=") === 0) {
        return c.substring("ultimaActualizacion=".length);
      }
    }
    return null;
  };

  // ============================================================
  //  IndexedDB: historial de pedidos
  //  Ref: Sem 5 sec 5.3 punto 6 (IndexedDB)
  // ============================================================
  function abrirDB() {
    return new Promise(function (resolve, reject) {
      var req = indexedDB.open(DB_NOMBRE, 1);
      req.onupgradeneeded = function (e) {
        var db = e.target.result;
        if (!db.objectStoreNames.contains(DB_TABLA)) {
          db.createObjectStore(DB_TABLA, { keyPath: "id", autoIncrement: true });
        }
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { reject(req.error); };
    });
  }

  Modelo.guardarPedido = function (pedido) {
    return new Promise(function (resolve, reject) {
      abrirDB().then(function (db) {
        var tx = db.transaction(DB_TABLA, "readwrite");
        var store = tx.objectStore(DB_TABLA);
        store.add({
          nombre: pedido.nombre,
          email: pedido.email,
          telefono: pedido.telefono,
          cedula: pedido.cedula,
          items: pedido.items,
          total: pedido.totales.total,
          fecha: new Date().toISOString()
        });
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(tx.error); };
      }).catch(reject);
    });
  };

  // ============================================================
  //  API pública del carrito
  // ============================================================
  Modelo.obtenerCarrito = function () {
    return carrito.slice(); // copia defensiva
  };

  Modelo.agregarProducto = function (producto) {
    var existente = null;
    for (var i = 0; i < carrito.length; i++) {
      if (carrito[i].id === producto.id) { existente = carrito[i]; break; }
    }
    if (existente) {
      existente.cantidad++;
    } else {
      carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: 1
      });
    }
    guardarCarrito();
  };

  Modelo.actualizarCantidad = function (id, cantidad) {
    for (var i = 0; i < carrito.length; i++) {
      if (carrito[i].id === id) {
        if (cantidad <= 0) {
          carrito.splice(i, 1);
        } else {
          carrito[i].cantidad = cantidad;
        }
        guardarCarrito();
        return;
      }
    }
  };

  Modelo.eliminarProducto = function (id) {
    carrito = carrito.filter(function (item) { return item.id !== id; });
    guardarCarrito();
  };

  Modelo.vaciarCarrito = function () {
    carrito = [];
    guardarCarrito();
  };

  Modelo.calcularTotales = function () {
    var subtotal = 0;
    var cantidadItems = 0;
    for (var i = 0; i < carrito.length; i++) {
      subtotal += carrito[i].precio * carrito[i].cantidad;
      cantidadItems += carrito[i].cantidad;
    }
    var iva = subtotal * 0.15;
    var total = subtotal + iva;
    return {
      subtotal: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      total: total.toFixed(2),
      cantidadItems: cantidadItems
    };
  };
})();