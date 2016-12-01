// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;

// ID del model conveyor temp
var idModelConTemp = args.modelConveyor.id;

Ti.API.info("Argumentos recibidos addQuotationSix: " + JSON.stringify(args));

// *********************************************************************
// EJECUTAMOS FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP
// *********************************************************************

getAllAccessoriesModelConveyorTemp(idModelConTemp);

// *********************************************************************
// FUNCION QUE OBTIENE LOS ACCESORIOS DEL MODEL CONVEYOR TEMP
// *********************************************************************

function getAllAccessoriesModelConveyorTemp(idModelConTemp) {

	// OBJ CON EL ID DEL MODEL CONVEYOR TEMP
	var objIdModelConvTemp = {
		"id" : parseInt(idModelConTemp)
	};

	var url = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/findAccessoriesModelTemp";

	var client = Ti.Network.createHTTPClient({
		onload : function(e) {
			Ti.API.info("Received text: " + this.responseText);

			var responseWS = JSON.parse(this.responseText);
			Ti.API.info("ResponseWSQuotations: " + this.responseText);
			
			// FUNCION QUE GENERA LA LISTA DE LOS ACCESORIOS DE LA COTIZACION
			createAllAccessoriesModelsConveyorTemp(responseWS.accessories);
		},
		onerror : function(e) {
			Ti.API.info(e.error);
		},
		timeout : 5000
	});
	
	// Preparamos conexion.
	client.open("POST", url);

	// Establecer la cabecera para el formato JSON correcta.
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");

	// Enviar peticion.
	client.send(JSON.stringify(objIdModelConvTemp));

}

// *********************************************************************
// FUNCION QUE GENERA LOS ACCESORIOS DE UN MODELO TEMPORAL
// *********************************************************************

