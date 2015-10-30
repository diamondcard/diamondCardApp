/*	Function handlePageWhen:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageWhen. This function calls initializePageWhen
 *		if pageWhen isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageWhen( pageFrom, pageTo )
{
	if( pageTo != "pageWhen" )
		return false;
	
	console.log("handlePageWhen called");
	
	var $pageWhen = $('#pageWhen');			
	
	initializePageWhen();
	
	if( $pageWhen.jqmData('initializedHandlers') == undefined )
		initializePageWhenHandlers();
		
	return true;
}

function initializePageWhen()
{
	console.log("initializePageWhen called");
	
	var $selectCategory = $('#selectCategory');
	var selectedCategory = $('option:selected', $selectCategory ).attr('value');
	
	var $fieldsetLunchOrDinner = $('#fieldsetLunchOrDinner');
	
	if( selectedCategory == 8 )
		$fieldsetLunchOrDinner.show();
	else
		$fieldsetLunchOrDinner.hide();
}

function initializePageWhenHandlers()
{
	console.log("initializePageWhenHandlers called");
	
	
}