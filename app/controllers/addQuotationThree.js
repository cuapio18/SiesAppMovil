// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("ACCESORIOS DEL TRANSPORTADOR:" + JSON.stringify(args));

// ACCESORIOS

var objAccesoriesConveyor = args;

// DATOS PARA GUARDAR UN MODELO Y GENERAR UNA COTIZACION

var dataFullModelAccesories = {
	"id" : "1",
	"model" : "TMR900FTP9018SM2-5SP1212",
	"accessories" : [{
		"id" : 1,
		"price" : 500.00,
		"quantity" : 1
	}, {
		"id" : 2,
		"price" : 200.00,
		"quantity" : 1
	}]
}; 


// EJECUTAMOS FUNCION PARA CREAR LA VISTA DE ACCESORIOS

fillAccessoriePicker(objAccesoriesConveyor);

// Click en el boton siguiente paso de la cotizacion
$.btnAddConveyor.addEventListener('click', function() {
	
	// Ventana del paso numero 4 de la cotizacion
	//var winAddQuotationFour = Alloy.createController('addQuotationFour').getView();
	
	// Abrir ventana
	//winAddQuotationFour.open();
	
	generarCotizacionModeloAccesorios(dataFullModelAccesories);
	
	// CLICK EN EL BOTON REGRESAR
	/*winAddQuotationFour.addEventListener("open", function(evt) {
		
		var actionBar = winAddQuotationFour.activity.actionBar;
		
		actionBar.displayHomeAsUp = true;
		actionBar.onHomeIconItemSelected = function(e) {
			//Ti.API.info(evt);
			winAddQuotationFour.close();
		};
		
	});*/
	
});

//var cells = [];

// **************************************************
// FUNCION PARA GENERAR LOS ACCESORIOS DE LOS TRASNPORTADORES
// **************************************************

/*function populateListAccessories(cellOffset, yOffset) {
	
	// Objeto con los datos a enviar
	var dataWS = {
		"model":"TMR900FTACA4018SW2-5SP1212"
		};
	
	// URL del servicio de accesorios
	//var url = "http://192.168.1.72:8080/SiesRestApp_23-09-2016/API/accessories";
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/searchModel";
	
	// Cliente para consumir el servicio
	var client = Ti.Network.createHTTPClient({
	
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			
			// Datos devueltos por el servico web
			var objOptionsAccessoriePicker = JSON.parse(this.responseText);
			
			// funcion que genera la vista de accesorios
			fillAccessoriePicker(objOptionsAccessoriePicker.acccesorie);
			
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			Ti.API.debug(e.error);
		},
		timeout : 5000 // milisegundos
		
	});
	
	// Preparar la conexion
	client.open("POST", url);
	
	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	
	// Enviamos la solicitud
	client.send(JSON.stringify(dataWS));
	
}*/

// FUNCION PARA GENERAR LA VISTA DE ACCESORIOS
function fillAccessoriePicker(objOptionsAccessoriePicker) {
	//console.log(objOptionsAccessoriePicker);
	
	// Contenedor para agregar los accesorios
	var containerAccessories = $.containerAccesorios;
	
	// Recoorremos el objeto json que recibimos
	objOptionsAccessoriePicker.forEach(function (optAcce, idx) {
		
		// Vista estatica
		var cell = Alloy.createController("list_static_cell");
		
		// Modificamos la vista
		cell.updateViews({
			"#cell" : {
				
			},
			"#title_label" : {
				text: optAcce.nameAccessorie
			},
			"#price_accessory" : {
				text : '$ ' + optAcce.price
			},
			"#imageview" : {
				image : 'http://image.made-in-china.com/2f0j10pvjtGEnMaqba/-Cinta-transportadora-con-el-accesorio-.jpg'
			}
			
		});
		
		//  ********* ACCIONES SOBRE CADA ACCESORIO **********
		
		(function(cell, index) {
			
			// Al hacer click sobre cada elemento
			cell.getView().addEventListener("click", function(e) {
				
				// Validamos el color de fondo de la vista
				if(e.source.getChildren()[2].getBackgroundColor() == "#0B3C4C") {
					
					//Cambiamos el tamano del fondo
					e.source.getChildren()[2].setHeight(Ti.UI.SIZE);
					
					// Cambiamos el color de fondo
					e.source.getChildren()[2].setBackgroundColor("#000");
					
					// Cambiamos el color del label titulo
					e.source.getChildren()[2].getChildren()[0].setColor("#fff");
					
					// Cambiamos el color al label precio
					e.source.getChildren()[2].getChildren()[1].setColor("#fff");
					
				} else {
					
					// Cambiamos el tamano del fondo
					e.source.getChildren()[2].setHeight(Ti.UI.FILL);
					
					// Cambiamos el color de fondo
					e.source.getChildren()[2].setBackgroundColor("#0B3C4C");
					
					// Cambiamos el color del label titulo
					e.source.getChildren()[2].getChildren()[0].setColor("#ECAE73");
					
					// Cambiamos el color al label precio
					e.source.getChildren()[2].getChildren()[1].setColor("#ECAE73");//0DD1BE - ECAE73
					
				}
				
			});
			
		})(cell, idx);

		// Arregamos los accesorios al arreglo
		//cells.push(cell);
		
		// Agregamos los accesorios al contenedor
		containerAccessories.add(cell.getView());
		
	});
	
}

