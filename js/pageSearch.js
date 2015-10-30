/*	Function handlePageSearch:
 *		Handles the pagebeforeshow event with a toPage parameter 
 *		equals to pageSearch. This function calls initializePageSearch
 *		if pageSearch isn't initialized, doing nothing otherwise.
 *	
 */
function handlePageSearch( pageFrom, pageTo )
{
	if( pageTo != "pageSearch" )
		return false;
	
	console.log("handlePageSearch called");
	
	var $page = $('#pageSearch');

	$('div.warningContainer', $page ).hide();
	$('div.searchForm input', $page ).attr('value', '');
	
	if( $page.jqmData('initializedHandlers') == undefined )
		initializePageSearchHandlers();
	
	return true;
}

function initializePageSearchHandlers()
{
	var $page = $('#pageSearch');
	
	$('#searchByNameButton').bind('click', searchByName );

	$('input[data-type="search"]', $page ).bind('keypress', function( event )
	{
		var searchTerm = $('div.searchForm input', $page ).attr('value');
		
		if( searchTerm.length >= 2 )
			$('div.warningContainer', $page ).hide();
		
		if( event.keyCode == 13 )
		{
			if( searchByName())
				window.location.href = "#pageResult";
		}
	});
	
	$page.jqmData('initializedHandlers', 'true');
}

function searchByName()
{
	console.log("searchByName called");
	
	var $pageSearch = $('#pageSearch');
	var $pageResult = $('#pageResult');
	 
	var searchTerm = $('div.searchForm input', $pageSearch ).attr('value');
	if( searchTerm.length < 3 )
	{
		$('div.warningContainer', $pageSearch ).show('bounce');
		
		return false;
	}

	$pageResult.jqmData("pageFrom", "pageSearch" );	
	$pageResult.jqmData('queryString', 'nome=' + searchTerm );
	return true;
}