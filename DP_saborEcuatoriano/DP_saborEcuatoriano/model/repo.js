var Modelo = Modelo || {};

(function () {
  "use strict";

  var productos = [
    {
      "id": 1,
      "nombre": "Encebollado",
      "categoria": "Sopas",
      "descripcion": "Caldo de albacora con yuca, tomate y cebolla curtida. Servido con chifles y limón.",
      "precio": 8.50,
      "imagen": "./assets/img/encebollado.jpg"
    },
    {
      "id": 2,
      "nombre": "Locro de papa",
      "categoria": "Sopas",
      "descripcion": "Sopa cremosa de papa con queso fresco, aguacate y cilantro andino.",
      "precio": 7.00,
      "imagen": "./assets/img/locro-papa.jpg"
    },
    {
      "id": 3,
      "nombre": "Caldo de patas",
      "categoria": "Sopas",
      "descripcion": "Caldo reconfortante de pata de res con maní, mote y aguacate. El favorito de los domingos.",
      "precio": 7.50,
      "imagen": "./assets/img/caldo-patas.jpg"
    },
    {
      "id": 4,
      "nombre": "Yahuarlocro",
      "categoria": "Sopas",
      "descripcion": "Sopa de papas con borrego y sangre frita. Plato emblemático de la sierra ecuatoriana.",
      "precio": 8.00,
      "imagen": "./assets/img/yahuarlocro.jpg"
    },
    {
      "id": 5,
      "nombre": "Sopa de quinua",
      "categoria": "Sopas",
      "descripcion": "Sopa andina con quinua, verduras frescas y papas. Nutritiva y reconfortante.",
      "precio": 6.50,
      "imagen": "./assets/img/sopa-quinua.jpg"
    },
    {
      "id": 6,
      "nombre": "Llapingachos",
      "categoria": "Platos fuertes",
      "descripcion": "Tortillas de papa con queso, chorizo, huevo frito y aguacate. Un clásico de la sierra.",
      "precio": 9.50,
      "imagen": "./assets/img/llapingachos.jpg"
    },
    {
      "id": 7,
      "nombre": "Hornado",
      "categoria": "Platos fuertes",
      "descripcion": "Cerdo horneado servido con mote, llapingachos y agrio de la casa. El rey de los mercados.",
      "precio": 12.00,
      "imagen": "./assets/img/hornado.jpg"
    },
    {
      "id": 8,
      "nombre": "Seco de pollo",
      "categoria": "Platos fuertes",
      "descripcion": "Pollo guisado con cerveza, naranjilla y especias. Servido con arroz amarillo y maduro.",
      "precio": 9.00,
      "imagen": "./assets/img/seco-pollo.jpg"
    },
    {
      "id": 9,
      "nombre": "Fritada",
      "categoria": "Platos fuertes",
      "descripcion": "Carne de cerdo frita en su propia manteca, con mote, tostado, maduro y choclo.",
      "precio": 11.00,
      "imagen": "./assets/img/fritada.jpg"
    },
    {
      "id": 10,
      "nombre": "Seco de chivo",
      "categoria": "Platos fuertes",
      "descripcion": "Guiso de chivo con chicha, especias y yuca. Plato típico de la costa y sierra.",
      "precio": 13.00,
      "imagen": "./assets/img/seco-chivo.jpg"
    },
    {
      "id": 11,
      "nombre": "Churrasco ecuatoriano",
      "categoria": "Platos fuertes",
      "descripcion": "Bistec apanado con huevo frito, arroz, papas fritas y ensalada. Contundente y sabroso.",
      "precio": 10.50,
      "imagen": "./assets/img/churrasco.jpg"
    },
    {
      "id": 12,
      "nombre": "Guatita",
      "categoria": "Platos fuertes",
      "descripcion": "Mondongo de res guisado en salsa de maní con papas y arroz blanco.",
      "precio": 8.50,
      "imagen": "./assets/img/guatita.jpg"
    },
    {
      "id": 13,
      "nombre": "Cuy asado",
      "categoria": "Platos fuertes",
      "descripcion": "Cuy entero asado a la brasa, servido con papas, mote y salsa de maní. Tradición andina.",
      "precio": 18.00,
      "imagen": "./assets/img/cuy-asado.jpg"
    },
    {
      "id": 14,
      "nombre": "Mote con chicharrón",
      "categoria": "Platos fuertes",
      "descripcion": "Mote blanco cocinado servido con chicharrón de cerdo crujiente. Sencillo y sabroso.",
      "precio": 7.50,
      "imagen": "./assets/img/mote-chicharron.jpg"
    },
    {
      "id": 15,
      "nombre": "Ceviche de camarón",
      "categoria": "Mariscos",
      "descripcion": "Camarón fresco con cebolla, tomate, limón y chifles crocantes. El orgullo de la costa.",
      "precio": 11.00,
      "imagen": "./assets/img/ceviche-camaron.jpg"
    },
    {
      "id": 16,
      "nombre": "Ceviche de concha",
      "categoria": "Mariscos",
      "descripcion": "Conchas negras marinadas en limón y naranja agria con cebolla y cilantro.",
      "precio": 12.00,
      "imagen": "./assets/img/ceviche-concha.jpg"
    },
    {
      "id": 17,
      "nombre": "Encocado de pescado",
      "categoria": "Mariscos",
      "descripcion": "Filete de pescado en salsa de coco con especias afroecuatorianas. Servido con arroz con coco.",
      "precio": 13.50,
      "imagen": "./assets/img/encocado-pescado.jpg"
    },
    {
      "id": 18,
      "nombre": "Arroz con menestra",
      "categoria": "Mariscos",
      "descripcion": "Arroz blanco con menestra de fréjol negro y patacones. Acompañado de carne asada.",
      "precio": 10.00,
      "imagen": "./assets/img/arroz-menestra.jpg"
    },
    {
      "id": 19,
      "nombre": "Bolón de verde",
      "categoria": "Desayunos",
      "descripcion": "Masa de plátano verde rellena de queso o chicharrón, dorada al sartén.",
      "precio": 5.50,
      "imagen": "./assets/img/bolon-verde.jpg"
    },
    {
      "id": 20,
      "nombre": "Tigrillo",
      "categoria": "Desayunos",
      "descripcion": "Verde maduro aplastado y frito con huevo, queso y chicharrón. Desayuno costeño.",
      "precio": 6.50,
      "imagen": "./assets/img/tigrillo.jpg"
    },
    {
      "id": 21,
      "nombre": "Colada morada",
      "categoria": "Bebidas",
      "descripcion": "Bebida de maíz morado con frutas y especias. Infaltable en el Día de Difuntos.",
      "precio": 3.50,
      "imagen": "./assets/img/colada-morada.jpg"
    },
    {
      "id": 22,
      "nombre": "Jugo de naranjilla",
      "categoria": "Bebidas",
      "descripcion": "Refresco natural de naranjilla ecuatoriana, frutal y ligeramente ácido.",
      "precio": 2.50,
      "imagen": "./assets/img/jugo-naranjilla.jpg"
    },
    {
      "id": 23,
      "nombre": "Chicha de jora",
      "categoria": "Bebidas",
      "descripcion": "Bebida ancestral fermentada de maíz con especias andinas. Servida fría.",
      "precio": 3.00,
      "imagen": "./assets/img/chicha-jora.jpg"
    },
    {
      "id": 24,
      "nombre": "Humitas",
      "categoria": "Snacks",
      "descripcion": "Masa de choclo tierno cocinada al vapor en hoja, ideal para acompañar el café.",
      "precio": 4.50,
      "imagen": "./assets/img/humitas.jpg"
    },
    {
      "id": 25,
      "nombre": "Chifles",
      "categoria": "Snacks",
      "descripcion": "Plátano verde frito en láminas finas, crocantes y salados. Para picar o acompañar.",
      "precio": 3.00,
      "imagen": "./assets/img/chifles.jpg"
    },
    {
      "id": 26,
      "nombre": "Empanadas de viento",
      "categoria": "Snacks",
      "descripcion": "Empanadas fritas rellenas de queso, espolvoreadas con azúcar y canela.",
      "precio": 4.00,
      "imagen": "./assets/img/empanadas-viento.jpg"
    },
    {
      "id": 27,
      "nombre": "Quimbolitos",
      "categoria": "Snacks",
      "descripcion": "Pastelitos de maíz con pasas, cocinados al vapor en hoja de achira. Dulces y esponjosos.",
      "precio": 3.50,
      "imagen": "./assets/img/quimbolitos.jpg"
    },
    {
      "id": 28,
      "nombre": "Helado de paila",
      "categoria": "Postres",
      "descripcion": "Helado artesanal de frutas batido en paila de bronce. Sabores de mora, naranjilla y frutilla.",
      "precio": 4.00,
      "imagen": "./assets/img/helado-paila.jpg"
    },
    {
      "id": 29,
      "nombre": "Tres leches",
      "categoria": "Postres",
      "descripcion": "Bizcocho empapado en crema de tres leches con merengue y frutas. Suave y cremoso.",
      "precio": 5.00,
      "imagen": "./assets/img/tres-leches.jpg"
    },
    {
      "id": 30,
      "nombre": "Arroz con leche",
      "categoria": "Postres",
      "descripcion": "Postre tradicional de arroz con leche y canela. Receta de la abuelita de siempre.",
      "precio": 3.50,
      "imagen": "./assets/img/arroz-leche.jpg"
    }
  ];

  Modelo.cargarProductos = function () {
    return Promise.resolve(productos);
  };

})();