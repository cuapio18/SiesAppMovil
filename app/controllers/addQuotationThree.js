// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// Click en el boton siguiente paso de la cotizacción
$.btnAddConveyor.addEventListener('click', function(){
	
	// Ventana del paso numero 4 de la cotizacion
	var winAddQuotationFour = Alloy.createController('addQuotationFour').getView();
	
	// Abrir ventana
	winAddQuotationFour.open();
	
	// CLICK EN EL BOTON REGRESAR
	winAddQuotationFour.addEventListener('open', function(){
		
		var actionBar = winAddQuotationFour.activity.actionBar;
		actionBar.displayHomeAsUp = true;
		actionBar.onHomeIconItemSelected = function(e) {
			winAddQuotationFour.close();
		};
		
	});
	
});
