/*	Function handlePageLogin:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageLogin. This function calls initializePageLogin
 *		if pageLogin isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageLogin( pageFrom, pageTo )
{
	if( pageTo != "pageLogin" )
		return false;
	
	console.log("handlePageLogin called");
	
	var $pageLogin = $('#pageLogin');			
	
	if( pageFrom == "pageBookmarks" ||
		pageFrom == "pageUser" )
		$('#backFromPageLogin').attr('href', '#pageMain');
	else if( pageFrom == "pageAddEvaluation")
		$('#backFromPageLogin').attr('href', '#pageCompanyRatings');
	else
		$('#backFromPageLogin').attr('href', "#" + pageFrom );
	
	initializePageLogin();
	
	$('div.isLogout', $pageLogin ).hide();
	if( $pageLogin.jqmData('isLogout'))
	{
		$pageLogin.jqmRemoveData('isLogout');
		$('div.isLogout', $pageLogin ).show();
	}
	
	if( $pageLogin.jqmData('initializedHandlers') == undefined )
		initializePageLoginHandlers();	
	
	return true;
}

function initializePageLogin()
{
	var $pageLogin = $('#pageLogin');
	var $pageLoginContent = $('#pageLoginContent');
	
	$('div.errorDiv', $pageLogin ).remove();
	$('div.warningContainer', $pageLogin ).hide();
	$('#pageLoginContent input').attr('value', '');
	
	var savedUsername = 
		window.localStorage.getItem('username');
	var savedPassword = 
		window.localStorage.getItem('password');	
	
	if( savedUsername != null )
		$('#pageLoginContent input[type="text"]').attr('value', savedUsername );	
	if( savedPassword != null )
		$('#pageLoginContent input[type="password"]').attr('value', savedPassword );
		
	$pageLoginContent.show();
}	

function initializePageLoginHandlers()
{
	console.log("initializePageLoginHandlers called");
	
	var $pageLogin = $('#pageLogin');

	$('input[type="text"]', $pageLogin ).bind('keypress', function()
	{
		if( event.keyCode == 13 )
			$('input[type="password"]', $pageLogin ).focus();
	});	
	
	$('input[type="password"]', $pageLogin ).bind('keypress', function()
	{
		if( event.keyCode == 13 )
			loginUser();
	});		
	
	$('#loginButton').bind('click', loginUser );
	
	$pageLogin.jqmData('initializedHandlers', 'true'); 
}

function loginUser()
{
	console.log("loginUser called");
	
	var $pageLogin = $('#pageLogin');
	
	var username =
		$('input[type="text"]', $pageLogin ).attr('value');
	var password =
		$('input[type="password"]', $pageLogin ).attr('value');
	
	if( username == "" )
	{
		$('div.warningContainer', $pageLogin ).text("Inserire lo username");
		$('div.warningContainer', $pageLogin ).show();
		
		return false;
	}
	
	if( password == "" )
	{
		$('div.warningContainer', $pageLogin ).text("Inserire la password");
		$('div.warningContainer', $pageLogin ).show();
		
		return false;
	}
	
	showPageLoadingMsg();	
	
	var authenticationHandler = AuthenticationHandler.getInstance();
	authenticationHandler.login({
		username: username,
		password: password,
		success: 
			function( code, message )
			{
				if( code == 200 )
				{
					console.log('User successfully authenticated');
					
					var $pageLogin = $('#pageLogin');
					
					var pageFrom = $pageLogin.jqmData('pageFrom');
					
					if( pageFrom == "pageUser" )
						$.mobile.changePage( $('#pageUser'), { transition: 'slide', reverse: true } );
					else if( pageFrom == "pageBookmarks" )
						$.mobile.changePage( $('#pageBookmarks'), { transition: 'slide', reverse: true } );
					else if( pageFrom == "pageAddEvaluation" )
						$.mobile.changePage( $('#pageAddEvaluation'), { transition: 'slide', reverse: true } );
					else if( pageFrom == "pageCompanyInfo" )
					{
						$('#pageCompanyInfo').jqmData('pageFrom', "pageLogin");
						$.mobile.changePage( $('#pageCompanyInfo'), { transition: 'slide', reverse: true } );
					}
					
					window.localStorage.setItem('username', username );
					window.localStorage.setItem('password', password );
				}
				else
				{
					$('div.warningContainer', $pageLogin ).text( message );
					$('div.warningContainer', $pageLogin ).show();
				}
				
				hidePageLoadingMsg();	
			},
		error:
			function( errorData )
			{
				var $pageLogin = $('#pageLogin');
				var $pageLoginContent = $('#pageLoginContent');
					
				$pageLoginContent.hide();
				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageLogin, errorData );
			}
	});
}