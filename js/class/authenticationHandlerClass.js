var loginURL = "http://app.diamondcard.it/smartApp/json/login.php";

function AuthenticationHandler()
{
	this.isAuthenticated = false;
	this.username = null;
	this.password = null;
}

AuthenticationHandler.getInstance = function()
{
	if( arguments.callee.instance == undefined )
		arguments.callee.instance = new AuthenticationHandler();
	return arguments.callee.instance; 
}

AuthenticationHandler.prototype.isAuthenticated = function()
{
	console.log('AuthenticationHandler.isAuthenticated called');
	return this.isAuthenticated;	
}

AuthenticationHandler.prototype.getUsername = function()
{
	console.log('AuthenticationHandler.getUsername called');
	return this.username;	
}

AuthenticationHandler.prototype.setUsername = function( username )
{
	console.log('AuthenticationHandler.setUsername called');
	this.username = username;	
}

AuthenticationHandler.prototype.getPassword = function()
{
	console.log('AuthenticationHandler.getPassword called');
	return this.password;	
}

AuthenticationHandler.prototype.setPassword = function( password )
{
	console.log('AuthenticationHandler.setPassword called');
	this.password = password;	
}

AuthenticationHandler.prototype.login = function( options )
{
	console.log('AuthenticationHandler:login called with: ' + options.username + ' - ' + options.password );
	
	// Save the instance of the AuthenticationHandler calling login
	// in order to have a reference to it within the success callback
	var authenticationHandlerInstance = this;
	
	console.log('AuthenticationHandler.login: making an Ajax request');
	// Make the AJAX request to the remote server
	$.ajax({
		type: 'POST',
		data: { username: options.username, password: options.password },
		url: loginURL,
		dataType: 'json',
		success: 
			function( response )
			{
				if( response.code == 200 )
				{
					authenticationHandlerInstance.isAuthenticated = true;
					authenticationHandlerInstance.username = options.username;
					authenticationHandlerInstance.password = options.password;
				}
				
				options.success( response.code, response.message );				
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

AuthenticationHandler.prototype.logout = function()
{
	console.log('AuthenticationHandler.logout called');
	
	this.isAuthenticated = false;
	this.username = null;
	this.password = null;
	
	var dataProvider = DataProvider.getInstance();
	dataProvider.unsetBookmarks();
}
