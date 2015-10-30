/*	Function handlePageCategory:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageCategory. This function calls initializePageCategory
 *		if pageCategory isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageCategory( pageFrom, pageTo )
{
	if( pageTo != "pageCategory" )
		return false;
	
	console.log("handlePageCategory called");
	
	var $pageCategory = $('#pageCategory');			
	
	if( $pageCategory.jqmData('initialized') == undefined )
		initializePageCategory();
	
	return true;
}

/*	Function initializePageCategory:
 * 	Retrieve data related to categories from the dataProvider
 *		and update the pageCategory accordingly.
 */		
function initializePageCategory()
{
	var $pageCategory = $('#pageCategory');
	
	$('div.errorDiv', $pageCategory ).remove();
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to categories
	dataProvider.getCategories({
		success: 
			function( categories )
			{
				var $pageCategory = $('#pageCategory');
				
				appendCategoryToList( categories );				
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				// Set flag 'initialized' to true 
				// in order to prevent further initializations
				$pageCategory.jqmData('initialized', 'true');
			},
		error:
			function( errorData )
			{
				var $pageCategory = $('#pageCategory');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageCategory, errorData );
			}
	});
}

function appendCategoryToList( categories )
{
	var $listCategory = $('#listCategory');
	
	// Sostituito da <div id="pageCategoryHeader" in main.html
	/*
	var newListHeaderElement = 
		'<li data-role="list-divider">' +
			'<h1>Categorie</h1>' + 
		'</li>';

	$listCategory.append( newListHeaderElement );	
	*/
	
	// For each category create a new list element and
	// append it to the ul element
	$.each( categories, function( index, category )
	{
		var newListElement = 
			'<li data-icon="false">' +
			'<a href="#pageSubCategory" data-transition="slide">' + 
				'<h1>' + category.getName() + '</h1>' +
			'</a></li>';
			
		$listCategory.append( newListElement );
		
		// Save the id of the current category within the
		// corresponding list item 
		$('li:last', $listCategory ).jqmData('id', category.getID());
	});
	
	// Update the category ul element
	$listCategory.listview('refresh');
	
	// Once a list item is clicked then set the corresponding 
	// category ID as #pageSubCategory data 
	$('li', $listCategory ).bind('click', function()
	{
		var categoryID = $(this).jqmData('id');
		$('#pageSubCategory').jqmData('categoryID', categoryID );
	});	
}
