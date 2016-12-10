// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("Argumentos recibidos: " + JSON.stringify(args));

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

Ti.API.info("ID del model conveyor temp: " + parseInt(idModelConTemp));

// *********************************************************************
// EJECUTAMOS FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP
// *********************************************************************

getAllAccessoriesModelConveyorTemp(idModelConTemp);

// **********************************************************
// FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP
// **********************************************************

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
				
				// FUNCION QUE GENERA LA LISTA DE LOS MODELOS DE LA COTIZACION
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

// **********************************************************
// FUNCION QUE GENERA LOS ACCESORIOS DE UN MODELO TEMPORAL
// **********************************************************

function createAllAccessoriesModelsConveyorTemp(modelsAccessoriesModelTemp) {

	// Array para guardar los datos
	var items = [];

	// Contador de accesorios seleccionados
	var countAccModel = 0;

	// RECORREMOS EL OBJETO
	modelsAccessoriesModelTemp.forEach(function(accessory, idx) {

		// Validamos si el accesorio esta seleccionado
		if (accessory.check == 1) {
			
			// Incrementamos el contador
			countAccModel++;

			// Vamos agregando los datos al arreglo
			items.push({
				name_accessory : {
					text : accessory.accessorie.nameAccessorie,
					id : accessory.accessorie.id,
					idx : parseInt(idx),
					quantity : accessory.count,
					idQuoAcc : accessory.idQuotationAccessorie,
					moreToOne : accessory.moreToOne
				},
				quantity_accessory : {
					text : "Cantidad: " + accessory.count
				},
				price_accessory : {
					text : "Precio: $" + accessory.accessorie.price
				}
			});

		};

		// Agregamos los datos a la lista
		$.listViewSeeAccessories.sections[0].setItems(items);

	});

	Ti.API.info("Contador de accesorios: " + countAccModel);

	// Validamos la cantidad de accesorios seleccionados
	if (countAccModel == 0) {
		Ti.UI.createAlertDialog({
			message : 'No hay accesorios seleccionados.',
			title : 'Accesorios',
			ok : 'Aceptar',
		}).show();
	};

}

// Dialogo de accesorios seleccionados
var dialogAccessorySelected;
var arrayDialogAccSelect = ['Cantidad Acc. +/-', 'Eliminar', 'Cancelar'];
var optDialogAccSelect = {
	title : "Accesorio Seleccionado",
	cancel : 2,
	options : arrayDialogAccSelect,
	destructive : 0,
	bubbleParent : false
};

// Datos del elemento presionado
var dataItemSelectedAccesory = {};

// Index del elemento seleccionado
var itemIndexAccessory;

// **********************************************************
// PRESION LARGA EN UN ELEMENTO DE LA LISTA
// **********************************************************

function longPressAccessory(e) {

	// Indice del elemento presionado
	itemIndexAccessory = e.itemIndex;

	// Datos del elemento presionado
	dataItemSelectedAccesory = e.section.items[parseInt(itemIndexAccessory)];

	Ti.API.info("ITEM INDEX: " + itemIndexAccessory);
	Ti.API.info("ITEM SELECTED: " + JSON.stringify(dataItemSelectedAccesory));

	dialogAccessorySelected = Ti.UI.createOptionDialog(optDialogAccSelect);
	dialogAccessorySelected.show();
	dialogAccessorySelected.addEventListener('click', onSelectedDialogAccessory);

}

// DIALOGO DE CANTIDAD DE MODELOS TEMPORALES

var dialogQuantityAccessory = $.alertDialogAccesoryQuantity;

// **********************************************************
// FUNCION QUE SE EJECUTA AL PRESIONAR UN ELEMENTO DEL DIALOGO
// **********************************************************

