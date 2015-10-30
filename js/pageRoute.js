/*	Function handlePageRoute:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageRoute. This function always calls initializePageRoute
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageRoute( pageFrom, pageTo )
{
	if( pageTo != "pageRoute" )
		return false;
	
	console.log("handlePageRoute called");
	
	var $pageRoute = $('#pageRoute');
	var $listDirections = $('#listDirections');
	
	$listDirections.listview('refresh');
	
	return true;
}

function initializePageRoute( route )
{
	var $listDirections = $('#listDirections');
	
	$listDirections.empty();
	
	var steps = route.legs[0].steps;
	
	var startAddressListElement = 
		'<li data-role="list-divider">' + route.legs[0].start_address + '</li>';	
	
	var directionSummaryListElement = 
		'<li><h1 class="directionSummary">' + 
			route.legs[0].distance.text + ' - ' +
			route.legs[0].duration.text + 
		'</li>';	
	
	$listDirections.append( startAddressListElement );
	$listDirections.append( directionSummaryListElement );
	
	for( var index = 0; index < steps.length; index++ )
	{
		var step = steps[index];
		
		var newListElement = 
			'<li>' +
				'<h1>' +
					'<span class="directionIndex">' + ( index + 1 ) + '.</span>' +
					'<span class="directionInstruction">' + step.instructions + '</span>' +
				'</h1>' +
				'<p class="directionTiming ui-li-aside">' + step.distance.text + '</p>' + 
			'</li>';	
		
		$listDirections.append( newListElement );
	}	
	
	var endAddressListElement = 
		'<li data-role="list-divider">' + route.legs[0].end_address + '</li>';		

	$listDirections.append( endAddressListElement );
}

