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

// ID del model conveyor temp
var idModelConTemp = args.modelConveyor.id;

Ti.API.info("Argumentos recibidos: " + JSON.stringify(args));

// *********************************************************************
// EJECUTAMOS FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP
// *********************************************************************

getAllAccessoriesModelConveyorTemp(idModelConTemp);

// *********************************************************************
// FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP
// *********************************************************************

function getAllAccessoriesModelConveyorTemp(idModelConTemp) {

	// OBJ CON EL ID DEL MODEL CONVEYOR TEMP
	var objIdModelConvTemp = {
		"id" : parseInt(idModelConTemp)
	};

	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/findAccessoriesModelTemp";

	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			Ti.API.info("Received text: " + this.responseText);

			var responseWS = JSON.parse(this.responseText);
			Ti.API.info("ResponseWSQuotations: " + this.responseText);
			
			try {
				
				// FUNCION QUE GENERA LA LISTA DE LOS ACCESORIOS DE LA COTIZACION
				createAllAccessoriesModelsConveyorTemp(responseWS.accessories);

			} catch(err) {
				Ti.API.info("CATCH: " + err);
			}

		},
		onerror : function(e) {
			Ti.API.info(e.error);
			Ti.UI.createAlertDialog({
				message : 'Ocurrio un error.\nIntentalo nuevamente.',
				title : 'Error',
				ok : 'Aceptar',
			}).show();
		},
		timeout : 59000
	});

	// Preparamos conexion.
	client.open("POST", url);

	// Establecer la cabecera para el formato JSON correcta.
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	// Enviar peticion.
	client.send(JSON.stringify(objIdModelConvTemp));

}

// *********************************************************************
// FUNCION QUE GENERA LOS ACCESORIOS DE UN MODELO TEMPORAL
// *********************************************************************

