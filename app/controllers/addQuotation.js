/*
 * CONTROLADOR PARA AGREGAR COTIZACIONES
 */

// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("Argumentos pasads:" + JSON.stringify(args));

// **************************************************
// Click en el boton siguiente paso de la cotizacion
// **************************************************

var conInp = 0;

$.btnSiguientePaso.addEventListener('click', function() {
	
	// Ventana del paso numero 2 de la cotizacion
	var winAddQuotationTwo = Alloy.createController('addQuotationTwo').getView();
	
	// Contenedor de campos
	var containerInput = $.scrollviewConveyorDetails;
	
	//alert(containerInput.getChildren());
	
	// Abrir ventana
	winAddQuotationTwo.open();
	
	// CLICK EN EL BOTON REGRESAR
	winAddQuotationTwo.addEventListener("open", function(evt) {
		var actionBar = winAddQuotationTwo.activity.actionBar;
		actionBar.displayHomeAsUp = true;
		actionBar.onHomeIconItemSelected = function(e) {
			Ti.API.info(evt);
			winAddQuotationTwo.close();
		};
	});
	
});

// **************************************************
// PICKER SOPORTE
// **************************************************

// Funcion para obtener las opciones para el combo de soporte
/*function getAllOptionsSupportPicker() {

	//var url    = "http://api.randomuser.me/?nat=es&results=5";
	var url    = "http://192.168.1.72:8080/SiesRestApp/API/supports";
	
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			//Ti.API.info("Received text: " + this.responseText);
			//var objOptionsSupportPicker = JSON.parse(this.responseText).results;
			var objOptionsSupportPicker = JSON.parse(this.responseText);
			// funcion que llena el combo de soporte
			fillSupportPicker(objOptionsSupportPicker);
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	// Preparar la conexión.
	client.open("GET", url);
	// Enviar la solicitud.
	client.send(); 

}*/


// PETICION GLOBAL
function getAllOptionsPickerGlobal(idConveyor)
{
	
	// Objeto con los datos a enviar
	var dataLogin = {
		"id" : parseInt(idConveyor)
	};
	
	var url    = "http://192.168.1.69:8080/sies-rest/quotation/lognGradeAndSerie";
	
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			//Ti.API.info("Received text: " + this.responseText);
			//var objOptionsSupportPicker = JSON.parse(this.responseText).results;
			//var objOptionsSupportPicker = JSON.parse(this.responseText);
			var responseWS = JSON.parse(this.responseText);
			
			// funcion que llena el combo de soporte
			//fillSupportPicker(objOptionsSupportPicker);
			fillSupportPicker(responseWS.support);
			
			// funcion que llena el combo de largo
			fillLongPicker(responseWS.longs);
			
			// funcion que llena el combo de velocidad
			fillSpeedPicker(responseWS.speed);
			
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	// Preparar la conexión.
	client.open("POST", url);
	
	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	
	// Enviar la solicitud.
	client.send(JSON.stringify(dataLogin)); 

}

// GENERAMOS LAS OPCIONES DEL PICKER SOPORTE
function fillSupportPicker(objOptionsSupportPicker) {
	var pickerSoporte = $.pickerSoporte;
	//console.log(objOptionsSupportPicker);
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsSupportPicker.forEach(function(optSupport){
		
		var row = Ti.UI.createPickerRow({
			//title: optSupport.name.first
			//title: optSupport.descriptionSupport
			title : optSupport.support
		});
		
		pickerSoporte.add(row);
		pickerSoporte.selectionIndicator = true;
		pickerSoporte.setSelectedRow(0, 0, false);
		
	});
}

// EJECUTAMOS FUNCION PARA LLENAR COMBO DE SOPORTE
//getAllOptionsSupportPicker();
getAllOptionsPickerGlobal(1);

// **************************************************
// PICKER LARGO
// **************************************************

// Funcion para obtener las opciones para el combo de largo
/*function getAllOptionsLongPicker() {

	//var url    = "http://api.randomuser.me/?nat=es&results=8";
	var url = "http://192.168.1.72:8080/SiesRestApp/API/longs";
	
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			//Ti.API.info("Received text: " + this.responseText);
			//var objOptionsLongPicker = JSON.parse(this.responseText).results;
			var objOptionsLongPicker = JSON.parse(this.responseText);
			
			// funcion que llena el combo de largo
			fillLongPicker(objOptionsLongPicker);
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	// Preparar la conexión.
	client.open("GET", url);
	// Enviar la solicitud.
	client.send(); 

}*/

