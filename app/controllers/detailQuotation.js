// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("Argumentos recibidos: " + JSON.stringify(args));

// ***************************************************
// CREAMOS UN INDICADOR
// ***************************************************

// ***************************************************
// Ventana para mostrar el indicador
// ***************************************************

var winAddActivityIndicator = Ti.UI.createWindow({
	theme           : "Theme.AppCompat.Light.NoActionBar",
	backgroundColor : "#000",
	opacity         : .9,
	fullscreen      : true
});

// ***************************************************
// Creamos activity Indicator
// ***************************************************

var activityIndicator = Ti.UI.createActivityIndicator({
	color   : '#ccc',
	font    : {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
	message : 'Espere...',
	style   : Ti.UI.ActivityIndicatorStyle.BIG_DARK,
	height  : Ti.UI.SIZE,
	width   : Ti.UI.SIZE
});

// ***************************************************
// Agregamos el indicador a la ventana
// ***************************************************

winAddActivityIndicator.add(activityIndicator);

// ID de la cotizacion
var idQuotation        = args.title_quotation.id;

Ti.API.info("ID de la cotización: " + parseInt(idQuotation));

// ID DE LA COTIZACION
var idQuotationCurrent = parseInt(args.title_quotation.id);

Ti.API.info("idQuotationCurrent:" + idQuotationCurrent);

// ID DEL CLIENTE
var idClientQuo        = 0;

Ti.API.info("idClientQuo:" + idClientQuo);

// ID DEL USUARIO
var idUsuarioSession   = Alloy.Globals.PROPERTY_INFO_USER.userLogin.id;

Ti.API.info("idUsuarioSession:" + parseInt(idUsuarioSession));

// PERFIL DEL USUARIO LOGUEADO
var idProfileUserLogin = Alloy.Globals.PROPERTY_INFO_USER.userLogin.user.profile.id;

Ti.API.info("idProfileUserLogin:" + parseInt(idProfileUserLogin));

// PICKER CLIENTE
var pickerClientByIdSeller     = $.pickerClientByIdSeller;

// VARIABLE PARA ALMACENAR LO QUE DEVUELVE EL SERVICIO DE MODELOS DE LA COTIZACION
var objModelsConveyorQuotation = {};

// ***************************************************
// EJECUTAMOS FUNCION QUE OBTIENE LOS MODELOS DE LA COTIZACION
// ***************************************************

//getAllModelsConveyorsQuotation(idQuotation);

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
			Ti.API.info("Received text: " + this.responseText);

			var responseMTWS = JSON.parse(this.responseText);
			Ti.API.info("ResponseWSQuotations: " + this.responseText);
			
			// Asignamos valor a nuestra variable
			objModelsConveyorQuotation = responseMTWS;
			Ti.API.info("Varible con lo que devuelve el WSMT: " + JSON.stringify(objModelsConveyorQuotation));
			
			// ***********************************************************
			// TOTAL Y FECHA ESTIMADA DE LA COTIZACION
			// ***********************************************************
			
			// limpiamos nuestra variable global de total y fecha estimada
			Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = "";
			
			Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));
			
			// Asignamos el total y la fecha estimada a la variable global
			Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
				"totalPrice" : objModelsConveyorQuotation.totalPrice,
				"estimated"  : objModelsConveyorQuotation.estimated
			};
			
			Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION 2: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));
			
			// ***********************************************************
			// EJECUTAMOS LA FUNCIÓN QUE CARGA TOTAL Y FECHA ESTIMADA
			// ***********************************************************
			
			setTotalAndDateEstimated();
			
			// FUNCION QUE GENERA LA LISTA DE LOS MODELOS DE LA COTIZACION
			createAllModelsConveyorsQuotation(responseMTWS.listTemp);
		},
		onerror : function(e) {
			Ti.API.info(e.error);
		},
		timeout : 5000
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
				text     : model.modelConveyor.model,
				id       : model.id, 
				idx      : parseInt(idx),
				quantity : model.quantity,
				price    : model.price,
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
		
		// Modificamos la altura de la lista
		//$.listViewModelConveyorQuotationDetail.setHeight(Titanium.UI.SIZE);
		
	});

}

// ***************************************************
// CLICK EN UN ELEMENTO DE LA LISTA
// ***************************************************

