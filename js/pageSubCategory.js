/*	Function handlePageSubCategory:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageSubCategory. This function calls initializePageSubCategory
 *		if pageSubCategory isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageSubCategory( pageFrom, pageTo )
{
	if( pageTo != "pageSubCategory" )
		return false;
	
	console.log("handlePageSubCategory called");
	
	initializePageSubCategory( pageFrom );
	
	return true;
}

/*	Function initializePageSubCategory:
 * 	Retrieve data related to subcategories from the dataProvider
 *		and update the pageSubCategory accordingly.
 */		
function initializePageSubCategory( pageFrom )
{
	console.log("initializePageSubCategory called");	
	
	var $pageSubCategory = $('#pageSubCategory');
	var $pageSubCategoryHeader = $('div[data-role="header"] h1', $pageSubCategory );
	
	// Retrieve the categoryID saved 
	// within the pageSubCategory div.
	var categoryID = $pageSubCategory.jqmData('categoryID');			
	
	// Retrieve the savedCategoryID saved 
	// within the header of the pageSubCategory.
	var savedCategoryID = $pageSubCategoryHeader.jqmData("categoryID");
	
	// If savedCategoryID is equal to the categoryID then return 
	// since the pageSubCategory is already initialized.
	if( !categoryID ||
			savedCategoryID == categoryID )
		return ;
	
	// Show the page loading dialog
	showPageLoadingMsg();

	// Otherwise we need to redefine the content of the listSubCategory
	var $listSubCategory = $('#listSubCategory');
	var $pageSubCategoryHeader = $('#pageSubCategoryHeader');
				
	// Empty the content of the listSubCategory
	$listSubCategory.empty();
	$pageSubCategoryHeader.empty();
	
	var dataProvider = DataProvider.getInstance();	
	// Query the dataProvider in order to get info related to subcategories
	dataProvider.getSubCategories({
		categoryID: categoryID,
		success: 
			function( category )
			{
				appendSubCategoryToList( category );
								
				// Hide the page loading dialog
				hidePageLoadingMsg();
			}
	});
}

function appendSubCategoryToList( category )
{
	console.log("appendSubCategoryToList called");

	var $listSubCategory = $('#listSubCategory');
	var $pageSubCategoryHeader = $('#pageSubCategoryHeader');
	
	var newSubCategoryHeaderElement = category.getName();
		
	$pageSubCategoryHeader.append( newSubCategoryHeaderElement );
	
	/*
	var newListHeaderElement = 
		'<li data-role="list-divider">' +
			'<h1>' + category.getName() + '</h1>' +
		'</li>';
		
	$listSubCategory.append( newListHeaderElement );
	*/
	
	

		
	// For each subcategory create a new list element and
	// append it to the ul element
	$.each( category.getSubcategories(), 
		function( index, subcategory )
		{
			var newListElement = 
				'<li data-icon="false">' +
				'<a href="#pageResult">' + 
					'<h1>' + subcategory.getName() + '</h1>' + 
					'<span class="ui-li-count">' + 
						subcategory.getNumberOfCompanies() + 
					'</span>' +
				'</a></li>';
				
			$listSubCategory.append( newListElement );
			
			// Save the id of the current subcategory within the
			// corresponding list item 
			$('li:last', $listSubCategory ).jqmData('id', subcategory.getID());
		});
	
	// Update the category ul element
	$listSubCategory.listview('refresh');
	
	// Once a list item is clicked then set the corresponding 
	// subcategory ID as #pageResult data 
	$('li', $listSubCategory ).bind('click', function()
	{
		var $pageResult = $('#pageResult');
		
		var subCategoryID = $(this).jqmData('id');
		var subCategoryName = $('h1', $(this)).text();
		
		$pageResult.jqmData("selectedCategory", subCategoryName );	
		$pageResult.jqmData('queryString', 'categorie=' + subCategoryID );
	});
}
