// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// ID DEL USUARIO
var idUsuarioSession = Alloy.Globals.PROPERTY_INFO_USER.userLogin.id;
//Ti.API.info("idUsuarioSession: " + idUsuarioSession);

var listViewQuot = $.listViewQuotations;

// FUNCION PARA OBTENER LAS COTIZACIONES

getAllQuotations(idUsuarioSession);

// CLICK EN UN ELEMENTO DE LA LISTA
listViewQuot.addEventListener('itemclick', function(e) {

	// Elemento seleccionado
	var itemClickQuotation = e.section.getItemAt(e.itemIndex);

	//Ti.API.info("ITEM:" + JSON.stringify(itemClickQuotation));

	// Variable global para almacenar los datos de la cotizacion
	Alloy.Globals.ALL_DATA_QUOTATION = itemClickQuotation;
	//Ti.API.info("Alloy.Globals.ALL_DATA_QUOTATION: " + JSON.stringify(Alloy.Globals.ALL_DATA_QUOTATION));

	// Ventana
	var windDetailQuotation = Alloy.createController('detailQuotation', itemClickQuotation).getView();

	// Abrimos la ventana
	windDetailQuotation.open();

});

// FUNCION QUE OBTIENE LAS COTIZACIONES
function getAllQuotations(idUser) {

	// OBJ CON EL ID DEL USUARIO
	var objUserSes = {
		"id" : idUser
	};

	//var url = "https://api.randomuser.me/?nat=es&results=" + parseInt(numQuo);
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/searchQuotationSession";

	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			//Ti.API.info("Received text: " + this.responseText);

			var responseWS = JSON.parse(this.responseText);
			//Ti.API.info("ResponseWSQuotations: " + this.responseText);
			// FUNCION QUE GENERA LA LISTA DE COTIZACIONES
			createListAllQuotations(responseWS.quotations);
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			//Ti.API.info(e.error);
			Ti.UI.createAlertDialog({
				message : 'Ocurrio un error.\nIntentalo nuevamente.',
				title : 'Error',
				ok : 'Aceptar',
			}).show();
		},
		timeout : 55000 // in milliseconds
	});
	
	// Prepare the connection.
	client.open("POST", url);

	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	// Send the request.
	client.send(JSON.stringify(objUserSes));

}

// FUNCION QUE GENERA LA LISTA DE COTIZACIONES
function createListAllQuotations(quotations) {

	//Ti.API.info("Informacion recibida: " + quotations);

	var items = [];
	//var dateQuo = '';
	//var cont = 1;

	// RECORREMOS LA LISTA DE COTIZACIONES
	quotations.forEach(function(quotation, idx) {

		// FECHA DE COTIZACION
		var dateQuo = new Date(parseInt(quotation.creationDate));
		// dateQuo.toLocaleDateString()

		// Formato fecha
		var dateFormatQuo = dateQuo.getDate() + "/" + (dateQuo.getMonth() + 1) + "/" + dateQuo.getFullYear();
		var urlImgCon = "http://" + Alloy.Globals.URL_GLOBAL_SERVER_SIES + "/sies-admin" + '/resources/images/TSC.png';

		// **************** Thumbnail Image ********************

		// ************************************

		// GENERAMOS OBJETO CON DE COTIZACIONES
		items.push({
			properties : {
				searchableText : 'Cotización ' + quotation.id + ' ' + dateFormatQuo + ' ' + quotation.status.nameStatus
			},
			img_quotation : {
				image : urlImgCon
				//image: 'https://www.logismarket.com.ar/ip/quintino-sistemas-transportadores-para-envios-y-correos-sistemas-transportadores-para-envios-y-correos-688836-FGR.jpg'
			},
			title_quotation : {
				text : 'Cotización ' + quotation.id,
				id : quotation.id,
				idx : parseInt(idx),
				statusQuo : quotation.status.id,
				commentQuo : quotation.comment,
				idClientQuo : quotation.client.id
			},
			date_quotation : {
				text : dateFormatQuo
			},
			status_quotation : {
				text : quotation.status.nameStatus
			},
		});

		// ASIGNAMOS A LA LISTA LAS COTIZACIONES
		$.listViewQuotations.sections[0].setItems(items);

	});

}

// DIALOGO DE COTIZACION
var dialogQuotation;
var arrayDialogQuo = ['Editar', 'Eliminar', 'Comentarios', 'Cancelar'];
var optsDialogQuo = {
	title : "Cotización",
	cancel : 3,
	options : arrayDialogQuo,
	//selectedIndex : 3, // Define la opción seleccionada por defecto.
	destructive : 0, // Índice para definir la opción destructiva, indicada por una señal visual cuando se procesa.
	bubbleParent : false
};

// Datos de la cotizacion
var dataItemSelected = {};

// Index del elemento sellecionado
var itemIndexQuotation;

// FUNCION AL DAR CLICK PROLONGADO SOBRE ALGUN ELEMENTO

