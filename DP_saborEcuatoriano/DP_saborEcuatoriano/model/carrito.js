// =====================================================
//  MODELO: Carrito + 4 mecanismos de persistencia
//  Ref: Sem 5 sec 5.2 (localStorage, sessionStorage)
//       Sem 5 sec 5.3 (IndexedDB, Cookies con SameSite)
// =====================================================

var Modelo = Modelo || {};

(function () {
  "use strict";

  var LS_CARRITO = "saborec_carrito";
  var LS_CONTADOR = "saborec_contador_pedido";
  var LS_FORMULARIO = "saborec_formulario";
  var SS_VISITAS = "saborec_visitas";
  var DB_NOMBRE = "SaborEcuatorianoDB";
  var DB_TABLA = "pedidos";

  var carrito = [];

  // localStorage: carrito persistente
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
    try {
      localStorage.setItem(LS_CARRITO, JSON.stringify(carrito));
      actualizarCookieFecha();
    } catch (e) {
      console.warn("⚠️ Error guardando en localStorage:", e);
    }
  }

  // sessionStorage: contador de visitas
  Modelo.registrarVisita = function () {
    var actual = parseInt(sessionStorage.getItem(SS_VISITAS) || "0", 10);
    var nuevo = actual + 1;
    sessionStorage.setItem(SS_VISITAS, nuevo);
    return nuevo;
  };

  // Cookies: fecha última actualización
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

  // IndexedDB: historial de pedidos
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

  // Contador secuencial de pedidos (#0001, #0002...)
  // Ref: Sem 5 sec 5.2 (localStorage) + Sem 4 (padStart ES6+)
  Modelo.obtenerSiguienteNumeroPedido = function () {
    var actual = parseInt(localStorage.getItem(LS_CONTADOR) || "0", 10);
    var siguiente = actual + 1;
    localStorage.setItem(LS_CONTADOR, siguiente);
    return String(siguiente).padStart(4, "0");
  };

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
          entrega: pedido.entrega,
          items: pedido.items,
          total: pedido.totales.total,
          fecha: new Date().toISOString()
        });
        tx.oncomplete = function () { resolve(true); };
        tx.onerror = function () { reject(tx.error); };
      }).catch(reject);
    });
  };

  // API pública del carrito
  Modelo.obtenerCarrito = function () { return carrito.slice(); };

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
        imagen: producto.imagen,
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

  // localStorage: persistencia de datos del formulario entre sesiones
  // Ref: Sem 5 sec 5.2 (localStorage)
  Modelo.guardarFormulario = function (datos) {
    try {
      localStorage.setItem(LS_FORMULARIO, JSON.stringify(datos));
    } catch (e) {
      console.warn("⚠️ Error guardando formulario:", e);
    }
  };

  Modelo.cargarFormulario = function () {
    try {
      var data = localStorage.getItem(LS_FORMULARIO);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  };

  Modelo.limpiarFormulario = function () {
    localStorage.removeItem(LS_FORMULARIO);
  };

})();