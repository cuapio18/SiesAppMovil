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
					text     : accessory.accessorie.nameAccessorie,
					id       : accessory.accessorie.id, 
					idx      : parseInt(idx),
					quantity : accessory.count
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
	destructive  : 0,
	bubbleParent : false
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

// DIALOGO DE CANTIDAD DE MODELOS TEMPORALES

var dialogQuantityAccessory = $.alertDialogAccesoryQuantity;

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
			
			// Modificar value del slider
			var valueSQA = $.sliderlabelAccesoryQuantity;
				
			valueSQA.value = parseInt(dataItemSelectedAccesory.name_accessory.quantity);
			
			// Mostramos el dialogo
			dialogQuantityAccessory.show();
			break;
		case 1:
			Ti.API.info("Eliminar Accesorio");
			deleteAccessoryModelTemp();
			break;
		default:
			Ti.API.info("Opcion no encontrada.");
			break;
	}

}

// AL HACER CLICK SOBRE ALGUNA OPCION DEL ALERT DIALOG DE CANTIDAD DE ACCESORIOS

dialogQuantityAccessory.addEventListener('click', function(e) {
		
	Ti.API.info("Item Index Dialog Alert CA: " + e.index);
		
	// Si presionamos confirmar
	if (e.index == 0) {
		// Llamamos a la funcion para actualizar la cantidad del modelo
		changeQuantityAccessory();
	};
				
});

// FUNCION PARA AUMENTA O DISMINUIR LA CANTIDAD DE ACCESORIOS

function changeQuantityAccessory()
{
	Ti.API.info("ITEM SELECCIONADO: " + JSON.stringify(dataItemSelectedAccesory));
	Ti.API.info("Cantidad accesorio MT. " +  dataItemSelectedAccesory.name_accessory.text + " # " + dataItemSelectedAccesory.name_accessory.id);
	
	// Slider de cantidad de accesorios
	var valueSliderQAMT = $.sliderlabelAccesoryQuantity;
	Ti.API.info("VALOR DE SLIDER: " + parseInt(valueSliderQAMT.value));
	Ti.API.info("Aumentar o disminuir cantidad de accesorios!");
	
	// Objeto para enviar en la peticion
	var objJSONQuantityAccessory = {
		id       : parseInt(dataItemSelectedAccesory.name_accessory.id) ,
		quantity : parseInt(valueSliderQAMT.value)
	};
	
	Ti.API.info("OBJ JSON QAMT: " + JSON.stringify(objJSONQuantityAccessory));
	
	// URL del sevicio
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/addCountQuotationTemp";
	
		// Cliente para realizar la peticion
	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			
			Ti.API.info("Received text: " + this.responseText);
			
			// Item seleccionado
			var row = $.listViewSeeAccessories.sections[0].getItemAt(parseInt(itemIndexAccessory));
			
			Ti.API.info("ROW: " + JSON.stringify(row));
			
			// Modificamos el atributo cantidad del item list seleccionado
			row.quantity_accessory.text = "Cantidad: " + parseInt(valueSliderQAMT.value);
			
			// Modificamos el atributo cantidad del item list seleccionado
			row.name_accessory.quantity = parseInt(valueSliderQAMT.value);
			
			Ti.API.info("ROW 2: " + JSON.stringify(row));
			
			// Modificamos el item de la lista con los nuevos datos
			$.listViewSeeAccessories.sections[0].updateItemAt(parseInt(itemIndexAccessory), row, { animated:true });
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
	client.send(JSON.stringify(objJSONQuantityAccessory));

}

//$.slider.text = $.slider.value;

// ACTUALIZAR EL TEXTO DEL LABEL ACCESSORY QUANTITY

function updateLabel(e)
{
	Ti.API.info("SLIDER: " + parseInt(e.value));
	$.labelAccesoryQuantity.text = parseInt(e.value);
    //$.label.text = String.format("%3.1f", e.value);
}

// FUNCION PARA ELIMINAR UN ACCESORIO DEL MODEL TEMP

function deleteAccessoryModelTemp()
{
	Ti.API.info("ITEM SELECCIONADO: " + JSON.stringify(dataItemSelectedAccesory));
	
	// Objeto co Id del accesorio del model temp
	var objIdAccessoryMT = {
		idQuotationTemp : idModelConTemp,
		idAccessorie    : parseInt(dataItemSelectedAccesory.name_accessory.id)
	};
	
	Ti.API.info("OBJ JSON AMT: " + JSON.stringify(objIdAccessoryMT));
	
	// Dialogo borra accesorio del model temp
	var dialogDeleteAccessoryModelTemp = Ti.UI.createAlertDialog({
		persistent  : true,
		cancel      : 0,
		buttonNames : ['Confirmar', 'Cancelar'],
		message     : '¿Seguro de realizar esta acción?',
		title       : 'Eliminar Accesorio del modelo'
	});
	
	// Click sobre el dialogo
	dialogDeleteAccessoryModelTemp.addEventListener('click', function(e){
		
		Ti.API.info("Item Index: " + e.index);
		
		// Si prsionamos confirmar
		if (e.index == 0) {
			
			Ti.API.info('Se va a borrar el accesorio.');
			
			// URL del servicio rest
			var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/deleteAccessoriesModelTemp";
			
			// Cliente para realizar la peticion
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {
					
					Ti.API.info("Received text: " + this.responseText);
					
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
			client.send(JSON.stringify(objIdAccessoryMT));
			
		};
		
	});
	
	// Mostramos el Alert Dialog
	dialogDeleteAccessoryModelTemp.show();
	
}