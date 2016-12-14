// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// ***************************************************
// CREAMOS UN INDICADOR
// ***************************************************

// ***************************************************
// Ventana para mostrar el indicador
// ***************************************************

var winAddActivityIndicator = Ti.UI.createWindow({
	theme : "Theme.AppCompat.Light.NoActionBar",
	backgroundColor : "#000",
	opacity : .9,
	fullscreen : true
});

// ***************************************************
// Creamos activity Indicator
// ***************************************************

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

// ***************************************************
// Agregamos el indicador a la ventana
// ***************************************************

winAddActivityIndicator.add(activityIndicator);

// ID de la cotizacion
var idQuotation = args.title_quotation.id;

// ID DE LA COTIZACION
var idQuotationCurrent = parseInt(args.title_quotation.id);

// ID DEL CLIENTE
var idClientQuo = 0;

// ID DEL USUARIO
var idUsuarioSession = Alloy.Globals.PROPERTY_INFO_USER.userLogin.id;

// PERFIL DEL USUARIO LOGUEADO
var idProfileUserLogin = Alloy.Globals.PROPERTY_INFO_USER.userLogin.user.profile.id;

// PICKER CLIENTE
var pickerClientByIdSeller = $.pickerClientByIdSeller;

// VARIABLE PARA ALMACENAR LO QUE DEVUELVE EL SERVICIO DE MODELOS DE LA COTIZACION
var objModelsConveyorQuotation = {};

// Vista contenedora del picker cliente
var viewSectionClientPicker = $.viewSectionClientPicker;

// ***********************************************************
// EJECUTAMOS FUNCION QUE OBTIENE LOS MODELOS DE LA COTIZACION
// ***********************************************************

getAllModelsConveyorsQuotation(idQuotation);

// ***************************************************
// FUNCION QUE OBTIENE LOS MODELOS DE LA COTIZACION
// ***************************************************