function onSelectedDialogAccessory(event) {

	Ti.API.info("Accesorio seleccionado: " + JSON.stringify(dataItemSelectedAccesory));

	// Indice del elemento seleccionado del dialogo
	var selectedIndexDialogAccessory = event.source.selectedIndex;

	Ti.API.info("Index del elemento seleccionado: " + parseInt(selectedIndexDialogAccessory));

	// Estatus de la cotización
	var statusOfQuotationSelected = Alloy.Globals.ALL_DATA_QUOTATION.title_quotation.statusQuo;
	Ti.API.info("statusOfQuotationSelected: " + JSON.stringify(statusOfQuotationSelected));

	// Variable para guardar el valor de si se puede o no cambiar la cantidad del accesorio
	var moreToOneAccessory = dataItemSelectedAccesory.name_accessory.moreToOne;

	// Realizamos una accion dependiendo lo que fue seleccionado
	switch(parseInt(selectedIndexDialogAccessory)) {
	case 0:
		Ti.API.info("Cantidad Accesorio.");

		// Validamos el status de la cotizacion
		if (statusOfQuotationSelected == 4) {
			// Mostramos mensaje
			Ti.UI.createAlertDialog({
				message : '¡El accesorio seleccionado no se puede modificar!\nLa cotizacción esta terminada.',
				title : 'Cotización terminada',
				ok : 'Aceptar',
			}).show();
		} else {

			// validamos si se puede cambiar la cantidad
			if (moreToOneAccessory == 2) {

				// Modificar value del slider
				var valueSQA = $.sliderlabelAccesoryQuantity;

				valueSQA.value = parseInt(dataItemSelectedAccesory.name_accessory.quantity);

				// Mostramos el dialogo
				dialogQuantityAccessory.show();

			} else {
				// Mostramos mensaje
				Ti.UI.createAlertDialog({
					message : '¡El accesorio seleccionado no se puede modificar!\nSolo se permite uno.',
					title : 'Cantidad de accesorio',
					ok : 'Aceptar',
				}).show();
			};

		};

		break;
	case 1:
		Ti.API.info("Eliminar Accesorio");

		// Validamos el status de la cotizacion
		if (statusOfQuotationSelected == 4) {
			// Mostramos mensaje
			Ti.UI.createAlertDialog({
				message : '¡El accesorio seleccionado no se puede eliminar!\nLa cotizacción esta terminada.',
				title : 'Cotización terminada',
				ok : 'Aceptar',
			}).show();
		} else {

			//Ti.API.info("Eliminar Modelo Temp");
			deleteAccessoryModelTemp();

		};

		break;
	default:
		Ti.API.info("Opcion no encontrada.");
		break;
	}

}

// *****************************************************************************
// AL HACER CLICK SOBRE ALGUNA OPCION DEL ALERT DIALOG DE CANTIDAD DE ACCESORIOS
// *****************************************************************************

dialogQuantityAccessory.addEventListener('click', function(e) {

	Ti.API.info("Item Index Dialog Alert CA: " + e.index);

	// Si presionamos confirmar
	if (e.index == 0) {
		// Llamamos a la funcion para actualizar la cantidad del modelo
		changeQuantityAccessory();
	};

});

// **********************************************************
// FUNCION PARA AUMENTA O DISMINUIR LA CANTIDAD DE ACCESORIOS
// **********************************************************

function changeQuantityAccessory() {
	// Abrimos ventana del Indicador
	winAddActivityIndicator.open();

	// Mostramos el indicador
	activityIndicator.show();

	Ti.API.info("ITEM SELECCIONADO: " + JSON.stringify(dataItemSelectedAccesory));
	Ti.API.info("Cantidad accesorio MT. " + dataItemSelectedAccesory.name_accessory.text + " # " + dataItemSelectedAccesory.name_accessory.id);

	// Slider de cantidad de accesorios
	var valueSliderQAMT = $.sliderlabelAccesoryQuantity;
	Ti.API.info("VALOR DE SLIDER: " + parseInt(valueSliderQAMT.value));
	Ti.API.info("Aumentar o disminuir cantidad de accesorios!");

	// Objeto para enviar en la peticion
	var objJSONQuantityAccessory = {
		idQuotationAccessorie : parseInt(dataItemSelectedAccesory.name_accessory.idQuoAcc),
		count : parseInt(valueSliderQAMT.value)
	};

	Ti.API.info("OBJ JSON QAMT: " + JSON.stringify(objJSONQuantityAccessory));

	// URL del sevicio
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/countAccessorieOfQuotationTemp";

	// Cliente para realizar la peticion
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {

			Ti.API.info("Received text: " + this.responseText);

			// Objeto con la respuesta del ws
			var responseWSQAMT = JSON.parse(this.responseText);

			Ti.API.info("Response WSQMT: " + JSON.stringify(responseWSQAMT));

			setTimeout(function() {

				if (responseWSQAMT.flag == true) {

					// ***********************************************************
					// TOTAL Y FECHA ESTIMADA DE LA COTIZACION
					// ***********************************************************

					// limpiamos nuestra variable global de total y fecha estimada
					Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = "";

					Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));

					// Asignamos el total y la fecha estimada a la variable global
					Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
						"totalPrice" : responseWSQAMT.totalPrice,
						"estimated" : responseWSQAMT.estimated
					};

					Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION 2: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));

					// Item seleccionado
					var row = $.listViewSeeAccessories.sections[0].getItemAt(parseInt(itemIndexAccessory));

					Ti.API.info("ROW: " + JSON.stringify(row));

					// Modificamos el atributo cantidad del item list seleccionado
					row.quantity_accessory.text = "Cantidad: " + parseInt(valueSliderQAMT.value);

					// Modificamos el atributo cantidad del item list seleccionado
					row.name_accessory.quantity = parseInt(valueSliderQAMT.value);

					Ti.API.info("ROW 2: " + JSON.stringify(row));

					// Modificamos el item de la lista con los nuevos datos
					$.listViewSeeAccessories.sections[0].updateItemAt(parseInt(itemIndexAccessory), row, {
						animated : true
					});

				};

				// Cerramos la ventana del Indicador
				winAddActivityIndicator.close();

				// Cerramos el indicador
				activityIndicator.hide();

			}, 3000);

		},
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
		timeout : 59000
	});

	// Preparamos conexion
	client.open("POST", url);

	// Establece rla cabecera para el formato JSON correcta.
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	// Enviar peticion.
	client.send(JSON.stringify(objJSONQuantityAccessory));

}

