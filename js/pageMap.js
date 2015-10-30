var DEFAULT_POSITION = null;

var map = null;

var directionsRenderer;
var directionsService;

var companyMarkerIcon = null;
var userMarkerIcon = null;

var userMarker = null;
var markers = null;
var infoWindow = null;

var userPositionCircle = null;
var userPositionCircleStroke = null;

/*	Function handlePageMap:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageMap. This function always calls initializePageMap
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageMap( pageFrom, pageTo )
{
	if( pageTo != "pageMap" )
		return false;
	
	console.log("handlePageMap called");
	
	var $pageMap = $('#pageMap');
	
	handlePageFrom();	
	
	if( !isGoogleMapsAPILoaded )
		showErrorDivOnMapPage();
	else
	{
		if( map == null )
			initializeMapCanvas();
	
		initializePageMap();
	}
	
	if( $pageMap.jqmData('initializedHandlers') == undefined )
		initializePageMapHandlers();

	return true;
}


function handlePageFrom()
{
	var $pageMap = $('#pageMap');
	var pageFrom = $pageMap.jqmData("pageFrom");
	
	if( pageFrom == "pageResult" )
		$('#backFromPageMap').attr('href', "#pageResult");	
	else if( pageFrom == "pageCompanyInfo" )
		$('#backFromPageMap').attr('href', "#pageCompanyInfo");
}

var googleMapsLoadingTimeout;
function showErrorDivOnMapPage()
{
	console.log("showErrorDivOnMapPage called");
	
	var $pageMap = $('#pageMap');
	var $pageMapContent = $('div[data-role="content"]', $pageMap );
	var $mapContainer = $('#mapCanvas', $pageMapContent );
	
	$('div.errorDiv', $pageMap ).remove();
	$('div.mapNavBarOnResults', $pageMap ).hide();
	$('div.mapNavBarOnCompanyInfo', $pageMap ).hide();
	$mapContainer.hide();
	
	/*
	var errorDiv = 
		'<div class="errorDiv">' + 
			'<p>Ops! Si &egrave; verificato un errore.</p>' +
			'<a class="tryAgainButton"' +
				' data-role="button"' +
				' data-mini="true"' +
				' data-inline="true"' +
				' data-theme="b">Riprova</a>' +
		'</div>';
	*/	
	var errorDiv = 
		'<div class="errorDiv">' + 
			'<p>Ops! Connessione ad internet non disponibile, controlla le tue impostazioni di connessione.</p>' +
			'<a class="tryAgainButton"' +
				' data-role="button"' +
				' data-mini="true"' +
				' data-inline="true"' +
				' data-theme="b">Riprova</a>' +
		'</div>';
	
	$pageMapContent.append( errorDiv );
	$('a.tryAgainButton', $pageMapContent ).button();
	$('a.tryAgainButton', $pageMapContent ).bind('click', function()
	{
		var script = document.createElement("script");
  		script.type = "text/javascript";
  		script.src = "http://maps.google.com/maps/api/js?sensor=false&language=it&callback=initializeGoogleMapsAPIFromPageMap";
  		document.body.appendChild( script );
  		
  		// Show the page loading dialog
		showPageLoadingMsg();
		
		googleMapsLoadingTimeout = 
			setTimeout('hidePageLoadingMsg();', 5000 );
	});
}

function initializeGoogleMapsAPIFromPageMap()
{
	console.log('initializeGoogleMapsAPIFromPageMap called');
	 
	isGoogleMapsAPILoaded = true;
	initializeMapCanvas();
	initializePageMap();
	clearTimeout( googleMapsLoadingTimeout );
}


/*	Function initializePageMap:
 * 			Retrieve data related to companies from the dataProvider
 *			and update the pageMap accordingly by displaying a marker
 *			for each returned company.
 */		
