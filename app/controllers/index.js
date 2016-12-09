// VENTANA PARA MOSTRAR EL ACTIVITY INDICATOR
var winActivityIndicator = Ti.UI.createWindow({
	theme : "Theme.AppCompat.Light.NoActionBar",
	backgroundColor : "#000",
	opacity : .9,
	fullscreen : true
});

// ACTIVITY INDICATOR
var activityIndicator = Ti.UI.createActivityIndicator({
	color : "#ccc",
	font : {
		fontFamily : 'Helvetica Neue',
		fontSize : 26,
		fontWeight : 'bold'
	},
	//message: 'Espere...',
	style : Ti.UI.ActivityIndicatorStyle.BIG_DARK,
	//top: 10,
	//left: 10,
	height : Ti.UI.SIZE,
	width : Ti.UI.SIZE
});

// AGREGAMOS EL ACTIVITY INDICATOR A LA VENTANA
winActivityIndicator.add(activityIndicator);

// CAMPOS DE USUARIO Y CONTRASEÑA
var inputUser = $.tfuser;
var inputPass = $.tfpass;

// CLICK EN EL BOTON INICIAR SESION
$.btnlogin.addEventListener('click', function() {

	// Validamos si el usuario y contrasena estan vacios
	if (inputUser.value != '' && inputPass.value != '') {

		// Llamamos a la funcion iniciar sesion
		logIn(inputUser.value.toString(), inputPass.value.toString());

	} else {
		Ti.UI.createAlertDialog({
			message : 'Se requiere nombre de usuario / contraseña',
			title : 'Alerta',
			ok : 'Aceptar',
		}).show();
	}

});

// **************************************************
// INICIAR SESION
// **************************************************
function logIn(userName, password) {

	// Abrimos la pantalla del activity indcator
	winActivityIndicator.open();

	// Mostramos el indicador de espera
	activityIndicator.show();

	// Objeto con los datos a enviar
	var dataLogin = {
		"userName" : userName,
		"password" : password
	};

	//Ti.API.info(JSON.stringify(dataLogin));

	// URL del servicio de login
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/login";

	// Cliente para consumir el servicio
	var client = Ti.Network.createHTTPClient({

		// Función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {

			// Respuest del servicio web
			var response = JSON.parse(this.responseText);

			//Ti.API.info("Respuesta del servicio: " + JSON.stringify(response));

			// Llamamos a la funcion recordar usuario
			rememberUser();

			// Guardamos en una variable global la respuesta
			Alloy.Globals.PROPERTY_INFO_USER = response;

			// Esperamos algunos segundos
			setTimeout(function() {

				//Ti.API.info("Propiedad global de usuarios: " + JSON.stringify(Alloy.Globals.PROPERTY_INFO_USER));
				//Ti.API.info("ID Usuario: " + response.userLogin.id);
				//Ti.API.info("Nombre Usuario: " + response.userLogin.name);
				//Ti.API.info("Estatus: " + response.logeado);

				// VALIDAMOS LA RESPUESTA DEL SERVICIO
				if (response.logeado == true) {
					//Ti.API.info("Usuario logedo correctamente!.");
					// Abrimos la ventana de inicio
					var winHome = Alloy.createController('home').getView();
					winHome.open();

					// Cerramos la ventana del activity indicator
					winActivityIndicator.close();

					// Ocultamos activity indicator
					activityIndicator.hide();
					//Quitamos la ventana de login
					//$.index.remove();
				} else {

					// Cerramos la ventana del activity indicator
					winActivityIndicator.close();

					// Ocultamos activity indicator
					activityIndicator.hide();

					//alert("Usuario o Contraseña incorrectos.");
					Ti.UI.createAlertDialog({
						message : 'Usuario o Contraseña incorrectos.',
						title : 'Alerta',
						ok : 'Aceptar',
					}).show();
				}

			}, 3000);

		},
		// Función llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {

			// Cerramos la ventana del activity indicator
			winActivityIndicator.close();

			// Ocultamos activity indicator
			activityIndicator.hide();

			Ti.UI.createAlertDialog({
				message : 'Ocurrio un error. Intentalo de nuevo.',
				title : 'Error',
				ok : 'Aceptar',
			}).show();

			// Cerramos la ventana del activity indicator
			//winActivityIndicator.close();

			// Ocultamos activity indicator
			//activityIndicator.hide();

			//alert(e.error);

			//Ti.API.debug(e);
			//Ti.API.info(e.error);
		},
		timeout : 15000 // Milisegundos

	});

	// Preparar la conexion
	client.open("POST", url);

	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	// Enviamos la solicitud
	client.send(JSON.stringify(dataLogin));

}

