/*	Function handlePageCompanyMenu:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageCompanyMenu. This function always calls initializePageCompanyMenu
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageCompanyMenu( pageFrom, pageTo )
{
	if( pageTo != "pageCompanyMenu" )
		return false;
	
	console.log("handlePageCompanyMenu called");
	
	var $pageCompanyMenu = $('#pageCompanyMenu');
	
	if( $pageCompanyMenu.jqmData('initialized') == undefined )
		initializePageCompanyMenu();
	
	return true;
}

/*	Function initializePageCompanyMenu:
 * 			Retrieve data related to the specific company from the dataProvider
 *			and update the pageCompanyMenu accordingly.
 */		
function initializePageCompanyMenu()
{
	console.log('initializePageCompanyMenu called');
	
	var $pageCompanyMenu = $('#pageCompanyMenu');
	var $listMenu = $('#listMenu');
	
	// Retrieve the companyID saved within the pageCompanyInfo div
	var companyID = $('#pageCompanyInfo').jqmData("companyID");
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	$('div.errorDiv', $pageCompanyMenu ).remove();
	$listMenu.empty();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info
	// related to the specific company
	dataProvider.getCompanyMenu({
		companyID: companyID,
		success:
			function( company )
			{
				var $pageCompanyMenu = $('#pageCompanyMenu');
				
				appenMenuCategoriesToList( company );
					
				$pageCompanyMenu.jqmData('initialized', 'true');
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			},
		error:
			function( errorData )
			{
				var $pageCompanyMenu = $('#pageCompanyMenu');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageCompanyMenu, errorData );
			}
	});
}

function appenMenuCategoriesToList( company )
{
	var $listMenu = $('#listMenu');
				
	if( company.getNumberOfMenuCategories() == 0 )
	{
		var newListElement =
			'<li data-icon="false">' +
				'<h1 class="emptyMenu">Nessun menu presente</h1>'
			'</li>';
			
		$listMenu.append( newListElement );
	}
	
	for( var index = 0; index < company.getNumberOfMenuCategories(); index++ )
	{
		var menuCategory = company.getMenuCategories( index );

		if( menuCategory.getNumberOfItems())					
		{
			var newListElement =
				'<li data-icon="false">' +
				'<a href="#pageCompanyMenuDetails" data-transition="slide">' +
					'<h1 class="menuCategory">' + menuCategory.getCategoryName() + '</h1>' +
				'</a></li>';
				
			$listMenu.append( newListElement );
		
			// Save the id of the current menu category within the
			// corresponding list item
			$('li:last', $listMenu ).jqmData('menuCategoryID', index );
		}
	}
	
	$listMenu.listview('refresh');
	
	// Once a list item is clicked then set the corresponding 
	// menuCategoryID as #pageCompanyMenuDetails data 
	$('li', $listMenu ).bind('click', function()
	{
		var menuCategoryID = $(this).jqmData('menuCategoryID');
		$('#pageCompanyMenuDetails').jqmData('menuCategoryID', menuCategoryID );
	});
}