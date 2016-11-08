// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("MODELO DEL TRANSPORTADOR:" + JSON.stringify(args));

// Modelo
var modelConveyor = args.model;
var objAccesoriesWS;
var objModelWS;

// FUNCION PARA OBTENER EL MODELO Y LOS ACCESORIOS DEL TRANSPORTADOR

function getModelAndAccesoriesOfConveyor() {
	
	// OBJ DEL MODELO DEL TRANSPORTADOR 
	var objModelConveyor = {
		"model" : modelConveyor
	};
	//Ti.API.info("OBJETO MODELO TRASNPORTADOR: " + JSON.stringify(objModelConveyor));
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/searchModel";
	//Ti.API.info("URL: " + url);
	var client = Ti.Network.createHTTPClient({
		
		onload : function(e) {
			
			var objResponseWS = JSON.parse(this.responseText);
			
			objAccesoriesWS   = objResponseWS.acccesorie;
			
			objModelWS        = objResponseWS.model;
			
			// FUNCION PARA MOSTRAR LOS DATOS DEL TRANSPORTADOR
			dataModelConveyor(objModelWS);
			 
			//Ti.API.info("ResponseWS: " + this.responseText);
			//Ti.API.info("ACCESORIOS: " + JSON.stringify(objAccesoriesWS));
			//Ti.API.info("MODELO: " + JSON.stringify(objAccesoriesWS));
			
		},
		onerror : function(e) {
			Ti.API.debug(e.error);
		},
		timeout: 5000
		
	});
	
	client.open("POST", url);
	
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	
	client.send(JSON.stringify(objModelConveyor));
	
}

// EJECUTAMOS LA FUNCION PARA OBTENER EL MODELO Y ACCESORIOS
getModelAndAccesoriesOfConveyor();

function dataModelConveyor(objModelWS)
{
	Ti.API.info("MODELO: " + JSON.stringify(objModelWS));
	
	// Titulo
	$.labelTitleConveyor.setText(objModelWS.conveyor.conveyor + " - " + objModelWS.conveyor.keyShort);
	
	// Modelo del transportador
	$.labelTitleModel.setText(objModelWS.model);
	
	// Precio
	$.labelTitlePrice.setText("$" + objModelWS.priceModel);
	
	// Largo o Grado
	$.labelValueLongGrade.setText(objModelWS.longs.measure);
	
	// Serie de la banda
	$.labelValueBandSerie.setText(objModelWS.serieBand.serieBand);
	
	// Material de la banda
	$.labelValueBandMaterial.setText(objModelWS.materialBand.materialBand);
	
	// Ancho util
	$.labelValueUsefulWidth.setText(objModelWS.width.measure + " PLG");
	
	// Tipo de soporte
	$.labelValueTypeSupport.setText(objModelWS.support.support);
	
	// Altura de entrada y alida
	$.labelValueInputOutputHeight.setText(objModelWS.heightInput.height);
	
	// Unidad motriz
	$.labelValueDriveUnit.setText(objModelWS.driveUnit.name);
	
	// Velocidad
	$.labelValueSpeed.setText(objModelWS.speed.speed);
	
	// Descripcion
	$.labelValueDescription.setText("Descripción: " + objModelWS.description);
	
}

// Click en el boton siguiente paso de la cotizacción
$.btnAcceptConveyor.addEventListener('click', function(){
	
	// Objeto que vamos a enviar a la vista 
	var objModelAndAccesoriesWS = {
		model      : objModelWS,
		accesories : objAccesoriesWS
	};
	
	// Ventana del paso numero 3 de la cotizacion
	var winAddQuotationThree = Alloy.createController('addQuotationThree', objModelAndAccesoriesWS).getView();
	
	// Abrir ventana
	winAddQuotationThree.open();
	
	// CLICK EN EL BOTON REGRESAR
	winAddQuotationThree.addEventListener('open', function(){
		
		var actionBar = winAddQuotationThree.activity.actionBar;
		actionBar.displayHomeAsUp = true;
		actionBar.onHomeIconItemSelected = function(e) {
			winAddQuotationThree.close();
		};
		
	});
	
});