function createAllAccessoriesModelsConveyorTemp(modelsAccessoriesModelTemp) {

	// RECORREMOS EL OBJETO
	modelsAccessoriesModelTemp.forEach(function(accessory, idx) {

		// Cantidad de accesorio
		var quantityAccessory = accessory.count;

		// Contenedor del accesorio
		var viewAccessory = Ti.UI.createView({
			top : 10,
			left : 10,
			bottom : 10,
			width : Alloy.Globals.layout.lists.cell.width,
			height : Alloy.Globals.layout.lists.cell.height,
			backgroundColor : '#3C3D42',
			clipMode : true
		});

		var urlImgAcc = "http://" + Alloy.Globals.URL_GLOBAL_SERVER_SIES + "/sies-admin" + accessory.accessorie.pic;

		// Imagen de accesorio
		var imageViewAccessory = Ti.UI.createImageView({
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			preventDefaultImage : true,
			touchEnabled : false,
			defaultImage : '/img/no-disponible.jpg',
			image : urlImgAcc//'http://image.made-in-china.com/2f0j10pvjtGEnMaqba/-Cinta-transportadora-con-el-accesorio-.jpg'
		});

		// Vista de degradado
		var viewGradientAccessory = Ti.UI.createView({
			top : 0,
			left : 0,
			width : Ti.UI.FILL,
			height : Ti.UI.FILL,
			backgroundGradient : {
				type : 'linear',
				startPoint : {
					x : '0%',
					y : '0%'
				},
				endPoint : {
					x : '0%',
					y : '100%'
				},
				colors : [{
					color : '#33000000',
					offset : 0
				}, {
					color : '#aa000000',
					offset : 1
				}]
			},
			touchEnabled : false
		});

		// Vista de Fondo
		var viewOverlayAccessory = Ti.UI.createView({
			layout : 'vertical',
			width : Titanium.UI.FILL,
			height : Titanium.UI.SIZE,
			bottom : 0,
			backgroundColor : '#000',
			opacity : 0.5,
			touchEnabled : false
		});

		// Nombre del accesorio
		var labelAccessory = Ti.UI.createLabel({
			top : 5,
			bottom : 5,
			left : 5,
			right : 5,
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			font : {
				fontSize : 20,
				fontFamily : 'FontAwesome'
			},
			textAlign : 'center',
			color : '#ffffff',
			touchEnabled : false,
			text : accessory.accessorie.nameAccessorie,
			id : accessory.accessorie.id,
			idx : parseInt(idx),
			quantity : accessory.count,
			idQuotationAccessorie : accessory.idQuotationAccessorie,
			countAcc : accessory.count,
			check : accessory.check
		});

		// Precio del accesorio
		var labelPriceAccessory = Ti.UI.createLabel({
			top : 0,
			bottom : 5,
			left : 5,
			right : 5,
			width : Ti.UI.FILL,
			height : Ti.UI.SIZE,
			textAlign : 'center',
			color : '#ffffff',
			touchEnabled : false,
			text : 'Precio: ' + accessory.accessorie.price,
			priceAcc : accessory.accessorie.price
		});

		// Cantidad de accesorio
		/*var sliderQuantityAccessory = Titanium.UI.createSlider({
		top          :0,
		bottom       : 5,
		left         : 5,
		right        : 5,
		width        : Ti.UI.FILL,
		height       : Ti.UI.SIZE,
		min          : 1,
		max          : 50,
		value        : quantityAccessory
		});*/

		// Atributo para saber si se puede o no elegir mas de un accesorio
		var verifyAccessory = accessory.accessorie.verify;

		// Variable para deshabilitar el campo
		var disabledQuantityAcc = false;

		// validamos si se puede cambiar la cantidad
		if (verifyAccessory == 2) {
			// Asignamos un valor a la variable
			disabledQuantityAcc = true;
		};
		
		//Cantidad del accesorio
		var quantityAccReal = 1;
		
		// Validamos la cantidad que hay en el campo
		if (quantityAccessory != 0) {
			quantityAccReal = quantityAccessory;
		};

		var sliderQuantityAccessory = Titanium.UI.createTextField({
			inputType : Titanium.UI.INPUT_TYPE_CLASS_NUMBER,
			width : 0,
			height : 0,
			color : "#FFFFFF",
			textAlign : Titanium.UI.TEXT_ALIGNMENT_CENTER,
			focusable : true,
			bubbleParent : false,
			keyboardType : Titanium.UI.KEYBOARD_TYPE_NUMBER_PAD,
			visible : false,
			left : 0,
			right : 0,
			value : quantityAccReal,
			editable : disabledQuantityAcc,
			touchEnabled : disabledQuantityAcc
		});

		// Label slider value
		var labelSliderQuantityAccessory = Ti.UI.createLabel({
			top : 0,
			bottom : 0,
			left : 0,
			right : 0,
			width : 0,
			height : 0,
			textAlign : 'center',
			color : '#ffffff',
			touchEnabled : false,
			//text : 'Cantidad:',
			visible : false,
			text : 'Cantidad:' //+ sliderQuantityAccessory.value,
		});

		/*sliderQuantityAccessory.addEventListener('change', function(e) {
		 labelSliderQuantityAccessory.text = 'Cantidad: ' + parseInt(e.value);
		 });*/

		var viewContainerAccessories = $.viewContainerAccessories;

		// Agregamos la imagen
		viewAccessory.add(imageViewAccessory);

		// Agregamos vista gradient
		viewAccessory.add(viewGradientAccessory);

		// Agregamos el Nombre
		viewOverlayAccessory.add(labelAccessory);

		// Agregamos precio
		viewOverlayAccessory.add(labelPriceAccessory);

		// Agregamos label para mostrar valor del slider
		viewOverlayAccessory.add(labelSliderQuantityAccessory);

		// Agregamos slider de cantidad
		viewOverlayAccessory.add(sliderQuantityAccessory);

		// Agregamos vista overlay
		viewAccessory.add(viewOverlayAccessory);

		// Agregamos los accesorios
		viewContainerAccessories.add(viewAccessory);

		// Variable con el valor de check
		var checkAccessory = accessory.check;

		// Validamos si el accesorio esta seleccionado
		if (checkAccessory == 1) {

			//Cambiamos el tamano del fondo
			viewOverlayAccessory.height = Ti.UI.FILL;

			// Cambiamos el color del fondo
			viewOverlayAccessory.backgroundColor = '#0B3C4C';

			// Cambiamos el color del label titulo
			labelAccessory.color = "#ECAE73";

			// Cambiamos el color al label precio
			labelPriceAccessory.color = "#ECAE73";

			// Mostramos el label cantidad de accesorio ***
			labelSliderQuantityAccessory.show();

			// Cambiamos el color del label cantidad de accesorio ***
			labelSliderQuantityAccessory.color = "#ECAE73";

			// Mostramos label slider
			//labelSliderQuantityAccessory.visible = true;

			// Cambiamos el ancho del label cantidad de accesorio ***
			labelSliderQuantityAccessory.width = Ti.UI.FILL;

			// Cambiamos el alto del label cantidad de accesorio ***
			labelSliderQuantityAccessory.height = Ti.UI.SIZE;

			// Cambiamos el espacio a la izquierda del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setLeft(5);

			// Cambiamos el espacio a la derecha del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setRight(5);

			// Cambiamos el espacio de abajo del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setBottom(5);

			// Activamos el foco del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setFocusable(true);

			// Cambiamos el color del campo de texto
			sliderQuantityAccessory.setColor("#ECAE73");

			// Mostramos el campo de texto
			sliderQuantityAccessory.show();

			// Cambiamos el ancho del campo de texto
			sliderQuantityAccessory.setWidth(Titanium.UI.FILL);

			// Cambiamos la altura del campo de texto
			sliderQuantityAccessory.setHeight(Titanium.UI.SIZE);

			// Cambiamos el espacio a la izquierda
			sliderQuantityAccessory.setLeft(15);

			// Cambiamos el espacio a la derecha
			sliderQuantityAccessory.setRight(15);

			// Aplicamos blur al campo de texto
			sliderQuantityAccessory.setValue(quantityAccReal);

			/*
			 // Mostramos slider
			 sliderQuantityAccessory.visible = true;

			 // Cambiamos el minimo del slider
			 sliderQuantityAccessory.min     = 1;

			 // Asignamos valor al slider
			 sliderQuantityAccessory.value   = quantityAccessory;

			 // Cambiamos alto del slider
			 sliderQuantityAccessory.height  = Ti.UI.SIZE;

			 // Cambiamos ancho del slider
			 sliderQuantityAccessory.width   = '100%';*/

		} else {

			//Cambiamos el tamano del fondo
			viewOverlayAccessory.height = Ti.UI.SIZE;

			// Cambiamos el color del fondo
			viewOverlayAccessory.backgroundColor = '#000000';

			// Cambiamos el color del label titulo
			labelAccessory.color = "#fff";

			// Cambiamos el color al label precio
			labelPriceAccessory.color = "#fff";

			// Ocultamos el label cantidad de accesorio ***
			labelSliderQuantityAccessory.hide();

			// Cambiamos el color del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setColor("#fff");

			// Cambiamos el ancho del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setWidth(0);

			// Cambiamos el alto del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setHeight(0);

			// Cambiamos el espacio a la izquierda del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setLeft(0);

			// Cambiamos el espacio a la derecha del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setRight(0);

			// Cambiamos el espacio de abajo del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setBottom(0);

			// Desactivamos el foco del label cantidad de accesorio ***
			labelSliderQuantityAccessory.setFocusable(false);

			// Cambiamos el color del campo de texto
			sliderQuantityAccessory.setColor("#fff");

			// Ocultamos el campo de texto
			sliderQuantityAccessory.hide();

			// Cambiamos el ancho del campo de texto
			sliderQuantityAccessory.setWidth(0);

			// Cambiamos la altura del campo de texto
			sliderQuantityAccessory.setHeight(0);

			// Cambiamos el espacio a la izquierda
			sliderQuantityAccessory.setLeft(0);

			// Cambiamos el espacio a la derecha
			sliderQuantityAccessory.setRight(0);

			// Aplicamos blur al campo de texto
			sliderQuantityAccessory.blur();

			// Aplicamos blur al campo de texto
			sliderQuantityAccessory.setValue(quantityAccReal);

			/*
			 // Cambiamos el color del label slider
			 labelSliderQuantityAccessory.color = "#fff";

			 // Ocultamos label slider
			 labelSliderQuantityAccessory.visible = false;

			 // Cambiamos alto de label slider
			 labelSliderQuantityAccessory.height = 0;

			 // Cambiamos ancho de label slider
			 labelSliderQuantityAccessory.width  = 0;

			 // Ocultamos slider
			 sliderQuantityAccessory.visible = false;

			 // Cambiamos el minimo del slider
			 sliderQuantityAccessory.min     = 0;

			 // Asignamos valor al slider
			 sliderQuantityAccessory.value   = quantityAccessory;

			 // Cambiamos alto del slider
			 sliderQuantityAccessory.height  = 0;

			 // Cambiamos ancho del slider
			 sliderQuantityAccessory.width   = 0;*/

		};

		// Atributo para saber si se puede o no elegir mas de un accesorio
		//var verifyAccessory = accessory.accessorie.verify;

		// VALIDAR SI SE PUEDE HACER CLICK O NO

		// CLICK SOBRE LA VISTA ACCESORIOS
		viewAccessory.addEventListener('click', function(e) {

			Ti.API.info(JSON.stringify(e.source));

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
				e.source.getChildren()[2].getChildren()[3].setValue(quantityAccReal);

				/*
				 // Cambiamos el color del label slider
				 e.source.getChildren()[2].getChildren()[2].setColor("#fff");

				 // Ocultamos label slider
				 e.source.getChildren()[2].getChildren()[2].hide();

				 // Cambiamos alto de label slider
				 e.source.getChildren()[2].getChildren()[2].setHeight(0);

				 // Cambiamos ancho de label slider
				 e.source.getChildren()[2].getChildren()[2].setWidth(0);

				 // Ocultamos slider
				 e.source.getChildren()[2].getChildren()[3].hide();

				 // Cambiamos el minimo del slider
				 e.source.getChildren()[2].getChildren()[3].setMin(0);

				 // Asignamos valor al slider
				 e.source.getChildren()[2].getChildren()[3].setValue(quantityAccessory);

				 // Cambiamos alto del slider
				 e.source.getChildren()[2].getChildren()[3].setHeight(0);

				 // Cambiamos ancho del slider
				 e.source.getChildren()[2].getChildren()[3].setWidth(0);*/

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
				e.source.getChildren()[2].getChildren()[3].setValue(quantityAccReal);

				/*
				 // Cambiamos el color del label slider
				 e.source.getChildren()[2].getChildren()[2].setColor("#ECAE73");

				 // Mostramos label slider
				 e.source.getChildren()[2].getChildren()[2].show();

				 // Cambiamos alto de label slider
				 e.source.getChildren()[2].getChildren()[2].setHeight(Titanium.UI.SIZE);

				 // Cambiamos ancho de label slider
				 e.source.getChildren()[2].getChildren()[2].setWidth(Titanium.UI.FILL);

				 // Mostramos slider
				 e.source.getChildren()[2].getChildren()[3].show();

				 // Cambiamos el minimo del slider
				 e.source.getChildren()[2].getChildren()[3].setMin(1);

				 // Asignamos valor al slider
				 e.source.getChildren()[2].getChildren()[3].setValue(quantityAccessory);

				 // Cambiamos alto del slider
				 e.source.getChildren()[2].getChildren()[3].setHeight(Titanium.UI.SIZE);

				 // Cambiamos ancho del slider
				 e.source.getChildren()[2].getChildren()[3].setWidth('100%');
				 */

			}

		});

		// Agregamos el cotenedor de accesorios al scroll view
		$.scrollViewAddAccessories.add(viewContainerAccessories);

	});

}

