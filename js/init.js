
function initializeApp()
{
	loadGoogleMapsScript();
}

var isGoogleMapsAPILoaded = false;
	
function initializeGoogleMapsAPI()
{
	console.log("initializeGoogleMapsAPI called");
	
  	isGoogleMapsAPILoaded = true;
}

function loadGoogleMapsScript()
{
	console.log("loadGoogleMapsScript called");
	
 	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://maps.google.com/maps/api/js?sensor=true&language=it&callback=initializeGoogleMapsAPI";
	
	document.body.appendChild( script );
}

var DEFAULT_LOADER_MESSAGE = "Caricamento";

function showPageLoadingMsg( loaderMessage )
{
	console.log("showPageLoadingMsg called");
	
	var newLoaderMessage = DEFAULT_LOADER_MESSAGE;
	if( loaderMessage != undefined &&
			loaderMessage != "" )
		newLoaderMessage = loaderMessage;
	
	$('#pageLoader h1').text( newLoaderMessage );
	$('#pageLoader').show();
}

function hidePageLoadingMsg()
{
	console.log("hidePageLoadingMsg called");
	
	$('#pageLoader').hide();
}		