function initializePageMap()
{
	console.log('initializePageMap called');
	
	var $pageMap = $('#pageMap');
	var $mapContainer = $('#mapCanvas', $pageMap );
	
	$('div.errorDiv', $pageMap ).remove();
		
	// Retrieve the query string saved within the pageMap div
	var queryString = $pageMap.jqmData("queryString");
	
	// Retrieve the previous query string saved within the mapContainer
	var savedQueryString = $mapContainer.jqmData("queryString");	
	
	$mapContainer.show();	
	
	if( savedQueryString == queryString )
		return ;
	
	// Otherwise we need to redefine the content of the pageMap	
	$('div.mapNavBarOnResults', $pageMap ).hide();
	$('div.mapNavBarOnCompanyInfo', $pageMap ).hide();
	
	// Show the page loading dialog
	showPageLoadingMsg();
					
	var pageFrom = $pageMap.jqmData("pageFrom");
	if( pageFrom == "pageResult" )
	{
		console.log("pageMap: coming from pageResult");
		
		var dataProvider = DataProvider.getInstance();
		// Query the dataProvider in order to get info related to companies
		dataProvider.getCompanies({
			queryString: queryString,
			success:
				function( companies )
				{
					var $pageMap = $('#pageMap');
					var $mapCanvas = $('#mapCanvas', $pageMap );

					// Save the queryString within the mapCanvas 
					// in order to avoid further reinitializations 
					$mapCanvas.jqmData("queryString", queryString );
					
					directionsRenderer.setMap( null );
	
					setCompaniesMarkers( companies );
					showUserPosition();
					
					$('div.mapNavBarOnResults', $pageMap ).show();
				}
		});
	}
	else if( pageFrom == "pageCompanyInfo" )
	{
		console.log("pageMap: coming from pageCompanyInfo");
		
		var dataProvider = DataProvider.getInstance();
		// Query the dataProvider in order to get info
		// related to the specific company
		dataProvider.getCompanyDetails({
			companyID: queryString,
			success:
				function( company )
				{
					var $pageMap = $('#pageMap');
					var $mapCanvas = $('#mapCanvas', $pageMap );
	
					// Save the queryString within the mapCanvas 
					// in order to avoid further reinitializations 
					$mapCanvas.jqmData("queryString", queryString );
					
					var companies = new Array( company );
					setCompaniesMarkers( companies );		
					
					getDirections( company );
					
					$('div.mapNavBarOnCompanyInfo', $pageMap ).show();
				}
		});	
	}
}

function initializePageMapHandlers()
{
	console.log('initializePageMapHandlers called');
	
	var $pageMap = $('#pageMap');
	
	$pageMap.bind('pageshow', function()
	{
		if( map != null )
		{
			$('#pageMap div[data-role="content"]').height( 
				$('#pageMap').height() - 15 -
				2 * $('#pageMap div[data-role="footer"]').height());	
			
			google.maps.event.trigger( map, 'resize');
			centerOnUserPosition();
			setMapBounds();
		}	
	});
	
	$pageMap.jqmData('initializedHandlers', 'true');
}

