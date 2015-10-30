/*	Function handlePageResult:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageResult. This function always calls initializePageResult
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageResult( pageFrom, pageTo )
{
	if( pageTo != "pageResult" )
		return false;
		
	console.log("handlePageResult called");
	
	var $pageResult = $('#pageResult');
	
	initializePageResult( pageFrom );
	
	if( $pageResult.jqmData('initializedHandlers') == undefined )
		initializePageResultHandlers();
	
	return true;
}

/*	Function initializePageResult:
 * 			Retrieve data related to companies from the dataProvider
 *			and update the pageResult accordingly.
 */		
function initializePageResult( pageFrom )
{
	console.log('initializePageResult called');
	
	var $pageResult = $('#pageResult');	
	var $listResult = $('#listResult');
	
	// Retrieve the query string saved within the pageResult div
	var queryString = $pageResult.jqmData("queryString");
	
	// Retrieve the previous query string saved within the listResult
	var savedQueryString = $listResult.jqmData("queryString");	
	
	if( savedQueryString == queryString )
		return ;
	
	// Otherwise we need to redefine the content of the listResult
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var $pageResultHeader = $('#pageResultHeader');
	var $pageResultFooter = $('div[data-role="footer"]', $pageResult );
	
	$('div.errorDiv', $pageResult ).hide();
	$pageResultFooter.hide();
	$pageResultHeader.empty();
	$('input[data-type="search"]', $pageResult ).attr('value', "");
		
	
	// Empty the content of the listResult
	$listResult.empty();	
	
	var defaultHeaderTitle = "<h1>Risultati ricerca</h1>";
	$pageResultHeader.append( defaultHeaderTitle );
	
	$('#backFromPageResultButton').attr('href', "#" + pageFrom );
	if( pageFrom == "pageSubCategory" )
	{
		var selectedCategory = $pageResult.jqmData("selectedCategory");
		var headerTitle = 
			'<h1>' + selectedCategory + '</h1>';
	
		$pageResultHeader.empty();
		$pageResultHeader.append( headerTitle );
	}
	
	var dataProvider = DataProvider.getInstance();
	dataProvider.unsetCompanies();
		
	// Query the dataProvider in order to get info related to companies
	dataProvider.getCompanies({
		queryString: queryString,
		success:
			function( companies )
			{
				var $pageResult = $('#pageResult');
				var $pageResultFooter = $('div[data-role="footer"]', $pageResult );
				
				var $listResult = $('#listResult');
				var $selectOrderMethod = $('#selectOrderMethod');
				
				// Save the queryString within the listResult 
				// in order to avoid further reinitializations 
				$listResult.jqmData("queryString", queryString );
				
				if( companies.length != 0 )
				{
					var $selectOrderMethod = $('#selectOrderMethod');
					$('option:selected', $selectOrderMethod ).removeAttr('selected');
					$('option[value="name"]', $selectOrderMethod ).attr('selected','selected');					
					$selectOrderMethod.selectmenu('refresh');
									
					$pageResultFooter.show();				
				
					// By default sort companies by name
					companies.sort( compareByName );
					// Add companies to the result list
					addCompaniesToResultList( companies );
					
					$('form', $pageResult ).show('blind', {}, 200, function()
					{
						$listResult.listview('refresh');
						
						// Hide the page loading dialog
						hidePageLoadingMsg();
					});
				}
				else
				{
					var emptyListElement = 
						'<li class="emptyListResult">' +
							'<h1>Nessun risultato trovato</h1>' +
						'</li>';
					
					$listResult.append( emptyListElement );
					
					// Update the category ul element
					$listResult.listview('refresh');
					$('form', $pageResult ).hide();
					
					// Hide the page loading dialog
					hidePageLoadingMsg();
				}
			},
		error:
			function( errorData )
			{
				var $pageResult = $('#pageResult');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageResult, errorData );
			}
	});
}

function initializePageResultHandlers()
{
	console.log('initializePageResultHandlers called');
	var $pageResult = $('#pageResult');
	
	$('#showResultsOnMap').bind('click', showResultsOnMap );
	$('#selectOrderMethod').bind('change', function()
	{
		console.log('selectOrderMethod change');
		
		var selectedOrderMethod = 
			$('option:selected', $(this)).attr('value');
			
		if( selectedOrderMethod == "name" )
			sortCompaniesByName();
		else if( selectedOrderMethod == "rating" )
			sortCompaniesByRating();
		if( selectedOrderMethod == "distance" )
			sortCompaniesByDistance();
	});
		
	$pageResult.jqmData('initializedHandlers', 'true');	
}

function showResultsOnMap()
{
	var $pageResult = $('#pageResult');
	var $pageMap = $('#pageMap');
	
	// Retrieve the query string saved within the pageResult div
	var queryString = $pageResult.jqmData("queryString");
 
	$pageMap.jqmData('queryString', queryString );
	$pageMap.jqmData('pageFrom', "pageResult" );
}

