// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// Click en el boton siguiente paso de la cotizacción
$.btnAcceptConveyor.addEventListener('click', function(){
	
	// Ventana del paso numero 3 de la cotizacion
	var winAddQuotationThree = Alloy.createController('addQuotationThree').getView();
	
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