function initializeMapCanvas()
{
	console.log('initializeMapCanvas called');
	
	var $pageMap = $('#pageMap');
	var $mapCanvas = $('#mapCanvas', $pageMap );
	
	DEFAULT_POSITION = 
		new google.maps.LatLng( 38.135889, 13.351371 );
	
	var userPosition = DEFAULT_POSITION;
	
	companyMarkerIcon = new google.maps.MarkerImage(
		"./css/images/marker_red.png",
		null,
		null,
		null,
		new google.maps.Size(28, 35));	
	
	userMarkerIcon = new google.maps.MarkerImage(
		"./css/images/marker_blue.png",
		null,
		null,
		null,
		new google.maps.Size(28, 35));	
	
	var mapDefaultOptions =
	{
		zoom: 14,
		center: userPosition,
		mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map = new google.maps.Map(
	    	document.getElementById("mapCanvas"),
		    mapDefaultOptions );
	
	var directionsRendererOptions =
	{
		draggable: false,
		map: map,
		suppressMarkers: true,
		suppressInfoWindows: true
	}		
	directionsRenderer = 
		new google.maps.DirectionsRenderer( directionsRendererOptions );
	
	directionsService = 
		new google.maps.DirectionsService();
}

function showUserPosition( coords )
{
	console.log('showUserPosition called');
	
	var geopositionHandlerInstance = 
		GeopositionHandler.getInstance();
		
	geopositionHandlerInstance.getUserPosition({
		success:
			function( userPosition )
			{
				var currentUserPosition = 
					new google.maps.LatLng( userPosition.latitude, 
						userPosition.longitude );
	
				var accuracy = 10000;
				if( userPosition.accuracy < 10000 )
					accuracy = userPosition.accuracy;
				
				setMarkerAndCircleOnUserPosition( currentUserPosition, accuracy );
			},
		error:
			function()
			{
				setMarkerAndCircleOnUserPosition( DEFAULT_POSITION, 10000 );
			}
	});
}

function setMarkerAndCircleOnUserPosition( currentUserPosition, accuracy )
{					
	var circleOptions = {
		strokeWeight: 0,
		fillColor: "#0000ff",
		fillOpacity: 0.2,
		map: map,
		center: currentUserPosition,
		radius: accuracy,
		clickable: false
	};
	
	var circleStrokeOptions = {
		strokeWeight: 1,
		strokeOpacity: 0.5,
		strokeColor: "#000066",
		fillOpacity: 0,
		map: map,
		center: currentUserPosition,
		radius: accuracy,
		clickable: false
	};
	
	if( userPositionCircle != null )
		userPositionCircle.setMap( null );
	
	userPositionCircle = 
		new google.maps.Circle( circleOptions );
	
	if( userPositionCircleStroke != null )
		userPositionCircleStroke.setMap( null );
	
	userPositionCircleStroke = 
		new google.maps.Circle( circleStrokeOptions );
	
	if( userMarker != null )
		userMarker.setMap( null );
		
	userMarker = new google.maps.Marker(
	{
		animation: google.maps.Animation.DROP,
		icon: userMarkerIcon,
		map: map,
		draggable: false,
		position: currentUserPosition
	});
}

function centerOnUserPosition()
{
	console.log('centerOnUserPosition called');
	
	var geopositionHandlerInstance = 
		GeopositionHandler.getInstance();
	
	geopositionHandlerInstance.getUserPosition({
		success:
			function( userPosition )
			{
				var currentUserPosition = 
					new google.maps.LatLng( userPosition.latitude, 
						userPosition.longitude );
						
				map.panTo( currentUserPosition );
				map.setZoom(18);
			},
		error:
			function()
			{
				map.panTo( DEFAULT_POSITION );
				map.setZoom(18);
			}
	});
}

function setMapBounds()
{
	console.log("setMapBounds called");
	
	var geopositionHandlerInstance = 
		GeopositionHandler.getInstance();
	
	geopositionHandlerInstance.getUserPosition({
		success:
			function( userPosition )
			{
				var currentUserPosition = 
					new google.maps.LatLng( userPosition.latitude, 
						userPosition.longitude );
				
				mapBounds = new google.maps.LatLngBounds( currentUserPosition,
					currentUserPosition );
				
				if( markers != null )		
					for( var index = 0; index < markers.length; index++ )
						mapBounds = mapBounds.extend( markers[index].getMarker().getPosition()); 		
				
				map.fitBounds( mapBounds );
					
				// Hide the page loading dialog
				hidePageLoadingMsg();
			},
		error:
			function()
			{
				mapBounds = new google.maps.LatLngBounds( DEFAULT_POSITION,
					DEFAULT_POSITION );
				
				if( markers != null )			
					for( var index = 0; index < markers.length; index++ )
						mapBounds = mapBounds.extend( markers[index].getMarker().getPosition()); 		
				
				map.fitBounds( mapBounds );
					
				// Hide the page loading dialog
				hidePageLoadingMsg();
			}
	});
}

function setCompaniesMarkers( companies )
{
	console.log('setCompaniesMarkers called');
	
	if( markers != null )
		unsetMarkers();
		
	markers = new Array();
	
	for( var index = 0; index < companies.length; index++ )
	{
		var company = companies[index];
		
		if( company.getNumberOfLocations() != 0 )	
		{
			var mainLocation = company.getLocations(0);
			
			if( mainLocation.getLatitude() != null &&
					mainLocation.getLongitude() != null )
			{
				var companyLatLng = 
					new google.maps.LatLng( 
						mainLocation.getLatitude(),
						mainLocation.getLongitude());
				
				var marker = 
					new google.maps.Marker(
					{
						animation: google.maps.Animation.DROP,
						icon: companyMarkerIcon,
						map: map,
						draggable: false,
						position: companyLatLng
					});
				
				google.maps.event.addListener( marker, 'click', markerClickEventHandler );
				
				markers.push( new MarkerWrapper( marker, company ));
			}
		}
	}
}

function markerClickEventHandler()
{
	for( var index = 0; index < markers.length; index++ )
	{
		if( markers[index].getMarker() == this )
		{
			if( infoWindow != null )
				infoWindow.close();
			
			infoWindow = 
				new google.maps.InfoWindow(
				{
		            content: markers[index].getInfoWindowContent()
				});
				
			infoWindow.open( map, this );
			
			var companyID = markers[index].getCompanyID();
			var companyName = markers[index].getCompanyName();
			
			preInitializePageCompanyInfo( companyID, companyName );			
			
			return ;
		}
	}	
}

function getDirections( company )
{
	console.log('showDirections called');
	
	var geopositionHandlerInstance = 
		GeopositionHandler.getInstance();
	
	geopositionHandlerInstance.getUserPosition({
		success:
			function( userPosition )
			{
				var currentUserPosition = new google.maps.LatLng( 
					userPosition.latitude, 
					userPosition.longitude );
				
				setDirectionsOnMap( currentUserPosition, company );
			},
		error:
			function()
			{
				setDirectionsOnMap( DEFAULT_POSITION, company );
			}
	});			
}

function setDirectionsOnMap( currentUserPosition, company )
{
	var latitude = company.getLocations(0).getLatitude();
	var longitude = company.getLocations(0).getLongitude();			
	var destinationPoint = new google.maps.LatLng( latitude, longitude );
	
	var request = {
		origin: currentUserPosition,
		destination: destinationPoint,
		travelMode: google.maps.TravelMode.DRIVING,
		unitSystem: google.maps.UnitSystem.METRIC
	};
	
	directionsService.route( request, function( response, status )
	{
		if( status == google.maps.DirectionsStatus.OK )
		{						
			showUserPosition();
			centerOnUserPosition();
			
			google.maps.event.addListenerOnce( map, 'idle', function()
			{
				directionsRenderer.setMap( map );
				directionsRenderer.setDirections( response );
	
				// Hide the page loading dialog
				hidePageLoadingMsg();	
			});
			
			initializePageRoute( response.routes[0] );
		}
		else
		{
			// Hide the page loading dialog
			hidePageLoadingMsg();
		}
	});	
}

function unsetMarkers()
{
	console.log('unsetMarkers called');
	
	for( var index = 0; index < markers.length; index++ )
		markers[index].getMarker().setMap( null );
}

function MarkerWrapper( marker, company )
{
	this.marker = marker;
	this.companyID = company.getID();
	this.companyName = company.getName();
	
	this.setInfoWindowContent( company ); 
}

MarkerWrapper.prototype.getMarker = function()
{
	return this.marker;	
}

MarkerWrapper.prototype.setMarker = function( marker )
{
	this.marker = marker;	
}

MarkerWrapper.prototype.getCompanyID = function()
{
	return this.companyID;	
}

MarkerWrapper.prototype.setCompanyID = function( companyID )
{
	this.companyID = companyID;	
}

MarkerWrapper.prototype.getCompanyName = function()
{
	return this.companyName;	
}

MarkerWrapper.prototype.setCompanyName = function( companyName )
{
	this.companyName = companyName;	
}


MarkerWrapper.prototype.getInfoWindowContent = function( companyID )
{
	return this.infoWindowContent;
}

MarkerWrapper.prototype.setInfoWindowContent = function( company )
{
	this.infoWindowContent = 
		'<div class="infoWindowContent">' +
			'<img src="' + company.getLogoSrc() + '" />' +
			'<p class="companyName">' + 
				company.getName() + 
			'</p>' +
			'<p class="companyAddress">' + 
				printCompanyAddressInfoWindow( company ) + 
			'</p>' +
			'<p class="companyCity">' + 
				printCompanyCityInfoWindow( company ) + 
			'</p>' +
			'<a href="#pageCompanyInfo"' + 
				' data-role="button"' + 
				' data-mini="true"' + 
				' data-inlie="true"' + 
				' data-corners="true"' + 
				' data-shadow="true"' + 
				' data-iconshadow="true"' + 
				' data-wrapperels="span"' + 
				' data-theme="c"' + 
				' class="ui-btn ui-shadow' + 
					' ui-btn-corner-all' + 
					' ui-mini ui-btn-up-c">' + 
				'<span class="ui-btn-inner' + 
					' ui-btn-corner-all">' + 
					'<span class="ui-btn-text">' + 
						'Scheda convenzionato' + 
					'</span>' + 
				'</span>' + 
			'</a>' +
		'</div>';
}

function printCompanyAddressInfoWindow( company )
{
	var locationString = "";
	
	if( company.getNumberOfLocations() != 0 )
	{		
		var mainLocation = company.getLocations(0);
		
		if( mainLocation.getAddress()) 
			locationString += mainLocation.getAddress();
	}
	
	return locationString; 
}

function printCompanyCityInfoWindow( company )
{
	var locationString = "";
	
	if( company.getNumberOfLocations() != 0 )
	{		
		var mainLocation = company.getLocations(0);
		
		if( mainLocation.getZipCode())
			locationString += mainLocation.getZipCode();
				
		if( mainLocation.getCity())
		{ 
			if( locationString == "" )		
				locationString += mainLocation.getCity();
			else
				locationString += " - " + mainLocation.getCity();
		}
				
		if( mainLocation.getProvince()) 
			locationString += 
				' (<span class="province">' + 
					mainLocation.getProvince() +
				'</span>)';
	}
	
	return locationString; 
}