// GENERAMOS LAS OPCIONES DEL PICKER LARGO
function fillLongPicker(objOptionsLongPicker) {
	var pickerLong = $.pickerLargo;
	console.log("Largos recibidos: " + objOptionsLongPicker);
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsLongPicker.forEach(function(optLong){
		
		var row = Ti.UI.createPickerRow({
			//title: optLong.name.first
			title : optLong.description
		});
		
		pickerLong.add(row);
		pickerLong.selectionIndicator = true;
		pickerLong.setSelectedRow(0, 0, false);
		
	});
}

// EJECUTAMOS FUNCION PARA LLENAR COMBO DE LARGO
//getAllOptionsLongPicker();


// **************************************************
// PICKER ALTURA DE SALIDA
// **************************************************

// Funcion para obtener las opciones para el combo de altura de salida
function getAllOptionsHeightPicker() {

	var url = "http://192.168.1.72:8080/SiesRestApp/API/heights";
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
		
			var objOptionsHeightPicker = JSON.parse(this.responseText);
			
			// funcion que llena el combo de altura de salida
			fillHeightPicker(objOptionsHeightPicker);
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	// Preparar la conexión.
	client.open("GET", url);
	// Enviar la solicitud.
	client.send(); 

}

// GENERAMOS LAS OPCIONES DEL PICKER ALTURA DE SALIDA
function fillHeightPicker(objOptionsHeightPicker) {
	var pickerHeight = $.pickerAltura;
	//console.log(objOptionsHeightPicker);
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsHeightPicker.forEach(function(optHeight){
		
		var row = Ti.UI.createPickerRow({
			title : optHeight.height
		});
		
		pickerHeight.add(row);
		pickerHeight.selectionIndicator = true;
		pickerHeight.setSelectedRow(0, 0, false);
		
	});
}

// EJECUTAMOS FUNCION PARA LLENAR COMBO DE ALTURA DE SALIDA
//getAllOptionsHeightPicker();

// **************************************************
// PICKER ALTURA DE ENTRADA
// **************************************************

// Funcion para obtener las opciones para el combo de altura de entrada
function getAllOptionsHeightEntryPicker() {

	var url = "http://192.168.1.72:8080/SiesRestApp/API/heights";
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
		
			var objOptionsHeightEntryPicker = JSON.parse(this.responseText);
			
			// funcion que llena el combo de altura de entrada
			fillHeightEntryPicker(objOptionsHeightEntryPicker);
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	// Preparar la conexión.
	client.open("GET", url);
	// Enviar la solicitud.
	client.send(); 

}

// GENERAMOS LAS OPCIONES DEL PICKER ALTURA DE ENTRADA
function fillHeightEntryPicker(objOptionsHeightEntryPicker) {
	var pickerHeightEntry = $.pickerAlturaEntrada;
	//console.log(objOptionsHeightEntryPicker);
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsHeightEntryPicker.forEach(function(optHeightEntry){
		
		var row = Ti.UI.createPickerRow({
			title : optHeightEntry.height
		});
		
		pickerHeightEntry.add(row);
		pickerHeightEntry.selectionIndicator = true;
		pickerHeightEntry.setSelectedRow(0, 0, false);
		
	});
}

// EJECUTAMOS FUNCION PARA LLENAR COMBO DE ALTURA DE ENTRADA
//getAllOptionsHeightEntryPicker();

// **************************************************
// PICKER ANCHO UTIL
// **************************************************

// Funcion para obtener las opciones para el combo de ancho util
function getAllOptionsUtilWidthPicker() {

	var url = "http://192.168.1.72:8080/SiesRestApp/API/widths";
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
		
			var objOptionsUtilWidthPicker = JSON.parse(this.responseText);
			
			// funcion que llena el combo de ancho util
			fillUtilWidthPicker(objOptionsUtilWidthPicker);
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	// Preparar la conexión.
	client.open("GET", url);
	// Enviar la solicitud.
	client.send(); 

}

// GENERAMOS LAS OPCIONES DEL PICKER ANCHO UTIL
function fillUtilWidthPicker(objOptionsUtilWidthPicker) {
	var pickerUtilWidth = $.pickerAnchoUtil;
	//console.log(objOptionsUtilWidthPicker);
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsUtilWidthPicker.forEach(function(optUtilWidth){
		
		var row = Ti.UI.createPickerRow({
			title : optUtilWidth.measure
		});
		
		pickerUtilWidth.add(row);
		pickerUtilWidth.selectionIndicator = true;
		pickerUtilWidth.setSelectedRow(0, 0, false);
		
	});
}

