// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// {"idQuotation":9,"comment":"m ,jvb klklhlk","idClient":3,"password":""}
Ti.API.info("ARGUMENTOS RECIBIDOS:" + JSON.stringify(args));

// FUNCION CONFIRMAR COMPRA

function confirmPurchase(e) {
	// Mostramos el alert dialog
	$.alertDialogTermsCond.show();
}

// CLICK SOBRE ALGUNA OPCION DEL ALERT DIALOG

$.alertDialogTermsCond.addEventListener('click', function(e) {
		
		// Validamos la opcion presionada
		if (e.index === e.source.cancel) {
			Ti.API.info('The cancel button was clicked');
		} else {
			
			// Campo de contraseña
			var tfConfirmPassword = $.tfPass;
			
			// Validamos si ya se escribio un password
			if(tfConfirmPassword.value == '') {
				alert('La contraseña es obligatoria');
			} else{
				tfConfirmPassword.value = '';
			}
		}
		
		Ti.API.info('e.cancel: ' + e.cancel);
		Ti.API.info('e.source.cancel: ' + e.source.cancel);
		Ti.API.info('e.index: ' + e.index);
		
});

// CLICK EN EL BOTON CANCELRA COMPRA DE COTIZACION

$.btnCan.addEventListener('click', function(e){
	//alert(e.source.getParent().special);
	var winTermsConditions = $.winTermsConditions.close();
});

function outputState(){
    Ti.API.info('Switch value: ' + $.switchSwitchConfirmBuy.value);
}