function longCB(e) {

	// Indice del elemento presionado
	itemIndexQuotation = e.itemIndex;

	// Datos del elemento presionado
	dataItemSelected = e.section.items[parseInt(itemIndexQuotation)];
	//Ti.API.info("LONGCB: " + JSON.stringify(dataItemSelected));

	// Variable global para almacenar los datos de la cotizacion
	Alloy.Globals.ALL_DATA_QUOTATION = dataItemSelected;
	//Ti.API.info("Alloy.Globals.ALL_DATA_QUOTATION: " + JSON.stringify(Alloy.Globals.ALL_DATA_QUOTATION));

	//alert(JSON.stringify(e.section.items[parseInt(itemIndex)].title_quotation.text ));
	// Creamos dialogo
	dialogQuotation = Ti.UI.createOptionDialog(optsDialogQuo);
	// Mostramos
	dialogQuotation.show();
	// Al seleccionar alguna opción del dialogo
	dialogQuotation.addEventListener('click', onSelectDialog);

};

// FUNCION AL PRESIONAR ALGUNA OPCION DEL ALERTA DIALOGO

function onSelectDialog(event) {

	//Ti.API.info("Opción seleccionada: " + JSON.stringify(event));
	//Ti.API.info("Cotizacion seleccionada: " + JSON.stringify(dataItemSelected));

	// indice del elemento seleccionado
	var selectedIndexDialogQuotation = event.source.selectedIndex;

	//Ti.API.info("Index del elemento seleccionado: " + parseInt(selectedIndex));

	// Estatus de la cotización
	var statusOfQuotationSelected = dataItemSelected.title_quotation.statusQuo;

	// Realizamos una accion dependiendo lo que se eligio
	switch(parseInt(selectedIndexDialogQuotation)) {
	case 0 :

		// Validamos el status de la cotizacion
		if (statusOfQuotationSelected == 4) {
			// Mostramos mensaje
			Ti.UI.createAlertDialog({
				message : '¡La cotización seleccionada no se puede editar!\nYa esta terminada.',
				title : 'Cotización terminada',
				ok : 'Aceptar',
			}).show();
		} else {
			// ID DE LA COTIZACION
			var idVCQ = parseInt(dataItemSelected.title_quotation.id);
			
			// Llamamos a la funcion
			verifyCountModelQuotation(idVCQ, dataItemSelected);
			// Llamamos a la funcion
			//editQuotation(dataItemSelected);
		};

		break;
	case 1:

		// Validamos el status de la cotizacion
		if (statusOfQuotationSelected == 4) {
			// Mostramos mensaje
			Ti.UI.createAlertDialog({
				message : '¡La cotización seleccionada no se puede eliminar!\nYa esta terminada.',
				title : 'Cotización terminada',
				ok : 'Aceptar',
			}).show();
		} else {
			// Llamamos a la funcion
			deleteQuotation(dataItemSelected);
		};

		break;
	case 2:
		// Llamamos a la funcion
		seeCommentsQuotation(dataItemSelected);
		break;
	default:
		return false;
		//Ti.API.info("Opcion no encontrada.");
		break;
	}
	//OR
	//var selectedIndex = dialog.selectedIndex();
	//alert('Usted ha seleccionado ' + myArray[selectedIndex]);
}

// FUNCION PARA VALIDAR SI SE PUEDE AGREGAR UN NUEVO MODELO O NO
function verifyCountModelQuotation(idQuotationAddModelTemp, dataItemSelected) {

	var objVerQuo = {
		"id" : idQuotationAddModelTemp
	};

	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/verifyCountQuotation";

	var client = Ti.Network.createHTTPClient({
		onload : function(e) {

			var responseVQWS = JSON.parse(this.responseText);

			if (responseVQWS.flag == true) {

				editQuotation(dataItemSelected);

			} else {
				Ti.UI.createAlertDialog({
					message : 'No puedes agregar más modelos a tu cotización\nLlegaste al maximo permitido.',
					title : 'Alerta',
					ok : 'Aceptar',
				}).show();
			};

		},
		onerror : function(e) {
			Ti.UI.createAlertDialog({
				message : 'Ocurrio un error.\nIntentalo nuevamente.',
				title : 'Error',
				ok : 'Aceptar',
			}).show();
		},
		timeout : 59000
	});

	client.open("POST", url);

	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	client.send(JSON.stringify(objVerQuo));

}

// FUNCION PARA EDITAR UNA COTIZACION

