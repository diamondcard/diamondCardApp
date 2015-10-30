/*	Function handlePageWhere:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageWhere. This function calls initializePageWhere
 *		if pageWhere isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageWhere( pageFrom, pageTo )
{
	if( pageTo != "pageWhere" )
		return false;
	
	console.log("handlePageWhere called");
	
	var $page = $('#pageWhere');			
	
	if( $page.jqmData('initialized') == undefined )
		initializePageWhere();
	
	if( $page.jqmData('initializedHandlers') == undefined )
		initializePageWhereHandlers();
		
	return true;
}

/*	Function initializePageWhere:
 * 		Retrieve data related to categories from the dataProvider, 
 *		and update the pageWhere accordingly.
 */
function initializePageWhere()
{
	console.log('initializePageWhere called');
	
	var $page = $('#pageWhere');
	var $pageWhereContent = $('#whereDiv');
	
	$pageWhereContent.hide();
	// Hide the div containing the city select element until a 
	// province is selected by the user
	$('#selectCityContainer').hide();
	
	$('div.errorDiv', $page ).remove();
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to provinces
	dataProvider.getProvinces({
		success:
			function( provinces )
			{
				var $page = $('#pageWhere');
				var $pageWhereContent = $('#whereDiv');
	
				var $selectProvince = $('#selectProvince');
								
				// For each province create a new option element and
				// append it to the select element
				$.each( provinces, function( index, province )
				{
					var newOptionElement = 
						'<option value="' + province.getID() + '">' 
							+ province.getName() + '</option>';
					$selectProvince.append( newOptionElement );
				});
						
				// Update the category select element
				$selectProvince.selectmenu('refresh');
				
				// Every time the user chooses a different category
				// update the subprovince select element
				$selectProvince.bind("change", updateCitySelect );
				
				$pageWhereContent.show();
	
				// Show the page loading dialog
				hidePageLoadingMsg();
				
				// Set flag 'initialized' to true in order to prevent further initializations
				$page.jqmData('initialized', 'true');
			},
		error:
			function( errorData )
			{
				var $page = $('#pageWhere');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $page, errorData );
			}
	});
}

/*	Function updateCitySelect:
 * 	Update the content of the city select element according
 *		to the province selected by the user within the province select
 *		element.	
 */
function updateCitySelect()
{
	console.log('updateCitySelect called');
	
	var $selectProvince = $('#selectProvince');
	var $selectCity = $('#selectCity');
	var $selectCityContainer = $('#selectCityContainer');
	var selectedProvinceID = 
		$('option:selected', $selectProvince ).attr('value');
	var selectedProvinceName =
		$('option:selected', $selectProvince ).text();
		
	// Empty the content of the subcategory select element
	$selectCity.empty();
	
	// If no province is selected then
	// hide the city select element
	if( selectedProvinceID == -1 )
	{
		$selectCityContainer.hide();
		return ;
	}
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to subcategories
	dataProvider.getCities({
		provinceID: selectedProvinceID,
		success: 
			function( province )
			{
				var defaultSelectCityChoise =
					'<option value="-1" data-placeholder="true">' +
					'Tutte le citt&agrave;...</option>';
				$selectCity.append( defaultSelectCityChoise );
				
				// For each city create a new option element and
				// append it to the select element
				$.each( province.getCities(), 
					function( index, city )
					{
						var setSelected = "";
						
						if( city.getName() == selectedProvinceName )
							setSelected = 'selected="selected"';
							 
						var newOptionElement = 
							'<option value="' + city.getID() + '" ' + setSelected + '>' + 
								city.getName() + '</option>';
						
						$selectCity.append( newOptionElement );
					});
				
				// Update the city select element
				$selectCity.selectmenu('refresh');
				// Show the div containing the city select element
				$selectCityContainer.show();
			}
	});
}

function initializePageWhereHandlers()
{
	console.log('initializePageWhatHandlers called');
	
	var $page = $('#pageWhere');
	
	$('#pageWhereSearch').bind('click', function()
	{
		var $pageResult = $('#pageResult');
		
		$pageResult.jqmData("pageFrom", "pageWhere" );	
		searchByOptions();
	});
	
	$page.jqmData('initializedHandlers', 'true');
}
