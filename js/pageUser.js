/*	Function handlePageUser:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageUser. This function calls initializePageUser
 *		if pageUser isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageUser( pageFrom, pageTo )
{
	if( pageTo != "pageUser" )
		return false;
	
	console.log("handlePageUser called");
	
	var $pageUser = $('#pageUser');			
	
	initializePageUser( pageFrom );
	
	if( $pageUser.jqmData('initializedHandlers') == undefined )
		initializePageUserHandlers();
	
	return true;
}

function initializePageUser( pageFrom )
{
	console.log("initializePageUser called");
	
	var $pageUser = $('#pageUser');	
	
	var authenticationHandler = 
		AuthenticationHandler.getInstance();
		
	if( !authenticationHandler.isAuthenticated )
	{
		var $pageLogin = $('#pageLogin');
		$pageUser.jqmRemoveData('initialized');
		
		$('#pageUserContent').hide();
		$('#pageUserLogoutButton').hide();
		
		$pageLogin.jqmData('pageFrom', 'pageUser');
		$.mobile.changePage( $pageLogin, { transition: 'slide' } );
	}
	else
	{
		if( $pageUser.jqmData('initialized') == undefined )
			initializePageUserDetails( pageFrom );
	}	
}

function initializePageUserDetails( pageFrom )
{
	console.log("initializePageUserDetails called");
	
	var $pageUser = $('#pageUser');	
	var $pageUserContent = $('#pageUserContent');
	
	// Show the page loading dialog
	showPageLoadingMsg();

	$('#pageUserLogoutButton').show();
	$pageUserContent.hide();
		
	var authenticationHandler = 
		AuthenticationHandler.getInstance();
	
	var dataProvider = DataProvider.getInstance();
	dataProvider.getUserDetails({
		username: authenticationHandler.getUsername(),
		password: authenticationHandler.getPassword(),
		success: 
			function( jsonUser )
			{
				var $pageUserContent = $('#pageUserContent');
				var $pinErgDiv = $('#pinErgDiv');

				$('span.username', $pageUserContent ).text( jsonUser.firstName );

				var ergImage = '<img src="http://www.diamondcard.it/img/logo_erg.png" />';
				$pinErgDiv.append( ergImage );
				$('span.pinValue', $pinErgDiv ).text( jsonUser.pinErg );
				
				$pageUser.jqmData('initialized', 'true');
				
				$pageUserContent.show();
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			},
		error:
			function()
			{
				
			}
	});
}

function initializePageUserHandlers()
{
	console.log("initializePageUserHandlers called");
	
	var $pageUser = $('#pageUser');	

	$('#pageUserLogoutButton').bind('click', function()
	{
		var $pageUser = $('#pageUser');	
		var $pageLogin = $('#pageLogin');
		var $pageBookmarks = $('#pageBookmarks');
		
		var authenticationHandler = 
			AuthenticationHandler.getInstance();
		
		authenticationHandler.logout();

		$pageUser.jqmRemoveData('initialized');
		$pageBookmarks.jqmRemoveData('initialized');
		
		$('#pageUserLogoutButton').hide();
		
		$pageLogin.jqmData('isLogout', 'true');
		$pageLogin.jqmData('pageFrom', 'pageUser');
		$.mobile.changePage( $pageLogin, { transition: 'slide' } );
	});
	
	$pageUser.jqmData('initializedHandlers', 'true');
}