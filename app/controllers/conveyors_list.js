// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

var movies = [];
var tableView_data = [];

// **************************************************
// FUNCION PARA OBTENER LA LISTA DE TRANSPORTADORES
// **************************************************

function getAllConveyors() {
	
	// URL del servicio de transportadores
	var url = "http://192.168.100.30:8084/SiesRestApp/API/conveyors";
	
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

populateMovies(movies);

// **************************************************
// EJECUTAMOS FUNCION TRANSPORTADORES
// **************************************************

//getAllConveyors();

// **************************************************
// FUNCION AGREGAR COTIZACION
// **************************************************

function addQuotation() {
	
	// VENTANA AGREGAR COTIZACION
	var winAddQuotation = Alloy.createController('addQuotation').getView();
	
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
			Ti.API.info(evt);
			//CERRAMOS LA VENTANA
			winAddQuotation.close();
		};
	});

}