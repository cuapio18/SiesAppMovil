// VENTANA PARA MOSTRAR EL ACTIVITY INDICATOR
var winActivityIndicator = Ti.UI.createWindow({
	theme: "Theme.AppCompat.Light.NoActionBar",
	backgroundColor : "#000",
	opacity: .9,
	fullscreen : true
}); 

// ACTIVITY INDICATOR
var activityIndicator = Ti.UI.createActivityIndicator({
	color: "#ccc",
	font: {fontFamily: 'Helvetica Neue', fontSize: 26, fontWeight: 'bold'},
	//message: 'Espere...',
	style: Ti.UI.ActivityIndicatorStyle.BIG_DARK,
	//top: 10,
	//left: 10,
	height: Ti.UI.SIZE,
	width: Ti.UI.SIZE
});

// AGREGAMOS EL ACTIVITY INDICATOR A LA VENTANA
winActivityIndicator.add(activityIndicator);

// CAMPOS DE USUARIO Y CONTRASEÑA
var inputUser = $.tfuser;
var inputPass = $.tfpass;

// CLICK EN EL BOTON INICIAR SESION
$.btnlogin.addEventListener('click', function(){
	
	// Validamos si el usuario y contrasena estan vacios
	if( inputUser.value != '' && inputPass.value != '' ) {
		
		winActivityIndicator.open();
		winActivityIndicator.addEventListener('open', function(e){
			activityIndicator.show();
			
			setTimeout(function(){
				
				// Abrimos la ventana de inicio
				var winHome = Alloy.createController('home').getView();
				winHome.open();
				
				// Cerramos la ventana del activity indicator
				e.source.close();
				
				// Occultamos activity indicator
				activityIndicator.hide();
				
				//Quitamos la ventana de login
				//$.index.remove();
				
			}, 3000);
			
		});
		
				
	} else {
		alert("Se requiere nombre de usuario / contraseña");
	}

	//activityIndicator.show();
	
});


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

// ABRIR VENTANA DE INICIO
$.index.open();

//$.activityIndicator.show();