//$.slider.text = $.slider.value;

// **********************************************************
// ACTUALIZAR EL TEXTO DEL LABEL ACCESSORY QUANTITY
// **********************************************************

/*function updateLabel(e)
{
Ti.API.info("SLIDER: " + parseInt(e.value));
$.labelAccesoryQuantity.text = parseInt(e.value);
//$.label.text = String.format("%3.1f", e.value);
}*/

// **********************************************************
// FUNCION PARA ELIMINAR UN ACCESORIO DEL MODEL TEMP
// **********************************************************

function deleteAccessoryModelTemp() {
	Ti.API.info("ITEM SELECCIONADO: " + JSON.stringify(dataItemSelectedAccesory));

	// Objeto co Id del accesorio del model temp
	var objIdAccessoryMT = {
		idQuotationTemp : idModelConTemp,
		idAccessorie : parseInt(dataItemSelectedAccesory.name_accessory.id)
	};

	Ti.API.info("OBJ JSON AMT: " + JSON.stringify(objIdAccessoryMT));

	// Dialogo borra accesorio del model temp
	var dialogDeleteAccessoryModelTemp = Ti.UI.createAlertDialog({
		persistent : true,
		cancel : 0,
		buttonNames : ['Confirmar', 'Cancelar'],
		message : '¿Seguro de realizar esta acción?',
		title : 'Eliminar Accesorio del modelo'
	});

	// Click sobre el dialogo
	dialogDeleteAccessoryModelTemp.addEventListener('click', function(e) {

		Ti.API.info("Item Index: " + e.index);

		// Si prsionamos confirmar
		if (e.index == 0) {

			// Abrimos ventana del Indicador
			winAddActivityIndicator.open();

			// Mostramos el indicador
			activityIndicator.show();

			Ti.API.info('Se va a borrar el accesorio.');

			// URL del servicio rest
			var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/deleteAccessoriesModelTemp";

			// Cliente para realizar la peticion
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {

					Ti.API.info("Received text: " + this.responseText);

					// Respuesta del ws eliminar accesorio
					var responseWSDAMT = JSON.parse(this.responseText);

					setTimeout(function() {

						if (responseWSDAMT.success == true) {

							// ***********************************************************
							// TOTAL Y FECHA ESTIMADA DE LA COTIZACION
							// ***********************************************************

							// limpiamos nuestra variable global de total y fecha estimada
							Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = "";

							Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));

							// Asignamos el total y la fecha estimada a la variable global
							Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
								"totalPrice" : responseWSDAMT.totalPrice,
								"estimated" : responseWSDAMT.estimated
							};

							Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION 2: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));

							var listViewSeeAccesoriesMT = $.listViewSeeAccessories;

							// Preguntamos si solo queda un elemento en la lista
							if (listViewSeeAccesoriesMT.sections[0].items.length == 1) {

								// Eliminamos la seccion
								listViewSeeAccesoriesMT.deleteSectionAt(0);

								// Creamos una seccion con un titulo
								var sectionDefaulAcceModelTemp = Ti.UI.createListSection({
									headerTitle : 'No existen accesorios para mostrar!'
								});

								// Array vacio
								var sectionsDefAccMT = [];

								// Agregamos nuestra seccion al array
								sectionsDefAccMT.push(sectionDefaulAcceModelTemp);

								// Agregamos nuestro array de secciones a la lista
								listViewSeeAccesoriesMT.setSections(sectionsDefAccMT);

							} else {

								// Eliminamos un elemento de la lista
								listViewSeeAccesoriesMT.sections[0].deleteItemsAt(parseInt(itemIndexAccessory), 1);

							};

						};

						// Cerramos la ventana del Indicador
						winAddActivityIndicator.close();

						// Cerramos el indicador
						activityIndicator.hide();

					}, 3000);

				},
				onerror : function(e) {
					Ti.API.info("ERROR: " + e.error);

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
				timeout : 59000
			});

			// Preparamos conexion
			client.open("POST", url);

			// Establecer la cabecera para el formato JSON correcta
			client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

			// Enviar petición
			client.send(JSON.stringify(objIdAccessoryMT));

		};

	});

	// Mostramos el Alert Dialog
	dialogDeleteAccessoryModelTemp.show();

}

