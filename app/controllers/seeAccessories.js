// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("Argumentos recibidos: " + JSON.stringify(args));

// ID del model conveyor temp
var idModelConTemp = args.modelConveyor.id;

Ti.API.info("ID del model conveyor temp: " + parseInt(idModelConTemp));

// EJECUTAMOS FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP

getAllModelConveyorTemp(idModelConTemp);

// FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP

function getAllModelConveyorTemp(idModelConTemp) {

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
			//createAllModelsConveyorsQuotation(responseWS.listTemp);
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
	client.send(JSON.stringify(objIdModelConvTemp));

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