/*
 * CONTROLADOR PARA AGREGAR COTIZACIONES
 */

// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Ti.API.info("Argumentos pasados:" + JSON.stringify(args.idConveyor));

// ID del transportador
var idConveyorArg = parseInt(args.idConveyor);

// **************************************************
// Click en el boton siguiente paso de la cotizacion
// **************************************************

$.btnSearchConveyor.addEventListener('click', function() {
	
	// MODELO DEL TRANSPORTADOR
	var modelConvey = "TMR900FTACA4018SW2-5SP1212";
	
	// OBJ DEL MODELO DEL TRANSPORTADOR 
	var objModelConveyor = {
		"model" : modelConvey
	};
	
	// Ventana del paso numero 2 de la cotizacion
	var winAddQuotationTwo = Alloy.createController('addQuotationTwo', objModelConveyor).getView();
	
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
// FUNCIONES AL HACER UN CAMBIO EN LOS PICKERS
// **************************************************

// FUNCION AL APLICAR UN CAMBIO EN EL PICKER SOPORTE

$.pickerTypeSupport.addEventListener("change", function(e) {
	
	var indexItem;
	//JSON.stringify(e.source.children[0].rows[1])
	//Ti.API.info(JSON.stringify(e));
	alert(JSON.stringify(e.rowIndex));
	
});

// FUNCION AL APLICAR UN CAMBIO EN EL PICKER SERIE DE LA BANDA

$.pickerBandSerie.addEventListener("change", function(e) {
	
	// Indeex del elemento seleccionado
	var indexItem = parseInt(JSON.stringify(e.rowIndex));
	
	// Datos del elemento seleccionado
	var pickerDataSelected = e.source.children[0].rows[indexItem];
	// Titulo - pickerDataSelected.title
	// ID -pickerDataSelected.id
	
	getAllOptPickerBandMaterialUtilWidth(parseInt(pickerDataSelected.id));
	
	//JSON.stringify(e.source.children[0].rows[1])
	//Ti.API.info(JSON.stringify(e));
	//alert(pickerDataSelected.id);
	//var column = $.pickerSpeed.getColumns()[0];
	//column.removeRow(column.rowAt(0));
	
});

// ***********************************************************
// PETICION GLOBAL PARA LLENAR TODOS LOS PICKER DINAMICAMENTE
// ***********************************************************

// EJECUTAMOS PETICION GLOBAL

function getAllOptionsPickerGlobal(idConveyor)
{
	
	// Objeto con los datos a enviar
	var dataLogin = {
		"id" : parseInt(idConveyor)
	};
	
	// Urll del servicio rest
	var url    = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/lognGradeAndSerie";
	
	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			//Ti.API.info("Received text: " + this.responseText);
			//var objOptionsSupportPicker = JSON.parse(this.responseText).results;
			//var objOptionsSupportPicker = JSON.parse(this.responseText);
			var responseWS = JSON.parse(this.responseText);
			
			// 1.- funcion que llena el combo de largo
			fillLongPicker(responseWS.longs);
			
			// 2.- funcion que llena el combo de serie de la banda
			fillBandSeriePicker(responseWS.serieBand);
			
			// 3.- funcion que llena el combo de soporte
			fillTypeSupportPicker(responseWS.support);
			
			// 4.- funcion que llena el combo de altur de entrada y salida
			fillInputOutputHeightPicker(responseWS.height);
			
			// 5.- funcion que llena el combo de unidad motriz
			fillDriveUnitPicker(responseWS.driveUnit);
			
			// 6.- funcion que llena el combo de velocidad
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

// FUNCION PARA LLENAR DINMICAMENTE EL COMBO DE MATERIAL DE LA BANDA Y ANCHO

function getAllOptPickerBandMaterialUtilWidth(idBandSerie)
{
	
	// Objeto con los datos a enviar
	var dataWsFull = {
		"id" : parseInt(idBandSerie)
	};
	
	// Urll del servicio rest
	var url    = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/materialAndWidth";
	
	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			Ti.API.info("Respuesta obtenida por el WS: " + this.responseText);
			
			// PARSEAMOS LA RESPUESTA A UN OBJETO JSON
			var responseWS = JSON.parse(this.responseText);
			
			// 1.- funcion que llena el combo de materila de la banda
			fillBandMaterialPicker(responseWS.materialBand);
			
			// 2.- funcion que llena el combo de ancho util
			fillUtilWidthPicker(responseWS.width);
			
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
	client.send(JSON.stringify(dataWsFull)); 

}

// **************************************************
// PICKER LARGO
// **************************************************

// GENERAMOS LAS OPCIONES DEL PICKER LARGO

function fillLongPicker(objOptionsLongPicker)
{
	
	var pickerLong = $.pickerLong;
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsLongPicker.forEach(function(optLong){
		
		var row = Ti.UI.createPickerRow({
			id : optLong.id,
			title : optLong.description
		});
		
		pickerLong.add(row);
		pickerLong.selectionIndicator = true;
		pickerLong.setSelectedRow(0, 0, false);
		
	});
	
}

// **************************************************
// PICKER SERIE DE LA BANDA
// **************************************************

// GENERAMOS LAS OPCIONES DEL PICKER SERIE DE LA BANDA

function fillBandSeriePicker(objOptionsBandSeriePicker)
{
	
	var pickerBandSerie = $.pickerBandSerie;
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsBandSeriePicker.forEach(function(optBandSerie){
		
		var row = Ti.UI.createPickerRow({
			id: optBandSerie.id,
			title : optBandSerie.serieBand
		});
		
		pickerBandSerie.add(row);
		pickerBandSerie.selectionIndicator = true;
		pickerBandSerie.setSelectedRow(0, 0, false);
		
	});
	
}

// **************************************************
// PICKER MATERIAL DE LA BANDA
// **************************************************

// GENERAMOS LAS OPCIONES DEL PICKER MATERIAL DE LA BANDA

function fillBandMaterialPicker(objOptionsBandMaterialPicker)
{

	var pickerBandMaterial = $.pickerBandMaterial;
	
	//Ti.API.info(JSON.stringify(pickerBandMaterial.getColumns()[0]));
	
	/*var columns = pickerBandMaterial.getColumns();
	
	//Iterate over picker columns
	for (var i = 0, length = columns.length; i < length; i++) {
		//iterate over column rows
		if (columns[i]) {
			var len = col.rowCount;
			for (var index = 0, collength = columns[i].length; index < collength; index++) {
				//remove rows[index] of columns[it]
				columns[i].removeRow(columns[it].rows[index]);
			}
		}
	}*/
	
	// Preguntamos si existen columnas en el combo
	if (pickerBandMaterial.columns[0]) {
		// Columnas que hay en el combo
		var _col = pickerBandMaterial.columns[0];
		
		// Cantidas de elementos que hay en el combo
		var len = _col.rowCount;
		
		// Recorremos los elementos del combo
		for (var x = len - 1; x >= 0; x--) {
			
			// Guardamos cada elemento del combo
			var _row = _col.rows[x];
			
			// Eliminamos el elemento
			_col.removeRow(_row);
			
		}
		
		//pickerBandMaterial.reloadColumn(_col);
	}
	
	// Creamos una fila por defecto
	var rowDef = Ti.UI.createPickerRow({
			id : "",
			title : "Seleccione Woow 1"
	});
	
	// Agregamos la fila al combo
	pickerBandMaterial.add(rowDef);
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsBandMaterialPicker.forEach(function(optBandMaterial){
		
		// Creamos las filas dinamicamente
		var row = Ti.UI.createPickerRow({
			id : optBandMaterial.id,
			title : optBandMaterial.materialBand
		});
		
		// Agregamos las filas al combo
		pickerBandMaterial.add(row);
		pickerBandMaterial.selectionIndicator = true;
		pickerBandMaterial.setSelectedRow(0, 0, false);
		
	});
	
}

// **************************************************
// PICKER ANCHO UTIL
// **************************************************

// GENERAMOS LAS OPCIONES DEL PICKER ANCHO UTIL

function fillUtilWidthPicker(objOptionsUsefulWidthPicker)
{
	
	var pickerUsefulWidth = $.pickerUsefulWidth;
	
	// Preguntamos si existen columnas en el combo
	if (pickerUsefulWidth.columns[0]) {
		// Columnas que hay en el combo
		var _col = pickerUsefulWidth.columns[0];
		
		// Cantidas de elementos que hay en el combo
		var len = _col.rowCount;
		
		// Recorremos los elementos del combo
		for (var x = len - 1; x >= 0; x--) {
			
			// Guardamos cada elemento del combo
			var _row = _col.rows[x];
			
			// Eliminamos el elemento
			_col.removeRow(_row);
			
		}
		
		//pickerBandMaterial.reloadColumn(_col);
	}
	
	// Creamos una fila por defecto
	var rowDef = Ti.UI.createPickerRow({
			id : "",
			title : "Seleccione Woow 2"
	});
	
	// Agregamos la fila al combo
	pickerUsefulWidth.add(rowDef);
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsUsefulWidthPicker.forEach(function(optUsefulWidth){
		
		var row = Ti.UI.createPickerRow({
			id : optUsefulWidth.id,
			title : optUsefulWidth.measure
		});
		
		pickerUsefulWidth.add(row);
		pickerUsefulWidth.selectionIndicator = true;
		pickerUsefulWidth.setSelectedRow(0, 0, false);
		
	});
	
}

// **************************************************
// PICKER SOPORTE
// **************************************************

// GENERAMOS LAS OPCIONES DEL PICKER TIPO DE SOPORTE

function fillTypeSupportPicker(objOptionsTypeSupportPicker)
{
	
	var pickerTypeSupport = $.pickerTypeSupport;
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsTypeSupportPicker.forEach(function(optTypeSupport){
		
		var row = Ti.UI.createPickerRow({
			id : optTypeSupport.id,
			title : optTypeSupport.support
		});
		
		pickerTypeSupport.add(row);
		pickerTypeSupport.selectionIndicator = true;
		pickerTypeSupport.setSelectedRow(0, 0, false);
		
	});
	
}

// **************************************************
// PICKER ALTURA DE  ENTRADA Y SALIDA
// **************************************************

// GENERAMOS LAS OPCIONES DEL PICKER ALTURA DE  ENTRADA Y SALIDA

function fillInputOutputHeightPicker(objOptionsInputOutputHeightPicker)
{
	
	var pickerInputOutputHeight = $.pickerInputOutputHeight;
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsInputOutputHeightPicker.forEach(function(optInputOutputHeight){
		
		var row = Ti.UI.createPickerRow({
			id : optInputOutputHeight.id,
			title : optInputOutputHeight.height
		});
		
		pickerInputOutputHeight.add(row);
		pickerInputOutputHeight.selectionIndicator = true;
		pickerInputOutputHeight.setSelectedRow(0, 0, false);
		
	});
	
}

// **************************************************
// PICKER UNIDAD MOTRIZ
// **************************************************

// GENERAMOS LAS OPCIONES DEL PICKER UNIDAD MOTRIZ

function fillDriveUnitPicker(objOptionsDriveUnitPicker)
{
	
	var pickerDriveUnit = $.pickerDriveUnit;
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsDriveUnitPicker.forEach(function(optDriveUnit){
		
		var row = Ti.UI.createPickerRow({
			id : optDriveUnit.id,
			title : optDriveUnit.name
		});
		
		pickerDriveUnit.add(row);
		pickerDriveUnit.selectionIndicator = true;
		pickerDriveUnit.setSelectedRow(0, 0, false);
		
	});
	
}

// **************************************************
// PICKER VELOCIDAD
// **************************************************

// GENERAMOS LAS OPCIONES DEL PICKER VELOCIDAD

function fillSpeedPicker(objOptionsSpeedPicker)
{
	
	var pickerSpeed = $.pickerSpeed;
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsSpeedPicker.forEach(function(optSpeed){
		
		var row = Ti.UI.createPickerRow({
			//title : optSpeed.speed
			id : optSpeed.id,
			title : optSpeed.description
		});
		
		pickerSpeed.add(row);
		pickerSpeed.selectionIndicator = true;
		pickerSpeed.setSelectedRow(0, 0, false);
		
	});
	
}

// EJECUTAMOS LA FUNCION GLOBAL PARA LLENAR LOS COMBOS

getAllOptionsPickerGlobal(idConveyorArg);