// CLICK EN EL BOTON RECORDAR CONTRASEÑA
$.labelforgetpassword.addEventListener('click', function() {
	var winForgPass = Alloy.createController('rememberPassword').getView();
	winForgPass.open(/*{
	 activityEnterAnimation : Ti.Android.R.anim.fade_in,
	 activityExitAnimation : Ti.Android.R.anim.fade_out
	 }*/);

	winForgPass.addEventListener("open", function(evt) {
		var actionBar = winForgPass.activity.actionBar;
		actionBar.displayHomeAsUp = true;
		actionBar.onHomeIconItemSelected = function(e) {
			//Ti.API.info(evt);
			//alert(e);
			//$.miVentana2.close();
			winForgPass.close();
		};
	});

});

// BOTON RECORDAR USURIO
var basicSwitch = $.basicSwitch;

// CLICK EN EL BOTON RECORDAR USUARIO
basicSwitch.addEventListener("change", function(e) {

	// Llamamos a la funcion recordar usuario
	rememberUser();

});

// FUNCION PARA RECORDAR EL USUARIO
function rememberUser() {

	// Valor del switch
	var valueSwitch = basicSwitch.value;
	// Vlor del campo usurio
	var valorUsuarioSies = $.tfuser.value;

	// Validamos el valor del switch
	if (valueSwitch == true) {

		//Ti.API.info("Recordar usuario encendido.");

		// Creamos una propiedad en la app con un valor true
		Ti.App.Properties.setBool("propRememberUser", true);

		// Creamos propiedad para guardar el valor del usuario
		Ti.App.Properties.setString("propValUserSies", valorUsuarioSies.toString());

	} else if (valueSwitch == false) {

		//Ti.API.info("Reordar usuario apagado.");

		// Eliminamos la propiedad de la app
		Ti.App.Properties.removeProperty("propRememberUser");

		//Eliminamos la propiedad de la app
		Ti.App.Properties.removeProperty("propValUserSies");

	}

	//Ti.API.info("Usuario: " + inputUser.value.toString());
	//Ti.API.info(Ti.App.Properties.getBool("propRememberUser"));
	//Ti.API.info(Ti.App.Properties.hasProperty('propRememberUser'));
	//Ti.API.info(Ti.App.Properties.listProperties());
	//Ti.API.info('Switch value: ' + basicSwitch.value);

}

// FUNCION PARA VALIDAR SI EL USUARIO ESTA GUARDADO O NO
function validateRememberUser() {
	//Ti.API.info("URL GLOBAL: " + Alloy.Globals.URL_GLOBAL_SIES);
	// Asignamos en una variable el valor de la propiedad
	var propRememberUser = Ti.App.Properties.hasProperty("propRememberUser");

	//Ti.API.info("PROPERTIES: " + Ti.App.Properties.listProperties());

	// Validamos si existe o no la propiedad en la app
	if (propRememberUser) {

		//Ti.API.info("Te recuerdo");
		//Ti.API.info(Ti.App.Properties.getString("propValUserSies"));

		// Asignamos un valor al input user
		inputUser.value = Ti.App.Properties.getString("propValUserSies");

		// Marcamos el switch como true
		basicSwitch.value = true;

	} else {

		//Ti.API.info("No te recuerdo");

		// Borramos el valor al input user
		inputUser.value = "";

		// Marcamos el switch como false
		basicSwitch.value = false;

	}

}

// EJECUTAMOS FUNCION QUE VALIDA SI EL USUARIO ESTA GUARDADO
validateRememberUser();

// ***************************************
// CLICK EN EL BOTON FISICO VOLVER
// ***************************************

if (Ti.Platform.osname === "android") {

	$.index.addEventListener('android:back', function(e) {

		//Ti.API.info("Click en el boton volver");

		// Cerramos la ventana
		$.index.close();

		// Obtenemos el activity actual
		var activity = Titanium.Android.currentActivity;

		// Terminamos el activity
		activity.finish();

		//return false;

	});

}

// ***************************************
// SE EJECUTA CUANDO SE AABRE UNA VENTANA
// ***************************************

$.index.addEventListener("open", function() {
	// OS_ANDROID
	// Escondemos el actionBar
	if (Ti.Platform.osname === "android")
		$.index.activity.actionBar.hide();
});

// ABRIR VENTANA DE INICIO
$.index.open();

//$.activityIndicator.show();
