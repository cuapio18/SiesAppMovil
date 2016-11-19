// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("ARGUMENTOS RECIBIDOS:" + JSON.stringify(args));

// Modelos de la cotizacion
var objModelsConveyorsQuotation = args;

// EJECUTAMOS LA FUNCION

getAllModelsConveyorsQuotation(objModelsConveyorsQuotation);

// FUNCION QUE GENERA LOS MODELOS DE LA COTIZACION

function getAllModelsConveyorsQuotation(modelsConvQuotaion) {
	
	// Array para guardar los datos
	var items = [];
	
	// RECORREMOS EL OBJETO
	modelsConvQuotaion.forEach(function(model, idx){
		
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

function saveQuotation(e) {
	
	// Limpiamos el valor del id de la cotizacion
	Alloy.Globals.ID_GLOBAL_QUOTATION = 0;
	
	// Venta principal de cotizaciones
	var winHomeQuotations = Alloy.createController('home').getView();
	
	// Abrimos ventana
	winHomeQuotations.open();
}

//$.btnOne.addEventListener('buyQuotation()');

function btnOneQuotation(e)
{
	//alert(e);
	/*var ventanaTerminosCondiciones = Ti.UI.createWindow({
		modal: true,
		title: 'Terminos y condiciones'
	});*/
	
	/*var texto = Ti.UI.createLabel({
		text : '',
		width : Ti.UI.SIZE,
		height: Ti.UI.SIZE
	});*/
	
	//ventanaTerminosCondiciones.add(texto);
	var winTermsConditions = Alloy.createController('termsConditions').getView();
	
	winTermsConditions.open();
}

var dialogModelConv;
var myArrayModelConv    = ['Eliminar modelo', 'Ver accesorios', 'Ver modelo', 'Cancelar' ];
var optsDialogModelConv = {
	title: 'Modelo',
	cancel: 3,
	options: myArrayModelConv
};


function longModelConv(e) {
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
			 /*default:
			 	alert('esa opcion no existe.');
			 	break;*/
		}
		//Ti.API.info("Delete ListView Raw = "+ JSON.stringify(e) );
		//Ti.API.info(item.modelConveyor.text);
	});
}

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
