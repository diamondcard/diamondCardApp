/*	Function handlePageWhat:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageWhat. This function calls initializePageWhat
 *		if pageWhat isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageWhat( pageFrom, pageTo )
{
	if( pageTo != "pageWhat" )
		return false;
	
	console.log("handlePageWhat called");
	
	var $page = $('#pageWhat');			
	
	if( $page.jqmData('initialized') == undefined )
		initializePageWhat();
	
	if( $page.jqmData('initializedHandlers') == undefined )
		initializePageWhatHandlers();
	
	return true;
}

/*	Function initializePageWhat:
 * 		Retrieve data related to categories from the dataProvider, 
 *		and update the pageWhat accordingly.
 */
function initializePageWhat()
{
	console.log('initializePageWhat called');
	
	var $page = $('#pageWhat');
	var $pageWhatContent = $('#whatDiv'); 
	var $warningContainers = $('div.warningContainer', $page );
		
	$warningContainers.hide();
	$pageWhatContent.hide();
	
	// Hide the div containing the subcategory select element until a 
	// category is selected by the user
	$('#selectSubCategoryContainer').hide();
				
	$('div.errorDiv', $page ).remove();
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to categories
	dataProvider.getCategories({
		success:
			function( categories )
			{
				var $page = $('#pageWhat');
				var $pageWhatContent = $('#whatDiv');
				var $selectCategory = $('#selectCategory');				
				// For each category create a new option element and
				// append it to the select element
				$.each( categories, function( index, category )
				{
					var newOptionElement = 
						'<option value="' + category.getID() + '">' 
							+ category.getName() + '</option>';
					$selectCategory.append( newOptionElement );
				});
				
				// Update the category select element
				$selectCategory.selectmenu('refresh');
				
				// Every time the user chooses a different category
				// update the subcategory select element
				$selectCategory.bind("change", updateSubCategorySelect );				
				
				$pageWhatContent.show();
				
				hidePageLoadingMsg();
				
				// Set flag 'initialized' to true in order to prevent further initializations
				$page.jqmData('initialized', 'true');
			},
		error:
			function( errorData )
			{
				var $page = $('#pageWhat');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $page, errorData );
			}
	});	
}

/*	Function updateSubCategorySelect:
 * 	Update the content of the subcategory select element according
 *		to the category selected by the user within the category select
 *		element.	
 */
function updateSubCategorySelect()
{
	console.log('updateSubCategorySelect called');
	
	var $page = $('#pageWhat');
	var $selectCategory = $('#selectCategory');
	var $selectSubCategory = $('#selectSubCategory');
	var $selectSubCategoryContainer = 
		$('#selectSubCategoryContainer');
	var selectedCategoryID = 
		$('option:selected', $selectCategory ).attr('value');
	
	var $warningContainers = $('div.warningContainer', $page );
		
	$warningContainers.hide();
	
	// Empty the content of the subcategory select element
	$selectSubCategory.empty();	
	
	// If no macro category is selected then
	// hide the subcategory select element
	if( selectedCategoryID == -1 )
	{
		$selectSubCategoryContainer.hide();
		return ;
	}
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to subcategories
	dataProvider.getSubCategories({
		categoryID: selectedCategoryID,
		success: 
			function( category )
			{
				var defaultSelectSubCategoryChoise =
					'<option value="-1" data-placeholder="true">' +
					'Tutte le categorie...</option>';
				$selectSubCategory.append( defaultSelectSubCategoryChoise );
				
				// For each subcategory create a new option element and
				// append it to the select element
				$.each( category.getSubcategories(), 
					function( index, subcategory )
					{
						var newOptionElement = 
							'<option value="' + subcategory.getID() + '">' 
								+ subcategory.getName() + '</option>';
						$selectSubCategory.append( newOptionElement );
					});
				
				// Update the subcategory select element
				$selectSubCategory.selectmenu('refresh');
				
				// Every time the user chooses a different subcategory
				// empty the warning div
				$selectSubCategory.bind("change", function()
				{
					var $page = $('#pageWhat');
					var $warningContainer =
						$('div.warningContainer', $page );
			
					$warningContainer.hide();
				});	

				// Show the div containing the subcategory select element
				$selectSubCategoryContainer.show();
			}
	});
}

function initializePageWhatHandlers()
{
	console.log('initializePageWhatHandlers called');
	
	var $page = $('#pageWhat');
	var $searchForwardButton = $('a.searchForwardButton', $page ); 
	
	$searchForwardButton.bind('click', function()
	{
		var $selectCategory = $('#selectCategory');
		var $selectSubCategory = $('#selectSubCategory');
		
		var selectedCategoryID = 
			$('option:selected', $selectCategory ).attr('value');
		var selectedSubCategoryID = 
			$('option:selected', $selectSubCategory ).attr('value');
			
		if( selectedCategoryID == -1 )
		{
			var $selectCategoryContainer = 
				$('#selectCategoryContainer');
			var $warningContainer =
				$('div.warningContainer', $selectCategoryContainer );
			
			$warningContainer.show('blink');
			return false;
		}
		
		if( selectedSubCategoryID == -1 )
		{
			console.log("Selezionare almeno una sotto categoria");		
			var $selectSubCategoryContainer = 
				$('#selectSubCategoryContainer');
			var $warningContainer =
				$('div.warningContainer', $selectSubCategoryContainer );
			
			$warningContainer.show('blink');
			return false;
		}
	});
	
	$('#pageWhatSearch').bind('click', function()
	{
		var $pageResult = $('#pageResult');
		 
		$pageResult.jqmData("pageFrom", "pageWhat" );	
		searchByOptions();
	});
	
	$page.jqmData('initializedHandlers', 'true');
}