function createAllAccessoriesModelsConveyorTemp(modelsAccessoriesModelTemp) {

	// RECORREMOS EL OBJETO
	modelsAccessoriesModelTemp.forEach(function(accessory, idx){
		
		// Cantidad de accesorio
		var quantityAccessory = accessory.count;
		
		// Contenedor del accesorio
		var viewAccessory = Ti.UI.createView({
			top: 10,
			left: 10,
			bottom: 10,
			width: Alloy.Globals.layout.lists.cell.width,
			height: Alloy.Globals.layout.lists.cell.height,
			backgroundColor: '#3C3D42',
			clipMode: true
        });
        
        // Imagen de accesorio
		var imageViewAccessory = Ti.UI.createImageView({
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			preventDefaultImage: true,
			touchEnabled: false,
			image : 'http://image.made-in-china.com/2f0j10pvjtGEnMaqba/-Cinta-transportadora-con-el-accesorio-.jpg'
        });
        
        // Vista de degradado
        var viewGradientAccessory = Ti.UI.createView({
			top: 0,
			left: 0,
			width: Ti.UI.FILL,
			height: Ti.UI.FILL,
			backgroundGradient: {
		        type: 'linear',
		        startPoint: { x: '0%', y: '0%' },
		        endPoint: { x: '0%', y: '100%' },
		        colors: [ { color: '#33000000', offset: 0 },
		        		  { color: '#aa000000', offset: 1 } ]
		   },
		   touchEnabled: false
        });
        
        // Vista de Fondo
        var viewOverlayAccessory = Ti.UI.createView({
        	layout       : 'vertical',
			width        : Titanium.UI.FILL,
			height       : Titanium.UI.SIZE,
			bottom       : 0,
			backgroundColor : '#000',
			opacity      : 0.5,
			touchEnabled : false
        });
        
        // Nombre del accesorio
        var labelAccessory = Ti.UI.createLabel({
        	top:5,
			bottom: 5,
			left: 5,
			right: 5,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			font: {
				fontSize: 20,
				fontFamily: 'FontAwesome'
			},
			textAlign: 'center',
			color: '#ffffff',
			touchEnabled: false,
        	text     : accessory.accessorie.nameAccessorie,
        	id       : accessory.accessorie.id, 
			idx      : parseInt(idx),
			quantity : accessory.count,
			idQuotationAccessorie : accessory.idQuotationAccessorie,
			countAcc : accessory.count,
			check : accessory.check
        });
        
        // Precio del accesorio
        var labelPriceAccessory = Ti.UI.createLabel({
			top:0,
			bottom: 5,
			left: 5,
			right: 5,
			width: Ti.UI.FILL,
			height: Ti.UI.SIZE,
			textAlign: 'center',
			color: '#ffffff',
			touchEnabled: false,
			text : 'Precio: ' + accessory.accessorie.price,
			priceAcc : accessory.accessorie.price
        });
        
        // Cantidad de accesorio
        var sliderQuantityAccessory = Titanium.UI.createSlider({
		    top          :0,
			bottom       : 5,
			left         : 5,
			right        : 5,
			width        : Ti.UI.FILL,
			height       : Ti.UI.SIZE,
		    min          : 1,
		    max          : 50,
		    value        : quantityAccessory
    	});
		
		// Label slider value
		var labelSliderQuantityAccessory = Ti.UI.createLabel({
		    top          :0,
			bottom       : 5,
			left         : 5,
			right        : 5,
			width        : Ti.UI.FILL,
			height       : Ti.UI.SIZE,
			textAlign    : Ti.UI.TEXT_ALIGNMENT_CENTER,
			color        : '#ffffff',
			touchEnabled : false,
		    text         : 'Cantidad: ' + sliderQuantityAccessory.value,
		});
		

		sliderQuantityAccessory.addEventListener('change', function(e) {
		    labelSliderQuantityAccessory.text = 'Cantidad: ' + parseInt(e.value);
		});
		
		var viewContainerAccessories = $.viewContainerAccessories;
        
        // Agregamos la imagen
         viewAccessory.add(imageViewAccessory);
         
         // Agregamos vista gradient
         viewAccessory.add(viewGradientAccessory);
         
         // Agregamos el Nombre
         viewOverlayAccessory.add(labelAccessory);
         
         // Agregamos precio
         viewOverlayAccessory.add(labelPriceAccessory);
         
         // Agregamos label para mostrar valor del slider
         viewOverlayAccessory.add(labelSliderQuantityAccessory);
         
         // Agregamos slider de cantidad
         viewOverlayAccessory.add(sliderQuantityAccessory);
         
         // Agregamos vista overlay
         viewAccessory.add(viewOverlayAccessory);
         
         // Agregamos los accesorios
         viewContainerAccessories.add(viewAccessory);
         
         // Variable con el valor de check
         var checkAccessory = accessory.check;
         
         // Validamos si el accesorio esta seleccionado
         if (checkAccessory == 1) {
         	
         	//Cambiamos el tamano del fondo
			viewOverlayAccessory.height          = Ti.UI.FILL;
			
			// Cambiamos el color del fondo
         	viewOverlayAccessory.backgroundColor = '#0B3C4C';
         	
         	// Cambiamos el color del label titulo
			labelAccessory.color      = "#ECAE73";
					
			// Cambiamos el color al label precio
			labelPriceAccessory.color = "#ECAE73";
			
			// Cambiamos el color del label slider
			labelSliderQuantityAccessory.color = "#ECAE73";
			
			// Mostramos label slider
			labelSliderQuantityAccessory.visible = true;
			
			// Cambiamos alto de label slider
			labelSliderQuantityAccessory.height = Ti.UI.SIZE;
			
			// Cambiamos ancho de label slider
			labelSliderQuantityAccessory.width  = Ti.UI.FILL;
			
			// Mostramos slider
			sliderQuantityAccessory.visible = true;
			
			//sliderQuantityAccessory.backgroundColor = 'red';
			
			//sliderQuantityAccessory.backgroundSelectedColor = 'blue';
			
			//sliderQuantityAccessory.backgroundFocusedColor = '#55ff00ff';
			
			//sliderQuantityAccessory.backgroundDisabledColor = '#55ff00ff';
			
			// Cambiamos el minimo del slider
			sliderQuantityAccessory.min     = 1;
			
			// Asignamos valor al slider
			sliderQuantityAccessory.value   = quantityAccessory;
			
			// Cambiamos alto del slider
			sliderQuantityAccessory.height  = Ti.UI.SIZE;
			
			// Cambiamos ancho del slider
			sliderQuantityAccessory.width   = '100%';
         	
         } else {
         	
         	//Cambiamos el tamano del fondo
			viewOverlayAccessory.height          = Ti.UI.SIZE;
			
			// Cambiamos el color del fondo
         	viewOverlayAccessory.backgroundColor = '#000000';
         	
         	// Cambiamos el color del label titulo
			labelAccessory.color      = "#fff";
					
			// Cambiamos el color al label precio
			labelPriceAccessory.color = "#fff";
			
			// Cambiamos el color del label slider
			labelSliderQuantityAccessory.color = "#fff";
			
			// Ocultamos label slider
			labelSliderQuantityAccessory.visible = false;
			
			// Cambiamos alto de label slider
			labelSliderQuantityAccessory.height = 0;
			
			// Cambiamos ancho de label slider
			labelSliderQuantityAccessory.width  = 0;
			
			// Ocultamos slider
			sliderQuantityAccessory.visible = false;
			
			// Cambiamos el minimo del slider
			sliderQuantityAccessory.min     = 0;
			
			// Asignamos valor al slider
			sliderQuantityAccessory.value   = quantityAccessory;
			
			// Cambiamos alto del slider
			sliderQuantityAccessory.height  = 0;
			
			// Cambiamos ancho del slider
			sliderQuantityAccessory.width   = 0;
			
         };
         
         // Atributo para saber si se puede o no elegir mas de un accesorio
         var verifyAccessory = accessory.accessorie.verify;
         
         // VALIDAR SI SE PUEDE HACER CLICK O NO
        
         // CLICK SOBRE LA VISTA ACCESORIOS
		viewAccessory.addEventListener('click', function(e) {
			
			Ti.API.info(JSON.stringify(e.source));
			
			// Validamos el color de fondo de la vista
			if(e.source.getChildren()[2].getBackgroundColor() == "#0B3C4C") {
					
				//Cambiamos el tamano del fondo
				e.source.getChildren()[2].setHeight(Ti.UI.SIZE);
					
				// Cambiamos el color de fondo
				e.source.getChildren()[2].setBackgroundColor("#000");
					
				// Cambiamos el color del label titulo
				e.source.getChildren()[2].getChildren()[0].setColor("#fff");
					
				// Cambiamos el color al label precio
				e.source.getChildren()[2].getChildren()[1].setColor("#fff");
				
				// Cambiamos el color del label slider
				e.source.getChildren()[2].getChildren()[2].setColor("#fff");
				
				// Ocultamos label slider
				e.source.getChildren()[2].getChildren()[2].hide();
				
				// Cambiamos alto de label slider
				e.source.getChildren()[2].getChildren()[2].setHeight(0);
				
				// Cambiamos ancho de label slider
				e.source.getChildren()[2].getChildren()[2].setWidth(0);
				
				// Ocultamos slider
				e.source.getChildren()[2].getChildren()[3].hide();
				
				// Cambiamos el minimo del slider
				e.source.getChildren()[2].getChildren()[3].setMin(0);
				
				// Asignamos valor al slider
				e.source.getChildren()[2].getChildren()[3].setValue(quantityAccessory);
				
				// Cambiamos alto del slider
				e.source.getChildren()[2].getChildren()[3].setHeight(0);
				
				// Cambiamos ancho del slider
				e.source.getChildren()[2].getChildren()[3].setWidth(0);
					
			} else {
					
				// Cambiamos el tamano del fondo
				e.source.getChildren()[2].setHeight(Ti.UI.FILL);
				
				// Cambiamos el color de fondo
				e.source.getChildren()[2].setBackgroundColor("#0B3C4C");
					
				// Cambiamos el color del label titulo
				e.source.getChildren()[2].getChildren()[0].setColor("#ECAE73");
					
				// Cambiamos el color al label precio
				e.source.getChildren()[2].getChildren()[1].setColor("#ECAE73");//0DD1BE - ECAE73
				
				// Cambiamos el color del label slider
				e.source.getChildren()[2].getChildren()[2].setColor("#ECAE73");
				
				// Mostramos label slider
				e.source.getChildren()[2].getChildren()[2].show();
				
				// Cambiamos alto de label slider
				e.source.getChildren()[2].getChildren()[2].setHeight(Titanium.UI.SIZE);
				
				// Cambiamos ancho de label slider
				e.source.getChildren()[2].getChildren()[2].setWidth(Titanium.UI.FILL);
				
				// Mostramos slider
				e.source.getChildren()[2].getChildren()[3].show();
				
				// Cambiamos el minimo del slider
				e.source.getChildren()[2].getChildren()[3].setMin(1);
				
				// Asignamos valor al slider
				e.source.getChildren()[2].getChildren()[3].setValue(quantityAccessory);
				
				// Cambiamos alto del slider
				e.source.getChildren()[2].getChildren()[3].setHeight(Titanium.UI.SIZE);
				
				// Cambiamos ancho del slider
				e.source.getChildren()[2].getChildren()[3].setWidth('100%');
					
			}
				
		});
		
		// Agregamos el cotenedor de accesorios al scroll view
        $.scrollViewAddAccessories.add(viewContainerAccessories);
		
	});

}