$.listViewModelConveyorQuotationDetail.addEventListener('itemclick', function(e) {
	
	// Elemento seleccionado
	var itemClickModelTemp  = e.section.getItemAt(e.itemIndex);
	
	Ti.API.info("ITEM:" + JSON.stringify(itemClickModelTemp));
	
	// Ventana
	var winSeeAccesories = Alloy.createController('seeAccessories', itemClickModelTemp).getView();
	
	// Abrimos la ventana
	winSeeAccesories.open();
	
	// Cerramos la ventana actual
	$.detailQuotation.close();

});

// Dialogo
var dialogModelTemp;
var arrayDialogModelTemp = ['Cantidad Modelo +/-', 'Eliminar', 'Cancelar'];
var optDialogMdelTemp    = {
	title   : "Modelo Temporal",
	cancel  : 2,
	options : arrayDialogModelTemp,
	destructive  : 0,
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
	
	Ti.API.info("ITEM INDEX: " + itemIndexModelTemp);
	Ti.API.info("ITEM SELECTED: " + JSON.stringify(dataItemSelected));
	
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
	
	Ti.API.info("Modelo Temp seleccionado: " + JSON.stringify(dataItemSelected));

	// Indice del elemento seleccionado del dialogo
	var selectedIndexDialModelTemp = event.source.selectedIndex;
	
	Ti.API.info("Index del elemento seleccionado: " + parseInt(selectedIndexDialModelTemp));
	
	// Estatus de la cotización
	var statusOfQuotationSelected = Alloy.Globals.ALL_DATA_QUOTATION.title_quotation.statusQuo;
	Ti.API.info("statusOfQuotationSelected: " + JSON.stringify(statusOfQuotationSelected));
	
	// Realizamos una accion dependiendo lo que fue seleccionado
	switch(parseInt(selectedIndexDialModelTemp))
	{
		case 0 :
			//Ti.API.info("Cambiar Cantidad Modelo Temp.");
			
			// Validamos el status de la cotizacion
			if (statusOfQuotationSelected == 4) {
				// Mostramos mensaje
				Ti.UI.createAlertDialog({ message: '¡El modelo seleccionado no se puede modificar!\nLa cotizacción esta terminada.', title: 'Cotización terminada', ok: 'Aceptar', }).show();
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
				Ti.UI.createAlertDialog({ message: '¡El modelo seleccionado no se puede eliminar!\nLa cotizacción esta terminada.', title: 'Cotización terminada', ok: 'Aceptar', }).show();
			} else {
				
				//Ti.API.info("Eliminar Modelo Temp");
				deleteModelTemp(dataItemSelected);
				
			};
			
			break;
		default :
			Ti.API.info("Opcion no encontrada.");
			break;
	}
}

// *******************************************************************************
// AL HACER CLICK SOBRE ALGUNA OPCION DEL ALERT DIALOG DE CANTIDAD DE MODELOS TEMP
// *******************************************************************************

dialogQuantityModlTemp.addEventListener('click', function(e) {
		
	Ti.API.info("Item Index Dialog Alert CMT: " + e.index);
		
	// Si presionamos confirmar
	if (e.index == 0) {
		// Llamamos a la funcion para actualizar la cantidad del modelo
		changeQuantityModelTemp();
	};
				
});

// ************************************************************
// FUNCION PARA AUMENTA O DISMINUIR LA CANTIDAD DE MODELOS TEMP
// ************************************************************

