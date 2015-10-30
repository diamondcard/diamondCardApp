/*	Function handlePageCompanyMenuDetails:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageCompanyMenuDetails. This function always calls initializePageCompanyMenuDetails
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageCompanyMenuDetails( pageFrom, pageTo )
{
	if( pageTo != "pageCompanyMenuDetails" )
		return false;
	
	console.log("handlePageCompanyMenuDetails called");
	
	initializePageCompanyMenuDetails();
	
	return true;
}

/*	Function initializePageCompanyMenuDetails:
 * 			Retrieve data related to the specific company from the dataProvider
 *			and update the pageCompanyMenuDetails accordingly.
 */		
function initializePageCompanyMenuDetails()
{
	console.log('initializePageCompanyMenuDetails called');
	
	var $pageCompanyMenuDetails = $('#pageCompanyMenuDetails');
	var $listMenuDetails = $('#listMenuDetails');
	
	// Retrieve the companyID saved within the pageCompanyInfo div
	var companyID = $('#pageCompanyInfo').jqmData("companyID");
	
	// Retrieve the menuCategoryID saved within the pageCompanyMenuDetails div
	var menuCategoryID = $pageCompanyMenuDetails.jqmData("menuCategoryID");
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	$listMenuDetails.empty();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info
	// related to the specific company
	dataProvider.getCompanyMenu({
		companyID: companyID,
		success:
			function( company )
			{
				var menuCategory = company.getMenuCategories( menuCategoryID );
	
				addMenuCategoryToList( menuCategory );
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			}
	});
}

function addMenuCategoryToList( menuCategory )
{
	var $listMenuDetails = $('#listMenuDetails');
				
	var listHeader = 
		'<li data-role="list-divider">' + 
			menuCategory.getCategoryName() +
		'</li>';
				
	$listMenuDetails.append( listHeader );
	
	for( var index = 0; index < menuCategory.getNumberOfItems(); index++ )
	{
		var menuItem = menuCategory.getItems( index );
		var newListElement =
			'<li class="ui-li-has-thumb" data-icon="false">';
		
		if( menuItem.getThumbnail())
			newListElement +=
				'<p class="galleryImageContainer">' +
					'<a class="galleryImage" href="' + menuItem.getImage() + '">' +
						'<img src="' + menuItem.getThumbnail() + '"' +
							' alt="' + menuItem.getName() + '"/>' +
					'</a>' +
				'</p>';
		
		newListElement +=
				'<h1 class="menuItemName">' + menuItem.getName() + '</h1>' + 
				'<p class="menuItemIngredients">' + 
					menuItem.getIngredients() + 
				'</p>' + 
				'<p class="ui-li-count">' + 
					menuItem.getPrice() + 
				'</p>' +
			'</li>';
			
		$listMenuDetails.append( newListElement );
	}
	
	$listMenuDetails.listview('refresh');
	
	if( $('a.galleryImage', $listMenuDetails ).length != 0 )
	{
		$('a.galleryImage', $listMenuDetails ).photoSwipe(
		{
			enableMouseWheel: false , 
			enableKeyboard: false
		});
	}
}