/*function populateLists(lists, type, cellOffset, yOffset) {
	//lists.length
	for (var i=0, num_lists=15; i<num_lists; i++) {

		var list = lists[i];
		var idx = i + cellOffset;
		var cell_x = 10 + ((Alloy.Globals.layout.lists.cell.width + 10) * (idx % 2));
		var cell_y = yOffset + ((Alloy.Globals.layout.lists.cell.height + 10) * Math.floor(idx / 2));

		var cell = Alloy.createController("list_static_cell");
		cell.updateViews({
			"#cell": {
				//top: cell_y,
				//left: cell_x
			},
			"#title_label": {
				text: 'Accesorio ' + (parseInt(i)+1)//(parseInt(i)+1)//list.title.toUpperCase()
			},
			"#imageview": {
				image: 'http://image.made-in-china.com/2f0j10pvjtGEnMaqba/-Cinta-transportadora-con-el-accesorio-.jpg'
			}
		});

		//var images = [];
		//_.each(list.backdrop_paths, function(path) {
		//	if (path != null) {
		//		images.push(theMovieDb.common.getImage({
		//			size: Alloy.Globals.backdropImageSize,
		//			file: path}));
		//	}
		//});
		//images = _.chain(images).shuffle().first(5).value();
		//cell.populateImages(images);

		(function(cell, index) {

			cell.getView().addEventListener("click", function(e) {

				//$.lists_container.touchEnabled = false;

				//cell.animateClick(function() {

					//if (type == 'list') {
		    			//openList(lists[index]);
		    		//} else if (type == 'genre') {
		    			//openGenre(genres[index]);
		    		//}
		    		//this.style.backgroundColor = "red";
		    		//alert(e.source.getBackgroundColor());
		    		//e.source.setZIndex(200);
		    		//e.source.setBackgroundColor("#00B274");
		    		//e.source.getChildren()[2].getChildren().toString()
		    		//alert(e.source.getChildren()[2].toString());
		    		//font:{fontSize:24,fontFamily:'Lucida Grande',fontWeight:'bold'},setFont
		    		// Validamos el color de fondo de la vista
		    		if(e.source.getChildren()[2].getBackgroundColor() == "#0B3C4C"){
		    			
		    			// Quitamos el input de la vista
		    			e.source.getChildren()[2].remove(e.source.getChildren()[2].getChildren()[2]);
		    			
		    			e.source.getChildren()[2].setHeight(Ti.UI.SIZE);
		    			e.source.getChildren()[2].setBackgroundColor("#000");
		    			
		    			e.source.getChildren()[2].getChildren()[0].setColor("#fff");
		    			e.source.getChildren()[2].getChildren()[1].setColor("#fff");
		    			
		    		} else {
		    			
		    			// Creamos campo para ingresar la cantidad
		    			var textFieldQuantity = Ti.UI.createTextField({
		    				color: '#fff',
		    				inputType: Ti.UI.INPUT_TYPE_CLASS_NUMBER,
		    				keyboardType: Titanium.UI.KEYBOARD_TYPE_NUMBER_PAD,
		    				value: 1,
		    				bubbleParent: false,
		    				height: Ti.UI.SIZE,
		    				width: Ti.UI.SIZE,
		    				//Titanium.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS
		    				focusable: true,
		    				softKeyboardOnFocus: Ti.UI.Android.SOFT_KEYBOARD_SHOW_ON_FOCUS
		    				//focusable: true
		    				//touchEnabled: false,
		    			});
		    			
		    			// Añanimos el campo a la vista
		    			e.source.getChildren()[2].add(textFieldQuantity);

		    			e.source.getChildren()[2].setHeight(Ti.UI.FILL);
						e.source.getChildren()[2].setBackgroundColor("#0B3C4C");
						
						e.source.getChildren()[2].getChildren()[0].setColor("#ECAE73");
		    			e.source.getChildren()[2].getChildren()[1].setColor("#ECAE73");
						// Azul claro - 4179BF
		    		}
					
		    		setTimeout(function() {
				    	//$.lists_container.touchEnabled = true;
				    }, 1000);

	   			//});
			});

		})(cell, i);

		cells.push(cell);
		$.containerAccesorios.add(cell.getView());
		//$.lists_container.add(cell.getView());
		//var contentHeight = cell_y + Alloy.Globals.layout.lists.cell.height + 10;
		//if (OS_ANDROID) {
		//	contentHeight = Alloy.Globals.dpToPx(contentHeight);
		//}
		//$.lists_container.contentHeight = contentHeight;
	}
}*/

//var cellOffset = (OS_IOS) ? 20 : 0;
//var list = [];

//populateLists(list, 'list', 0, cellOffset + Alloy.Globals.layout.lists.cell.height + 20);
//populateListAccessories(0, cellOffset + Alloy.Globals.layout.lists.cell.height + 20);

function generarCotizacionModeloAccesorios(objModelAccesories) 
{

	// Url del servicio rest
	var url    = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/saveQuotationTemp";
	
	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			Ti.API.info("Received text: " + this.responseText);
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	
	// Preparar la conexión.
	client.open("POST", url);
	
	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	
	// Enviar la solicitud.
	client.send(JSON.stringify(objModelAccesories)); 
	
}
