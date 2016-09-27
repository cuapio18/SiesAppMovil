// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var listViewQuot = $.listViewQuotations;

// CLICK EN UN ELEMENTO DE LA LISTA
listViewQuot.addEventListener('itemclick', function(e) {
	
	var windDetailQuotation = Alloy.createController('detailQuotation').getView();
	windDetailQuotation.open();
	
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
function getAllQuotations(numQuo) {
	
	var url = "http://api.randomuser.me/?nat=es&results=" + numQuo;
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			//Ti.API.info("Received text: " + this.responseText);
			//alert('success');
			// FUNCION QUE GENERA LA LISTA DE COTIZACIONES
			createListAllQuotations(JSON.parse(this.responseText).results);
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info(e.error);
			alert('error');
		},
		timeout : 5000 // in milliseconds
	});
	// Prepare the connection.
	client.open("GET", url);
	// Send the request.
	client.send();
	
}

// FUNCION QUE GENERA LA LISTA DE COTIZACIONES
function createListAllQuotations(quotations) {
	
	//Ti.API.info(contactos);
	var items = [];
	//var dateQuo = '';
	//var cont = 1;
	
	// RECORREMOS LA LISTA DE COTIZACIONES
	quotations.forEach(function(quotation, idx){
		
		// FORMATO A LA FECHA
		//dateQuo = new Date(quotation.registered);
		
		// GENERAMOS OBJETO CON DE COTIZACIONES
		items.push({
			img_quotation: {image: 'https://www.logismarket.com.ar/ip/quintino-sistemas-transportadores-para-envios-y-correos-sistemas-transportadores-para-envios-y-correos-688836-FGR.jpg'},//quotation.picture.thumbnail
			title_quotation: {text: 'Cotización ' + (parseInt(idx)+1)},//quotation.name.first
			date_quotation: {text: '14/07/2016'},//dateQuo.toDateString()
			status_quotation: {text: 'Creada'},//quotation.gender
		});
		
		// ASIGNAMOS A LA LISTA LAS COTIZACIONES
		$.listViewQuotations.sections[0].setItems(items);
		
	});
	
}

// FUNCION PARA OBTENER LAS COTIZACIONES
getAllQuotations(50);



var dialog;
var myArray = ['Editar', 'Eliminar', 'Comentarios'];
var opts = {
	title:"Cotización",
	//cancel : 2,
	options : myArray,
	//selectedIndex : 0,
	//destructive : 0,
};

function longCB(e) {
	var itemIndex = e.itemIndex;
	//Ti.API.info(JSON.stringify(e.section.items));
	//alert(JSON.stringify(e.section.items[parseInt(itemIndex)].title_quotation.text ));
	dialog = Ti.UI.createOptionDialog(opts);
	dialog.show();
	dialog.addEventListener('click', onSelectDialog);

};

function onSelectDialog(event) {
	alert(event);
	var selectedIndex = event.source.selectedIndex;
	//OR
	//var selectedIndex = dialog.selectedIndex();
	//alert('Usted ha seleccionado ' + myArray[selectedIndex]);
}