//////////

	// Evento que se ejecuta ala abri la ventana
$.addQuotationSix.addEventListener("open", function(evt) {

	// Action Bar
	var actionBar;

	// Activity
	var activityAddAccessories = $.addQuotationSix.activity;

	// Validamos el sistema operativo
	if (Ti.Platform.osname === "android") {

		if (!activityAddAccessories) {
			Ti.API.info("No se puede acceder a la barra de acción en una ventana ligera.");
		} else {

			actionBar = $.addQuotationSix.activity.actionBar;

			// Validamos si existen un actionBar
			if (actionBar) {

				// Agregamos un menu
				activityAddAccessories.onCreateOptionsMenu = function(ev) {

					// Menu
					var menuAddAcc = ev.menu;

					// Item Menu Agregar o quitar accesorios
					var menuItemAddAcc = menuAddAcc.add({
						title : 'Agregar o Eliminar Accesorios',
						icon : Ti.Android.R.drawable.ic_menu_add,
						showAsAction : Ti.Android.SHOW_AS_ACTION_ALWAYS
					});

					// Click sobre itm del menu
					menuItemAddAcc.addEventListener('click', function(e) {

						Ti.API.info("Me hicieron clic: " + JSON.stringify(e));

						// Dialogo para agregar un model temp
						var dialogAddAccMT = Ti.UI.createAlertDialog({
							persistent : true,
							cancel : 0,
							buttonNames : ['Confirmar', 'Cancelar'],
							message : '¿Seguro de realizar esta acción?',
							title : 'Agregar o Eliminar Accesorios'
						});

						dialogAddAccMT.addEventListener('click', function(e) {

							Ti.API.info("Item Index: " + e.index);

							// Id de la cotizacion
							var idQuotationAddModelTemp = Alloy.Globals.ID_GLOBAL_QUOTATION;

							if (e.index == 0) {

								Ti.API.info('Vamos a agregar o eliminar accesorios');

								// Llamamos a la  funcion que guarda o elimina accesorios
								addOrDeleteAccessories();

							};

						});

						// Mostramos el dialogo
						dialogAddAccMT.show();

					});

				};

				// Metodo para mostrar menu dinamico
				activityAddAccessories.invalidateOptionsMenu();

				// Mostramos boton Home Icon
				actionBar.displayHomeAsUp = true;

				// Agregamos un titulo
				actionBar.title = "Accesorios";

				// Al hacer click en el boton Home Icon
				actionBar.onHomeIconItemSelected = function(e) {
						
					// Model Coveyor Temp
					var dataModelCoveyorTempQuoN = args;
			
					// Ventana
					var winSeeAccesoriesN = Alloy.createController('addQuotationFive', dataModelCoveyorTempQuoN).getView();
			
					// Abrimos la ventana
					winSeeAccesoriesN.open();
			
					// Cerramos la ventana actual
					$.addQuotationSix.close();
				};

			};

		};

	};

}); 


