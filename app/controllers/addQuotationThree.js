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

// ACCESORIOS

var objAccesoriesConveyor = args.accesories;

// ID del modelo

var idModel = args.model.id;

// Modelo
var nameModel = args.model.model;

// EJECUTAMOS FUNCION PARA CREAR LA VISTA DE ACCESORIOS

fillAccessoriePicker(objAccesoriesConveyor);

// FUNCION PARA GENERAR LA VISTA DE ACCESORIOS

function fillAccessoriePicker(objOptionsAccessoriePicker) {

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
					e.source.getChildren()[2].getChildren()[3].blur();

					// Aplicamos blur al campo de texto
					e.source.getChildren()[2].getChildren()[3].setValue(1);

				}

			});

		})(cell, idx);

		// Agregamos los accesorios al contenedor
		containerAccessories.add(cell.getView());

	});

}

// ****************************************************
// Click en el boton siguiente paso de la cotizacion
// ****************************************************

$.btnAddConveyor.addEventListener('click', function() {

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

		// Validamos el status
		if (statusSelectedAccConv == "checked") {
			// Creamos un objeto con los datos de los accesorios
			jsonAccConvSaveQuot.push({
				id : idAccConv,
				price : parseFloat(convertriceAccesory),
				quantity : parseInt(quantityAccConv)
			});
		};

	});

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

		// Si se presiona confirmar
		if (e.index == 0) {
			// GUARDAMOS LA COTIZACION
			saveQuotationModelAccessories(objSaveQuotationJson);
		};

	});

	// Mostramos el dialogo
	dialogAddQuotation.show();

});

// ******************************************
// FUNCION QUE CREA O MODIFICA UNA COTIZACION
// ******************************************

function saveQuotationModelAccessories(objSaveQuotationJson) {
	Ti.API.info('objSaveQuotationJson: ' + JSON.stringify(objSaveQuotationJson));
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

			Ti.API.info('this.responseText: ' + this.responseText);

			// Respuesta del servicio
			var objResponseWS = JSON.parse(this.responseText);

			// EJECUTAMOS LA FUNCION PARA ASIGNAR VALORES A LAS VARIABLES GLOBALES
			setGlobalVariablesSies(objResponseWS);

			setTimeout(function() {

				// Validamos la bandera
				if (objResponseWS.flag == true) {

					// Ventana del paso numero 4 de la cotizacion
					var winAddQuotationFour = Alloy.createController('addQuotationFour', objResponseWS).getView();
					//var winAddQuotationFour = Alloy.createController('home', objResponseWS).getView();

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
		timeout : 59000 // en milisegundos
	});

	// Preparar la conexión.
	client.open("POST", url);

	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	//var objetito = {id:4};
	// Enviar la solicitud.
	client.send(JSON.stringify(objSaveQuotationJson));
	//client.send(JSON.stringify(objetito));

}

// ***************************************************
// FUNCION QUE ASIGNA VALORES A LAS VARIABLES GLOBALES
// ***************************************************

function setGlobalVariablesSies(objResponseWS) {

	// ***************************************************************
	// ASIGNAMOS VALORES A LAS VARIABLES GLOBALES
	// **************************************************************

	// 1.- ASIGNAMOS UN VALOR A LA VARIABLE GLOBAL DE ID DE LA COTIZACION
	Alloy.Globals.ID_GLOBAL_QUOTATION = objResponseWS.quotation.id;

	// 2.- ASIGNAMOS EL TOTAL Y FECHA ESTIMADA A LA VARIABLE GLOBAL
	Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
		"totalPrice" : objResponseWS.totalPrice,
		"estimated" : objResponseWS.estimated
	};

	// 3.- ASIGNAMOS UN VALOR A LA VARIABLE GLOBAL ID DE CLIENTE
	Alloy.Globals.ID_CLIENT_QUOTATION = Alloy.Globals.PROPERTY_INFO_USER.userLogin.user.business.id;
	//objResponseWS.quotation.client.user.business.id;

	// 4.- Asignamos un valor a la propiedad Alloy.Globals.ALL_DATA_QUOTATION
	Alloy.Globals.ALL_DATA_QUOTATION = objResponseWS.quotation;

}

