// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("Argumentos recibidos: " + JSON.stringify(args));

// ID del model conveyor temp
var idModelConTemp = args.modelConveyor.id;

Ti.API.info("ID del model conveyor temp: " + parseInt(idModelConTemp));

// EJECUTAMOS FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP

getAllAccessoriesModelConveyorTemp(idModelConTemp);

// FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP

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
			
			// FUNCION QUE GENERA LA LISTA DE LOS MODELOS DE LA COTIZACION
			createAllAccessoriesModelsConveyorTemp(responseWS.accessories);
		},
		onerror : function(e) {
			Ti.API.info(e.error);
		},
		timeout : 5000
	});
	
	// Preparamos conexion.
	client.open("POST", url);

	// Establecer la cabecera para el formato JSON correcta.
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	// Enviar peticion.
	client.send(JSON.stringify(objIdModelConvTemp));

}

// FUNCION QUE GENERA LOS ACCESORIOS DE UN MODELO TEMPORAL

function createAllAccessoriesModelsConveyorTemp(modelsAccessoriesModelTemp) {

	// Array para guardar los datos
	var items = [];

	// RECORREMOS EL OBJETO
	modelsAccessoriesModelTemp.forEach(function(accessory, idx) {
		
		// Validamos si el accesorio esta seleccionado
		if (accessory.check == 1) {

			// Vamos agregando los datos al arreglo
			items.push({
				name_accessory : {
					text : accessory.accessorie.nameAccessorie,
					id   : accessory.accessorie.id, 
					idx  : parseInt(idx)
				},
				quantity_accessory : {
					text : "Cantidad: " + accessory.count
				}
			});
		
		};

		// Agregamos los datos a la lista
		$.listViewSeeAccessories.sections[0].setItems(items);

	});

}

// Dialogo de accesorios seleccionados
var dialogAccessorySelected;
var arrayDialogAccSelect = ['Cantidad Acc. +/-', 'Eliminar', 'Cancelar'];
var optDialogAccSelect   = {
	title   : "Accesorio Seleccionado",
	cancel  : 2,
	options : arrayDialogAccSelect,
	destructive : 0
};

// Datos del elemento presionado
var dataItemSelectedAccesory = {};

// Index del elemento seleccionado
var itemIndexAccessory;

// PRESION LARGA EN UN ELEMENTO DE LA LISTA

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

// FUNCION QUE SE EJECUTA AL PRESIONAR UN ELEMENTO DEL DIALOGO

function onSelectedDialogAccessory(event) {
	
	Ti.API.info("Accesorio seleccionado: " + JSON.stringify(dataItemSelectedAccesory));
	
	// Indice del elemento seleccionado del dialogo
	var selectedIndexDialogAccessory = event.source.selectedIndex;
	
	Ti.API.info("Index del elemento seleccionado: " + parseInt(selectedIndexDialogAccessory));
	
	// Realizamos una accion dependiendo lo que fue seleccionado
	switch(parseInt(selectedIndexDialogAccessory)) {
		case 0:
			Ti.API.info("Cantidad Accesorio.");
			$.alertDialogAccesoryQuantity.show();
			break;
		case 1:
			Ti.API.info("Eliminar Accesorio");
			break;
		default:
			Ti.API.info("Opcion no encontrada.");
			break;
	}

}

$.slider.text = $.slider.value;

function updateLabel(e){
	Ti.API.info("SLIDER: " + parseInt(e.value));
	$.label.text = parseInt(e.value);
    //$.label.text = String.format("%3.1f", e.value);
}