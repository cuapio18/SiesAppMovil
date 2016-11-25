// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("ARGUMENTOS RECIBIDOS:" + JSON.stringify(args));

// PERFIL DEL USUARIO LOGUEADO
var idProfileUserLogin = Alloy.Globals.PROPERTY_INFO_USER.userLogin.user.profile.id;

Ti.API.info("ID PERFIL USUARIO:" + parseInt(idProfileUserLogin));

// Modelos de la cotizacion
var objModelsConveyorsQuotation = args;

// EJECUTAMOS LA FUNCION

getAllModelsConveyorsQuotation(objModelsConveyorsQuotation.listTemp);

// FUNCION QUE GENERA LOS MODELOS DE LA COTIZACION

function getAllModelsConveyorsQuotation(modelsConvQuotaion) {
	
	// Array para guardar los datos
	var items = [];
	
	// RECORREMOS EL OBJETO
	modelsConvQuotaion.forEach(function(model, idx) {
		
		// Vamos agregando los datos al arreglo
		items.push({
			modelConveyor    : {text : model.modelConveyor.model},
			quantityConveyor : {text : model.quantity},
			priceConveyor    : {text : model.price},
			totalConveyor    : {text : "total"}
		});
		
		// Agregamos los datos a la lista
		$.listViewModelConveyorQuotation.sections[0].setItems(items);
		
	});
	
}

// FUNCION PARA GUARDAR COTIZACION

function saveQuotation(e)
{
	
	// Limpiamos el valor del id de la cotizacion
	Alloy.Globals.ID_GLOBAL_QUOTATION = 0;
	
	// Creamo objeto para enviar
	var objJSONSaveQuotation = {
		idQuotation : 166,
		comment     : "PRUEBA DE GUARDAR",
		idClient    : 4,
	};
	
	// Validamos el tipo de usuario que inicio sesion - 4 vendedor -3 cliente
	if (parseInt(idProfileUserLogin)  == 4) {
		Ti.API.info("Eres vendedor");
		
		// Atributo validate
		objJSONSaveQuotation['validate'] = 1;
		
		// Atributo idSeller
		objJSONSaveQuotation['idSeller'] = 3;
		
	} else {
		Ti.API.info("Eres cliente");
		
		// Atributo validate
		objJSONSaveQuotation['validate'] = 0;
		
	};
	
	Ti.API.info("OBJETO GUARDAR COTIZCION: " + JSON.stringify(objJSONSaveQuotation));
	
	// Venta principal de cotizaciones
	//var winHomeQuotations = Alloy.createController('home').getView();
	
	// Abrimos ventana
	//winHomeQuotations.open();
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
	
	var buttonAuthorizeBuy = $.buttonAuthorizeBuy;
	
	// Validamos el tipo de usuario que inicio sesion - 4 vendedor -3 cliente
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
	/*
	// OBJ JSON PARA ENVIAR EN LA PETICION
	var objJsonAuthorizeQuotation = {
		idQuotation : 166,
    	comment     : "ESTA ES  UNA PRUEBA",
		idClient    : 4,
		idSeller    : 3
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
	dialogAuthorizeQuotation.addEventListener('click', function(e){
		
		Ti.API.info("Item Index: " + e.index);
		
		if (e.index == 0) {
			
			Ti.API.info('Se va a autorizar la cotización.');
			
			// URL del servicio rest
			var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/setAut";
			
			// Cliente para realizar la peticion
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {
					
					Ti.API.info("Received text: " + this.responseText);
					
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
			//client.send(JSON.stringify(objJsonAuthorizeQuotation));
			
		};
		
	});
	
	// Mostramos el Alert Dialog
	dialogAuthorizeQuotation.show();
	*/
}

// FUNCION PARA COMPRAR UNA COTIZACION
function comprarCotizacion()
{
	Ti.API.info("Vamos a comprar la cotizacion");
	
	//ventanaTerminosCondiciones.add(texto);
	var winTermsConditions = Alloy.createController('termsConditions').getView();
	
	// Mostramos la ventana
	winTermsConditions.open();
}
