// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// Bandera Home
var flagHomeStatus = 0;

// ID DEL USUARIO
var idUsuarioSession = Alloy.Globals.PROPERTY_INFO_USER.userLogin.id;

// ID DE LA COTIZACION
var idQuo = Alloy.Globals.ID_GLOBAL_QUOTATION;

Ti.API.info("ARGUMENTOS RECIBIDOS:" + JSON.stringify(args));
Ti.API.info("ACCESORIOS DEL TRANSPORTADOR:" + JSON.stringify(args.accesories));

// ACCESORIOS

var objAccesoriesConveyor = args.accesories;

// ID del modelo

var idModel   = args.model.id;

// Modelo
var nameModel = args.model.model;

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
	
	//Ti.API.info("Contenedor de accesorios: " + JSON.stringify($.containerAccesorios.children));
	
	var idAccConv;
	var nameAccConv;
	var priceAccConv;
	var quantityAccConv;
	var backColorAccConv;
	var statusSelectedAccConv;
	var jsonAccConvSaveQuot = [];
	
	// Recorremos elementos
	$.containerAccesorios.children.forEach(function(objAcc, idx){
		
		// ID del accesorio
		idAccConv   = objAcc.children[2].children[0].attributedString;
		
		// Nombre accesorio
		nameAccConv  = objAcc.children[2].children[0].text;
		
		// Precio accesorio
		priceAccConv = objAcc.children[2].children[1].text;
		
		// Convertimos el precio a numero
		var convertriceAccesory = priceAccConv.split("$ ")[1].replace(new RegExp(",", "g"), "");
		
		// Cantidad de accesorios
		quantityAccConv = objAcc.children[2].children[2].value;
		
		// Color de fondo del accesorio
		backColorAccConv = objAcc.children[2].backgroundColor;
		
		// Validamos el color de fondo
		// Para saber si fue seleccionado o no
		if (backColorAccConv == "#0B3C4C") {
			statusSelectedAccConv = "checked";
		} else if (backColorAccConv == "#000") {
			statusSelectedAccConv = "unchecked";
		};
		
		//Ti.API.info("ACCESORIO: " + JSON.stringify(objAcc.children[2]));
		//Ti.API.info("Elementos recorridos: " + "Nombre: " + nameAccConv + " Precio: " + priceAccConv + " Color: " + backColorAccConv + " Status: " + statusSelectedAccConv);
		
		//Ti.API.info("Precio: " + convertriceAccesory);
		//Ti.API.info("Precio 2: " + parseFloat(convertriceAccesory));
		
		// Validamos el status
		if (statusSelectedAccConv == "checked") {
			// Creamos un objeto con los datos de los accesorios
			jsonAccConvSaveQuot.push({
				id                     : idAccConv,
				//nameAccessoryConveyor  : nameAccConv,
				price                  : parseFloat(convertriceAccesory),
				quantity               : parseInt(quantityAccConv),
				//colorAccesoryConveyor  : backColorAccConv,
				//statusAccesoryConveyor : statusSelectedAccConv
			});
		};
		
	});
	
	//Ti.API.info("OBJETO DE ACCESORIOS DE MODELOS: " + JSON.stringify(jsonAccConvSaveQuot));
	//var objSaveQuotationJson = [];
	
	// Creamo objeto para guardar la cotizacion
	var objSaveQuotationJson = {
		idUser      : idUsuarioSession,
		id          : idModel,
		model       : nameModel,
		accessories : jsonAccConvSaveQuot
	};
	
	// Si el id de la cotizacion es diferente de cero agregamos un valor al array}
	if (idQuo > 0) {
		objSaveQuotationJson['idQuotation'] = idQuo;
	};
	
	// Dialogo para agregar cotizacion
	var dialogAddQuotation = Ti.UI.createAlertDialog({
		persistent  : true,
		cancel      : 0,
		buttonNames : ['Confirmar', 'Cancelar'],
		message     : "¿Deseas confirmar esta acción?",
		title       : "Agregar Cotización"
	});
	
	// Click sobre el dialogo
	dialogAddQuotation.addEventListener('click', function(e){
		
		Ti.API.info("Indice boton: " + e.index);
		
		// Si se presiona confirmar
		if (e.index == 0) {
			Ti.API.info("ID de la Cotización: " + Alloy.Globals.ID_GLOBAL_QUOTATION);
			Ti.API.info("OBJETO PARA GUARDAR COTIZACION: " + JSON.stringify(objSaveQuotationJson));
			// GUARDAMOS LA COTIZACION
			generarCotizacionModeloAccesorios(objSaveQuotationJson);
		};
		
	});
	
	// Mostramos el dialogo
	dialogAddQuotation.show();
	
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
				text             : optAcce.nameAccessorie,
				attributedString : optAcce.id
			},
			"#price_accessory" : {
				text : '$ ' + optAcce.price
			},
			"#imageview" : {
				image : 'http://image.made-in-china.com/2f0j10pvjtGEnMaqba/-Cinta-transportadora-con-el-accesorio-.jpg'
			},
			"#quantity_accesory" : {
				value : 1,
				//focusable : true,
			}
			
		});
		
		//  ********* ACCIONES SOBRE CADA ACCESORIO **********
		
		(function(cell, index) {
			
			// Al hacer click sobre cada elemento
			cell.getView().addEventListener("click", function(e) {
				
				Ti.API.info("Se activa click");
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
					
					// Cambiamos el color del campo de texto
					e.source.getChildren()[2].getChildren()[2].setColor("#fff");
					
					// Ocultamos el campo de texto
					e.source.getChildren()[2].getChildren()[2].hide();
					
					// Cambiamos el ancho del campo de texto
					e.source.getChildren()[2].getChildren()[2].setWidth(0);
					
					// Cambiamos la altura del campo de texto
					e.source.getChildren()[2].getChildren()[2].setHeight(0);
					
				} else {
					
					// Cambiamos el tamano del fondo
					e.source.getChildren()[2].setHeight(Ti.UI.FILL);
					
					// Cambiamos el color de fondo
					e.source.getChildren()[2].setBackgroundColor("#0B3C4C");
					
					// Cambiamos el color del label titulo
					e.source.getChildren()[2].getChildren()[0].setColor("#ECAE73");
					
					// Cambiamos el color al label precio
					e.source.getChildren()[2].getChildren()[1].setColor("#ECAE73");//0DD1BE - ECAE73
					
					// Cambiamos el color del campo de texto
					e.source.getChildren()[2].getChildren()[2].setColor("#ECAE73");
					
					// Mostramos el campo de texto
					e.source.getChildren()[2].getChildren()[2].show();
					
					// Cambiamos el ancho del campo de texto
					e.source.getChildren()[2].getChildren()[2].setWidth(Titanium.UI.SIZE);
					
					// Cambiamos la altura del campo de texto
					e.source.getChildren()[2].getChildren()[2].setHeight(Titanium.UI.SIZE);
					
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

function generarCotizacionModeloAccesorios(objSaveQuotationJson) 
{

	// Url del servicio rest
	var url    = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/saveQuotationTemp";
	
	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			
			Ti.API.info("Received text: " + this.responseText);
			
			// Respuesta del servicio
			var objResponseWS = JSON.parse(this.responseText);
			
			// validamos la bandera
			Alloy.Globals.ID_GLOBAL_QUOTATION = objResponseWS.quotation.id
			
			// Ventana del paso numero 4 de la cotizacion
			var winAddQuotationFour = Alloy.createController('addQuotationFour', objResponseWS).getView();
			
			// Evento que se ejecuta al abrir la ventana
			winAddQuotationFour.addEventListener("open", function(evt) {
				
				// Action Bar
				var actionBar;
				
				// Activity
				var activityQuoFour = winAddQuotationFour.activity;
				
				// Validamos el sistema operativo
				if (Ti.Platform.osname === "android") {
					
					if (! activityQuoFour) {
						Ti.API.error("No se puede acceder a la barra de acción en una ventana ligera.");
					} else {
						
						// Action Bar de la ventana
						actionBar = winAddQuotationFour.activity.actionBar;
						
						// Validamos si existe un actionbar
						if (actionBar) {
							
							// Agregamos un menu
							activityQuoFour.onCreateOptionsMenu = function(ev) {
								
								// Menu
								var menu = ev.menu;
								
								// Item Menu Add Model
								var menuItemAddModelTemp = menu.add({
									title        : 'Agregar Modelo',
									icon         : Ti.Android.R.drawable.ic_menu_add,
									showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
								});
								
								// Click sobre un item del menu
								menuItemAddModelTemp.addEventListener('click', function(e){
									
									Ti.API.info("Me hicieron clic: " + JSON.stringify(e));
									
									// Dialogo para agregar un model temp
									var dialogAddModelTempQ = Ti.UI.createAlertDialog({
										persistent  : true,
										cancel      : 0,
										buttonNames : ['Confirmar', 'Cancelar'],
										message     : '¿Deseas agregar un nuevo modelo a tu cotización?',
										title       : 'Agregar Modelo'
									});
									
									dialogAddModelTempQ.addEventListener('click', function(e) {
										
										Ti.API.info("Item Index: " + e.index);
										
										// Id de la cotizacion
										var idQuotationAddModelTemp = Alloy.Globals.ID_GLOBAL_QUOTATION;
			
										if (e.index == 0) {
											
											// Asignamos un valor a la variable 0 - Nueva 1 - Editar
											flagHomeStatus = 1;
											
											// Parametros a enviar
											var objHomeParameters = {
												flagHomeStatus : flagHomeStatus
											};
											
											// Limpiamos el valor del id de la cotizacion
											Alloy.Globals.ID_GLOBAL_QUOTATION = 0;
											//Ti.API.info("Editar la cotización. " +  dataItemSelected.title_quotation.text + " # " + dataItemSelected.title_quotation.id);
											Ti.API.info("ID Cotización: " + Alloy.Globals.ID_GLOBAL_QUOTATION);
	
											// Asignamos un id
											Alloy.Globals.ID_GLOBAL_QUOTATION = parseInt(idQuotationAddModelTemp);
											Ti.API.info("ID Cotización 2: " + Alloy.Globals.ID_GLOBAL_QUOTATION);
											
											// Venta principal de cotizaciones
											var winHomeQuotations = Alloy.createController('home', objHomeParameters).getView();
											
											// Abrimos ventana
											winHomeQuotations.open();
											
										};
										
									});
									
									// Mostramos el dialogo
									dialogAddModelTempQ.show();
		
								});
								
								// Item Menu Cancel Quotation
								var menuItemCancelQuo = menu.add({
									title        : 'Cancelar',
									icon         : Ti.Android.R.drawable.ic_menu_close_clear_cancel,
									showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
								});
								
								// Click sobre un item del menu
								menuItemCancelQuo.addEventListener('click', function(e) {
									
									Ti.API.info("Click Item Cancelar: " + JSON.stringify(e));
									
									// Limpiamos el valor del id de la cotizacion
									Alloy.Globals.ID_GLOBAL_QUOTATION = 0;
									
									// Venta principal de cotizaciones
									var winHomeQuotations = Alloy.createController('home').getView();
										
									// Abrimos ventana
									winHomeQuotations.open();
									
								});
								
							};
							
							// Metodo para mostrar menu dinamico
							activityQuoFour.invalidateOptionsMenu();
							
							// Mostramos boton Home Icon
							//actionBar.displayHomeAsUp = true;
							
							// Agregamos un titulo
							actionBar.title = "Cotización Generada";
							
							// Al hacer click en el boton Home Icon
							/*actionBar.onHomeIconItemSelected = function(e) {
								//Ti.API.info(evt);
								winAddQuotationFour.close();
							};*/
							
						};
						
					};
					
				};
				
			});
			
			// Abrir ventana
			winAddQuotationFour.open();
			
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
	client.send(JSON.stringify(objSaveQuotationJson)); 
	
}