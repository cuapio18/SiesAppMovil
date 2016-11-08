/*
 * CONTROLADOR PARA AGREGAR COTIZACIONES
 */

// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Ti.API.info("Argumentos pasados:" + JSON.stringify(args));

// ID del transportador
var idConveyorArg    = parseInt(args.idConveyor);

// Clave corta del transportador
var keyShortConveyor = args.keyShort;

// Tipo de transportador
var typeConveyor     = args.typeConveyor;

//Ti.API.info("KEY SHORT: " + keyShortConveyor);

// VARIABLES CON LOS VALORES DE LOS PICKER

// Largo
/*var valuePickerLongGrade      = "";
var valuePickerBandSerie = "";
var valueBandMaterial    = "";
var valueUtilWidth      = "";
var valueTypeSupport = "";
var valueInputOutputHeight = "";
var valueDriveUnit = "";
var valueSpeed = "";*/

// **************************************************
// Click en el boton siguiente paso de la cotizacion
// **************************************************

$.btnSearchConveyor.addEventListener('click', function() {
	
	// Asignamos un valor a largo
	var valPickerLongGrade   = $.pickerLongGrade.getSelectedRow(0).keyshort;
	
	// Asignamos valor a serie de la banda
	var valPickerBandSerie   = $.pickerBandSerie.getSelectedRow(0).keyshort;
	
	// Asignamos valor a material de la banda
	var valBandMaterial      = String($.pickerBandMaterial.getSelectedRow(0).keyshort);
	
	// Asignamos valor al ancho util
	var valUtilWidth         = $.pickerUsefulWidth.getSelectedRow(0).keyshort;
	
	// Asignmos valor a tipo de soporte
	var valTypeSupport       = $.pickerTypeSupport.getSelectedRow(0).keyshort;
	
	// Asignnamos valor a altura de entrada y salida
	var valInputOutputHeight = $.pickerInputOutputHeight.getSelectedRow(0).keyshort;
	
	// Asignamos valor a unidad motriz
	var valDriveUnit         = $.pickerDriveUnit.getSelectedRow(0).keyshort;
	
	// Asignamos valor a la velocidad
	var valSpeed             = $.pickerSpeed.getSelectedRow(0).keyshort;
	
	// Tipo de soporte
	var typeSupportConveyor  = $.pickerTypeSupport.getSelectedRow(0).id;
	
	var modelConvey = "";
	Ti.API.info("Tipo de soporte: " + typeSupportConveyor);
	// VALIDAMOS EL TIPO DE SOPORTE (piso - techo)
	if (typeSupportConveyor == 1) {
		
		// Validamos el tipo de transportador (recto - curvo)
		if (typeConveyor == "R") {
			
			modelConvey = keyShortConveyor + valPickerBandSerie + valBandMaterial + valPickerLongGrade + valUtilWidth + valDriveUnit + valSpeed + valTypeSupport + valInputOutputHeight + valInputOutputHeight;
			
		} else if(typeConveyor == "C") {
			
			modelConvey = keyShortConveyor + valPickerBandSerie + valBandMaterial + valPickerLongGrade + valUtilWidth + valDriveUnit + valSpeed + valTypeSupport + valInputOutputHeight + valInputOutputHeight;
			
		};
		
	} else if(typeSupportConveyor == 2){
		// Validamos el tipo de transportador (recto - curvo)
		if (typeConveyor == "R") {
			
			modelConvey = keyShortConveyor + valPickerBandSerie + valBandMaterial + valPickerLongGrade + valUtilWidth + valDriveUnit + valSpeed + valTypeSupport;

		} else if(typeConveyor == "C") {
			
			modelConvey = keyShortConveyor + valPickerBandSerie + valBandMaterial + valPickerLongGrade + valUtilWidth + valDriveUnit + valSpeed + valTypeSupport;		

		};
	};
	
	// MODELO DEL TRANSPORTADOR
	//var modelConvey    = keyShortConveyor + valPickerLongGrade + valPickerBandSerie + valBandMaterial + valUtilWidth + valTypeSupport + valInputOutputHeight + valDriveUnit + valSpeed;
	//var modelConveyor = "TMR900FTACA4018SW2-5SP1212";
	
	Ti.API.info("LARGO: " + valPickerLongGrade);
	Ti.API.info("SERIE DE LA BANDA: " + valPickerBandSerie);
	Ti.API.info("MATERIAL DE LA BANDA: " + valBandMaterial);
	Ti.API.info("ANCHO UTIL: " + valUtilWidth);
	Ti.API.info("TIPO DE SOPORTE: " + valTypeSupport);
	Ti.API.info("ALTURA DE ENTRADA Y SALIDA: " + valInputOutputHeight);
	Ti.API.info("UNIDAD MOTRIZ: " + valDriveUnit);
	Ti.API.info("VELOCIDAD: " + valSpeed);
	
	Ti.API.info("MODELO: " + modelConvey);
	
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

// FUNCION AL APLICAR UN CAMBIO EN EL PICKER LARGO

/*$.pickerLongGrade.addEventListener("change", function(e) {
	
	// index del elemento seleccionado
	var indexItem               = parseInt(e.rowIndex);
	
	// Datos del elemento seleccionado
	var pickerDataSelected = e.source.children[0].rows[indexItem];
	
	Ti.API.info("Datos del picker largo: " + JSON.stringify(e));
	
	Ti.API.info("Datos del picker largo 2: " + JSON.stringify(pickerDataSelected));
	
});*/

// FUNCION AL APLICAR UN CAMBIO EN EL PICKER SOPORTE

/*$.pickerTypeSupport.addEventListener("change", function(e) {
	
	// index del elemento seleccionado
	var indexItem               = parseInt(e.rowIndex);
	
	// Label
	var labelInputOutputHeightSH  = $.labelInputOutputHeight;
	
	// Picker Altura de entrada y salida
	var pickerInputOutputHeightSH = $.pickerInputOutputHeight;
	
	//JSON.stringify(e.source.children[0].rows[1])
	//Ti.API.info(JSON.stringify(e));
	Ti.API.info("Index Picker Support: " + JSON.stringify(e.rowIndex));
	
	// Preguntamos cual elemento se selecciono
	if (indexItem == 1 || indexItem == 0) {
		
		// Mostramos Label
		labelInputOutputHeightSH.show();
		
		// Mostramos picker
		pickerInputOutputHeightSH.show();
		
	} else if (indexItem == 2) {
		
		// Ocultamos Label
		labelInputOutputHeightSH.hide();
		
		// Oculatamos picker
		pickerInputOutputHeightSH.hide();
		
		// Determina si se muestra el indicador de selección visual.
		// Si es true, el indicador de selección está habilitado.
		pickerInputOutputHeightSH.selectionIndicator = true;
		
		// Selecciona la fila de una columna.
		pickerInputOutputHeightSH.setSelectedRow(0, 0, false);
		
	};
	
});*/

// FUNCION AL APLICAR UN CAMBIO EN EL PICKER SERIE DE LA BANDA

/*$.pickerBandSerie.addEventListener("change", function(e) {
	
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
	
});*/

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
			fillLongGradePicker(responseWS.longs, responseWS.grade);
			
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
			//Ti.API.info("Respuesta obtenida por el WS: " + this.responseText);
			
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

function fillLongGradePicker(objOptionsLongPicker, objOptionsGradePicker)
{
	// picker
	var pickerLongGrade = $.pickerLongGrade;
	
	// Label
	var labelLongGrade  = $.labelLongGrade;
	
	// Objeto
	var objDataFull     = {};
	
	// Dependiendo el tipo de transportador hacemos una accion
	if (typeConveyor == "R") {
		
		// Asignamos el texto
		labelLongGrade.setText("Largo (Pulg):");
		
		// Objeto a recorrer
		objDataFull = objOptionsLongPicker;
		
	} else if(typeConveyor == "C"){
		
		// Asignamos el texto
		labelLongGrade.setText("Grado:");
		
		// Objeto a recorrer
		objDataFull = objOptionsGradePicker;
		
	};
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objDataFull.forEach(function(optLongGrade){
		
		var row = Ti.UI.createPickerRow({
			id       : optLongGrade.id,
			title    : optLongGrade.measure,
			keyshort : optLongGrade.measure
			//title : optLong.description
		});
		
		pickerLongGrade.add(row);
		pickerLongGrade.selectionIndicator = true;
		pickerLongGrade.setSelectedRow(0, 0, false);
		
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
			id       : optBandSerie.id,
			title    : optBandSerie.serieBand,
			keyshort : optBandSerie.serieBand
		});
		
		pickerBandSerie.add(row);
		pickerBandSerie.selectionIndicator = true;
		pickerBandSerie.setSelectedRow(0, 0, false);
		
	});
	
	// FUNCION AL APLICAR UN CAMBIO EN EL PICKER SERIE DE LA BANDA
	
	pickerBandSerie.addEventListener("change", function(e) {
		
		Ti.API.info("INICIANDO CAMBIO EN PICKER SERIE DE BANDA!");
	
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
			id       : "",
			title    : "Seleccione!",
			keyshort : ""
	});
	
	// Agregamos la fila al combo
	pickerBandMaterial.add(rowDef);
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsBandMaterialPicker.forEach(function(optBandMaterial){
		
		// Creamos las filas dinamicamente
		var row = Ti.UI.createPickerRow({
			id       : optBandMaterial.id,
			title    : optBandMaterial.materialBand,
			keyshort : optBandMaterial.keyShort
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
			id       : "",
			title    : "Seleccione!",
			keyshort : ""
	});
	
	// Agregamos la fila al combo
	pickerUsefulWidth.add(rowDef);
	
	// RECORREMOS EL OBJETO QUE LLEGA
	objOptionsUsefulWidthPicker.forEach(function(optUsefulWidth){
		
		var row = Ti.UI.createPickerRow({
			id       : optUsefulWidth.id,
			title    : optUsefulWidth.measure,
			keyshort : optUsefulWidth.measure
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
			id       : optTypeSupport.id,
			title    : optTypeSupport.support,
			keyshort : optTypeSupport.keyShort
		});
		
		pickerTypeSupport.add(row);
		pickerTypeSupport.selectionIndicator = true;
		pickerTypeSupport.setSelectedRow(0, 0, false);
		
	});
	
	// FUNCION AL APLICAR UN CAMBIO EN EL PICKER SOPORTE
	
	pickerTypeSupport.addEventListener("change", function(e) {
		
		Ti.API.info("HAY CAMBIO EN EL PICKER SOPORTE!");
	
		// index del elemento seleccionado
		var indexItem               = parseInt(e.rowIndex);
		
		// Label
		var labelInputOutputHeightSH  = $.labelInputOutputHeight;
		
		// Picker Altura de entrada y salida
		var pickerInputOutputHeightSH = $.pickerInputOutputHeight;
		
		//JSON.stringify(e.source.children[0].rows[1])
		//Ti.API.info(JSON.stringify(e));
		Ti.API.info("Index Picker Support: " + JSON.stringify(e.rowIndex));
		
		// Preguntamos cual elemento se selecciono
		if (indexItem == 1 || indexItem == 0) {
			
			// Mostramos Label
			labelInputOutputHeightSH.show();
			
			// Mostramos picker
			pickerInputOutputHeightSH.show();
			
		} else if (indexItem == 2) {
			
			// Ocultamos Label
			labelInputOutputHeightSH.hide();
			
			// Oculatamos picker
			pickerInputOutputHeightSH.hide();
			
			// Determina si se muestra el indicador de selección visual.
			// Si es true, el indicador de selección está habilitado.
			pickerInputOutputHeightSH.selectionIndicator = true;
			
			// Selecciona la fila de una columna.
			pickerInputOutputHeightSH.setSelectedRow(0, 0, false);
			
		};
		
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
			id       : optInputOutputHeight.id,
			title    : optInputOutputHeight.height,
			keyshort : optInputOutputHeight.height
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
			id       : optDriveUnit.id,
			title    : optDriveUnit.name,
			keyshort : optDriveUnit.keyShort
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
			id       : optSpeed.id,
			title    : optSpeed.speed,
			//title  : optSpeed.description
			keyshort : optSpeed.speed
		});
		
		pickerSpeed.add(row);
		pickerSpeed.selectionIndicator = true;
		pickerSpeed.setSelectedRow(0, 0, false);
		
	});
	
}

// EJECUTAMOS LA FUNCION GLOBAL PARA LLENAR LOS COMBOS

getAllOptionsPickerGlobal(idConveyorArg);