function editQuotation(dataItemSelected) {
	// Create an instance of the controller
	var tabGroupQuot = Alloy.Globals.TABGROUP_QUOTATIONS;

	//tabGroupQuot.getActiveTab().setTitle("Tab Modif.");

	//tabGroupQuot.removeTab(tabGroupQuot.getTabs()[1]);

	// Activamos la tab de modelos
	tabGroupQuot.setActiveTab(1);
	// Modificamos titulo del tab
	tabGroupQuot.getActiveTab().setTitle("Editar Cot.");

	//Ti.API.info('Alloy.Globals.TABGROUP_QUOTATIONS' + tabGroupQuot.getTabsBackgroundColor());

	// Limpiamos el valor del id de la cotizacion
	Alloy.Globals.ID_GLOBAL_QUOTATION = 0;
	//Ti.API.info("Editar la cotización. " + dataItemSelected.title_quotation.text + " # " + dataItemSelected.title_quotation.id);
	//Ti.API.info("ID Cotización: " + Alloy.Globals.ID_GLOBAL_QUOTATION);

	// Asignamos un id
	Alloy.Globals.ID_GLOBAL_QUOTATION = parseInt(dataItemSelected.title_quotation.id);
	//Ti.API.info("ID Cotización 2: " + Alloy.Globals.ID_GLOBAL_QUOTATION);

}

// FUNCION PAARA ELIMINAR UNA COTIZACION

function deleteQuotation(dataItemSelected) {
	//Ti.API.info("ITEM SELECCIONADO: " + JSON.stringify(dataItemSelected));
	//Ti.API.info("Eliminar la cotización. " + dataItemSelected.title_quotation.text + " # " + dataItemSelected.title_quotation.id);

	// Objeto con el id de la cotizacion
	var objIdQuotation = {
		"id" : parseInt(dataItemSelected.title_quotation.id)
	};

	// Dialogo de eliminar cotizacion
	var dialogDeleteQuotation = Ti.UI.createAlertDialog({
		persistent : true,
		cancel : 0,
		buttonNames : ['Confirmar', 'Cancelar'],
		message : "¿Seguro de realizar esta acción?",
		title : "Eliminar Cotización"
	});

	// Click sobre el dialogo
	dialogDeleteQuotation.addEventListener('click', function(e) {

		// Si presionamos confirmar
		if (e.index == 0) {

			// URL del servicio rest
			var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/delete";

			// Cliente para realizar la peticion
			var client = Ti.Network.createHTTPClient({
				onload : function(e) {

					//Ti.API.info("Received text: " + this.responseText);

					//var responseWS = JSON.parse(this.responseText);

					// Eliminamos el elemento seleccionado de la vista

					// Preguntamos si solo queda un elemento en la vista
					if ($.listViewQuotations.sections[0].items.length == 1) {

						// Eliminamos la seccion
						$.listViewQuotations.deleteSectionAt(0);

						// Creamos una seccion con un titulo
						var section0 = Ti.UI.createListSection({
							headerTitle : "No existen cotizaciones registradas!"
						});

						// Array vacio
						var sections = [];

						// Agregamos nuestra seccion al array
						sections.push(section0);

						// Agregamos nuestro array de secciones a la lista
						$.listViewQuotations.setSections(sections);

					} else {
						// Eliminamos un elemento de la lista
						$.listViewQuotations.sections[0].deleteItemsAt(parseInt(itemIndexQuotation), 1);
					}

				},
				onerror : function(e) {
					Ti.UI.createAlertDialog({
						message : 'Ocurrio un error.\nIntentalo nuevamente.',
						title : 'Error',
						ok : 'Aceptar',
					}).show();
					//Ti.API.info(e.error);
				},
				timeout : 5000
			});

			// Preparamos conexion
			client.open("POST", url);

			// Establecer la cabecera para el formato JSON correcta
			client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

			// Enviar peticion
			client.send(JSON.stringify(objIdQuotation));

		};

	});

	// Mostramos el dialogo
	dialogDeleteQuotation.show();

}

// FUNCION PARA VER LOS COMETRIOS DE UNA COTIZACION

function seeCommentsQuotation(dataItemSelected) {
	//Ti.API.info("Cometarios de la cotización. " + dataItemSelected.title_quotation.text + " # " + dataItemSelected.title_quotation.id);

	// JSON FINAL DE ACCESORIOS
	var jsonIdQuotation = {
		id : dataItemSelected.title_quotation.id

	};

	// Url del servicio rest
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/getComment";

	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {

			//Ti.API.info("Received text: " + this.responseText);

			// Respuesta del servicio
			var objResponseWS = JSON.parse(this.responseText);

			if (objResponseWS.commet != null) {
				//alert(objResponseWS.commet);
				Ti.UI.createAlertDialog({
					message : objResponseWS.commet,
					title : 'Comentario de Cotización',
					ok : 'Aceptar',
				}).show();
			} else {
				Ti.UI.createAlertDialog({
					message : 'No hay comentario!',
					title : 'Comentario de Cotización',
					ok : 'Aceptar',
				}).show();
				//alert("No hay comentario.");
			};

		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			Ti.UI.createAlertDialog({
				message : 'Ocurrio un error.\nIntentalo nuevamente.',
				title : 'Error',
				ok : 'Aceptar',
			}).show();
			//Ti.API.debug(e.error);
		},
		timeout : 6000 // en milisegundos
	});

	// Preparar la conexión.
	client.open("POST", url);

	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	// Enviar la solicitud.
	client.send(JSON.stringify(jsonIdQuotation));
}