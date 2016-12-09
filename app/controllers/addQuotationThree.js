// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// CREAMOS UN INDICADOR

// Ventana para mostrar el indicador
var winAddActivityIndicator = Ti.UI.createWindow({
	theme : "Theme.AppCompat.Light.NoActionBar",
	backgroundColor : "#000",
	opacity : .9,
	fullscreen : true
});

// Creamos activity Indicator
var activityIndicator = Ti.UI.createActivityIndicator({
	color : '#ccc',
	font : {
		fontFamily : 'Helvetica Neue',
		fontSize : 26,
		fontWeight : 'bold'
	},
	message : 'Espere...',
	style : Ti.UI.ActivityIndicatorStyle.BIG_DARK,
	height : Ti.UI.SIZE,
	width : Ti.UI.SIZE
});

// Agregamos el indicador a la ventana
winAddActivityIndicator.add(activityIndicator);

// Bandera Home
//var flagHomeStatus = 0;

// ID DEL USUARIO
var idUsuarioSession = Alloy.Globals.PROPERTY_INFO_USER.userLogin.id;

// ID DE LA COTIZACION
var idQuo = Alloy.Globals.ID_GLOBAL_QUOTATION;
//Ti.API.info("idQuo:" + idQuo);
//Ti.API.info("ARGUMENTOS RECIBIDOS:" + JSON.stringify(args));
//Ti.API.info("ACCESORIOS DEL TRANSPORTADOR:" + JSON.stringify(args.accesories));

// ACCESORIOS

var objAccesoriesConveyor = args.accesories;

// ID del modelo

var idModel = args.model.id;

// Modelo
var nameModel = args.model.model;

// DATOS PARA GUARDAR UN MODELO Y GENERAR UNA COTIZACION

/*var dataFullModelAccesories = {
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
};*/

// EJECUTAMOS FUNCION PARA CREAR LA VISTA DE ACCESORIOS

fillAccessoriePicker(objAccesoriesConveyor);