function sortCompaniesByName()
{
	console.log('sortCompaniesByName called');
	
	var $pageResult = $('#pageResult');
	var $listResult = $('#listResult');
	
	var isListEmpty = $('li.emptyListResult', $listResult );
	if( isListEmpty.length == 1 )
		return ;	
	
	// Show the page loading dialog
	showPageLoadingMsg();	
	
	// Retrieve the query string saved within the pageResult div
	var queryString = $pageResult.jqmData("queryString");
	
	// Empty the content of the listResult
	$listResult.empty();
	$listResult.hide();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to companies
	dataProvider.getCompanies({
		queryString: queryString,
		success:
			function( companies )
			{
				// Sort companies by name
				companies.sort( compareByName );
				// Add companies to the result list
				addCompaniesToResultList( companies, "name" );
				
				$listResult.show('blind', {}, 600, function()
				{
					// Hide the page loading dialog
					hidePageLoadingMsg();
				});
			}
	});	return compareByName( company1, company2 );
}

function sortCompaniesByDistance()
{
	console.log('sortCompaniesByDistance called');
	
	var $pageResult = $('#pageResult');
	var $listResult = $('#listResult');
	
	var isListEmpty = $('li.emptyListResult', $listResult );
	if( isListEmpty.length == 1 )
		return ;
		
	// Show the page loading dialog
	showPageLoadingMsg();
	
	// Retrieve the query string saved within the pageResult div
	var queryString = $pageResult.jqmData("queryString");
	
	// Empty the content of the listResult
	$listResult.empty();
	$listResult.hide();	
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to companies
	dataProvider.getCompanies({
		queryString: queryString,
		success:
			function( companies )
			{
				var geopositionHandlerInstance = 
					GeopositionHandler.getInstance();
		
				geopositionHandlerInstance.getUserPosition({
					success:	
						function( userPosition )
						{
							sortCompaniesByDistanceHavingPosition( companies, userPosition );
						},
					error:
						function()
						{
							var defaultUserPosition = new Array();

							defaultUserPosition.latitude = 38.135889;
							defaultUserPosition.longitude = 13.351371;
							
							sortCompaniesByDistanceHavingPosition( companies, defaultUserPosition );
						}
				});
			}
	});
}

function sortCompaniesByDistanceHavingPosition( companies, userPosition )
{
	var $listResult = $('#listResult');
							
	for( var index = 0; index < companies.length; index++ )
	{
		if( companies[index].getNumberOfLocations() != 0 )
			companies[index].getLocations(0).setDistance( userPosition );
	}
	
	// Sort companies by growing distance
	companies.sort( compareCompaniesByDistance );
	// Add companies to the result list
	addCompaniesToResultList( companies, "distance" );
	
	$listResult.show('blind', {}, 600, function()
	{
		// Hide the page loading dialog
		hidePageLoadingMsg();
	});	
}

function sortCompaniesByRating()
{
	console.log('sortCompaniesByRating called');
	
	var $pageResult = $('#pageResult');
	var $listResult = $('#listResult');
	
	var isListEmpty = $('li.emptyListResult', $listResult );
	if( isListEmpty.length == 1 )
		return ;
	
	// Show the page loading dialog
	showPageLoadingMsg();	
	
	// Retrieve the query string saved within the pageResult div
	var queryString = $pageResult.jqmData("queryString");
	
	// Empty the content of the listResult
	$listResult.empty();
	$listResult.hide();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to companies
	dataProvider.getCompanies({
		queryString: queryString,
		success:
			function( companies )
			{
				// Sort companies 
				companies.sort( compareCompaniesByRating );
				// Add companies to the result list
				addCompaniesToResultList( companies, "rating" );
				
				$listResult.show('blind', {}, 600, function()
				{
					// Hide the page loading dialog
					hidePageLoadingMsg();
				});
			}
	});
}


function addCompaniesToResultList( companies, orderType )
{	
	var $listResult = $('#listResult');
	
	// For each subcategory create a new list element and
	// append it to the ul element
	$.each( companies, 
		function( index, company )
		{
			var cssClasses = "";
			if( orderType == "name" )
				cssClasses = "extendedAddress";
			if( orderType == "rating" )
				cssClasses = "shortAddress";
						
			var newListElement = 
				'<li data-icon="false">' +
				'<a href="#pageCompanyInfo" data-transition="slide">' + 
					'<img src="' + company.getLogoSrc() + '" />' +
					'<h1>' + 
						'<span class="companyName">' + company.getName() + '</span>' +
					'</h1>' +					
					'<p class="companyAddress ' + cssClasses + '">' + 
						printCompanyAddress( company ) + 
					'</p>' +
					'<p class="companyCity ' + cssClasses + '">' + 
						printCompanyCity( company ) + 
					'</p>';
					
			if( orderType == "distance" )
			{
				newListElement += 
					'<p class="ui-li-count">' + getDistanceAsString( company ) + '</p>';
			}
			else if( orderType == "rating" )
			{
				var companyRating = company.getRatingValue();
				
				newListElement += 
					'<p class="ui-li-aside">' + 
						getCompanyStarAsImage( companyRating ) +
					'</p>';
			}
			
			newListElement += '</a></li>';
			
			$listResult.append( newListElement );
			
			// Save the id of the current company within the
			// corresponding list item
			$('li:last', $listResult ).jqmData('companyID', company.getID());
		});
	
	// Update the listResult element
	$listResult.listview('refresh');
		
	// Once a list item is clicked then set the corresponding 
	// company ID as #pageCompanyDetails data 
	$('li', $listResult ).bind('click', function()
	{
		var companyID = $(this).jqmData('companyID');
		var companyName = $('span.companyName', $(this)).text();
				
		preInitializePageCompanyInfo( companyID, companyName );
	});
}

function printCompanyAddress( company )
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

function printCompanyCity( company )
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