// ********************************************************
// FUNCION QUE SE EJECUTA AL ABRIR LA VENTANA
// ********************************************************

$.seeAccessories.addEventListener("open", function(ev) {

	// Action Bar
	var actionBar;

	// Validamos el sistema operativo
	if (Ti.Platform.osname === "android") {

		// Activity
		var activitySeeAcc = $.seeAccessories.activity;

		if (!activitySeeAcc) {
			Ti.API.error("No se puede acceder a la barra de acción en una ventana ligera.");
		} else {

			// Action Bar de la ventana
			actionBar = $.seeAccessories.activity.actionBar;

			// Validamos si existe un actionbar
			if (actionBar) {

				// Agregamos un menu
				activitySeeAcc.onCreateOptionsMenu = function(ev) {

					// Menu
					var menu = ev.menu;

					// Item Menu
					var menuItem = menu.add({
						title : 'Agregar accesorios',
						icon : Ti.Android.R.drawable.ic_menu_add,
						showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
					});

					// Click sobre un item del menu
					menuItem.addEventListener('click', function(e) {

						Ti.API.info("Me hicieron clic: " + JSON.stringify(e));

						// ID model conveyor
						var modelConveyorTempQuo = args;

						// Creamos ventana
						var winAddAccessories = Alloy.createController('addAccessories', modelConveyorTempQuo).getView();

						// Abrimos la ventana
						winAddAccessories.open();

						// Cerramos la ventana actual
						$.seeAccessories.close();

					});

				};

				// STATUS COTIZACION
				var estatusQuo = Alloy.Globals.ALL_DATA_QUOTATION.title_quotation.statusQuo;
				Ti.API.info("estatusQuo: " + JSON.stringify(estatusQuo));

				// VALIDAMOS EL STATUS
				if (estatusQuo != 4) {
					// Mosdstramos menu
					activitySeeAcc.invalidateOptionsMenu();
				}

				// Mostramos boton Home Icon
				actionBar.displayHomeAsUp = true;

				// Agregamos un titulo
				actionBar.title = "Accesorios seleccionados";

				// Al hacer click en el boton Home Icon
				actionBar.onHomeIconItemSelected = function(e) {

					Ti.API.info("Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));

					Ti.API.info("Alloy.Globals.ALL_DATA_QUOTATION: " + JSON.stringify(Alloy.Globals.ALL_DATA_QUOTATION));

					// Ventana
					var windDetailQuotation = Alloy.createController('detailQuotation', Alloy.Globals.ALL_DATA_QUOTATION).getView();

					// Abrimos la ventana
					windDetailQuotation.open();

					// Cerramos la ventana actual
					$.seeAccessories.close();
				};

			};

		};

	};

});

// FUNCION QUE SE EJECUTA CUANDO SE CIERRA LA VENTANA
/*$.seeAccessories.addEventListener('close', function(e){

Ti.API.info("Se cerro la ventana de Ver Accesorios");

//var vista = Alloy.createController('detailQuotation').getView();

//vista.labelTotalQuotation.text = "Te modifique desde Ver Accesorios";

});*/

// ***************************************
// CLICK EN EL BOTON FISICO VOLVER
// ***************************************

if (Ti.Platform.osname === "android") {

	$.seeAccessories.addEventListener('android:back', function(e) {

		//Ti.API.info("Click en el boton volver");

		return false;

	});

}