// EJECUTAMOS FUNCION PARA LLENAR COMBO DE ANCHO UTIL
//getAllOptionsUtilWidthPicker();

// **************************************************
// PICKER MATERIAL DE LA BANDA
// **************************************************

// Funcion para obtener las opciones para el combo de material de la banda
function getAllOptionsMaterialBandPicker() {

	var url = "http://192.168.1.72:8080/SiesRestApp/API/materials-bands";
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
		
			var objOptionsMaterialBandPicker = JSON.parse(this.responseText);
			
			// funcion que llena el combo de material de la banda
			fillMaterialBandPicker(objOptionsMaterialBandPicker);
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	// Preparar la conexión.
	client.open("GET", url);
	// Enviar la solicitud.
	client.send(); 

}

// GENERAMOS LAS OPCIONES DEL PICKER MATERIAL DE LA BANDA
function fillMaterialBandPicker(objOptionsMaterialBandPicker) {
	var pickerMaterialBand = $.pickerMaterialBanda;
	//console.log(objOptionsMaterialBandPicker);
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsMaterialBandPicker.forEach(function(optMaterialBand){
		
		var row = Ti.UI.createPickerRow({
			title : optMaterialBand.materialBand
		});
		
		pickerMaterialBand.add(row);
		pickerMaterialBand.selectionIndicator = true;
		pickerMaterialBand.setSelectedRow(0, 0, false);
		
	});
}

// EJECUTAMOS FUNCION PARA LLENAR COMBO DE MATERIAL DE LA BANDA
//getAllOptionsMaterialBandPicker();

// **************************************************
// PICKER UNIDAD MOTRIZ
// **************************************************

// Funcion para obtener las opciones para el combo de unidad motriz
function getAllOptionsDriveUnitPicker() {

	var url = "http://192.168.1.72:8080/SiesRestApp/API/drives-units";
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
		
			var objOptionsDriveUnitPicker = JSON.parse(this.responseText);
			
			// funcion que llena el combo de unidad motriz
			fillDriveUnitPicker(objOptionsDriveUnitPicker);
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	// Preparar la conexión.
	client.open("GET", url);
	// Enviar la solicitud.
	client.send(); 

}

// GENERAMOS LAS OPCIONES DEL PICKER UNIDAD MOTRIZ
function fillDriveUnitPicker(objOptionsDriveUnitPicker) {
	var pickerDriveUnit = $.pickerUnidadMotriz;
	//console.log(objOptionsDriveUnitPicker);
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsDriveUnitPicker.forEach(function(optDriveUnit){
		
		var row = Ti.UI.createPickerRow({
			title : optDriveUnit.name
		});
		
		pickerDriveUnit.add(row);
		pickerDriveUnit.selectionIndicator = true;
		pickerDriveUnit.setSelectedRow(0, 0, false);
		
	});
}

// EJECUTAMOS FUNCION PARA LLENAR COMBO DE UNIDAD MOTRIZ
//getAllOptionsDriveUnitPicker();

// **************************************************
// PICKER VELOCIDAD
// **************************************************

// Funcion para obtener las opciones para el combo de velocidad
/*function getAllOptionsSpeedPicker() {

	var url = "http://192.168.1.72:8080/SiesRestApp/API/speeds";
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
		
			var objOptionsSpeedPicker = JSON.parse(this.responseText);
			
			// funcion que llena el combo de velocidad
			fillSpeedPicker(objOptionsSpeedPicker);
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 5000 // en milisegundos
	});
	// Preparar la conexión.
	client.open("GET", url);
	// Enviar la solicitud.
	client.send(); 

}*/

// GENERAMOS LAS OPCIONES DEL PICKER VELOCIDAD
function fillSpeedPicker(objOptionsSpeedPicker) {
	var pickerSpeed = $.pickerVelocidad;
	//console.log(objOptionsSpeedPicker);
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsSpeedPicker.forEach(function(optSpeed){
		
		var row = Ti.UI.createPickerRow({
			//title : optSpeed.speed
			title : optSpeed.description
		});
		
		pickerSpeed.add(row);
		pickerSpeed.selectionIndicator = true;
		pickerSpeed.setSelectedRow(0, 0, false);
		
	});
}

// EJECUTAMOS FUNCION PARA LLENAR COMBO DE VELOCIDAD
//getAllOptionsSpeedPicker();



