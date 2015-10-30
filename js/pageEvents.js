var EVENTS_PER_PAGE = 5;

/*	Function handlePageEvents:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageEvents. This function calls initializePageEvents
 *		if pageEvents isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageEvents( pageFrom, pageTo )
{
	if( pageTo != "pageEvents" )
		return false;
	
	console.log("handlePageEvents called");
	
	var $pageEvents = $('#pageEvents');			
	
	if( $pageEvents.jqmData('initialized') == undefined )
		initializePageEvents();
	
	if( $pageEvents.jqmData('initializedHandlers') == undefined )
		initializePageEventsEventHandler();
	
	return true;
}

/*	Function initializePageEvents:
 * 	Retrieve data related to events from the dataProvider
 *		and update the pageEvents accordingly.
 */		
function initializePageEvents()
{
	console.log('initializePageEvents called');
	
	var $pageEvents = $('#pageEvents');
	var $listEvents = $('#listEvents');
	
	$('div.errorDiv', $pageEvents ).remove();
	$listEvents.empty();
	$('#otherEventsButton').hide();
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to events
	dataProvider.getEvents({
		success: 
			function( events )
			{
				var $pageEvents = $('#pageEvents');
				
				appendEventsItem( events, 0, EVENTS_PER_PAGE );
							
				$('#otherEventsButton').show();
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				// Set flag 'initialized' to true 
				// in order to prevent further initializations
				$pageEvents.jqmData('initialized', 'true');
			},
		error:
			function( errorData )
			{
				var $pageEvents = $('#pageEvents');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageEvents, errorData );
			}
	});
}

function appendEventsItem( events, startIndex, endIndex )
{	
	console.log('appendEventsItem called (' + startIndex + ', ' + endIndex + ')');
	
	var $listEvents = $('#listEvents');
	
	endIndex += startIndex;
	if( endIndex > events.length )
		endIndex = events.length;
	
	// For each events create a new list element and
	// append it to the ul element
	for( var index = startIndex; index < endIndex; index++ )
	{				
		var event = events[index];
		
		var eventsDate = event.getDate();
		var dividerDateString = 
			months[eventsDate.getMonth()] + " " + eventsDate.getFullYear();
		var dateString = 
			eventsDate.getDate() + " " + months[eventsDate.getMonth()];
		
		var currentDividerDate = $('li[data-role="list-divider"]:last', $listEvents ).text();
		
		if( currentDividerDate != dividerDateString )
		{			
			$listEvents.append('<li data-role="list-divider">' + dividerDateString + '</li>');
			currentDividerDate = dividerDateString;
		}
		
		var newListElement = 
			'<li class="ui-li-has-thumb" data-icon="false">' + 
			'<a href="#pageEventDetails" data-transition="slide">' +
				'<img src="' + event.getImageSrc() + '" />' +
				'<h1>' + event.getTitle() + '</h1>' +
			'</a></li>';
		
		$listEvents.append( newListElement );
		
		// Save the id of the current events within the
		// corresponding list item 
		$('li:last', $listEvents ).jqmData('id', event.getID());
	}
	
	// Update the events ul element
	$listEvents.listview('refresh');
	
	// Once a list item is clicked then set the corresponding 
	// events ID as #pageEventsDetails data 
	$('li', $listEvents ).bind('click', function()
	{
		var eventID = $(this).jqmData('id');
		$('#pageEventDetails').jqmData('eventID', eventID );
	});		
	
	if( endIndex == events.length )
		$('#otherEventsButton').hide();
	else
		$('#otherEventsButton').show();
}

function initializePageEventsEventHandler()
{
	console.log('initializePageEventsEventHandler called');
	
	var $pageEvents = $('#pageEvents');
	
	$('#otherEventsButton').bind('click', function()
	{
		var $listEvents = $('#listEvents');
		var numberOfEvents = 
			$('li:not([data-role="list-divider"])', $listEvents ).length;
		
		var dataProvider = DataProvider.getInstance();
		dataProvider.getEvents({
			success: 		
				function( events )
				{
					appendEventsItem( events, numberOfEvents, EVENTS_PER_PAGE );
				}
		});
		
		return false;
	});				
	
	$('#pageEventsRefreshButton').bind('click', function()
	{
		var $pageEvents = $('#pageEvents');
		
		var dataProvider = DataProvider.getInstance();
		dataProvider.unsetEvents();

		$pageEvents.jqmRemoveData('initialized');
		initializePageEvents();
		
		return false;
	});
	
	$pageEvents.jqmData('initializedHandlers', 'true');
}