// ****************************************************
// Click en el boton siguiente paso de la cotizacion
// ****************************************************

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
	$.containerAccesorios.children.forEach(function(objAcc, idx) {

		// ID del accesorio
		idAccConv = objAcc.children[2].children[0].attributedString;

		// Nombre accesorio
		nameAccConv = objAcc.children[2].children[0].text;

		// Precio accesorio
		priceAccConv = objAcc.children[2].children[1].text;

		// Convertimos el precio a numero
		var convertriceAccesory = priceAccConv.split("$ ")[1].replace(new RegExp(",", "g"), "");

		// Cantidad de accesorios
		quantityAccConv = objAcc.children[2].children[3].value;

		// Color de fondo del accesorio
		backColorAccConv = objAcc.children[2].backgroundColor;

		// Validamos el color de fondo
		// Para saber si fue seleccionado o no
		if (backColorAccConv == "#0B3C4C") {
			statusSelectedAccConv = "checked";
		} else if (backColorAccConv == "#000") {
			statusSelectedAccConv = "unchecked";
		}
		;

		//Ti.API.info("ACCESORIO: " + JSON.stringify(objAcc.children[2]));
		//Ti.API.info("Elementos recorridos: " + "Nombre: " + nameAccConv + " Precio: " + priceAccConv + " Color: " + backColorAccConv + " Status: " + statusSelectedAccConv);

		//Ti.API.info("Precio: " + convertriceAccesory);
		//Ti.API.info("Precio 2: " + parseFloat(convertriceAccesory));

		// Validamos el status
		if (statusSelectedAccConv == "checked") {
			// Creamos un objeto con los datos de los accesorios
			jsonAccConvSaveQuot.push({
				id : idAccConv,
				//nameAccessoryConveyor  : nameAccConv,
				price : parseFloat(convertriceAccesory),
				quantity : parseInt(quantityAccConv),
				//colorAccesoryConveyor  : backColorAccConv,
				//statusAccesoryConveyor : statusSelectedAccConv
			});
		};

	});

	//Ti.API.info("OBJETO DE ACCESORIOS DE MODELOS: " + JSON.stringify(jsonAccConvSaveQuot));
	//var objSaveQuotationJson = [];

	// Creamo objeto para guardar la cotizacion
	var objSaveQuotationJson = {
		idUser : idUsuarioSession,
		id : idModel,
		model : nameModel,
		accessories : jsonAccConvSaveQuot
	};

	// Si el id de la cotizacion es diferente de cero agregamos un valor al array}
	if (idQuo > 0) {
		objSaveQuotationJson['idQuotation'] = idQuo;
	};

	// Dialogo para agregar cotizacion
	var dialogAddQuotation = Ti.UI.createAlertDialog({
		persistent : true,
		cancel : 0,
		buttonNames : ['Confirmar', 'Cancelar'],
		message : "¿Deseas confirmar esta acción?",
		title : "Agregar Cotización"
	});

	// Click sobre el dialogo
	dialogAddQuotation.addEventListener('click', function(e) {

		//Ti.API.info("Indice boton: " + e.index);
		//Ti.API.info("ID de la Cotización: " + Alloy.Globals.ID_GLOBAL_QUOTATION);
		Ti.API.info("OBJETO PARA GUARDAR COTIZACION: " + JSON.stringify(objSaveQuotationJson));

		// Si se presiona confirmar
		if (e.index == 0) {
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

	//Ti.API.info("JSON DE ACCESORIOS: " + JSON.stringify(objOptionsAccessoriePicker));

	// Contenedor para agregar los accesorios
	var containerAccessories = $.containerAccesorios;

	// Recoorremos el objeto json que recibimos
	objOptionsAccessoriePicker.forEach(function(optAcce, idx) {
		
		// Atributo para saber si se puede o no elegir mas de un accesorio
		var verifyAccessory = optAcce.verify;
		
		// Variable para deshabilitar el campo
		var disabledQuantityAcc = false;
		
		// validamos si se puede cambiar la cantidad
		if (verifyAccessory == 2) {
			// Asignamos un valor a la variable
			disabledQuantityAcc = true;
		};

		var urlImgAcc = "http://" + Alloy.Globals.URL_GLOBAL_SERVER_SIES + "/sies-admin" + optAcce.pic;

		// Vista estatica
		var cell = Alloy.createController("list_static_cell");

		// Modificamos la vista
		cell.updateViews({
			"#cell" : {

			},
			"#title_label" : {
				text : optAcce.nameAccessorie,
				attributedString : optAcce.id
			},
			"#price_accessory" : {
				text : '$ ' + optAcce.price
			},
			"#imageview" : {
				image : urlImgAcc//'http://image.made-in-china.com/2f0j10pvjtGEnMaqba/-Cinta-transportadora-con-el-accesorio-.jpg'
			},
			"#label_quantity_accessory" : {
				text : 'Cantidad:'
			},
			"#quantity_accesory" : {
				value : 1,
				editable : disabledQuantityAcc,
				touchEnabled : disabledQuantityAcc
				//focusable : true,
			}

		});

		//  ********* ACCIONES SOBRE CADA ACCESORIO **********

		(function(cell, index) {

			// Al hacer click sobre cada elemento
			cell.getView().addEventListener("click", function(e) {

				//Ti.API.info("Se activa click");
				// Validamos el color de fondo de la vista
				if (e.source.getChildren()[2].getBackgroundColor() == "#0B3C4C") {

					//Cambiamos el tamano del fondo
					e.source.getChildren()[2].setHeight(Ti.UI.SIZE);

					// Cambiamos el color de fondo
					e.source.getChildren()[2].setBackgroundColor("#000");

					// Cambiamos el color del label titulo
					e.source.getChildren()[2].getChildren()[0].setColor("#fff");

					// Cambiamos el color al label precio
					e.source.getChildren()[2].getChildren()[1].setColor("#fff");
					
					// Ocultamos el label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].hide();
					
					// Cambiamos el color del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setColor("#fff");
					
					// Cambiamos el ancho del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setWidth(0);
					
					// Cambiamos el alto del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setHeight(0);
					
					// Cambiamos el espacio a la izquierda del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setLeft(0);
					
					// Cambiamos el espacio a la derecha del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setRight(0);
					
					// Cambiamos el espacio de abajo del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setBottom(0);
					
					// Desactivamos el foco del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setFocusable(false);
					
					// Cambiamos el color del campo de texto
					e.source.getChildren()[2].getChildren()[3].setColor("#fff");

					// Ocultamos el campo de texto
					e.source.getChildren()[2].getChildren()[3].hide();

					// Cambiamos el ancho del campo de texto
					e.source.getChildren()[2].getChildren()[3].setWidth(0);

					// Cambiamos la altura del campo de texto
					e.source.getChildren()[2].getChildren()[3].setHeight(0);
					
					// Cambiamos el espacio a la izquierda
					e.source.getChildren()[2].getChildren()[3].setLeft(0);
					
					// Cambiamos el espacio a la derecha
					e.source.getChildren()[2].getChildren()[3].setRight(0);
					
					// Aplicamos blur al campo de texto
					e.source.getChildren()[2].getChildren()[3].blur();
					
					// Aplicamos blur al campo de texto
					e.source.getChildren()[2].getChildren()[3].setValue(1);

				} else {

					// Cambiamos el tamano del fondo
					e.source.getChildren()[2].setHeight(Ti.UI.FILL);

					// Cambiamos el color de fondo
					e.source.getChildren()[2].setBackgroundColor("#0B3C4C");

					// Cambiamos el color del label titulo
					e.source.getChildren()[2].getChildren()[0].setColor("#ECAE73");

					// Cambiamos el color al label precio
					e.source.getChildren()[2].getChildren()[1].setColor("#ECAE73");
					//0DD1BE - ECAE73
					
					// Mostramos el label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].show();
					
					// Cambiamos el color del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setColor("#ECAE73");
					
					// Cambiamos el ancho del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setWidth(Titanium.UI.FILL);
					
					// Cambiamos el alto del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setHeight(Titanium.UI.SIZE);
					
					// Cambiamos el espacio a la izquierda del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setLeft(5);
					
					// Cambiamos el espacio a la derecha del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setRight(5);
					
					// Cambiamos el espacio de abajo del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setBottom(5);
					
					// Activamos el foco del label cantidad de accesorio ***
					e.source.getChildren()[2].getChildren()[2].setFocusable(true);

					// Cambiamos el color del campo de texto
					e.source.getChildren()[2].getChildren()[3].setColor("#ECAE73");

					// Mostramos el campo de texto
					e.source.getChildren()[2].getChildren()[3].show();

					// Cambiamos el ancho del campo de texto
					e.source.getChildren()[2].getChildren()[3].setWidth(Titanium.UI.FILL);

					// Cambiamos la altura del campo de texto
					e.source.getChildren()[2].getChildren()[3].setHeight(Titanium.UI.SIZE);
					
					// Cambiamos el espacio a la izquierda
					e.source.getChildren()[2].getChildren()[3].setLeft(15);
					
					// Cambiamos el espacio a la derecha
					e.source.getChildren()[2].getChildren()[3].setRight(15);
					
					// Aplicamos blur al campo de texto
					e.source.getChildren()[2].getChildren()[3].setValue(1);

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

function generarCotizacionModeloAccesorios(objSaveQuotationJson) {
	// Abrimos ventana del Indicador
	winAddActivityIndicator.open();

	// Mostramos el indicador
	activityIndicator.show();

	// Url del servicio rest
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/saveQuotationTemp";

	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {

			//Ti.API.info("Received text: " + this.responseText);

			// Respuesta del servicio
			var objResponseWS = JSON.parse(this.responseText);

			setTimeout(function() {

				// Validamos la bandera
				if (objResponseWS.flag == true) {

					// ***************************************************************
					// ASIGNAMOS VALORES A LAS VARIABLES GLOBALES
					// **************************************************************

					// 1.- ASIGNAMOS UN VALOR A LA VARIABLE GLOBAL DE ID DE LA COTIZACION
					Alloy.Globals.ID_GLOBAL_QUOTATION = objResponseWS.quotation.id;
					//Ti.API.info("Alloy.Globals.ID_GLOBAL_QUOTATION: " + JSON.stringify(Alloy.Globals.ID_GLOBAL_QUOTATION));

					// 2.- ASIGNAMOS UN VALOR  A LA VARIABLE GLOBAL DE LISTA DE MODELOS
					Alloy.Globals.ALL_LIST_MODEL_TEMP_QUOTATION = objResponseWS.listTemp;
					//Ti.API.info("Alloy.Globals.ALL_LIST_MODEL_TEMP_QUOTATION: " + JSON.stringify(Alloy.Globals.ALL_LIST_MODEL_TEMP_QUOTATION));

					// 3.- ASIGNAMOS EL TOTAL Y FECHA ESTIMADA A LA VARIABLE GLOBAL
					Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
						"totalPrice" : objResponseWS.totalPrice,
						"estimated" : objResponseWS.estimated
					};
					//Ti.API.info("Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));

					// 4.- ASIGNAMOS UN VALOR A LA VARIABLE GLOBAL ID DE CLIENTE
					Alloy.Globals.ID_CLIENT_QUOTATION = Alloy.Globals.PROPERTY_INFO_USER.userLogin.user.business.id;
					//objResponseWS.quotation.client.user.business.id;
					//Ti.API.info("Alloy.Globals.ID_CLIENT_QUOTATION: " + JSON.stringify(Alloy.Globals.ID_CLIENT_QUOTATION));

					// 5.- Asignamos un valor a la propiedad Alloy.Globals.ALL_DATA_QUOTATION
					Alloy.Globals.ALL_DATA_QUOTATION = objResponseWS.quotation;
					//Ti.API.info("Alloy.Globals.ID_CLIENT_QUOTATION: " + JSON.stringify(Alloy.Globals.ID_CLIENT_QUOTATION));

					// Ventana del paso numero 4 de la cotizacion
					var winAddQuotationFour = Alloy.createController('addQuotationFour', objResponseWS).getView();

					// Abrir ventana
					winAddQuotationFour.open();

				};

			}, 3000);

		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
			// Cerramos la ventana del Indicador
			winAddActivityIndicator.close();

			// Cerramos el indicador
			activityIndicator.hide();

			//alert("Ocurrio un error.\nIntentalo nuevamente.");
			Ti.UI.createAlertDialog({
				message : 'Ocurrio un error.\nIntentalo nuevamente.',
				title : 'Error',
				ok : 'Aceptar',
			}).show();

		},
		timeout : 55000 // en milisegundos
	});

	// Preparar la conexión.
	client.open("POST", url);

	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	// Enviar la solicitud.
	client.send(JSON.stringify(objSaveQuotationJson));

}

// ***************************************
// CLICK EN EL BOTON FISICO VOLVER
// ***************************************

/*if (Ti.Platform.osname === "android") {

	$.index.addEventListener('android:back', function(e) {

		//Ti.API.info("Click en el boton volver");

		// Cerramos la ventana
		//$.index.close();

		// Obtenemos el activity actual
		//var activity = Titanium.Android.currentActivity;

		// Terminamos el activity
		//activity.finish();

		//return false;

	});

}*/
