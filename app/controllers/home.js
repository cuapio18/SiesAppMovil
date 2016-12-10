// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

Ti.API.info("ARGUMENTOS RECIBIDOS:" + JSON.stringify(args));

var tabGroupQuotations = $.tabGroupQuotations;

// *****************************
// CLICK EN CERRAR SESION
// *****************************
function logutApp(e) {
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
	dialog.addEventListener('click', function(e) {
		//if (e.index === e.source.cancel)
		if (e.index === 0) {
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

	winSettings.addEventListener('open', function(e) {
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
$.tabGroupQuotations.addEventListener('android:back', function(e) {
	//alert(e);
	//e.cancelBubble = true;
	//var winLogin = Alloy.createController('index').getView();
	//winLogin.open();
	//Ti.API.info(JSON.stringify(e));

	// CREAMOS UN DIALOGO
	var dialogLogout = Ti.UI.createAlertDialog({
		cancel : 1,
		buttonNames : ['Confirmar', 'Cancelar'],
		message : '¿Cerrar la sesión de sies?',
		title : 'Cerrar sesión',
		persistent : true,
		canceledOnTouchOutside : true
	});

	// AL PRESIONAR SOBRE UN BOTON DEL DIALOGO
	dialogLogout.addEventListener('click', function(e) {

		if (e.index === 0) {
			// abrimos ventana de login
			var winLogin = Alloy.createController('index').getView();
			winLogin.open();
		};

	});

	// MOSTRAR EL DIALOGO
	dialogLogout.show();

	return false;
});

/*$.tabgroupsies.addEventListener('open', function(e) {
$.tabgroupsies.setActiveTab(1);
Ti.API.info('****************** activeTab: ' + $.tabgroupsies.getActiveTab().getTitle());
});

function doClick(e){
$.tabgroupsies.setActiveTab(1);
Titanium.API.info("You clicked the button");
};*/

// ACTIVAMOS UN TAB AL CARGAR LA PANTALLA

tabGroupQuotations.addEventListener('open', function(e) {
	// Bandera
	var flagHome = args.flagHomeStatus;

	// Validamos el tipo de accion
	if (flagHome && flagHome == 1) {

		Ti.API.info("Existes");

		// Activamos la tab de modelos
		tabGroupQuotations.setActiveTab(1);

		// Modificamos titulo del tab
		tabGroupQuotations.getActiveTab().setTitle("Editar Cot.");

	} else {

		Ti.API.info("No Existes");

		// Activamo tab de cotizaciones
		tabGroupQuotations.setActiveTab(0);
	};

	// Guardamos el tabgroup en una variable global
	Alloy.Globals.TABGROUP_QUOTATIONS = tabGroupQuotations;

	Ti.API.info('****************** activeTab: ****************** ' + tabGroupQuotations.getActiveTab().getTitle());

	// Action Bar
	var actionBar;

	// Activity
	var activityHomeQ = tabGroupQuotations.activity;

	// Validamos el sistema operativo
	if (Ti.Platform.osname === "android") {

		if (!activityHomeQ) {
			Ti.API.info("No se puede acceder a la barra de acción en una ventana ligera.");
		} else {

			// Action Bar de la ventana
			actionBar = tabGroupQuotations.activity.actionBar;

			// Validamos si existe un actionbar
			if (actionBar) {

				// Agregamos un menu
				activityHomeQ.onCreateOptionsMenu = function(ev) {

					// Menu
					var menu = ev.menu;

					/*
					// Item Menu Settings
					var menuItemSettings = menu.add({
					title        : 'Ajustes',
					//icon         : Ti.Android.R.drawable.ic_menu_add,
					showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
					});

					// Click sobre un item del menu
					menuItemSettings.addEventListener('click', function(e){
					Ti.API.info("I was clicked: " + JSON.stringify(e));
					showSettings(e);
					});
					*/

					// Item Menu Logout
					var menuItemLogout = menu.add({
						title : 'Salir',
						//icon         : Ti.Android.R.drawable.ic_menu_add,
						showAsAction : Ti.Android.SHOW_AS_ACTION_NEVER
					});

					// Click sobre un item del menu
					menuItemLogout.addEventListener('click', function(e) {
						Ti.API.info("I was clicked 2: " + JSON.stringify(e));
						logutApp(e);
					});

				};

				activityHomeQ.invalidateOptionsMenu();

				// Agregamos un titulo
				actionBar.title = "SIES MOVIL";

			};

		};

	};

});

tabGroupQuotations.addEventListener('focus', function(e) {

	var idQuotation = Alloy.Globals.ID_GLOBAL_QUOTATION;
	var activeTabQuo = tabGroupQuotations.getTabs()[0].getActive();
	var titleActiveTabQuo = tabGroupQuotations.getTabs()[1].getTitle();
	//Ti.API.info("EVENT: " + e);
	//Ti.API.info('ID DE COTIZACION: ' + idQuotation);
	//Ti.API.info('TAB ACTIVO: ' + activeTabQuo);
	//Ti.API.info('TITULO TAB ACTIVO: ' + titleActiveTabQuo);

	// Si el id es diferente de 0 - Editar Cot.
	if (idQuotation != 0 && activeTabQuo == true && titleActiveTabQuo == 'Editar Cot.') {

		// Limpimos el id de la cotizacion
		Alloy.Globals.ID_GLOBAL_QUOTATION = 0;

		// Cambiamos el nombre al tab
		tabGroupQuotations.getTabs()[1].setTitle('Nueva Cot.');

		Ti.API.info('ID DE COTIZACION: ' + idQuotation);

	} else {
		Ti.API.info('ID DE COTIZACION: ' + idQuotation);
	};

});

/*tabGroupQuotations.addEventListener('swipe', function(e){

 var activeTabIndex = tabGroupQuotations.tabs.indexOf(tabGroupQuotations.activeTab);

 Ti.API.info("Dirección: " + e.direction);

 if(e.direction === 'right' && activeTabIndex == 1) {

 Ti.API.info("Dirección: " + e.direction);

 //tabGroup.setActiveTab(activeTabIndex - 1);

 } else if(e.direction === 'left' && activeTabIndex == 0) {

 Ti.API.info("Dirección: " + e.direction);
 //tabGroup.setActiveTab(activeTabIndex + 1);

 }

 });*/