// *********************************************************************
// Evento que se ejecuta ala abri la ventana
// *********************************************************************

$.addAccessories.addEventListener("open", function(evt) {

	// Action Bar
	var actionBar;

	// Validamos el sistema operativo
	if (Ti.Platform.osname === "android") {

		// Activity
		var activityAddAccessories = $.addAccessories.activity;

		if (!activityAddAccessories) {
			Ti.API.info("No se puede acceder a la barra de acción en una ventana ligera.");
		} else {

			actionBar = $.addAccessories.activity.actionBar;

			// Validamos si existen un actionBar
			if (actionBar) {

				// Agregamos un menu
				activityAddAccessories.onCreateOptionsMenu = function(ev) {

					// Menu
					var menuAddAcc = ev.menu;

					// Item Menu Agregar o quitar accesorios
					var menuItemAddAcc = menuAddAcc.add({
						title : 'Agregar o Eliminar Accesorios',
						icon : Ti.Android.R.drawable.ic_menu_save,
						showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
					});

					// Click sobre itm del menu
					menuItemAddAcc.addEventListener('click', function(e) {

						Ti.API.info("Me hicieron clic: " + JSON.stringify(e));

						// Dialogo para agregar un model temp
						var dialogAddAccMT = Ti.UI.createAlertDialog({
							persistent : true,
							cancel : 0,
							buttonNames : ['Confirmar', 'Cancelar'],
							message : '¿Seguro de realizar esta acción?',
							title : 'Agregar o Eliminar Accesorios'
						});

						dialogAddAccMT.addEventListener('click', function(e) {

							Ti.API.info("Item Index: " + e.index);

							// Id de la cotizacion
							var idQuotationAddModelTemp = Alloy.Globals.ID_GLOBAL_QUOTATION;

							if (e.index == 0) {

								Ti.API.info('Vamos a agregar o eliminar accesorios');

								// Llamamos a la  funcion que guarda o elimina accesorios
								addOrDeleteAccessories();

							};

						});

						// Mostramos el dialogo
						dialogAddAccMT.show();

					});

				};

				// Metodo para mostrar menu dinamico
				activityAddAccessories.invalidateOptionsMenu();

				// Mostramos boton Home Icon
				actionBar.displayHomeAsUp = true;

				// Agregamos un titulo
				actionBar.title = "Accesorios";

				// Al hacer click en el boton Home Icon
				actionBar.onHomeIconItemSelected = function(e) {

					// Model Coveyor Temp
					var dataModelCoveyorTempQuoN = args;

					// Ventana
					var winSeeAccesoriesN = Alloy.createController('seeAccessories', dataModelCoveyorTempQuoN).getView();

					// Abrimos la ventana
					winSeeAccesoriesN.open();

					// Cerramos la ventana actual
					$.addAccessories.close();
				};

			};

		};

	};

});