function changeQuantityModelTemp()
{
	Ti.API.info("ITEM SELECCIONADO: " + JSON.stringify(dataItemSelected));
	Ti.API.info("Cantidad model temp. " +  dataItemSelected.modelConveyor.text + " # " + dataItemSelected.modelConveyor.id);
	
	var valueSliderQMT = $.sliderQuantityModelTemp;
	
	Ti.API.info("VALOR DE SLIDER: " + parseInt(valueSliderQMT.value));
	Ti.API.info("Aumentar o disminuir cantidad de modelo!");
	
	// Objeto a enviar en la peticion
	var objJSONQuantityMT = {
		id       : parseInt(dataItemSelected.modelConveyor.id),
		quantity : parseInt(valueSliderQMT.value)
	};
	
	Ti.API.info("OBJ JSON QMT: " + JSON.stringify(objJSONQuantityMT));
	
	// URL del sevicio
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/addCountQuotationTemp";
	
	// Cliente para realizar la peticion
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			
			Ti.API.info("Received text: " + this.responseText);
			
			// Objeto con la respuesta del ws
			var responseWSQMT = JSON.parse(this.responseText);
			
			Ti.API.info("Response WSQMT: " + JSON.stringify(responseWSQMT));
			
			// ***********************************************************
			// TOTAL Y FECHA ESTIMADA DE LA COTIZACION
			// ***********************************************************
			
			// limpiamos nuestra variable global de total y fecha estimada
			Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = "";
			
			Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));
			
			// Asignamos el total y la fecha estimada a la variable global
			Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
				"totalPrice" : responseWSQMT.totalPrice,
				"estimated"  : responseWSQMT.estimated
			};
			
			Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION 2: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));
			
			// ***********************************************************
			// EJECUTAMOS LA FUNCIÓN QUE CARGA TOTAL Y FECHA ESTIMADA
			// ***********************************************************
			
			setTotalAndDateEstimated();
			
			// Item seleccionado
			var row = $.listViewModelConveyorQuotationDetail.sections[0].getItemAt(parseInt(itemIndexModelTemp));
			
			Ti.API.info("ROW: " + JSON.stringify(row));
			
			// Modificamos el atributo cantidad del item list seleccionado
			row.quantityConveyor.text = "Cantidad: " + parseInt(valueSliderQMT.value);
			
			// Modificamos el atributo cantidad del item list seleccionado
			row.modelConveyor.quantity = parseInt(valueSliderQMT.value);
			
			// Subtotal del Modelo Temp
			var subtotalModelTemp      = (parseInt(valueSliderQMT.value) * parseFloat(dataItemSelected.modelConveyor.price)) ;
			Ti.API.info("subtotalModelTemp: " + subtotalModelTemp);
			
			// Modificamos el valor de subtotal del atributo modelConveyor
			row.modelConveyor.subtotal = subtotalModelTemp;
			
			// Modificamos el atributo subtotal del item list seleccionado
			row.totalConveyor.text     = "Subtotal: $" + subtotalModelTemp;
			
			Ti.API.info("ROW 2: " + JSON.stringify(row));
			
			// Modificamos el item de la lista con los nuevos datos
			$.listViewModelConveyorQuotationDetail.sections[0].updateItemAt(parseInt(itemIndexModelTemp), row, { animated:true });
		},
		onerror : function(e) {
			Ti.API.info(e.error);
		},
		timeout : 5000
	});
	
	// Preparamos conexion
	client.open("POST", url);
	
	// Establece rla cabecera para el formato JSON correcta.
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	
	// Enviar peticion.
	client.send(JSON.stringify(objJSONQuantityMT));
	
}

// ***************************************************
// ACTUALIZAR EL TEXTO DEL LABEL MODEL TEMP QUANTITY
// ***************************************************

function updateValueLabelMT(e)
{
	Ti.API.info("SLIDER: " + parseInt(e.value));
	$.labelQuantityModelTemp.text = parseInt(e.value);
}

// ***************************************************
// FUNCION PARA ELIMINAR UN MODELO TEMPORAL
// ***************************************************

function deleteModelTemp(dataItemSelected)
{
	Ti.API.info("ITEM SELECCIONADO: " + JSON.stringify(dataItemSelected));
	Ti.API.info("Eliminar model temp. " +  dataItemSelected.modelConveyor.text + " # " + dataItemSelected.modelConveyor.id);
	
	// Objeto con el ID del modelo temp
	var objIdModelTemp = {
		"id" : parseInt(dataItemSelected.modelConveyor.id)	
	};
	
	// Dialogo para confirmar "Borrar modelo temp"
	var dialogDeleteModelTemp = Ti.UI.createAlertDialog({
		persistent  : true,
		cancel      : 0,
		buttonNames : ['Confirmar', 'Cancelar'],
		message     : '¿Seguro de realizar esta acción?',
		title       : 'Eliminar Modelo Temporal'
	});
	
	// Click sobre el dialogo
	dialogDeleteModelTemp.addEventListener('click', function(e) {
		Ti.API.info("Item Index: " + e.index);
		// Si presionamos confirmar
		if (e.index == 0) {
			
			// URL del servicio rest
			var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/deleteModelTemp";
			
			// Cliente para realizar la peticion
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {
					
					Ti.API.info("Received text: " + this.responseText);
					
					// Respuesta del ws eliminar modelo
					var responseWSDMT = JSON.parse(this.responseText);
					
					// ***********************************************************
					// TOTAL Y FECHA ESTIMADA DE LA COTIZACION
					// ***********************************************************
					
					// limpiamos nuestra variable global de total y fecha estimada
					Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = "";
					
					Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));
					
					// Asignamos el total y la fecha estimada a la variable global
					Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION = {
						"totalPrice" : responseWSDMT.totalPrice,
						"estimated"  : responseWSDMT.estimated
					};
					
					Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION 2: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));
					
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
					
				},
				onerror : function(e) {
					Ti.API.info("ERROR: " + e.error);
				},
				timeout : 5000
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
// FUNCION PARA GUARDAR COTIZACION
// ***********************************************************

