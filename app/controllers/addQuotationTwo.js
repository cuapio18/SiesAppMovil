// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

//Ti.API.info("Argumentos pasados:" + JSON.stringify(args));

// IMAGEVIEW CONVEYOR
var imgConveyor = $.imgConveyor;

var urlImgCon = "http://" + Alloy.Globals.URL_GLOBAL_SERVER_SIES + "/sies-admin" + args.model.conveyor.pic;

// ASIGNAMOS UNA IMAGEN A NUESTRO IMAGEVIEW
imgConveyor.image = urlImgCon;
//imgConveyor.html = '<html><head></head><body><video width="100%" height="100%" autoplay="autoplay"><source src="http://201.163.92.66:8080/sies-admin/resources/videoConveyor/TSR1476305395501.mp4" type="video/mp4">Tu navegador no soporta HTML5 video.</video></body></html>';

//Ti.API.info("urlImgCon: " + urlImgCon);
//f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, urlImgCon);

/*var videoPlayer = Titanium.Media.createVideoPlayer({
url : urlImgCon,
top : 2,
autoplay : true,
backgroundColor : 'blue',
height : 300,
width : 300,
mediaControlStyle : Titanium.Media.VIDEO_CONTROL_HIDDEN,
scalingMode : Titanium.Media.VIDEO_SCALING_ASPECT_FIT
});

$.viewContainerImg.add(videoPlayer);*/

//Ti.API.info("MODELO DEL TRANSPORTADOR:" + JSON.stringify(args));

// Modelo
//var modelConveyor   = args.model;

// MODELO
var objModelWS = args.model;

// ACCESORIOS DEL MODELO
var objAccesoriesWS = args.accessories;

// FUNCION PARA OBTENER EL MODELO Y LOS ACCESORIOS DEL TRANSPORTADOR
dataModelConveyor();

// FUNCION PARA OBTENER EL MODELO Y LOS ACCESORIOS DEL TRANSPORTADOR

function dataModelConveyor() {
	//Ti.API.info("MODELO: " + JSON.stringify(objModelWS));

	var titleConveyor = objModelWS.conveyor.conveyor + " - " + objModelWS.conveyor.keyShort;

	// Titulo
	$.labelTitleConveyor.setText(titleConveyor);

	var titleModel = objModelWS.model;

	// Modelo del transportador
	$.labelTitleModel.setText(titleModel);

	var priceModel = objModelWS.priceModel;

	// Precio
	$.labelTitlePrice.setText("$" + priceModel);

	// VALIDAMOS SI ES LARGO O GRADO

	var longOrGrade = "";

	if (objModelWS.longs != null) {

		//Ti.API.info("ES LARGO");

		// Asignamos un valor a nuestra variable
		longOrGrade = objModelWS.longs.measure;

	} else if (objModelWS.grade != null) {

		//Ti.API.info("ES GRADO");

		// Asignamos un valor a nuestra variable
		longOrGrade = objModelWS.grade.measure;

	}
	;

	// Largo o Grado
	$.labelValueLongGrade.setText(longOrGrade);

	var bandSerie = objModelWS.serieBand.serieBand;

	// Serie de la banda
	$.labelValueBandSerie.setText(bandSerie);

	var bandMaterial = objModelWS.materialBand.materialBand;

	// Material de la banda
	$.labelValueBandMaterial.setText(bandMaterial);

	var usefulWidth = objModelWS.width.measure;
	// Ancho util
	$.labelValueUsefulWidth.setText(usefulWidth + " PLG");

	var typeSupport = objModelWS.support.support;

	// Tipo de soporte
	$.labelValueTypeSupport.setText(typeSupport);

	var inputOutputHeight = '';

	// VALIDAMOS EL TIPO DE SOPORTE
	if (objModelWS.support.id == 1) {
		inputOutputHeight = objModelWS.heightInput.height;
	};

	// Altura de entrada y salida
	$.labelValueInputOutputHeight.setText(inputOutputHeight);

	var driveUnit = objModelWS.driveUnit.name;

	// Unidad motriz
	$.labelValueDriveUnit.setText(driveUnit);

	var speedModel = objModelWS.speed.speed;

	// Velocidad
	$.labelValueSpeed.setText(speedModel);

	var descriptionModel = objModelWS.description;

	// Descripcion
	$.labelValueDescription.setText("Descripción: " + descriptionModel);

}

// Click en el boton siguiente paso de la cotizacción
$.btnAcceptConveyor.addEventListener('click', function() {

	// Objeto que vamos a enviar a la vista
	var objModelAndAccesoriesWS = {
		model : objModelWS,
		accesories : objAccesoriesWS
	};

	// Ventana del paso numero 3 de la cotizacion
	var winAddQuotationThree = Alloy.createController('addQuotationThree', objModelAndAccesoriesWS).getView();

	// CLICK EN EL BOTON REGRESAR
	winAddQuotationThree.addEventListener('open', function(e) {

		// Action Bar
		var actionBar;

		// Validamos el sistema operativo
		if (Ti.Platform.osname === "android") {

			// Activity
			var activityAddQuotationThree = winAddQuotationThree.activity;

			if (!activityAddQuotationThree) {
				Ti.API.error("No se puede acceder a la barra de acción en una ventana ligera.");
			} else {

				// Action Bar de la ventana
				actionBar = winAddQuotationThree.activity.actionBar;

				// Validamos si existe un actionbar
				if (actionBar) {

					// AGREGAMOS BOTON DE VOLVER
					actionBar.displayHomeAsUp = true;

					// Agregamos un titulo
					actionBar.title = "Accesorios";

					//AL DAR CLICK EN EL BOTON  VOLVER
					actionBar.onHomeIconItemSelected = function(e) {
						//CERRAMOS LA VENTANA
						winAddQuotationThree.close();
					};

				}

			};

		}

	});

	// Abrir ventana
	winAddQuotationThree.open();

});
