// Initialize app
var myApp = new Framework7();
  
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'My App',
    // App id
    id: 'com.myapp.test',
    // Enable swipe panel
    panel: {
      swipe: 'left',
    },
    // Add default routes
    routes: [
      {
        path: '/inicio/',
        url: 'inicio.html',
      },
      {
        path: '/about/',
        url: 'about.html',
      }
    ],
    dialog: {
      buttonOk: 'Revancha',
      buttonCancel: 'No, finalizar.'
    }
    // ... other parameters
  });

var mainView = app.views.create('.view-main');

// RESET ALL

function resetGame(){
  players = [];
  totalScores = [];
  GeneralScores = [];
  $$("li.swipeout").remove();
}

// BOTON PARA VOLVER O SALIR
document.addEventListener("backbutton", onBackKeyDown, false); 

function onBackKeyDown() { 
  switch (app.views.main.router.url) {
    case ( "/about/" ) :
      dynamicDialog(' Esta acción reiniciara todos los puntajes ¿Deseas Continuar?', 'REINICIANDO MARCADOR', closeAndReset);
        break;
    case ( "/inicio/" ) :
        mainView.router.back();
        break;
    default :
    dynamicDialog('¿Estás seguro que quieres salir de la app?', 'Confirmar salida', navigator.app.exitApp);  
  break;   
  }  
};
    
// Global variables
var scoreName = ['Nombre', 'Uno', 'Dos', 'Tres', 'Cuatro', 'Cinco', 'Seis', 'Escalera', 'Full', 'Póker', 'Generala', 'D.Generala', 'Total'];
var players = [];
var totalScores = [];
var GeneralScores = [];
var indexJugador, indexPicker;


const closeAndReset = () => {
  mainView.router.back()
  resetGame();
}
var dynamicDialog = (textBody, titleDial, callback) => {
  app.dialog.create({
    title: titleDial,
    text: textBody,
    buttons : [
      {
        text: 'Si',
        onClick: callback
        }, 
      {
        text: 'No',
      }
      
    ]
  }).open();
};



// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {

})

