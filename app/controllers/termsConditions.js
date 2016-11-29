// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// {"idQuotation":9,"comment":"m ,jvb klklhlk","idClient":3,"password":""}
Ti.API.info("ARGUMENTOS RECIBIDOS:" + JSON.stringify(args));

// CREAMOS UN INDICADOR

// Ventana para mpstrar el indicador
var winAddActivityIndicator = Ti.UI.createWindow({
	theme: "Theme.AppCompat.Light.NoActionBar",
	backgroundColor : "#000",
	opacity: .9,
	fullscreen : true
});

// Creamos activity Indicator
var activityIndicator = Ti.UI.createActivityIndicator({
	color   : '#ccc',
	font    : {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
	message : 'Espere...',
	style   : Ti.UI.ActivityIndicatorStyle.BIG_DARK,
	//top   : 10,
	//left  : 10,
	height  : Ti.UI.SIZE,
	width   : Ti.UI.SIZE
});

// The activity indicator must be added to a window or view for it to appear
// Agregamos el indicador a la ventana
winAddActivityIndicator.add(activityIndicator);

// Cuando la ventana se muestra
/*winAddActivityIndicator.addEventListener('open', function(e) {
	
	Ti.API.info("Abriendo Ventana del Indicador");
	
	activityIndicator.show();
	// do some work that takes 6 seconds
	// ie. replace the following setTimeout block with your code
	setTimeout(function() {
		e.source.close();
		activityIndicator.hide();
	}, 6000);
});*/

// FUNCION CONFIRMAR COMPRA

function confirmPurchase(e) {
	
	Ti.API.info('switchTermsConditions: ' + switchTermsConditions);
			
	// Validar el valor del switch
	if (switchTermsConditions == true) {
		
		// Mostramos el alert dialog
		$.alertDialogTermsCond.show();
		
	} else {
		alert("Tienes que aceptar los terminos y condiciones para poder realizar tu compra.");
	};
	
}

// CLICK SOBRE ALGUNA OPCION DEL ALERT DIALOG

$.alertDialogTermsCond.addEventListener('click', function(e) {
	
	// Campo de contraseña
	var tfConfirmPassword = $.tfPass;
		
	// Validamos la opcion presionada
	if (e.index === e.source.cancel) {
		Ti.API.info('The cancel button was clicked');
		// Limpiamos campo de contraseña
		tfConfirmPassword.value = '';
	} else {
			
		var objJsonBuyQuotation = {
			idQuotation : args.idQuotation,
			comment     : args.comment,
			idClient    : args.idClient,
			password    : tfConfirmPassword.value
		};
				
		Ti.API.info("JSON PARA COMPRAR COT.: " + JSON.stringify(objJsonBuyQuotation));
			
		// Validamos si ya se escribio un password
		if(tfConfirmPassword.value == '') {
				
			alert('La contraseña es obligatoria');
					
		} else {
			
			// Abrimos ventana del Indicador
			winAddActivityIndicator.open();
			// Mostramos el indicador
			activityIndicator.show();
					
			tfConfirmPassword.value = '';
					
			// URL del servicio rest
			var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/confirmQuotationBuy";
					
			// Cliente para realizar la peticion
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {
					
					Ti.API.info("Received text: " + this.responseText);
					
					// Parseamos la respuesta a objeto
					var responseWS = JSON.parse(this.responseText);
					 
					 setTimeout(function() {
					 	/*
					 	// Cuando la ventana se cierra
						winAddActivityIndicator.addEventListener('close', function(e) {
							
							Ti.API.info("Cerrando Ventana del Indicador");
							
							// Ocultamos el indicador
							//activityIndicator.hide();
							
						});*/
				        
				    	// Cerramos la ventana del Indicador
						winAddActivityIndicator.close();
						
						// Cerramos el indicador
						activityIndicator.hide();
				    
				    	// Validamos la respuesta
						if (responseWS.stateSave == false) {
							alert("No se puede realiar la compra.\nIntentalo nuevamente.");
						} else if(responseWS.stateSave == true) {
								
							// Limpiamos el valor del id de la cotizacion
							Alloy.Globals.ID_GLOBAL_QUOTATION = 0;
										
							// Venta principal de cotizaciones
							var winHomeQuotations = Alloy.createController('home').getView();
									
							// Abrimos ventana
							winHomeQuotations.open();
									
						};
						
					}, 3000);
							
				},
				onerror : function(e) {
					Ti.API.info("ERROR: " + e.error);
					// Cerramos la ventana del Indicador
					winAddActivityIndicator.close();
						
					// Cerramos el indicador
					activityIndicator.hide();
					
					alert("Ocurrio un error.\nIntentalo nuevamente.");
				},
				timeout : 10000
				
			});
					
			// Preparamos conexion
			client.open("POST", url);
					
			// Establecer la cabecera para el formato JSON correcta
			client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
					
			// Enviar petición
			client.send(JSON.stringify(objJsonBuyQuotation));
				
		}
	}
		
	Ti.API.info('e.cancel: ' + e.cancel);
	Ti.API.info('e.source.cancel: ' + e.source.cancel);
	Ti.API.info('e.index: ' + e.index);
		
});

// CLICK EN EL BOTON CANCELRA COMPRA DE COTIZACION

$.btnCan.addEventListener('click', function(e) {
	//alert(e.source.getParent().special);
	var winTermsConditions = $.winTermsConditions;
	
	// Cerramos ventana
	winTermsConditions.close();
});

// Switch Terminos y Condiciones
var switchTermsConditions = "";

// Al cambiar el valor del switch
function outputState() {
    Ti.API.info('Switch value: ' + $.switchTermsConditions.value);
    
    // Asignamos un valor a la variable
    switchTermsConditions = $.switchTermsConditions.value;
}