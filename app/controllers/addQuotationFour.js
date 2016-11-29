// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("ARGUMENTOS RECIBIDOS:" + JSON.stringify(args));

// CREAMOS UN INDICADOR

// Ventana para mpstrar el indicador
var winAddActivityIndicator = Ti.UI.createWindow({
	theme: "Theme.AppCompat.Light.NoActionBar",
	backgroundColor : "#000",
	opacity: .9,
	fullscreen : true
});

// Creamos activity Indicator
var activityIndicator = Ti.UI.createActivityIndicator({
	color   : '#ccc',
	font    : {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
	message : 'Espere...',
	style   : Ti.UI.ActivityIndicatorStyle.BIG_DARK,
	height  : Ti.UI.SIZE,
	width   : Ti.UI.SIZE
});

// Agregamos el indicador a la ventana
winAddActivityIndicator.add(activityIndicator);

// ID DE LA COTIZACION
var idQuotationCurrent = parseInt(args.quotation.id);

Ti.API.info("idQuotationCurrent:" + idQuotationCurrent);

// ID DEL CLIENTE
var idClientQuo = 0;

Ti.API.info("idClientQuo:" + idClientQuo);

// ID DEL USUARIO
var idUsuarioSession   = Alloy.Globals.PROPERTY_INFO_USER.userLogin.id;

Ti.API.info("idUsuarioSession:" + parseInt(idUsuarioSession));

// PERFIL DEL USUARIO LOGUEADO
var idProfileUserLogin = Alloy.Globals.PROPERTY_INFO_USER.userLogin.user.profile.id;

Ti.API.info("idProfileUserLogin:" + parseInt(idProfileUserLogin));

// PICKER CLIENTE
var pickerClientByIdSeller = $.pickerClientByIdSeller;

// Modelos de la cotizacion
var objModelsConveyorsQuotation = args.listTemp;

// EJECUTAMOS LA FUNCION

getAllModelsConveyorsQuotation(objModelsConveyorsQuotation);

// FUNCION QUE GENERA LOS MODELOS DE LA COTIZACION

function getAllModelsConveyorsQuotation(modelsConvQuotaion) {
	
	// Array para guardar los datos
	var items = [];
	
	// RECORREMOS EL OBJETO
	modelsConvQuotaion.forEach(function(model, idx) {
		
		// Vamos agregando los datos al arreglo
		items.push({
			modelConveyor    : {text : model.modelConveyor.model},
			quantityConveyor : {text : 'Cantidad: ' + model.quantity},
			priceConveyor    : {text : 'Precio: ' + model.price},
			totalConveyor    : {text : "Total: "}
		});
		
		// Agregamos los datos a la lista
		$.listViewModelConveyorQuotation.sections[0].setItems(items);
		
	});
	
}

// FUNCION PARA GUARDAR COTIZACION

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
							winAddActivityIndicator.close();
							
							// Cerramos el indicador
							activityIndicator.hide();
							
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
		alert("Debes seleccionar un cliente!");
	};
}

var dialogModelConv;
var myArrayModelConv    = ['Eliminar modelo', 'Ver accesorios', 'Ver modelo', 'Cancelar' ];
var optsDialogModelConv = {
	title   : 'Modelo',
	cancel  : 3,
	options : myArrayModelConv
};