// *********************************************************************
// FUNCION QUE AGREGA O ELIMINA ACCESORIOS
// *********************************************************************

function addOrDeleteAccessories() {
	Ti.API.info('Llamamos a la funcion agrega o eliminar accesorios');

	var idQuotationAccessorie;
	var idAccConv;
	var priceAccConv;
	var countAcc;
	var checkAcc;
	var backColorAccConv;
	var jsonAddDelAcc = [];

	// Recorremos los elemento
	$.viewContainerAccessories.children.forEach(function(objAcc, idx) {

		Ti.API.info('Numero de elementos: ' + idx);

		// ID del Quotation Accessory
		idQuotationAccessorie = objAcc.getChildren()[2].getChildren()[0].idQuotationAccessorie;
		Ti.API.info('idQuotationAccessorie: ' + idQuotationAccessorie);

		// ID del accesorio
		idAccConv = objAcc.getChildren()[2].getChildren()[0].id;
		Ti.API.info('ID de elementos: ' + idAccConv);

		// Color de fondo del accesorio
		backColorAccConv = objAcc.children[2].backgroundColor;
		Ti.API.info('backColorAccConv: ' + backColorAccConv);

		// Validamos si esta seleccionado
		if (backColorAccConv == "#0B3C4C") {

			// Cantidad de accesorios
			countAcc = objAcc.getChildren()[2].getChildren()[3].value;

			checkAcc = 1;

		} else if (backColorAccConv == "#000" || backColorAccConv == "#000000") {

			// Cantidad de accesorios
			countAcc = 0;

			checkAcc = 0;

		}
		;

		Ti.API.info('countAcc: ' + parseInt(countAcc));
		Ti.API.info('checkAcc: ' + parseInt(checkAcc));

		// Precio accesorio
		priceAccConv = objAcc.getChildren()[2].getChildren()[1].priceAcc;
		Ti.API.info('Precio: ' + priceAccConv);

		// Llenamos el objeto con los datos
		jsonAddDelAcc.push({
			idQuotationAccessorie : idQuotationAccessorie,
			count : parseInt(countAcc),
			check : checkAcc,
			accessorie : {
				id : idAccConv,
				price : priceAccConv
			}
		});

	});

	Ti.API.info('JSON DE ACCESORIOS: ' + JSON.stringify(jsonAddDelAcc));

	// JSON FINAL DE ACCESORIOS
	var jsonFullAddDelAcc = {
		idQuotationTemp : idModelConTemp,
		listAccessoriesQuotationTemp : jsonAddDelAcc

	};

	Ti.API.info('JSON FINAL DE ACCESORIOS: ' + JSON.stringify(jsonFullAddDelAcc));

	// Llamamos a la funcion que agrega o elimina accesorios
	saveAddOrDelAccessories(jsonFullAddDelAcc);

}