function getAllModelsConveyorsQuotation(idQuotation) {

	// OBJ CON EL ID DE LA COTIZACION
	var objIdQuotation = {
		"id" : parseInt(idQuotation)
	};

	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/searchQuotationTempByQuotation";

	var client = Ti.Network.createHTTPClient({
		onload : function(e) {

			var responseMTWS = JSON.parse(this.responseText);

			// Asignamos valor a nuestra variable
			objModelsConveyorQuotation = responseMTWS;

			// ***********************************************************
			// TOTAL Y FECHA ESTIMADA DE LA COTIZACION
			// ***********************************************************

			// limpiamos nuestra variable global de total y fecha estimada
			Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = "";

			// Asignamos el total y la fecha estimada a la variable global
			Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
				"totalPrice" : objModelsConveyorQuotation.totalPrice,
				"estimated" : objModelsConveyorQuotation.estimated
			};

			try {

				// FUNCION QUE GENERA LA LISTA DE LOS MODELOS DE LA COTIZACION
				createAllModelsConveyorsQuotation(responseMTWS.listTemp);

			} catch(err) {
				Ti.API.info("CATCH: " + err);
			}

		},
		onerror : function(e) {
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

	// Enviar peticion
	client.send(JSON.stringify(objIdQuotation));

}

// ***************************************************
// FUNCION QUE GENERA LOS MODELOS DE LA COTIZACION
// ***************************************************

function createAllModelsConveyorsQuotation(modelsConvQuotaion) {

	// Array para guardar los datos
	var items = [];

	// RECORREMOS EL OBJETO
	modelsConvQuotaion.forEach(function(model, idx) {

		// Subtotal
		var subtotalMCT = parseInt(model.quantity) * parseFloat(model.price);

		// Vamos agregando los datos al arreglo
		items.push({
			modelConveyor : {
				text : model.modelConveyor.model,
				id : model.id,
				idx : parseInt(idx),
				quantity : model.quantity,
				price : model.price,
				subtotal : subtotalMCT
			},
			quantityConveyor : {
				text : "Cantidad: " + model.quantity
			},
			priceConveyor : {
				text : "Precio Unit.: $" + model.price
			},
			totalConveyor : {
				text : "Subtotal: $" + subtotalMCT
			}
		});

		// Agregamos los datos a la lista
		$.listViewModelConveyorQuotationDetail.sections[0].setItems(items);

	});

	// ***********************************************************
	// Validamos el tipo de usuario que inicio sesion - 4 vendedor -3 cliente
	// ***********************************************************

	if (parseInt(idProfileUserLogin) == 4) {

		// EJECUTAMOS FUNCION
		getAllOptionsPickerClientsByIdSeller();

	} else {

		// Asignamos un valor
		idClientQuo = Alloy.Globals.PROPERTY_INFO_USER.userLogin.user.business.id;

		// Ocultamos el contenedor
		viewSectionClientPicker.hide();

		// Cambiamos el alto del contenedor
		viewSectionClientPicker.height = 0;

	};

	// Comentario Cotizacion
	var commentQuotation = args.title_quotation.commentQuo;

	// Validamos si ya existe un comentario
	if (commentQuotation != null) {
		// Asignamos valor al textArea comentario
		$.textAreaCommentQuo.value = commentQuotation;
	}

	// ***********************************************************
	// EJECUTAMOS LA FUNCION
	// ***********************************************************

	validarBotonComprarAutorizarCotizacion();

	// ***********************************************************
	// EJECUTAMOS LA FUNCIÓN QUE CARGA TOTAL Y FECHA ESTIMADA
	// ***********************************************************

	setTotalAndDateEstimated();

}

// ***************************************************
// CLICK EN UN ELEMENTO DE LA LISTA
// ***************************************************

$.listViewModelConveyorQuotationDetail.addEventListener('itemclick', function(e) {

	// Elemento seleccionado
	var itemClickModelTemp = e.section.getItemAt(e.itemIndex);

	// Ventana
	var winSeeAccesories = Alloy.createController('seeAccessories', itemClickModelTemp).getView();

	// Abrimos la ventana
	winSeeAccesories.open();

	// Cerramos la ventana actual
	$.detailQuotation.close();

});

// ***********************************************************
// FUNCION PARA MOSTRAR EL BOTON AUTORIZAR O COMPRAR
// ***********************************************************

function validarBotonComprarAutorizarCotizacion() {

	// Boton comprar o autorizar
	var buttonAuthorizeBuy = $.buttonAuthorizeBuy;

	// Validamos el tipo de usuario que inicio sesion - 4 vendedor - 3 cliente
	if (parseInt(idProfileUserLogin) == 4) {

		// Cambiamos el texto al boton
		buttonAuthorizeBuy.title = "Autorizar";

	} else if (parseInt(idProfileUserLogin) == 3) {

		// Cambiamos el texto al boton
		buttonAuthorizeBuy.title = "Comprar";

	}
	;

	// CLICK SOBRE EL BOTON COMPRAR O AUTORIZAR
	buttonAuthorizeBuy.addEventListener('click', function(e) {

		// Titulo del boton
		var getTitleButtonAB = e.source.title;

		switch(getTitleButtonAB) {
		case 'Autorizar' :

			// Llamomos a l funcion
			autorizarCotizacion();

			break;
		case 'Comprar' :

			// Llamomos a l funcion
			comprarCotizacion();

			break;
		}

	});

}

// ***********************************************************
// FUNCION PARA AUTORIZAR UNA COTIZACION
// ***********************************************************

function autorizarCotizacion() {

	// TextArea Comntario
	var textAreaCommentQuo = $.textAreaCommentQuo.value;

	// Validamos si existe un cliente
	if (idClientQuo != "" && idClientQuo > 0) {

		// OBJ JSON PARA ENVIAR EN LA PETICION
		var objJsonAuthorizeQuotation = {
			idQuotation : idQuotationCurrent,
			comment : textAreaCommentQuo,
			idClient : idClientQuo,
			idSeller : idUsuarioSession
		};

		//Ti.API.info("OBJ JSON AQ: " + JSON.stringify(objJsonAuthorizeQuotation));

		// Dialogo para autorizar un acotizacion
		var dialogAuthorizeQuotation = Ti.UI.createAlertDialog({
			persistent : true,
			cancel : 0,
			buttonNames : ['Confirmar', 'Cancelar'],
			message : '¿Seguro de realizar esta acción?',
			title : 'Autorizar Cotización'
		});

		// Click sobre el dialogo
		dialogAuthorizeQuotation.addEventListener('click', function(e) {

			if (e.index == 0) {

				// Abrimos ventana del Indicador
				winAddActivityIndicator.open();
				// Mostramos el indicador
				activityIndicator.show();

				// URL del servicio rest
				var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/setAut";

				// Cliente para realizar la peticion
				var client = Ti.Network.createHTTPClient({
					onload : function(e) {

						setTimeout(function() {

							// Cerramos la ventana del Indicador
							//winAddActivityIndicator.close();

							// Cerramos el indicador
							//activityIndicator.hide();

							// Limpiamos el valor del id de la cotizacion
							Alloy.Globals.ID_GLOBAL_QUOTATION = 0;

							// Venta principal de cotizaciones
							var winHomeQuotations = Alloy.createController('home').getView();

							// Abrimos ventana
							winHomeQuotations.open();

						}, 3000);

					},
					onerror : function(e) {
						// Cerramos la ventana del Indicador
						winAddActivityIndicator.close();

						// Cerramos el indicador
						activityIndicator.hide();

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
				client.send(JSON.stringify(objJsonAuthorizeQuotation));

			};

		});

		// Mostramos el Alert Dialogo
		dialogAuthorizeQuotation.show();

	} else {
		//alert("Debes seleccionar un cliente!");
		Ti.UI.createAlertDialog({
			message : 'Debes seleccionar un cliente!',
			title : 'Cliente',
			ok : 'Aceptar',
		}).show();
	};

}

// ***********************************************************
// FUNCION PARA COMPRAR UNA COTIZACION
// ***********************************************************

function comprarCotizacion() {

	// TextArea Comntario
	var textAreaCommentQuo = $.textAreaCommentQuo.value;

	var objJsonBuyQuotation = {
		idQuotation : idQuotationCurrent,
		comment : textAreaCommentQuo,
		idClient : idClientQuo,
		password : ""
	};

	//ventanaTerminosCondiciones.add(texto);
	var winTermsConditions = Alloy.createController('termsConditions', objJsonBuyQuotation).getView();

	// Mostramos la ventana
	winTermsConditions.open();
}

// ***************************************************
// ACTUALIZAR EL TEXTO DEL LABEL MODEL TEMP QUANTITY
// ***************************************************

function updateValueLabelMT(e) {
	$.labelQuantityModelTemp.text = parseInt(e.value);
}

// ***********************************************************
// FUNCION PARA GUARDAR COTIZACION
// ***********************************************************

function saveQuotation(e) {

	// TextArea Comntario
	var textAreaCommentQuo = $.textAreaCommentQuo.value;

	// Validamos si existe un cliente
	if (idClientQuo != "" && idClientQuo > 0) {

		// Creamo objeto para enviar
		var objJSONSaveQuotation = {
			idQuotation : idQuotationCurrent,
			comment : textAreaCommentQuo,
			idClient : idClientQuo
		};

		// Validamos el tipo de usuario que inicio sesion - 4 vendedor -3 cliente
		if (parseInt(idProfileUserLogin) == 4) {

			// Atributo validate
			objJSONSaveQuotation['validate'] = 1;

			// Atributo idSeller
			objJSONSaveQuotation['idSeller'] = parseInt(idUsuarioSession);

		} else {
			// Atributo validate
			objJSONSaveQuotation['validate'] = 0;

		};

		//Ti.API.info("OBJETO GUARDAR COTIZCION: " + JSON.stringify(objJSONSaveQuotation));

		// Dialogo para guardar una acotizacion
		var dialogSaveQuotation = Ti.UI.createAlertDialog({
			persistent : true,
			cancel : 0,
			buttonNames : ['Confirmar', 'Cancelar'],
			message : '¿Seguro de realizar esta acción?',
			title : 'Guardar Cotización'
		});

		// Click sobre el dialogo
		dialogSaveQuotation.addEventListener('click', function(e) {

			if (e.index == 0) {

				// Abrimos ventana del Indicador
				winAddActivityIndicator.open();
				// Mostramos el indicador
				activityIndicator.show();

				// Url del servicio rest
				var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/saveQuotationEdit";

				// Creamoss un cliente http
				var client = Ti.Network.createHTTPClient({
					// función de llamada cuando los datos de respuesta está disponible
					onload : function(e) {

						var responseWS = JSON.parse(this.responseText);

						setTimeout(function() {

							// Cerramos la ventana del Indicador
							//winAddActivityIndicator.close();

							// Cerramos el indicador
							//activityIndicator.hide();

							// Limpiamos el valor del id de la cotizacion
							Alloy.Globals.ID_GLOBAL_QUOTATION = 0;

							// Venta principal de cotizaciones
							var winHomeQuotations = Alloy.createController('home').getView();

							// Abrimos ventana
							winHomeQuotations.open();

						}, 3000);

					},
					// función de llamada cuando se produce un error, incluyendo un tiempo de espera
					onerror : function(e) {
						Ti.API.debug(e.error);

						// Cerramos la ventana del Indicador
						winAddActivityIndicator.close();

						// Cerramos el indicador
						activityIndicator.hide();

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
				client.send(JSON.stringify(objJSONSaveQuotation));

			};

		});

		// Mostramos el Alert Dialog
		dialogSaveQuotation.show();

	} else {
		//alert("Debes seleccionar un cliente!");
		Ti.UI.createAlertDialog({
			message : 'Debes seleccionar un cliente!',
			title : 'Cliente',
			ok : 'Aceptar',
		}).show();
	};
}

// ***************************************************
// DIALOGO
// ***************************************************

var dialogModelTemp;
var arrayDialogModelTemp = ['Cantidad Modelo +/-', 'Eliminar', 'Cancelar'];
var optDialogMdelTemp = {
	title : "Modelo Temporal",
	cancel : 2,
	options : arrayDialogModelTemp,
	destructive : 0,
	bubbleParent : false
};

// Datos del elemento presionado
var dataItemSelected = {};

// Index del elemento seleccionado
var itemIndexModelTemp;

// ***************************************************
// CLICK PROLONGADO EN UN ELEMENTO DE LA LISTA
// ***************************************************

function longPressModelConveyor(e) {
	// Indice del elemento presionado
	itemIndexModelTemp = e.itemIndex;

	// Datos del elemento presionado
	dataItemSelected = e.section.items[parseInt(itemIndexModelTemp)];

	dialogModelTemp = Ti.UI.createOptionDialog(optDialogMdelTemp);
	dialogModelTemp.show();
	dialogModelTemp.addEventListener('click', onSelectDialogModelTemp);
}

// ***************************************************
// DIALOGO DE CANTIDAD DE MODELOS TEMPORALES
// ***************************************************

var dialogQuantityModlTemp = $.alertDialogModelTemp;

// ***************************************************
// FUNCION QUE SE EJECUTA AL PRESIONAR UN ELEMENTO DEL DIALOGO
// ***************************************************

function onSelectDialogModelTemp(event) {

	// Indice del elemento seleccionado del dialogo
	var selectedIndexDialModelTemp = event.source.selectedIndex;

	// Estatus de la cotización
	var statusOfQuotationSelected = Alloy.Globals.ALL_DATA_QUOTATION.title_quotation.statusQuo;

	// Realizamos una accion dependiendo lo que fue seleccionado
	switch(parseInt(selectedIndexDialModelTemp)) {
	case 0 :

		// Validamos el status de la cotizacion
		if (statusOfQuotationSelected == 4) {
			// Mostramos mensaje
			Ti.UI.createAlertDialog({
				message : '¡El modelo seleccionado no se puede modificar!\nLa cotizacción esta terminada.',
				title : 'Cotización terminada',
				ok : 'Aceptar',
			}).show();
		} else {

			// Modificar value del slider
			var valueSQMT = $.sliderQuantityModelTemp;

			valueSQMT.value = parseInt(dataItemSelected.modelConveyor.quantity);

			// Mostramos el dialogo
			dialogQuantityModlTemp.show();

		};

		break;
	case 1 :

		// Validamos el status de la cotizacion
		if (statusOfQuotationSelected == 4) {
			// Mostramos mensaje
			Ti.UI.createAlertDialog({
				message : '¡El modelo seleccionado no se puede eliminar!\nLa cotizacción esta terminada.',
				title : 'Cotización terminada',
				ok : 'Aceptar',
			}).show();
		} else {
			deleteModelTemp(dataItemSelected);
		};

		break;
	default :
		return false;
		break;
	}
}

// *******************************************************************************
// AL HACER CLICK SOBRE ALGUNA OPCION DEL ALERT DIALOG DE CANTIDAD DE MODELOS TEMP
// *******************************************************************************

dialogQuantityModlTemp.addEventListener('click', function(e) {

	// Si presionamos confirmar
	if (e.index == 0) {
		// Llamamos a la funcion para actualizar la cantidad del modelo
		changeQuantityModelTemp();
	};

});

// ************************************************************
// FUNCION PARA AUMENTA O DISMINUIR LA CANTIDAD DE MODELOS TEMP
// ************************************************************

function changeQuantityModelTemp() {

	// Abrimos ventana del Indicador
	winAddActivityIndicator.open();

	// Mostramos el indicador
	activityIndicator.show();

	var valueSliderQMT = $.sliderQuantityModelTemp;

	// Objeto a enviar en la peticion
	var objJSONQuantityMT = {
		id : parseInt(dataItemSelected.modelConveyor.id),
		quantity : parseInt(valueSliderQMT.value)
	};

	// URL del sevicio
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/addCountQuotationTemp";

	// Cliente para realizar la peticion
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {

			// Objeto con la respuesta del ws
			var responseWSQMT = JSON.parse(this.responseText);

			setTimeout(function() {

				if (responseWSQMT.success == true) {

					// ***********************************************************
					// TOTAL Y FECHA ESTIMADA DE LA COTIZACION
					// ***********************************************************

					// limpiamos nuestra variable global de total y fecha estimada
					Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = "";

					// Asignamos el total y la fecha estimada a la variable global
					Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
						"totalPrice" : responseWSQMT.totalPrice,
						"estimated" : responseWSQMT.estimated
					};

					// ***********************************************************
					// EJECUTAMOS LA FUNCIÓN QUE CARGA TOTAL Y FECHA ESTIMADA
					// ***********************************************************

					setTotalAndDateEstimated();

					// Item seleccionado
					var row = $.listViewModelConveyorQuotationDetail.sections[0].getItemAt(parseInt(itemIndexModelTemp));

					// Modificamos el atributo cantidad del item list seleccionado
					row.quantityConveyor.text = "Cantidad: " + parseInt(valueSliderQMT.value);

					// Modificamos el atributo cantidad del item list seleccionado
					row.modelConveyor.quantity = parseInt(valueSliderQMT.value);

					// Subtotal del Modelo Temp
					var subtotalModelTemp = (parseInt(valueSliderQMT.value) * parseFloat(dataItemSelected.modelConveyor.price));

					// Modificamos el valor de subtotal del atributo modelConveyor
					row.modelConveyor.subtotal = subtotalModelTemp;

					// Modificamos el atributo subtotal del item list seleccionado
					row.totalConveyor.text = "Subtotal: $" + subtotalModelTemp;

					// Modificamos el item de la lista con los nuevos datos
					$.listViewModelConveyorQuotationDetail.sections[0].updateItemAt(parseInt(itemIndexModelTemp), row, {
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
	client.send(JSON.stringify(objJSONQuantityMT));

}

// ***************************************************
// FUNCION PARA ELIMINAR UN MODELO TEMPORAL
// ***************************************************

function deleteModelTemp(dataItemSelected) {

	// Objeto con el ID del modelo temp
	var objIdModelTemp = {
		"id" : parseInt(dataItemSelected.modelConveyor.id)
	};

	// Dialogo para confirmar "Borrar modelo temp"
	var dialogDeleteModelTemp = Ti.UI.createAlertDialog({
		persistent : true,
		cancel : 0,
		buttonNames : ['Confirmar', 'Cancelar'],
		message : '¿Seguro de realizar esta acción?',
		title : 'Eliminar Modelo Temporal'
	});

	// Click sobre el dialogo
	dialogDeleteModelTemp.addEventListener('click', function(e) {

		// Si presionamos confirmar
		if (e.index == 0) {

			// Abrimos ventana del Indicador
			winAddActivityIndicator.open();

			// Mostramos el indicador
			activityIndicator.show();

			// URL del servicio rest
			var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/deleteModelTemp";

			// Cliente para realizar la peticion
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {

					// Respuesta del ws eliminar modelo
					var responseWSDMT = JSON.parse(this.responseText);

					setTimeout(function() {

						if (responseWSDMT.deleted == true) {

							// ***********************************************************
							// TOTAL Y FECHA ESTIMADA DE LA COTIZACION
							// ***********************************************************

							// limpiamos nuestra variable global de total y fecha estimada
							Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = "";

							// Asignamos el total y la fecha estimada a la variable global
							Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
								"totalPrice" : responseWSDMT.totalPrice,
								"estimated" : responseWSDMT.estimated
							};

							// ***********************************************************
							// EJECUTAMOS LA FUNCIÓN QUE CARGA TOTAL Y FECHA ESTIMADA
							// ***********************************************************

							setTotalAndDateEstimated();

							// Preguntamos si solo queda un elemento en la lista
							if ($.listViewModelConveyorQuotationDetail.sections[0].items.length == 1) {

								// Eliminamos la seccion
								$.listViewModelConveyorQuotationDetail.deleteSectionAt(0);

								// Creamos una seccion con un titulo
								var sectionDefaulModelTemp = Ti.UI.createListSection({
									headerTitle : 'No existen modelos para mostrar!'
								});

								// Array vacio
								var sectionsDefModTemp = [];

								// Agregamos nuestra seccion al array
								sectionsDefModTemp.push(sectionDefaulModelTemp);

								// Agregamos nuestro array de secciones a la lista
								$.listViewModelConveyorQuotationDetail.setSections(sectionsDefModTemp);

							} else {

								// Eliminamos un elemento de la lista
								$.listViewModelConveyorQuotationDetail.sections[0].deleteItemsAt(parseInt(itemIndexModelTemp), 1);

							};

						}

						// Cerramos la ventana del Indicador
						winAddActivityIndicator.close();

						// Cerramos el indicador
						activityIndicator.hide();

					}, 3000);

				},
				onerror : function(e) {
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
			client.send(JSON.stringify(objIdModelTemp));

		};
	});

	// Mostramos el Alert Dialog
	dialogDeleteModelTemp.show();

}

// ***********************************************************
// FUNCION PARA MOSTRAR TOTAL Y FECHA ESTIMADA
// ***********************************************************

function setTotalAndDateEstimated() {

	// Total de la cotizacion
	var totalQuotation = $.labelTotalQuotation;

	// Asignamos total
	totalQuotation.text = "Total USD + IVA: $" + Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION.totalPrice;

	// Fecha estimada de la cotizacion
	var dateEstimatedQuotation = $.labelDateEstimatedQuotation;

	// Asignamos Fecha Estimada
	dateEstimatedQuotation.text = "Fecha Estimada: " + Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION.estimated;

}

// ***********************************************************
// FUNCION PARA CARGAR EL PICKER DE CLIENTES POR ID DE VEDEDOR - YES
// ***********************************************************

function getAllOptionsPickerClientsByIdSeller() {
	// Objeto con los datos a enviar
	var objJsonIdSeller = {
		"id" : parseInt(idUsuarioSession)
	};

	// Urll del servicio rest
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/searchClientBySeller";

	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {

			var responseWS = JSON.parse(this.responseText);

			// Funcion que llena el combo
			fillClientByIdSellerPicker(responseWS.business);

		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 15000 // en milisegundos
	});

	// Preparar la conexión.
	client.open("POST", url);

	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	// Enviar la solicitud.
	client.send(JSON.stringify(objJsonIdSeller));
}

// ***********************************************************
// GENERAMOS LAS OPCIONES DEL PICKER CLIENTES POR ID DE VENDEDOR - YES
// ***********************************************************

function fillClientByIdSellerPicker(objOptionsClientByIdSellerPicker) {

	// Variable para guardar el index del cliente seleccionado
	var indexItemSelectedPicker = 0;

	// Variable que guarda el id del cliente
	var idClientItemSelectedPicker = 0;

	// Estatus cotizacion
	var statusQuotationValidatePicker = Alloy.Globals.ALL_DATA_QUOTATION.title_quotation.statusQuo;

	if (statusQuotationValidatePicker == 2 || statusQuotationValidatePicker == 3) {

		// Variable para guardar el id del cliente seleccionado
		idClientItemSelectedPicker = Alloy.Globals.ALL_DATA_QUOTATION.title_quotation.idClientQuo;

	};

	// Columna
	var pickerColumnClientByIdSeller = $.pickerColumnClientByIdSeller;

	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsClientByIdSellerPicker.forEach(function(optClientByIdSeller, idx) {

		// VALIDAMOS SI YA HAY UN CLIENTE SELECCIONADO O NO

		//if (statusQuotationValidatePicker == 2 || statusQuotationValidatePicker == 3) {

		// Validamos el id del cliente
		if (parseInt(idClientItemSelectedPicker) == parseInt(optClientByIdSeller.user.business.id)) {

			// Asignamos un valor a la variable item index
			indexItemSelectedPicker = parseInt(idx) + 1;

			// Asignaamos un valor al id del cliente
			idClientQuo = parseInt(optClientByIdSeller.user.business.id);

		};

		//};

		// Variable con el nombre del cliente y usuario asignado
		var nameCompanyAndClient = optClientByIdSeller.user.business.nameCompany + " - " + optClientByIdSeller.name + " " + optClientByIdSeller.lastName;

		var row = Ti.UI.createPickerRow({
			id : optClientByIdSeller.user.business.id,
			title : nameCompanyAndClient
		});

		// Agregamos datos a la columna
		pickerColumnClientByIdSeller.addRow(row);

		// Asignamos el arreglo
		pickerClientByIdSeller.add(pickerColumnClientByIdSeller);

		// Mostramos el elemento seleccionado
		pickerClientByIdSeller.selectionIndicator = true;

		// Seleccionamos un elemento
		pickerClientByIdSeller.setSelectedRow(0, parseInt(indexItemSelectedPicker), false);

	});

	// FUNCION AL APLICAR UN CAMBIO EN EL PICKER

	pickerClientByIdSeller.addEventListener("change", function(e) {
		//Ti.API.info("HAY UN CAMBIO EN EL PICKER");
		// Index del elemento seleccionado
		var indexItem = parseInt(JSON.stringify(e.rowIndex));

		// Datos del elemento seleccionado
		var pickerDataSelected = e.source.children[0].rows[indexItem];

		// Asignaamos un valor al id del cliente
		idClientQuo = pickerDataSelected.id;

	});

}

// ***********************************************************
// VALIDAMOS EL STATUS Y COMENTARIO DE LA COTIZACION
// ***********************************************************

// Estatus cotizacion
var statusQuotation = args.title_quotation.statusQuo;

// Validamos el status 4 - Terminada
if (statusQuotation == 4) {

	// Contenedor de botones de guardar - comprar o autorizar
	var containerTwo = $.containerTwo;

	// Ocultamos contededor
	containerTwo.hide();

	// Cambiar tamaño del contenedor
	containerTwo.height = 0;

	// Ocultamos el contenedor
	viewSectionClientPicker.hide();

	// Cambiamos el alto del contenedor
	viewSectionClientPicker.height = 0;

	// Contenedor de la lista
	var containerOne = $.containerOne;

	// Cambiamos tamaño del contenedor
	containerOne.height = '100%';

};

/*$.detailQuotation.addEventListener('focus', function(e) {
$.textAreaCommentQuo.blur();
});*/

// ***********************************************************
// FUNCION QUE SE EJECUTA CUANDO ESTA CARGANDO LA VENTANA
// ***********************************************************

// Ventana
var windDetailQuotation = $.detailQuotation;

// Evento que se ejecuta ala abri la ventana
windDetailQuotation.addEventListener("open", function(evt) {

	// ***************************************************
	// EJECUTAMOS FUNCION QUE OBTIENE LOS MODELOS DE LA COTIZACION
	// ***************************************************

	//getAllModelsConveyorsQuotation(idQuotation);

	// Action Bar
	var actionBar;

	// Validamos el sistema operativo
	if (Ti.Platform.osname === "android") {

		// Activity
		var activityDetailQuotation = windDetailQuotation.activity;

		if (!activityDetailQuotation) {
			Ti.API.info("No se puede acceder a la barra de acción en una ventana ligera.");
		} else {

			actionBar = windDetailQuotation.activity.actionBar;

			// Validamos si existen un actionBar
			if (actionBar) {

				// Mostramos boton Home Icon
				actionBar.displayHomeAsUp = true;

				// Agregamos un titulo
				actionBar.title = "Modelos seleccionados";

				// Al hacer click en el boton Home Icon
				actionBar.onHomeIconItemSelected = function(e) {
					// Cerramos la ventana actual
					windDetailQuotation.close();
				};

			};

		};

	};

});
