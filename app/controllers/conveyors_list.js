// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var movies = [];
var tableView_data = [];

// **************************************************
// FUNCION PARA OBTENER LA LISTA DE TRANSPORTADORES
// **************************************************

function getAllConveyors() {
	
	// URL del servicio de transportadores
	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/typeConveyor";
	
	// Cliente para consumir el servicio rest
	var client = Ti.Network.createHTTPClient({
		
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			
			// Datos devueltos por el servicio rest
			var objJsonConveyor = JSON.parse(this.responseText);
			
			// Funcion que genera la vista de transportadores
			fillConveyorsView(objJsonConveyor);
			
		}, 
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			Ti.API.debug(e.error);
		},
		timeout : 5000 // milisegundos
		
	});
	
	// Preparar la conexion
	client.open("GET", url);
	
	// Enviamos la solicitud
	client.send();
	
}

// **************************************************
// FUNCION PARA GENERAR LA VISTA DE LOS TRANSPORTADORES
// **************************************************

function fillConveyorsView(objJsonConveyor) {
	
	console.log(objJsonConveyor);
	
	//tableView_data = [];
	var tableView_rows = [];
	
	// Recorremos el objeto json que recibimos
	objJsonConveyor.forEach(function (optConv){
		
		// Vista estatica
		var cell = Alloy.createController("conveyors_list_cell");
		
		//Modificamos la vista
		cell.updateViews({
			"#title_label" : {
				text     : optConv.conveyor + " - " + optConv.keyShort,
				//keyShort : optConv.keyShort,
				attributedString : optConv.keyShort
			},
			"#thumbnail_imageview" : {
				image : 'http://www.esysautomation.com/data/uploads/Esys%20Pictures/Assembly/Conveyors_MainContent460px.jpg'
			},
			"#id_conveyor": {
				text             : optConv.id,
				attributedString : optConv.id
			}
		});
		
		// Click en algun elemnto de la lista
		cell.getView().addEventListener("click", function(e) {
			
			// ID del conveyor
			var idConveyor       = e.row.children[3].text;
			
			// Clave corta del transportador
			var keyShortConveyor = e.row.children[2].attributedString;
			
			//Nombre del transportador
			var nameConveyor     = e.row.children[2].text;
			
			// Imagen del transportador
			var imgConveyor     = e.row.children[0].children[0].image;
			
			// Tipo del transportador
			var typeConveyor = keyShortConveyor.substr(-1);
			
			// Obj con los datos del transportador
			var objDataConveyor = {
				"idConveyor"   : idConveyor ,
				"keyShort"     : keyShortConveyor,
				"nameConveyor" : nameConveyor,
				"typeConveyor" : typeConveyor,
				"imgConveyor"  : imgConveyor
			};			
			
			//Ti.API.info("TIPO TRANSPORTADOR: " + typeConveyor);
			//Ti.API.info("KEYSHORT TRANSPORTADOR: " + keyShortConveyor);
			//Ti.API.info("DATOS DEL TRANSPORTADOR: " + JSON.stringify(e.row.children[2].attributedString));
			//JSON.stringify(e.row.children[3].attributedString)
			//alert(JSON.stringify(e.row.children[3].attributedString));
			// Llamamos a la funcion agregar cotizacion
			addQuotation(objDataConveyor);				
		}); 
		
		//tableView_data.push(cell);
		tableView_rows.push(cell.getView());
		
	});
	
	$.tableview.setData(tableView_rows);

	//$.activity_indicator.hide();

	/*var tableview_animation = Ti.UI.createAnimation({
		opacity : 1,
		duration : 500,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_OUT
	});*/
	//$.tableview.animate(tableview_animation);
	
}


function populateMovies(movies) {

	tableView_data = [];
	var tableView_rows = [];

	for (var i = 0; i < 10; i++) {

		var movie = movies[i];

		var cell = Alloy.createController("conveyors_list_cell");
		cell.updateViews({
			"#title_label" : {
				text : "Transportador " + (parseInt(i)+1)//movie.title
			},
			"#thumbnail_imageview" : {
				//top : (OS_IOS) ? cellImageOffset(i) : 0,
				image : 'http://www.esysautomation.com/data/uploads/Esys%20Pictures/Assembly/Conveyors_MainContent460px.jpg' /*theMovieDb.common.getImage({
					size : Alloy.Globals.backdropImageSize,
					file : "http://www.esysautomation.com/data/uploads/Esys%20Pictures/Assembly/Conveyors_MainContent460px.jpg"//movie.backdrop_path
				})*/
			}
		});
		

		cell.getView().addEventListener("click", function(e) {

			//$.lists_container.touchEnabled = false;

			//cell.animateClick(function() {

				addQuotation();				

			//});
		}); 


		tableView_data.push(cell);
		tableView_rows.push(cell.getView());
	}

	$.tableview.setData(tableView_rows);

	$.activity_indicator.hide();

	var tableview_animation = Ti.UI.createAnimation({
		opacity : 1,
		duration : 500,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_OUT
	});
	$.tableview.animate(tableview_animation);
}

// **************************************************
// EJECUTAMOS FUNCION TRANSPORTADORES
// **************************************************

//populateMovies(movies);

// **************************************************
// EJECUTAMOS FUNCION TRANSPORTADORES
// **************************************************

getAllConveyors();

// **************************************************
// FUNCION AGREGAR COTIZACION
// **************************************************

function addQuotation(objDataConveyor) {
	
	//alert("Datos del transportador: " + JSON.stringify(objDataConveyor));
	
	// VENTANA AGREGAR COTIZACION
	var winAddQuotation = Alloy.createController('addQuotation', objDataConveyor).getView();
	
	// ABRIMOS VENTANA DE COTIZACIONES
	winAddQuotation.open();
	
	// CUANDO LA VENTANA SE ABRE
	winAddQuotation.addEventListener("open", function(evt) {
		//ACTION BAR
		var actionBar = winAddQuotation.activity.actionBar;
		// AGREGAMOS BOTON DE VOLVER
		actionBar.displayHomeAsUp = true;
		//AL DAR CLICK EN EL BOTON  VOLVER
		actionBar.onHomeIconItemSelected = function(e) {
			//Ti.API.info(evt);
			//CERRAMOS LA VENTANA
			winAddQuotation.close();
		};
	});

}