/*
function longModelConv(e)
{
	//alert(JSON.stringify(e.sectionIndex));
	// SECCION
	var section   = $.listView.sections[e.sectionIndex];
	// INDICE DEL EELEMENTO
	var itemIndex = e.itemIndex;
	// ELEMENTO SELECCIONADO
	var item      = section.getItemAt(e.itemIndex);
	//alert(item);
	// DIALOGO CON LAS OPCIONES
	dialogModelConv = Ti.UI.createOptionDialog(optsDialogModelConv);
	// MOSTRAMOS DIALOGO
	dialogModelConv.show();
	// CLICK EN ALGUNA OPCION DEL DIALOGO
	dialogModelConv.addEventListener('click', function(e) {
		//alert(JSON.stringify(e.index));
		switch (parseInt(e.index)) {
			 case 0 : 
			 	Ti.API.info("Eliminar modelo.");
			 	section.deleteItemsAt(itemIndex, 1);
			 	break;
			 case 1 : 
			 	Ti.API.info("Ver accesorios.");
			 	var winSeeAccessories = Alloy.createController('seeAccessories').getView();
			 	winSeeAccessories.open();
			 	break;
			 case 2 : 
			 	Ti.API.info("Ver modelo.");
			 	var winSeeModel = Alloy.createController('seeModel').getView();
			 	winSeeModel.open();
			 	winSeeModel.addEventListener('open', function(ev){
			 		var actionBarSeeModel = winSeeModel.activity.actionBar;
			 		actionBarSeeModel.displayHomeAsUp = true;
			 		actionBarSeeModel.onHomeIconItemSelected = function(){
			 			winSeeModel.close();
			 		};
			 	});
			 	break;
			 default:
			 	alert('esa opcion no existe.');
			 	break;
		}
		//Ti.API.info("Delete ListView Raw = "+ JSON.stringify(e) );
		//Ti.API.info(item.modelConveyor.text);
	});
}
*/
/*

function addOneToCurrentNumber(e) {
	var row = $.listView.sections[0].getItemAt(e.itemIndex);
	var number = parseInt(row.number.text);
	number++;
	row.number.text = number;
	$.listView.sections[0].updateItemAt(e.itemIndex, row, {
		animated : true
	});
}

 */

// FUNCION PARA MOSTRAR EL BOTON AUTORIZAR O COMPRAR

function validarBotonComprarAutorizarCotizacion() {
	
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

// EJECUTAMOS LA FUNCION

validarBotonComprarAutorizarCotizacion();

// FUNCION PARA AUTORIZAR UNA COTIZACION

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
							winAddActivityIndicator.close();
							
							// Cerramos el indicador
							activityIndicator.hide();
						
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
					timeout : 10000
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
		alert("Debes seleccionar un cliente!");
	};
	
}

// FUNCION PARA COMPRAR UNA COTIZACION

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

// FUNCION PARA CARGAR EL PICKER DE CLIENTES POR ID DE VEDEDOR

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

// GENERAMOS LAS OPCIONES DEL PICKER CLIENTES POR ID DE VENDEDOR

function fillClientByIdSellerPicker(objOptionsClientByIdSellerPicker)
{
	
	
	//Ti.API.info("ID Cliente: " + JSON.stringify( objOptionsClientByIdSellerPicker[0].user.business) );
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsClientByIdSellerPicker.forEach(function(optClientByIdSeller) {
		
		//Ti.API.info("FOREACH: " + JSON.stringify(optClientByIdSeller.user.business) );
		
		var row = Ti.UI.createPickerRow({
			id       : optClientByIdSeller.user.business.id,
			title    : optClientByIdSeller.user.business.nameCompany
		});
		
		pickerClientByIdSeller.add(row);
		pickerClientByIdSeller.selectionIndicator = true;
		pickerClientByIdSeller.setSelectedRow(0, 0, false);

	});
	
	// FUNCION AL APLICAR UN CAMBIO EN EL PICKER
	
	pickerClientByIdSeller.addEventListener("change", function(e) {
	
		// Index del elemento seleccionado
		var indexItem = parseInt(JSON.stringify(e.rowIndex));
		Ti.API.info("indexItem: " + indexItem );
		
		// Datos del elemento seleccionado
		var pickerDataSelected = e.source.children[0].rows[indexItem];
		Ti.API.info("pickerDataSelected: " + JSON.stringify(pickerDataSelected) );
		
		// Asignaamos un valor al id del cliente
		idClientQuo = pickerDataSelected.id;
	
	});

}

// Validamos el tipo de usuario que inicio sesion - 4 vendedor -3 cliente
if (parseInt(idProfileUserLogin)  == 4) {
	
	Ti.API.info("Eres vendedor y vamos a cargar el combo de clientes." );
	
	// EJECUTAMOS FUNCION
	getAllOptionsPickerClientsByIdSeller();
	
} else {
	Ti.API.info("Eres cliente y vamos a asignar un id de cliente automatico." );
	
	// Asignamos un valor
	idClientQuo = args.quotation.client.user.business.id;
};

