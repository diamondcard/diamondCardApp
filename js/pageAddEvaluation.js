/*	Function handlePageAddEvaluation:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageAddEvaluation. This function calls initializePageUser
 *		if pageAddEvaluation isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageAddEvaluation( pageFrom, pageTo )
{
	if( pageTo != "pageAddEvaluation" )
		return false;
	
	console.log("handlePageAddEvaluation called");
	
	var $pageAddEvaluation = $('#pageAddEvaluation');			
	
	initializePageAddEvaluation( pageFrom );
	
	if( $pageAddEvaluation.jqmData('initializedHandlers') == undefined )
		initializePageAddEvaluationHandlers();
	
	return true;
}

function initializePageAddEvaluation( pageFrom )
{
	console.log("initializePageAddEvaluation called");
	
	var $pageAddEvaluation = $('#pageAddEvaluation');	
	
	var authenticationHandler = 
		AuthenticationHandler.getInstance();
		
	if( !authenticationHandler.isAuthenticated )
	{
		var $pageLogin = $('#pageLogin');
		$pageAddEvaluation.jqmRemoveData('initialized');
		
		$('#pageAddEvaluationContent').hide();
		
		$pageLogin.jqmData('pageFrom', 'pageAddEvaluation');
		$.mobile.changePage( $pageLogin, { transition: 'slide' } );
	}
	else
	{
		if( $pageAddEvaluation.jqmData('initialized') == undefined )
			initializePageAddEvaluationContent( pageFrom );
	}	
}

function initializePageAddEvaluationContent( pageFrom )
{
	console.log("initializePageAddEvaluationContent called");
	
	var $pageAddEvaluation = $('#pageAddEvaluation');	
	var $pageAddEvaluationContent = $('#pageAddEvaluationContent');
	
	// Show the page loading dialog
	showPageLoadingMsg();

	$pageAddEvaluationContent.hide();
	
	var companyType = $('#pageAddEvaluation').jqmData('companyType');	
	
	var dataProvider = DataProvider.getInstance();
	dataProvider.getEvaluationTypes({
		companyType: companyType,
		success: 
			function( evaluationTypes )
			{
				var $pageAddEvaluation = $('#pageAddEvaluation');
				var $listComment = $('#listComment');
				
				appendEvaluationTypes( evaluationTypes );
				
				$pageAddEvaluationContent.show();
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			},
		error:
			function( errorData )
			{
				var $pageAddEvaluation = $('#pageAddEvaluation');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageAddEvaluation, errorData );
			}
	});
}

function appendEvaluationTypes( evaluationTypes )
{	
	console.log('appendEvaluationTypes called');
	
	var $listComment = $('#listComment');
	$listComment.empty();
	
	for( var index = 0; index < evaluationTypes.length; index++ )
	{				
		var evaluationType = evaluationTypes[index];
		
		var newListElement = 
			'<li data-icon="false">' + 
				'<h1>' + evaluationType.descrizione + '</h1>' + 
				'<p>' +
					'<select name="' + evaluationType.id + '">' +
						'<option value="1">Scarso</option>' +
						'<option value="2">Mediocre</option>' +
						'<option value="3" selected="selected">Sufficiente</option>' +
						'<option value="4">Buono</option>' +
						'<option value="5">Ottimo</option>' +
					'</select>' +
				'</p>' +
			'</li>';
		
		$listComment.append( newListElement );
		
	}
	
	$listComment.listview('refresh');
	$('select', $listComment ).selectmenu();
}


function initializePageAddEvaluationHandlers()
{
	console.log("initializePageAddEvaluationHandlers called");
	
	var $pageAddEvaluation = $('#pageAddEvaluation');	

	$('#saveEvaluationButton').bind('click', function()
	{
		console.log('saveEvaluationButton clicked');
		
		$('#saveEvaluationButton').unbind('click');
		
		var $selectElements = $('select', $pageAddEvaluation );
		var votes = "";
		$.each( $selectElements, function( index, selectElement )
		{
			var $selectElement = $(selectElement);
			
			if( index != 0 )
				votes += ",";
				
			votes += 
				$('option:selected', $selectElement).attr('value');
		});	
		
		var comment = $('textarea', $pageAddEvaluation ).attr('value');		
		var respectDiscount = $('input[type="radio"]:checked', $pageAddEvaluation ).attr('value');
		
		// Retrieve the companyID saved within the pageCompanyInfo div
		var companyID = $('#pageCompanyInfo').jqmData("companyID");
		
		var authenticationHandler = 
		AuthenticationHandler.getInstance();
		
		var queryString = "username=" + authenticationHandler.getUsername() +
			"&password=" + authenticationHandler.getPassword() +
			"&companyID=" + companyID +
			"&votes=" + votes +
			"&comment=" + comment +
			"&discountRespect=" + respectDiscount; 
			 
		// Show the page loading dialog
		showPageLoadingMsg();
					
		var dataProvider = DataProvider.getInstance();
		dataProvider.saveEvaluation({
			queryString: queryString,
			success:
				function()
				{
					console.log('evaluation added');
								
					// Hide the page loading dialog
					hidePageLoadingMsg();
					
			    	$('#pageCompanyRatings').jqmRemoveData('initialized');
			    	
					navigator.notification.confirm(
					    'Giudizio aggiunto correttamente.',
					    function() {
					    	$.mobile.changePage( $('#pageCompanyRatings'), { transition: 'slide', reverse: true } );	
					    },
					    'Fatto!',
					    'Fine'
					);
				},
			error:
				function()
				{
					console.log('evaluation not added');
					
					// Hide the page loading dialog
					hidePageLoadingMsg();
					
					/*
					navigator.notification.confirm(
					    'Si &egrave; verificato un errore',
					    function () {},
					    'Ops!',
					    'Fine'
					);
					*/
					navigator.notification.confirm(
					    'Connessione ad internet non disponibile, controlla le tue impostazioni di connessione.',
					    function () {},
					    'Ops!',
					    'Fine'
					);
				} 
		});
	});
}