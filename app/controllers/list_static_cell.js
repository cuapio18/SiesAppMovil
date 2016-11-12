// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

/*var scrollView = Ti.UI.createScrollView({
    top : 10,
    left : 0,
    contentWidth : 'auto',
    contentHeight : 'auto',
    showVerticalScrollIndicator : true,
});
 
$.winAddQuot.add(scrollView);
 
var topPostion = 80;
var leftPosition = 20;
 
for (var i = 0; i < 4; i++) {
    if (i % 2 == 0) {
        leftPosition = 20;
    } else {
        leftPosition = 180;
    }
 
    var panelImage = Ti.UI.createView({
        backgroundColor : 'white',
        top : topPostion,
        left : leftPosition,
        height : 100,
        width : 120,
    });
    var cellQuot = Ti.UI.createView({
    	id: "cell"
    });
    //reset the top postion of the view.
    if (leftPosition == 180) {
        topPostion = topPostion + panelImage.height + 40;
    }
 
    // Add the EventListener  for the view.
    panelImage.addEventListener('click', function(e) {
 
        alert('AppceleratorTutorial.com');
 
    });
 
    // add the view in scroll view
    scrollView.add(cellQuot);
 
}*/
/*
// CREAMOS SCROLLVIEW
var scrollView = Ti.UI.createScrollView({
	layout: 'vertical',
    width: Ti.UI.FILL,
    height: Ti.UI.FILL,
    showVerticalScrollIndicator : true,
});

// CREAMOS CONTENEDOR DE LOS TRANSPORTADORES
var containerConveyor = Ti.UI.createView({
	layout: 'horizontal',
	width: Titanium.UI.FILL,
	height: Ti.UI.FILL
});

//$.list_static_cell.add(scrollView);

for (var i = 1; i < 16; i++) {
    
    var panelImage = Ti.UI.createView({
        backgroundColor : 'gray',
        backgroundImage: 'http://www.penaycia.com/Portals/0/LiveContent/446/Images/transportadores-rodillos-12.jpg',
        top : 10,
        left : 10,
        height : 165,
        width : 330,
    });
    
    var tv = Ti.UI.createLabel({
    	color: '#fff',
    	text: 'Transportador ' + i//Ti.Platform.displayCaps.platformWidth
    });
    
    panelImage.add(tv);
 
    // Add the EventListener  for the view.
    panelImage.addEventListener('click', function(e) {
 
        //alert('AppceleratorTutorial.com');
        addQuotation();
 
    });
 
    // add the view in scroll view
    //$.containerTransports.add(panelImage);
    containerConveyor.add(panelImage);
 
}
*/
//scrollView.add(containerConveyor);

// AGREGAMOS EL SCROLLVIEW A LA VENTANA
//$.winAddQuotation.add(scrollView);

// FUNCION AGREGAR COTIZACION
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

/*var tableView_data = [];

var movies = [{
	title: "titulo",
	backdrop_path : "vvtvtrf"
},{
	title: "titulo",
	backdrop_path : "vvtvtrf"
}];

function populateMovies(movies) {

	tableView_data     = [];
	var tableView_rows = [];

	for (var i = 0; i < movies.length; i++) {

		var movie = movies[i];

		var cell = Alloy.createController("list_static_cell");
		cell.updateViews({
			"#title_label" : {
				text : movie.title
			},
			"#thumbnail_imageview" : {
				//top : (OS_IOS) ? cellImageOffset(i) : 0,
				image : ""
			}
		});
 
		tableView_data.push(cell);
		tableView_rows.push(cell.getView());
	}

	$.tableview.setData(tableView_rows);

	//$.activity_indicator.hide();

	var tableview_animation = Ti.UI.createAnimation({
		opacity : 1,
		duration : 500,
		curve : Titanium.UI.ANIMATION_CURVE_EASE_OUT
	});
	$.tableview.animate(tableview_animation);

}*/

function longAcce(e) {
	alert(e);
}

/*function ActivarFoco(e) {
	Ti.API.info(JSON.stringify(e));
	//e.source.focusable = true;
	//e.source.setFocusable(true);
	$.quantity_accesory.focusable = true;
}*/
