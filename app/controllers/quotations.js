// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// ID DEL USUARIO
var idUsuarioSession = Alloy.Globals.PROPERTY_INFO_USER.userLogin.id;
Ti.API.info("idUsuarioSession: " + idUsuarioSession);
var listViewQuot = $.listViewQuotations;

// CLICK EN UN ELEMENTO DE LA LISTA
listViewQuot.addEventListener('itemclick', function(e) {
	
	var item = e.section.getItemAt(e.itemIndex);
	//var item = eA.section.getItemAt(e.itemIndex);
	
	//alert("INDEX: " + e.source.selectedIndex);
	Ti.API.info("ITEM:" + JSON.stringify(item));
	//Ti.API.info("E: " + JSON.stringify(e));
	var windDetailQuotation = Alloy.createController('detailQuotation').getView();
	//windDetailQuotation.open();
	
	windDetailQuotation.addEventListener("open", function(evt) {
		var actionBar = windDetailQuotation.activity.actionBar;
		actionBar.displayHomeAsUp = true;
		actionBar.onHomeIconItemSelected = function(e) {
			//Ti.API.info(evt);
			//alert(e);
			//$.miVentana2.close();
			windDetailQuotation.close();
		};
	});

		
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
			Ti.API.info("ResponseWSQuotations: " + this.responseText);
			// FUNCION QUE GENERA LA LISTA DE COTIZACIONES
			createListAllQuotations(responseWS.quotations);
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error);
			alert('error');
		},
		timeout : 5000 // in milliseconds
	});
	// Prepare the connection.
	client.open("POST", url);
	
	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	
	// Send the request.
	client.send(JSON.stringify(objUserSes));
	
}

// FUNCION QUE GENERA LA LISTA DE COTIZACIONES
function createListAllQuotations(quotations)
{
	
	Ti.API.info("Informacion recibida: " + quotations);
	
	var items = [];
	//var dateQuo = '';
	//var cont = 1;
	
	// RECORREMOS LA LISTA DE COTIZACIONES
	quotations.forEach(function(quotation, idx){
		
		// FORMATO A LA FECHA
		dateQuo = new Date(quotation.creationDate);
		
		// GENERAMOS OBJETO CON DE COTIZACIONES
		items.push({
			img_quotation    : {image: 'https://www.logismarket.com.ar/ip/quintino-sistemas-transportadores-para-envios-y-correos-sistemas-transportadores-para-envios-y-correos-688836-FGR.jpg'},
			title_quotation  : {text: 'Cotización ' + quotation.id, id : quotation.id, idx : parseInt(idx)},
			date_quotation   : {text: dateQuo.toLocaleDateString("es-MX")},
			status_quotation : {text: quotation.status.nameStatus},
		});
		
		// ASIGNAMOS A LA LISTA LAS COTIZACIONES
		$.listViewQuotations.sections[0].setItems(items);
		
	});
	
}

// FUNCION PARA OBTENER LAS COTIZACIONES

getAllQuotations(idUsuarioSession);

var dialog;
var myArray = ['Editar', 'Eliminar', 'Comentarios', 'Cancelar'];
var opts    = {
	title:"Cotización",
	cancel : 3,
	options : myArray,
	//selectedIndex : 3, // Define la opción seleccionada por defecto.
	destructive : 0, // Índice para definir la opción destructiva, indicada por una señal visual cuando se procesa.
};

// Datos de la cotizacion
var dataItemSelected = {};

// FUNCION AL DAR CLICK PROLONGADO SOBRE ALGUN ELEMENTO

function longCB(e) {
	
	// Indice del elemento presionado
	var itemIndex    = e.itemIndex;
	
	// Datos del elemento presionado
	dataItemSelected = e.section.items[parseInt(itemIndex)];
	
	//Ti.API.info("LONGCB: " + JSON.stringify(dataItemSelected));
	//alert(JSON.stringify(e.section.items[parseInt(itemIndex)].title_quotation.text ));
	dialog = Ti.UI.createOptionDialog(opts);
	dialog.show();
	dialog.addEventListener('click', onSelectDialog);

};

// FUNCION AL PRESIONAR ALGUNA OPCION DEL ALERTA DIALOGO

function onSelectDialog(event) {
	
	//Ti.API.info("Opción seleccionada: " + JSON.stringify(event));
	Ti.API.info("Cotizacion seleccionada: " + JSON.stringify(dataItemSelected));
	
	// indice del elemento seleccionado
	var selectedIndex = event.source.selectedIndex;
	
	//Ti.API.info("Index del elemento seleccionado: " + parseInt(selectedIndex));
	
	// Realizamos una accion dependiendo lo que se eligio
	switch(parseInt(selectedIndex)) {
		case 0 :
			// Llamamos a la funcion
			editQuotation(dataItemSelected);
			break;
		case 1:
			// Llamamos a la funcion
			deleteQuotation(dataItemSelected);
			break;
		case 2:
			// Llamamos a la funcion
			seeCommentsQuotation(dataItemSelected);
			break;
		default:
			Ti.API.info("Opcion no encontrada.");
			break;
	}
	//OR
	//var selectedIndex = dialog.selectedIndex();
	//alert('Usted ha seleccionado ' + myArray[selectedIndex]);
}

// FUNCION PARA EDITAR UNA COTIZACION

function editQuotation(dataItemSelected)
{
	Ti.API.info("Editar la cotización. " +  dataItemSelected.title_quotation.text + " # " + dataItemSelected.title_quotation.id);
}

// FUNCION PAARA ELIMINAR UNA COTIZACION

function deleteQuotation(idQuotation)
{
	Ti.API.info("Eliminar la cotización. " +  dataItemSelected.title_quotation.text + " # " + dataItemSelected.title_quotation.id);
}

// FUNCION PARA VER LOS COMETRIOS DE UNA COTIZACION

function seeCommentsQuotation(idQuotation)
{
	Ti.API.info("Cometarios de la cotización. " +  dataItemSelected.title_quotation.text + " # " + dataItemSelected.title_quotation.id);
}


