// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("Argumentos recibidos: " + JSON.stringify(args));

// ID de la cotizacion
var idQuotation = args.title_quotation.id;

Ti.API.info("ID de la cotización: " + parseInt(idQuotation));

// EJECUTAMOS FUNCION QUE OBTIENE LOS MODELOS DE LA COTIZACION

getAllModelsConveyorsQuotation(idQuotation);

// FUNCION QUE OBTIENE LOS MODELOS DE LA COTIZACION

function getAllModelsConveyorsQuotation(idQuotation) {

	// OBJ CON EL ID DE LA COTIZACION
	var objIdQuotation = {
		"id" : parseInt(idQuotation)
	};

	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/searchQuotationTempByQuotation";

	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			Ti.API.info("Received text: " + this.responseText);

			var responseWS = JSON.parse(this.responseText);
			Ti.API.info("ResponseWSQuotations: " + this.responseText);
			
			// FUNCION QUE GENERA LA LISTA DE LOS MODELOS DE LA COTIZACION
			createAllModelsConveyorsQuotation(responseWS.listTemp);
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

// FUNCION QUE GENERA LOS MODELOS DE LA COTIZACION

function createAllModelsConveyorsQuotation(modelsConvQuotaion) {

	// Array para guardar los datos
	var items = [];

	// RECORREMOS EL OBJETO
	modelsConvQuotaion.forEach(function(model, idx) {

		// Vamos agregando los datos al arreglo
		items.push({
			modelConveyor : {
				text : model.modelConveyor.model,
				id   : model.id, 
				idx  : parseInt(idx)
			},
			quantityConveyor : {
				text : "Cantidad: " + model.quantity
			},
			priceConveyor : {
				text : "Precio: " + model.price
			},
			totalConveyor : {
				text : "Total:"
			}
		});

		// Agregamos los datos a la lista
		$.listViewModelConveyorQuotationDetail.sections[0].setItems(items);

	});

}

// CLICK EN UN ELEMENTO DE LA LISTA

$.listViewModelConveyorQuotationDetail.addEventListener('itemclick', function(e) {
	
	// Elemento seleccionado
	var itemClickModelTemp  = e.section.getItemAt(e.itemIndex);
	
	Ti.API.info("ITEM:" + JSON.stringify(itemClickModelTemp));
	
	// Ventana
	var winSeeAccesories = Alloy.createController('seeAccessories', itemClickModelTemp).getView();
	
	// Evento que se ejecuta al abrir la ventana
	winSeeAccesories.addEventListener("open", function(ev) {
		
		// Action Bar
		var actionBar;
		
		// Activity
		var activitySeeAcc = winSeeAccesories.activity;
		
		// Validamos el sistema operativo
		if (Ti.Platform.osname === "android") {
			
			if (! activitySeeAcc) {
				Ti.API.error("No se puede acceder a la barra de acción en una ventana ligera.");
			} else {
			
				// Action Bar de la ventana
				actionBar = winSeeAccesories.activity.actionBar;
				
				// Validamos si existe un actionbar
				if (actionBar) {
					
					// Agregamos un menu
					activitySeeAcc.onCreateOptionsMenu = function(ev) {
						
						// Menu
						var menu = ev.menu;
						
						// Item Menu
						var menuItem = menu.add({
							title        : 'Item 1',
							icon         : Ti.Android.R.drawable.ic_menu_add,
							showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
						});
						
						// Click sobre un item del menu
						menuItem.addEventListener('click', function(e){
							Ti.API.info("I was clicked: " + JSON.stringify(e));
						});
						
					};
					
					// Mostramos boton Home Icon
					actionBar.displayHomeAsUp = true;
					
					// Agregamos un titulo
					actionBar.title = "Accesorios seleccionados";
					
					// Al hacer click en el boton Home Icon
					actionBar.onHomeIconItemSelected = function(e) {
						// Cerramos la ventana actual
						winSeeAccesories.close();
					};
				
				};
				
			};
			
		};
		
	});
	
	// Abrimos la ventana
	winSeeAccesories.open();

});

// Dialogo
var dialogModelTemp;
var arrayDialogModelTemp = ['Ver Accesorios', 'Eliminar', 'Cancelar'];
var optDialogMdelTemp    = {
	title   : "Modelo Temporal",
	cancel  : 2,
	options : arrayDialogModelTemp,
	destructive : 0
};

// Datos del elemento presionado
var dataItemSelected = {};

// Index del elemento seleccionado
var itemIndexModelTemp;

// CLICK PROLONGADO EN UN ELEMENTO DE LA LISTA

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

// FUNCION QUE SE EJECUTA AL PRESIONAR UN ELEMENTO DEL DIALOGO

function onSelectDialogModelTemp(event) {
	Ti.API.info("Modelo Temp seleccionado: " + JSON.stringify(dataItemSelected));

	// Indice del elemento seleccionado del dialogo
	var selectedIndexDialModelTemp = event.source.selectedIndex;
	
	Ti.API.info("Index del elemento seleccionado: " + parseInt(selectedIndexDialModelTemp));
	
	// Realizamos una accion dependiendo lo que fue seleccionado
	switch(parseInt(selectedIndexDialModelTemp))
	{
		case 0 :
			Ti.API.info("Ver Accesorios Model Temp");
			break;
		case 1 :
			Ti.API.info("Eliminar Modelo Temp");
			deleteModelTemp(dataItemSelected);
			break;
		default :
			Ti.API.info("Opcion no encontrada.");
			break;
	}
}

// FUNCION PARA ELIMINAR UN MODELO TEMPORAL
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
	dialogDeleteModelTemp.addEventListener('click', function(e){
		Ti.API.info("Item Index: " + e.index);
		// Si presionamos confirmar
		if (e.index == 0) {
			
			// URL del servicio rest
			var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/deleteModelTemp";
			
			// Cliente para realizar la peticion
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {
					
					Ti.API.info("Received text: " + this.responseText);
					
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