// FUNCION QUE AGREGA O ELIMINA ACCESORIOS

function addOrDeleteAccessories()
{
	Ti.API.info('Llamamos a la funcion agrega o eliminar accesorios');
	
	var idQuotationAccessorie;
	var idAccConv;
	var priceAccConv;
	var countAcc;
	var checkAcc;
	var backColorAccConv;
	var jsonAddDelAcc = [];
	
	// Recorremos los elemento
	$.viewContainerAccessories.children.forEach(function(objAcc, idx) {
		
		Ti.API.info('Numero de elementos: ' + idx);
		
		// ID del Quotation Accessory
		idQuotationAccessorie = objAcc.getChildren()[2].getChildren()[0].idQuotationAccessorie;
		Ti.API.info('idQuotationAccessorie: ' + idQuotationAccessorie);
		
		// ID del accesorio
		idAccConv   = objAcc.getChildren()[2].getChildren()[0].id;
		Ti.API.info('ID de elementos: ' + idAccConv);
		
		// Color de fondo del accesorio
		backColorAccConv = objAcc.children[2].backgroundColor;
		Ti.API.info('backColorAccConv: ' + backColorAccConv);
		
		// Validamos si esta seleccionado
		if (backColorAccConv == "#0B3C4C") {
			
			// Cantidad de accesorios
			countAcc    = objAcc.getChildren()[2].getChildren()[3].value;
		
			checkAcc = 1;
			
		} else if (backColorAccConv == "#000" || backColorAccConv == "#000000") {
			
			// Cantidad de accesorios
			countAcc = 0;
			
			checkAcc = 0;
			
		};
		
		Ti.API.info('countAcc: ' + parseInt(countAcc));
		Ti.API.info('checkAcc: ' + parseInt(checkAcc));
		
		// Precio accesorio
		priceAccConv = objAcc.getChildren()[2].getChildren()[1].priceAcc;
		Ti.API.info('Precio: ' + priceAccConv);
		
		// Llenamos el objeto con los datos
		jsonAddDelAcc.push({
			idQuotationAccessorie : idQuotationAccessorie,
			count                 : parseInt(countAcc),
			check                 : checkAcc,
			accessorie            : {
				id    : idAccConv,
				price : priceAccConv
			}
		});
		
	});
	
	Ti.API.info('JSON DE ACCESORIOS: ' + JSON.stringify(jsonAddDelAcc));
	
	// JSON FINAL DE ACCESORIOS
	var jsonFullAddDelAcc = {
		idQuotationTemp : idModelConTemp,
		listAccessoriesQuotationTemp : jsonAddDelAcc
		
	};
	
	Ti.API.info('JSON FINAL DE ACCESORIOS: ' + JSON.stringify(jsonFullAddDelAcc));
	
	// Llamamos a la funcion que agrega o elimina accesorios
	saveAddOrDelAccessories(jsonFullAddDelAcc);
	
}