function saveQuotation(e)
{
	// Picker Cliente
	Ti.API.info("idClientQuo: " + idClientQuo);
	
	// TextArea Comntario
	var textAreaCommentQuo = $.textAreaCommentQuo.value;
	
	Ti.API.info("textAreaCommentQuo: " + JSON.stringify(textAreaCommentQuo));
	
	// Validamos si existe un cliente
	if ( idClientQuo != "" && idClientQuo > 0 ) {
		
		// Creamo objeto para enviar
		var objJSONSaveQuotation = {
			idQuotation : idQuotationCurrent,
			comment     : textAreaCommentQuo,
			idClient    : idClientQuo
		};
		
		// Validamos el tipo de usuario que inicio sesion - 4 vendedor -3 cliente
		if (parseInt(idProfileUserLogin)  == 4) {
			Ti.API.info("Eres vendedor");
			
			// Atributo validate
			objJSONSaveQuotation['validate'] = 1;
			
			// Atributo idSeller
			objJSONSaveQuotation['idSeller'] = parseInt(idUsuarioSession);
			
		} else {
			Ti.API.info("Eres cliente");
			
			// Atributo validate
			objJSONSaveQuotation['validate'] = 0;
			
		};
		
		Ti.API.info("OBJETO GUARDAR COTIZCION: " + JSON.stringify(objJSONSaveQuotation));
		
		// Dialogo para guardar una acotizacion
		var dialogSaveQuotation = Ti.UI.createAlertDialog({
			persistent  : true,
			cancel      : 0,
			buttonNames : ['Confirmar', 'Cancelar'],
			message     : '¿Seguro de realizar esta acción?',
			title       : 'Guardar Cotización'
		});
		
		// Click sobre el dialogo
		dialogSaveQuotation.addEventListener('click', function(e) {
			
			Ti.API.info("Item Index: " + e.index);
			
			if (e.index == 0) {
				
				// Abrimos ventana del Indicador
				winAddActivityIndicator.open();
				// Mostramos el indicador
				activityIndicator.show();
				
				Ti.API.info('Presionaste guardar la cotización.');
				
				// Url del servicio rest
				var url    = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/saveQuotationEdit";
				
				// Creamoss un cliente http
				var client = Ti.Network.createHTTPClient({
					// función de llamada cuando los datos de respuesta está disponible
					onload : function(e) {
						
						Ti.API.info("Received text: " + this.responseText);
						
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
						
						alert("Ocurrio un error.\nIntentalo nuevamente.");
					},
					timeout : 5000 // en milisegundos
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
		Ti.UI.createAlertDialog({ message: 'Debes seleccionar un cliente!', title: 'Cliente', ok: 'Aceptar', }).show();
	};
}

// ***********************************************************
// FUNCION PARA MOSTRAR EL BOTON AUTORIZAR O COMPRAR
// ***********************************************************

function validarBotonComprarAutorizarCotizacion()
{
	
	// Boton comprar o autorizar
	var buttonAuthorizeBuy = $.buttonAuthorizeBuy;
	
	// Validamos el tipo de usuario que inicio sesion - 4 vendedor - 3 cliente
	if (parseInt(idProfileUserLogin)  == 4) {
		
		// Cambiamos el texto al boton
		buttonAuthorizeBuy.title = "Autorizar";
		
	} else if(parseInt(idProfileUserLogin)  == 3) {
		
		// Cambiamos el texto al boton
		buttonAuthorizeBuy.title = "Comprar";
		
	};
	
	// CLICK SOBRE EL BOTON COMPRAR O AUTORIZAR
	buttonAuthorizeBuy.addEventListener('click', function(e) {
		
		Ti.API.info("Click Boton Comprar o autorizar: " + JSON.stringify(e));
		
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
// EJECUTAMOS LA FUNCION
// ***********************************************************

validarBotonComprarAutorizarCotizacion();

// ***********************************************************
// FUNCION PARA AUTORIZAR UNA COTIZACION
// ***********************************************************

function autorizarCotizacion()
{
	Ti.API.info("Vamos a autorizar la cotizacion");
	
	Ti.API.info("idClientQuo: " + idClientQuo);
	
	// TextArea Comntario
	var textAreaCommentQuo = $.textAreaCommentQuo.value;
	
	Ti.API.info("textAreaCommentQuo: " + JSON.stringify(textAreaCommentQuo));
	
	// Validamos si existe un cliente
	if ( idClientQuo != "" && idClientQuo > 0 ) {
	
		// OBJ JSON PARA ENVIAR EN LA PETICION
		var objJsonAuthorizeQuotation = {
			idQuotation : idQuotationCurrent,
	    	comment     : textAreaCommentQuo,
			idClient    : idClientQuo,
			idSeller    : idUsuarioSession
		};
		
		
		Ti.API.info("OBJ JSON AQ: " + JSON.stringify(objJsonAuthorizeQuotation));
		
		// Dialogo para autorizar un acotizacion
		var dialogAuthorizeQuotation = Ti.UI.createAlertDialog({
			persistent  : true,
			cancel      : 0,
			buttonNames : ['Confirmar', 'Cancelar'],
			message     : '¿Seguro de realizar esta acción?',
			title       : 'Autorizar Cotización'
		});
		
		// Click sobre el dialogo
		dialogAuthorizeQuotation.addEventListener('click', function(e) {
			
			Ti.API.info("Item Index: " + e.index);
			
			if (e.index == 0) {
				
				// Abrimos ventana del Indicador
				winAddActivityIndicator.open();
				// Mostramos el indicador
				activityIndicator.show();
				
				Ti.API.info('Se va a autorizar la cotización.');
				
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
							
							Ti.API.info("Received text: " + this.responseText);
							
							// Venta principal de cotizaciones
							var winHomeQuotations = Alloy.createController('home').getView();
							
							// Abrimos ventana
							winHomeQuotations.open();
							
						}, 3000);
						
					},
					onerror : function(e) {
						Ti.API.info("ERROR: " + e.error);
						
						// Cerramos la ventana del Indicador
						winAddActivityIndicator.close();
							
						// Cerramos el indicador
						activityIndicator.hide();
						
						alert("Ocurrio un error.\nIntentalo nuevamente.");
					},
					timeout : 15000
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
		Ti.UI.createAlertDialog({ message: 'Debes seleccionar un cliente!', title: 'Cliente', ok: 'Aceptar', }).show();
	};
	
}

// ***********************************************************
// FUNCION PARA COMPRAR UNA COTIZACION
// ***********************************************************

function comprarCotizacion()
{
	Ti.API.info("Vamos a comprar la cotizacion");
	
	Ti.API.info("idClientQuo: " + idClientQuo);
	
	// TextArea Comntario
	var textAreaCommentQuo = $.textAreaCommentQuo.value;
	
	Ti.API.info("textAreaCommentQuo: " + JSON.stringify(textAreaCommentQuo));
	
	var objJsonBuyQuotation = {
		idQuotation : idQuotationCurrent,
		comment     : textAreaCommentQuo,
		idClient    : idClientQuo,
		password    : ""
	};
	
	//ventanaTerminosCondiciones.add(texto);
	var winTermsConditions = Alloy.createController('termsConditions', objJsonBuyQuotation).getView();
	
	// Mostramos la ventana
	winTermsConditions.open();
}

// ***********************************************************
// FUNCION PARA CARGAR EL PICKER DE CLIENTES POR ID DE VEDEDOR - YES
// ***********************************************************

function getAllOptionsPickerClientsByIdSeller()
{
	// Objeto con los datos a enviar
	var objJsonIdSeller = {
		"id" : parseInt(idUsuarioSession)
	};
	
	// Urll del servicio rest
	var url    = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/searchClientBySeller";
	
	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			
			Ti.API.info("Received text: " + this.responseText);
			
			var responseWS = JSON.parse(this.responseText);
			
			// Funcion que llena el combo
			fillClientByIdSellerPicker(responseWS.business);
			
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
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

function fillClientByIdSellerPicker(objOptionsClientByIdSellerPicker)
{
	Ti.API.info("*************** INICIA FUNCION GENERAR LISTA DE CLIENTES");
	// Variable para guardar el index del cliente seleccionado
	var indexItemSelectedPicker        = 0;
	//Ti.API.info("indexItemSelectedPicker: " + indexItemSelectedPicker);
	
	// Variable que guarda el id del cliente
	var idClientItemSelectedPicker     = 0;
	
	// Estatus cotizacion
	var statusQuotationValidatePicker  = Alloy.Globals.ALL_DATA_QUOTATION.title_quotation.statusQuo;
	Ti.API.info("statusQuotationValidatePicker: " + statusQuotationValidatePicker);
		
	//Ti.API.info("ID Cliente: " + JSON.stringify( objOptionsClientByIdSellerPicker[0].user.business) );
	
	if (statusQuotationValidatePicker == 2 || statusQuotationValidatePicker == 3) {
			
		// Variable para guardar el id del cliente seleccionado
		idClientItemSelectedPicker     = Alloy.Globals.ALL_DATA_QUOTATION.title_quotation.idClientQuo;
		//Ti.API.info("idClientItemSelectedPicker: " + idClientItemSelectedPicker);
			
	};
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsClientByIdSellerPicker.forEach(function(optClientByIdSeller, idx) {
		
		// VALIDAMOS SI YA HAY UN CLIENTE SELECCIONADO O NO
		
		//if (statusQuotationValidatePicker == 2 || statusQuotationValidatePicker == 3) {
			
		// Validamos el id del cliente
		if (parseInt(idClientItemSelectedPicker) == parseInt(optClientByIdSeller.user.business.id)) {
				
			Ti.API.info("TE ENCONTRE");
				
			// Asignamos un valor a la variable item index
			indexItemSelectedPicker = parseInt(idx) + 1;
			//Ti.API.info("indexItemSelectedPicker 2: " + idx);
				
			// Asignaamos un valor al id del cliente
			idClientQuo             = parseInt(optClientByIdSeller.user.business.id);
				
		};
			
		//};
		
		// Variable con el nombre del cliente y usuario asignado
		var nameCompanyAndClient = optClientByIdSeller.user.business.nameCompany + " - " + optClientByIdSeller.name + " " + optClientByIdSeller.lastName;
		
		var row = Ti.UI.createPickerRow({
			id       : optClientByIdSeller.user.business.id,
			title    : nameCompanyAndClient
		});
		
		// Asignamos el arreglo
		pickerClientByIdSeller.add(row);
		
		// Mostramos el elemento seleccionado
		pickerClientByIdSeller.selectionIndicator = true;
		
		// Seleccionamos un elemento
		pickerClientByIdSeller.setSelectedRow(0, parseInt(indexItemSelectedPicker), false);

	});
	
	//Ti.API.info("indexItemSelectedPicker 3: " + indexItemSelectedPicker);
	
	// FUNCION AL APLICAR UN CAMBIO EN EL PICKER
	
	pickerClientByIdSeller.addEventListener("change", function(e) {
		Ti.API.info("HAY UN CAMBIO EN EL PICKER");
		// Index del elemento seleccionado
		var indexItem = parseInt(JSON.stringify(e.rowIndex));
		//Ti.API.info("indexItem: " + indexItem );
		
		// Datos del elemento seleccionado
		var pickerDataSelected = e.source.children[0].rows[indexItem];
		//Ti.API.info("pickerDataSelected: " + JSON.stringify(pickerDataSelected) );
		
		// Asignaamos un valor al id del cliente
		idClientQuo = pickerDataSelected.id;
		Ti.API.info("idClientQuo: " + idClientQuo);
	
	});
	
	Ti.API.info("*************** TERMINA FUNCION GENERAR LISTA DE CLIENTES");
	
}

// ***********************************************************
// VALIDAMOS EL STATUS Y COMENTARIO DE LA COTIZACION
// ***********************************************************

// Vista contenedora del picker cliente
var viewSectionClientPicker = $.viewSectionClientPicker;

// Estatus cotizacion
var statusQuotation  = args.title_quotation.statusQuo;

Ti.API.info("Estatus Cotización: " + statusQuotation);

// Validamos el status 4 - Terminada
if (statusQuotation == 4 ) {
	
	// Contenedor de botones de guardar - comprar o autorizar
	var containerTwo     = $.containerTwo;
	
	// Ocultamos contededor
	containerTwo.hide();
	
	// Cambiar tamaño del contenedor
	containerTwo.height  = 0;
	
	// Ocultamos el contenedor
	viewSectionClientPicker.hide();
		
	// Cambiamos el alto del contenedor
	viewSectionClientPicker.height = 0;
	
	// Contenedor de la lista
	var containerOne     = $.containerOne;
	
	// Cambiamos tamaño del contenedor
	containerOne.height  = '100%';
	
};

// ***********************************************************
// Validamos el tipo de usuario que inicio sesion - 4 vendedor -3 cliente
// ***********************************************************

if (parseInt(idProfileUserLogin)  == 4) {
		
	Ti.API.info("Eres vendedor y vamos a cargar el combo de clientes." );
		
	// EJECUTAMOS FUNCION
	getAllOptionsPickerClientsByIdSeller();
		
} else {
	Ti.API.info("Eres cliente y vamos a asignar un id de cliente automatico." );
		
	// Asignamos un valor
	idClientQuo = Alloy.Globals.PROPERTY_INFO_USER.userLogin.user.business.id;//args.quotation.client.user.business.id;
		
	// Ocultamos el contenedor
	viewSectionClientPicker.hide();
		
	// Cambiamos el alto del contenedor
	viewSectionClientPicker.height = 0;
		
};

// Comentario Cotizacion
var commentQuotation = args.title_quotation.commentQuo;
Ti.API.info("Comentario Cotización: " + commentQuotation);

// Validamos si ya existe un comentario
if(commentQuotation != null) {
	// Asignamos valor al textArea comentario
	$.textAreaCommentQuo.value = commentQuotation;
}

/*$.detailQuotation.addEventListener('focus', function(e){
	Ti.API.info('Click en el textArea comentario');
	Ti.API.info('e: ' + JSON.stringify(e));
	
	// Habilitamos el foco
	//e.source.focusable = true;
	$.textAreaCommentQuo.blur();
});*/

// ***********************************************************
// FUNCION PARA MOSTRAR TOTAL Y FECHA ESTIMADA
// ***********************************************************

function setTotalAndDateEstimated()
{
	
	Ti.API.info("FUNCION QUE CARGA EL TOTAL Y LA FECHA ESTIMADA");
	Ti.API.info("DATE_ESTIMATED_TOTAL_QUOTATION: " + JSON.stringify(Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION));
	
	// Total de la cotizacion
	var totalQuotation          = $.labelTotalQuotation;
	
	// Asignamos total
	totalQuotation.text         = "Total USD + IVA: $" + Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION.totalPrice;
	
	// Fecha estimada de la cotizacion
	var dateEstimatedQuotation  = $.labelDateEstimatedQuotation;
	
	// Asignamos Fecha Estimada
	dateEstimatedQuotation.text = "Fecha Estimada: "    + Alloy.Globals.DATE_ESTIMATED_TOTAL_QUOTATION.estimated;
	
}

// ***********************************************************
// FUNCION QUE SE EJECUTA CUANDO ESTA CARGANDO LA VENTANA
// ***********************************************************

// Ventana
var windDetailQuotation = $.detailQuotation;
	
// Evento que se ejecuta ala abri la ventana
windDetailQuotation.addEventListener("open", function(evt) {
	
	Ti.API.info("Se esta abriendo la ventana!");
	
	// ***************************************************
	// EJECUTAMOS FUNCION QUE OBTIENE LOS MODELOS DE LA COTIZACION
	// ***************************************************
	
	getAllModelsConveyorsQuotation(idQuotation);
	
	// ***********************************************************
	// EJECUTAMOS LA FUNCIÓN QUE CARGA TOTAL Y FECHA ESTIMADA
	// ***********************************************************
			
	//setTotalAndDateEstimated();
		
	// Action Bar
	var actionBar;
		
	// Activity
	var activityDetailQuotation = windDetailQuotation.activity;
		
	// Validamos el sistema operativo
	if (Ti.Platform.osname === "android") {
			
	if (! activityDetailQuotation) {
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
