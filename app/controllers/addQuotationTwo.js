// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Ti.API.info("MODELO DEL TRANSPORTADOR:" + JSON.stringify(args.model));

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
			
			objModelWS = objResponseWS.model;
			
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
	//Ti.API.info("MODELO: " + JSON.stringify(objModelWS));
	// Titulo
	$.labelSubtitleAddQuo.setText(objModelWS.conveyor.conveyor);
	//Ancho
	$.labelAnchuraValor.setText(objModelWS.width.measure + "PLG");
	
	$.labelLongitudValor.setText(objModelWS.longs.measure + "PLG");
	
	$.labelVelocidadValor.setText(objModelWS.speed.speed);
	
	$.labelUnidadMotrizValor.setText(objModelWS.driveUnit.name);
	
	$.labelDenominacionBandaValor.setText(" FLAT TO AZUL FLAT TOP AZUL FLAT TOP AZUL");
}

// Click en el boton siguiente paso de la cotizacción
$.btnAcceptConveyor.addEventListener('click', function(){
	
	// Ventana del paso numero 3 de la cotizacion
	var winAddQuotationThree = Alloy.createController('addQuotationThree', objAccesoriesWS).getView();
	
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