// FUNCION PARA GUARDAR O ELIMINAR ACCESORIOS

function saveAddOrDelAccessories(jsonFullAddDelAcc) 
{

	// Url del servicio rest
	var url    = "http://" + Alloy.Globals.URL_GLOBAL_SIES + "/sies-rest/quotation/setAccessoriesToQuotationTemp";
	
	// Creamoss un cliente http
	var client = Ti.Network.createHTTPClient({
		// función de llamada cuando los datos de respuesta está disponible
		onload : function(e) {
			
			Ti.API.info("Received text: " + this.responseText);
			
			// Respuesta del servicio
			var objResponseWS = JSON.parse(this.responseText);
			
			// Model Coveyor Temp
			var dataModelCoveyorTempQuo = args;
			
			// Ventana
			var winSeeAccesories = Alloy.createController('addQuotationFive', dataModelCoveyorTempQuo).getView();
			
			// Abrimos la ventana
			winSeeAccesories.open();
			
			// Cerramos la ventana actual
			$.addQuotationSix.close();
			
			
		},
		// función de llamada cuando se produce un error, incluyendo un tiempo de espera
		onerror : function(e) {
			//Ti.API.debug(e.error);
		},
		timeout : 6000 // en milisegundos
	});
	
	// Preparar la conexión.
	client.open("POST", url);
	
	// Establecer la cabecera para el formato JSON correcta
	client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
	
	// Enviar la solicitud.
	client.send(JSON.stringify(jsonFullAddDelAcc)); 
	
}