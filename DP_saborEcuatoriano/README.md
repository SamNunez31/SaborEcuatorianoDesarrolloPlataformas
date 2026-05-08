# Proyecto: Sabor Ecuatoriano

Sistema de "Carrito de Compras" para comercio de gastronomía ecuatoriana. Proyecto académico correspondiente a la asignatura de Desarrollo en Plataformas (PUCE Virtual, Reto 1, semanas 1 al 6).

## 1. Explicación Técnica y Consideraciones de Ejecución

Este proyecto web ha sido desarrollado aplicando los estándares de HTML5 semántico, CSS3 adaptable (Responsive Design mediante Flexbox y Grid) y JavaScript moderno (ES6+). 

---

## 2. Arquitectura de Software: Modelo-Vista-Controlador (MVC)

La organización del código fuente se estructuró siguiendo los principios del patrón de diseño Modelo-Vista-Controlador abordados en el material de estudio, con el objetivo de separar de manera estricta las responsabilidades del sistema:

sabor-ecuatoriano/
├── index.html              (Vista principal, estructurada con HTML semántico y accesible)
├── assets/styles.css       (Hojas de estilo: CSS3 adaptable, Flexbox, Grid y Media Queries)
│
├── model/                  (MODELO: Gestión de datos y lógica de persistencia)
│   ├── productos.json      (Catálogo de productos estático en formato JSON)
│   ├── repo.js             (Capa de acceso asíncrono a datos)
│   ├── carrito.js          (Lógica central del carrito mediante Módulos ES6+)
│   └── validacion.js       (Lógica de validación con expresiones regulares)
│
├── view/                   (VISTA: Renderizado y actualización del DOM)
│   └── vista.js            (Manipulación del DOM y retroalimentación visual al usuario)
│
└── controller/             (CONTROLADOR: Orquestación de eventos del sistema)
    └── app.js              (Punto de entrada que enlaza el Modelo con la Vista)

---

## 3. Persistencia de Datos (Web Storage)

Para garantizar la persistencia de la información en el entorno del cliente, se implementaron cuatro mecanismos de almacenamiento distintos, conforme a los lineamientos del curso:

| Mecanismo | Aplicación en el Proyecto | Referencia Teórica |
|-----------|---------------------------|--------------------|
| localStorage | Mantiene el estado de los productos en el carrito entre sesiones. | Semana 5, sec. 5.2 |
| sessionStorage | Gestiona el contador de visitas exclusivas a la sesión actual. | Semana 5, sec. 5.2 |
| IndexedDB | Almacena el historial estructurado de los pedidos confirmados. | Semana 5, sec. 5.3 |
| Cookies | Registra la fecha de la última actualización del carrito (SameSite=Strict). | Semana 5, sec. 5.3 |

---

## 4. Validaciones de Formularios (Expresiones Regulares)

El proceso de validación de datos se ejecuta en tiempo real utilizando eventos del Document Object Model (DOM) como "input" y "blur". Estas validaciones operan en conjunto con atributos ARIA para notificar errores sin interrumpir el flujo de navegación del usuario. Los criterios aplicados son:

* Nombre: Cadena de 3 a 50 caracteres alfabéticos (incluyendo soporte para caracteres latinos como tildes y la letra ñ).
* Correo Electrónico: Formato estandarizado de la forma usuario@dominio.ext.
* Teléfono: Cadena de exactamente 10 dígitos numéricos.
* Cédula de Identidad: Cadena de exactamente 10 dígitos numéricos.

---

## 5. Accesibilidad Web (Normativas WCAG)

El diseño de la interfaz fue desarrollado siguiendo las normativas de Accesibilidad para el Contenido Web (WCAG), específicamente bajo los principios POUR (Perceptible, Operable, Comprensible y Robusto), abordados en la Semana 5, sección 5.4. Las implementaciones incluyen:

* HTML Semántico y Roles ARIA: Empleo adecuado de etiquetas estructurales (header, nav, main, footer) y roles semánticos complementarios (role="banner", role="navigation", role="alert").
* Regiones Dinámicas: Uso de los atributos aria-live="polite" y aria-live="assertive" para notificar cambios de estado en el catálogo, el carrito y en los mensajes de validación.
* Estados de Carga: Implementación del atributo aria-busy durante las operaciones de recuperación de datos asíncronos.
* Formularios Accesibles: Vinculación de los mensajes de ayuda y error a los campos correspondientes a través de aria-invalid y aria-describedby.
* Navegación por Teclado: Gestión del foco visible (:focus-visible) y orden de tabulación lógico para todos los elementos interactivos.
* Inclusión: Integración de la directiva CSS "prefers-reduced-motion" para asegurar una experiencia adecuada a usuarios con sensibilidad al movimiento.
