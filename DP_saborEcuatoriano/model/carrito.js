// =====================================================
//  MODELO: Carrito + 4 mecanismos de persistencia
//  Ref: Sem 5 sec 5.2 (localStorage, sessionStorage)
//       Sem 5 sec 5.3 (IndexedDB, Cookies con SameSite)
// =====================================================

var Modelo = Modelo || {};

(() => {
  "use strict";

  const LS_CARRITO = "saborec_carrito";
  const LS_CONTADOR = "saborec_contador_pedido";
  const LS_FORMULARIO = "saborec_formulario";
  const SS_VISITAS = "saborec_visitas";
  const DB_NOMBRE = "SaborEcuatorianoDB";
  const DB_TABLA = "pedidos";

  let carrito = [];

  // localStorage: carrito persistente
  Modelo.cargarCarrito = () => {
    try {
      const data = localStorage.getItem(LS_CARRITO);
      carrito = data ? JSON.parse(data) : [];
    } catch (e) {
      carrito = [];
    }
    return carrito;
  };

  const guardarCarrito = () => {
    try {
      localStorage.setItem(LS_CARRITO, JSON.stringify(carrito));
      actualizarCookieFecha();
    } catch (e) {
      console.warn("⚠️ Error guardando en localStorage:", e);
    }
  };

  // sessionStorage: contador de visitas
  Modelo.registrarVisita = () => {
    const actual = parseInt(sessionStorage.getItem(SS_VISITAS) || "0", 10);
    const nuevo = actual + 1;
    sessionStorage.setItem(SS_VISITAS, nuevo);
    return nuevo;
  };

  // Cookies: fecha última actualización
  const actualizarCookieFecha = () => {
    const fecha = new Date().toISOString();
    document.cookie = `ultimaActualizacion=${fecha}; max-age=86400; path=/; SameSite=Strict`;
  };

  Modelo.obtenerFechaActualizacion = () => {
    const cookies = document.cookie.split(";");
    const cookieMatch = cookies.find(c => c.trim().startsWith("ultimaActualizacion="));
    return cookieMatch ? cookieMatch.trim().substring("ultimaActualizacion=".length) : null;
  };

  // IndexedDB: historial de pedidos
  const abrirDB = () => {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NOMBRE, 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(DB_TABLA)) {
          db.createObjectStore(DB_TABLA, { keyPath: "id", autoIncrement: true });
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  };

  // Contador secuencial de pedidos (#0001, #0002...)
  // Ref: Sem 5 sec 5.2 (localStorage) + Sem 4 (padStart ES6+)
  Modelo.obtenerSiguienteNumeroPedido = () => {
    const actual = parseInt(localStorage.getItem(LS_CONTADOR) || "0", 10);
    const siguiente = actual + 1;
    localStorage.setItem(LS_CONTADOR, siguiente);
    return String(siguiente).padStart(4, "0");
  };

  Modelo.guardarPedido = (pedido) => {
    return new Promise((resolve, reject) => {
      abrirDB().then((db) => {
        const tx = db.transaction(DB_TABLA, "readwrite");
        const store = tx.objectStore(DB_TABLA);
        store.add({
          ...pedido,
          total: pedido.totales.total,
          fecha: new Date().toISOString()
        });
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => reject(tx.error);
      }).catch(reject);
    });
  };

  // API pública del carrito
  Modelo.obtenerCarrito = () => [...carrito];

  Modelo.agregarProducto = (producto) => {
    const existente = carrito.find(item => item.id === producto.id);
    
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

  Modelo.actualizarCantidad = (id, cantidad) => {
    const index = carrito.findIndex(item => item.id === id);
    if (index !== -1) {
      if (cantidad <= 0) {
        carrito.splice(index, 1);
      } else {
        carrito[index].cantidad = cantidad;
      }
      guardarCarrito();
    }
  };

  Modelo.eliminarProducto = (id) => {
    carrito = carrito.filter(item => item.id !== id);
    guardarCarrito();
  };

  Modelo.vaciarCarrito = () => {
    carrito = [];
    guardarCarrito();
  };

  Modelo.calcularTotales = () => {
    const { subtotal, cantidadItems } = carrito.reduce((acc, item) => {
      acc.subtotal += item.precio * item.cantidad;
      acc.cantidadItems += item.cantidad;
      return acc;
    }, { subtotal: 0, cantidadItems: 0 });

    const iva = subtotal * 0.15;
    const total = subtotal + iva;

    return {
      subtotal: subtotal.toFixed(2),
      iva: iva.toFixed(2),
      total: total.toFixed(2),
      cantidadItems
    };
  };

  // localStorage: persistencia de datos del formulario entre sesiones
  // Ref: Sem 5 sec 5.2 (localStorage)
  Modelo.guardarFormulario = (datos) => {
    try {
      localStorage.setItem(LS_FORMULARIO, JSON.stringify(datos));
    } catch (e) {
      console.warn("⚠️ Error guardando formulario:", e);
    }
  };

  Modelo.cargarFormulario = () => {
    try {
      const data = localStorage.getItem(LS_FORMULARIO);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  };

  Modelo.limpiarFormulario = () => {
    localStorage.removeItem(LS_FORMULARIO);
  };

})();