// *********************************************************************
// FUNCION PARA GUARDAR O ELIMINAR ACCESORIOS
// *********************************************************************

function saveAddOrDelAccessories(jsonFullAddDelAcc) {
	
	// Abrimos ventana del Indicador
	winAddActivityIndicator.open();

	// Mostramos el indicador
	activityIndicator.show();

	// Url del servicio rest
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/setAccessoriesToQuotationTemp";

	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {

			Ti.API.info("Received text: " + this.responseText);

			// Respuesta del servicio
			//var objResponseWS = JSON.parse(this.responseText);

			// Objeto con la respuesta del ws
			var responseWSADAMT = JSON.parse(this.responseText);

			Ti.API.info("Response WSADAMT: " + JSON.stringify(responseWSADAMT));
			
			setTimeout(function() {
			
				// ***********************************************************
				// TOTAL Y FECHA ESTIMADA DE LA COTIZACION
				// ***********************************************************
	
				// limpiamos nuestra variable global de total y fecha estimada
				Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = "";
	
				Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));
	
				// Asignamos el total y la fecha estimada a la variable global
				Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
					"totalPrice" : responseWSADAMT.totalPrice,
					"estimated" : responseWSADAMT.estimated
				};
	
				Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION 2: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));
	
				// Model Coveyor Temp
				var dataModelCoveyorTempQuo = args;
	
				// Ventana
				var winSeeAccesories = Alloy.createController('seeAccessories', dataModelCoveyorTempQuo).getView();
	
				// Abrimos la ventana
				winSeeAccesories.open();
				
				// Cerramos la ventana del Indicador
				winAddActivityIndicator.close();
	
				// Cerramos el indicador
				activityIndicator.hide();
	
				// Cerramos la ventana actual
				$.addAccessories.close();
			
			}, 3000);

		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			
			Ti.API.info(e.error);
			
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

	// Enviar la solicitud.
	client.send(JSON.stringify(jsonFullAddDelAcc));

}

// ***************************************
// CLICK EN EL BOTON FISICO VOLVER
// ***************************************

if (Ti.Platform.osname === "android") {

	$.addAccessories.addEventListener('android:back', function(e) {

		//Ti.API.info("Click en el boton volver");

		return false;

	});

}