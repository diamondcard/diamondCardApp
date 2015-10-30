/*	Function handlePageEventDetails:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageEventDetails. This function calls initializePageEventDetails
 *		if pageEventDetails isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageEventDetails( pageFrom, pageTo )
{
	if( pageTo != "pageEventDetails" )
		return false;
	
	console.log("handlePageEventDetails called");
	
	initializePageEventDetails();
	
	return true;
}

/*	Function initializePageEventDetails:
 * 	Retrieve data related to events from the dataProvider
 *		and update the pageEventDetails accordingly.
 */		
function initializePageEventDetails()
{
	console.log('initializePageEventDetails called');
	
	var $pageEventDetails = $('#pageEventDetails');
	var $pageEventDetailsContent = $('#pageEventDetailsContent');
	
	var eventID = $pageEventDetails.jqmData('eventID');	
	
	$pageEventDetailsContent.empty();
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var dataProvider = DataProvider.getInstance();	
	// Query the dataProvider in order to get info related to events
	dataProvider.getEvents({
		eventID: eventID,
		success: 
			function( event )
			{
				var $pageEventDetails = $('#pageEventDetails');
				var $pageEventDetailsContent = $('#pageEventDetailsContent');
					
				var eventTitle = '<h1>' + event.getTitle() + '</h1>';
				var eventDate = event.getDate();
				var eventDateString = eventDate.getDate() + " " + 
						months[eventDate.getMonth()] + " " + eventDate.getFullYear();			
				var eventSubTitle = '<h2>' + eventDateString + '</h1>';
				
				$pageEventDetailsContent.append( eventTitle );
				$pageEventDetailsContent.append( eventSubTitle );		
				
				var contentText = $('<div />').html( event.getContent()).text();
				contentText = contentText.replace( /\n/g,'<br />');
				
				if( event.getImageSrc())
				{
					var imageElement = '<img src="' + event.getImageSrc() + '" />';
					$pageEventDetailsContent.append( imageElement );				
				}
				
				$pageEventDetailsContent.append( contentText );
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			}
	});
}
