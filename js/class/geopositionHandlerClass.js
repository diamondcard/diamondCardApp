function GeopositionHandler()
{
	console.log('GeopositionHandler called');
	
	this.options = { enableHighAccuracy: true };
		this.watchID = 
			navigator.geolocation.watchPosition( GeopositionHandlerOnSuccess, 
				GeopositionHandlerOnError, this.options );
	
	this.userPosition = null;
}

GeopositionHandler.getInstance = function()
{
	if( arguments.callee.instance == undefined )
		arguments.callee.instance = new GeopositionHandler();
	return arguments.callee.instance; 
}

GeopositionHandler.prototype.getUserPosition = function( callback )
{
	console.log('GeopositionHandler.getUserPosition called');
	
	if( this.userPosition != null )
		callback.success( this.userPosition );
	else
	{
		console.log("User position not available");
		if( callback.error != undefined )
			callback.error();
		
		this.restartWatchingPosition();
	}	
}

GeopositionHandler.prototype.setUserPosition = function( position )
{
	console.log('GeopositionHandler.setUserPosition called');
	
	if( position != undefined )
		this.userPosition = position.coords;
	else
		this.userPosition = null;
}

GeopositionHandler.prototype.restartWatchingPosition = function( position )
{
	console.log('GeopositionHandler.restartWatchingPosition called');
	
	navigator.geolocation.clearWatch( this.watchID );
	this.watchID = 
		navigator.geolocation.watchPosition( GeopositionHandlerOnSuccess, 
			GeopositionHandlerOnError, this.options );
}


function GeopositionHandlerOnError( error )
{
    console.log('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
	
	var geopositionHandlerInstance = 
		GeopositionHandler.getInstance();
		
	geopositionHandlerInstance.setUserPosition();
}

function GeopositionHandlerOnSuccess( position )
{
	console.log('GeopositionHandlerOnSuccess called with position:');
	console.log( position );

	var geopositionHandlerInstance = 
		GeopositionHandler.getInstance();
	geopositionHandlerInstance.setUserPosition( position );
}