$$(document).on('page:init', '.page[data-name="inicio"]', function() {
    
  // USAR FOR AL APRETAR SOBRE EL BORRAR ELEMENTO PARA RENOMBRAR EL LABEL DE CADA JUGADOR
  $$("#addPlayer").on('click', function(){
    $$("ul.page2").append(`<li class="item-content item-input swipeout primeros">
                              <div class="item-inner swipeout-content">
                                <div class="item-title item-floating-label">Jugador ${$$(".item-title").length + 1}</div>
                                <div class="item-input-wrap">
                                  <input type="text" placeholder="Nombre" required validate pattern="[a-zA-Z]*">
                                  <span class="input-clear-button"></span>
                                </div>
                              </div>
                              <div class="swipeout-actions-right">
                                <a href="#" class="swipeout-delete">Borrar</a>
                              </div>
                            </li>`);
  });
  


  $$("#init").on('click', function(){
    var estaoNo = $$("input[placeholder]");
    var jugador;
      for(var i = 0; i < $$("li.primeros").length; i++){
        jugador = $$(estaoNo[i]).hasClass("input-with-value")?estaoNo[i].value:$$("li.primeros")[i].innerText;
        var hasSpace = jugador.indexOf('\n');
        if( hasSpace > 0 ) jugador = jugador.substring(hasSpace, -1);
        players.push(jugador);
        totalScores.push([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        GeneralScores.push(0);
      };    
  });
});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="about"]', function (e) {
        
  // for scores 
  function createScoreNames(){
    for(var i = 0; i < scoreName.length; i++){
      $$("#puntuacion").append(`<div class="auto h7 ali">${scoreName[i]}</div>`);
    };
  };
  
  // for slider players
  function createSliders(){
    for(var i = 0; i < players.length; i++){
      var jugComprimido = players[i].replace(' ','') + i;
      $$(".swiper-wrapper.otroSwiper").append(`<div class="swiper-slide playerFill h100">
                                                  <div class="list no-hairlines-md h100">
                                                    <ul class="${jugComprimido} page3 h100">
                                                      <li class="h7 ali">${players[i]}</li>
                                                    </ul>
                                                  </div>
                                                </div>`);
      $$(".swiper-wrapper.scores").append(`<div class="swiper-slide">${players[i]}: <span class="valorTotal"></span></div>`);
      createScore(jugComprimido);
      $$(`ul.${jugComprimido}`).append(`<li class="h7 ali"><span class="valorTotal"></span></li>`);
    };

    var swiper = app.swiper.create('.moverse', {
      autoplay: {
        delay: 3000,
      },
    });
  };

  // for slider puntajes
  function createScore(jug){
    var uno, dos, tres, cuatro, cinco, serve;
    var unserve = 20;
    for(var j = 1; j < 7; j++){
      $$(`ul.${jug}`).append(`<li class="h7 segundos">
                                <input type="text" placeholder=" - " readonly="readonly" class='puntos${jug + j} ali'/>
                              </li>`);
      uno = String(j * 1);
      dos = String(j * 2);
      tres = String(j * 3);
      cuatro = String(j * 4);
      cinco = String(j * 5);
      var pickerDevice1 = app.picker.create({
        inputEl: `.puntos${jug + j}`,
        toolbarCloseText: 'Confirmar',
        openIn: 'popover',
        cols: [{
                textAlign: 'center',
                values: [0, uno, dos, tres, cuatro, cinco, 0],
                displayValues: ['-', uno, dos, tres, cuatro, cinco, 'x']
              }],
        on: {
          closed: function () {
            totalScores[indexJugador][indexPicker] = parseInt(this.value);
            console.log(totalScores[indexJugador]);
            GeneralScores[indexJugador] = totalScores[indexJugador].reduce((a, b) => a + b);
            $$('ul.page3>li>span.valorTotal')[indexJugador].innerText = `${GeneralScores[indexJugador]}`;
            $$('div>span.valorTotal')[indexJugador].innerText = `${GeneralScores[indexJugador]}`;
          }
        }
      });
    };
    for(var j = 7; j < 12; j++){
      serve = unserve + 5;
      var juegosArmados = [0, unserve, serve, 0];
      $$(`ul.${jug}`).append(`<li class="h7 segundos">
                                <input type="text" placeholder=" - " readonly="readonly" class='juegos${jug + j} ali'/>
                              </li>`);
      if(j == 4){
        juegosArmados[2] = 'WIN';
      }else if(j == 5){
        juegosArmados.splice(2,1);
      };
      var pickerDevice1 = app.picker.create({
        inputEl: `.juegos${jug + j}`,
        toolbarCloseText: 'Confirmar',
        openIn: 'popover',
        onChange: function () {
          totalScores[indexJugador][indexPicker] = parseInt(this.value);
          console.log(totalScores[indexJugador]);
          GeneralScores[indexJugador] = totalScores[indexJugador].reduce((a, b) => a + b);
          $$('ul.page3>li>span.valorTotal')[indexJugador].innerText = `${GeneralScores[indexJugador]}`;
          $$('div>span.valorTotal')[indexJugador].innerText = `${GeneralScores[indexJugador]}`;
        },
        cols: [{
                textAlign: 'center',
                values: juegosArmados,
                displayValues : ['-'].concat(juegosArmados.slice(1,3)).concat(['x']) 
              }],
        on: {
          closed: function () {
            totalScores[indexJugador][indexPicker] = parseInt(this.value);
            console.log(totalScores[indexJugador]);
            GeneralScores[indexJugador] = totalScores[indexJugador].reduce((a, b) => a + b);
            $$('ul.page3>li>span.valorTotal')[indexJugador].innerText = `${GeneralScores[indexJugador]}`;
            $$('div>span.valorTotal')[indexJugador].innerText = `${GeneralScores[indexJugador]}`;

          }
        }
      });
      unserve += 10;
    };

  };
 
  createScoreNames();
  createSliders();
  
  $$('ul.page3').on('click', function(){ indexJugador = $$('ul.page3').indexOf(this)})
  $$('ul.page3>.segundos').on('click', function(){ indexPicker = $$('ul.page3>.segundos').indexOf(this)})

  // TABLA DE PUNTOS
  $$('.popup-open.moverse').on('click', function () {
    var points = '';
    for(var i = 0; i < players.length; i++){
      points += players[i] + ':   ' + GeneralScores[i] + '<br/>';
    };
    $$('.rellenarPuntajes').append(points);
  });

  $$('.popup-close').on('click', function () {
    $$('.rellenarPuntajes').html('');
  });
  

  $$('.open-confirm').on('click', function () {
      var algunIndex = GeneralScores.indexOf(Math.max(...GeneralScores));
      var jugadorazo = $$('ul.page3>li')[algunIndex].innerText;
      app.dialog.confirm('Quieren jugar a revancha?', `Gano ${jugadorazo}`, function () {
        for(var i = 0; i < totalScores.length; i++){
          totalScores[i]=0;
        };
        createScore();
      }, function(){
        resetGame();
        mainView.router.back();
      }, ['No, finalizar.', 'Revancha']);
  });

})