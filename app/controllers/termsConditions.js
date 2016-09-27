// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;



function confirmPurchase(e) {
	$.alertDialogTermsCond.show();
	/**/
}

$.btnCan.addEventListener('click', function(e){
	//alert(e.source.getParent().special);
	var winTermsConditions = $.winTermsConditions.close();
});

$.alertDialogTermsCond.addEventListener('click', function(e) {
		if (e.index === e.source.cancel) {
			Ti.API.info('The cancel button was clicked');
		} else {
			var tfConfirmPassword = $.tfPass;
			
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