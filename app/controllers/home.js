// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// *****************************
// CLICK EN CERRAR SESION
// *****************************
function logutApp(e)
{
	Ti.API.info("Info del evento: " + e);
	//alert(e);
	// Creamos una ventana tipo dialog
	var dialog = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Confirmar', 'Cancelar'],
		message : '¿Cerrar la sesión de sies?',
		title : 'Cerrar sesión',
		//persistent:true,
		//canceledOnTouchOutside: true
	});
	//dialog.
	//Al presionar sobre un boton del dialogo
	dialog.addEventListener('click', function(e){
		//if (e.index === e.source.cancel)
		if(e.index === 0) {
			//alert(JSON.stringify(e));
			// abrimos ventana de login
			var winLogin = Alloy.createController('index').getView();
			winLogin.open();
		};
	});
	
	//Mostramos el dialogo
	dialog.show();
	
	// Cerramos ventana principal
	//e.source.close();
}

// *****************************
// MOSTRAR AJUSTES
// *****************************
function showSettings(e) {
	
	var winSettings = Alloy.createController('settings').getView();
	winSettings.open();
	
	winSettings.addEventListener('open', function(e){
		var aBS = winSettings.activity.actionBar;
		aBS.displayHomeAsUp = true;
		aBS.onHomeIconItemSelected = function(e) {
			//alert(e);
			winSettings.close();
		};
	});
	
}

// *****************************
// CLICK EN EL BOTON FISICO VOLVER
// *****************************
$.tabGroupQuotations.addEventListener('android:back', function(e){
	//alert(e);
	e.cancelBubble = true;
	var winLogin = Alloy.createController('index').getView();
	winLogin.open();
});
