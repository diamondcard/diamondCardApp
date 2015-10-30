var OFFERS_PER_PAGE = 5;

/*	Function handlePageOffers:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageOffers. This function calls initializePageOffers
 *		if pageOffers isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageOffers( pageFrom, pageTo )
{
	if( pageTo != "pageOffers" )
		return false;
	
	console.log("handlePageOffers called");
	
	var $pageOffers = $('#pageOffers');			
	
	if( $pageOffers.jqmData('initialized') == undefined )
		initializePageOffers();
	
	if( $pageOffers.jqmData('initializedHandlers') == undefined )
		initializePageOffersEventHandler();
	
	return true;
}

/*	Function initializePageOffers:
 * 	Retrieve data related to offers from the dataProvider
 *		and update the pageOffers accordingly.
 */		
function initializePageOffers()
{
	console.log('initializePageOffers called');
	
	var $pageOffers = $('#pageOffers');
	var $listOffers = $('#listOffers');
	
	$('div.errorDiv', $pageOffers ).remove();
	$listOffers.empty();
	$('#otherOffersButton').hide();
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to offers
	dataProvider.getOffers({
		success: 
			function( offers )
			{
				var $pageOffers = $('#pageOffers');
				
				appendOffersItem( offers, 0, OFFERS_PER_PAGE );
					
				$('#otherOffersButton').show();
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				// Set flag 'initialized' to true 
				// in order to prevent further initializations
				$pageOffers.jqmData('initialized', 'true');
			},
		error:
			function( errorData )
			{
				var $pageOffers = $('#pageOffers');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageOffers, errorData );
			}
	});
}

function appendOffersItem( offers, startIndex, endIndex )
{	
	console.log('appendOffersItem called (' + startIndex + ', ' + endIndex + ')');
	
	var $listOffers = $('#listOffers');
	
	endIndex += startIndex;
	if( endIndex > offers.length )
		endIndex = offers.length;
	
	// For each offers create a new list element and
	// append it to the ul element
	for( var index = startIndex; index < endIndex; index++ )
	{				
		var offer = offers[index];
		
		var offersDate = offer.getDate();
		var dividerDateString = 
			months[offersDate.getMonth()] + " " + offersDate.getFullYear();
		var dateString = 
			offersDate.getDate() + " " + months[offersDate.getMonth()];
		
		var currentDividerDate = $('li[data-role="list-divider"]:last', $listOffers ).text();
		
		if( currentDividerDate != dividerDateString )
		{			
			$listOffers.append('<li data-role="list-divider">' + dividerDateString + '</li>');
			currentDividerDate = dividerDateString;
		}
		
		var newListElement = 
			'<li class="ui-li-has-thumb" data-icon="false">' + 
			'<a href="#pageOfferDetails" data-transition="slide">' +
				'<img src="' + offer.getImageSrc() + '" />' +
				'<h1>' + offer.getTitle() + '</h1>' + 
			'</a></li>';
		
		$listOffers.append( newListElement );
		
		// Save the id of the current offers within the
		// corresponding list item 
		$('li:last', $listOffers ).jqmData('id', offer.getID());
	}
	
	// Update the offers ul element
	$listOffers.listview('refresh');
	
	// Once a list item is clicked then set the corresponding 
	// offers ID as #pageOfferDetails data 
	$('li', $listOffers ).bind('click', function()
	{
		var offerID = $(this).jqmData('id');
		$('#pageOfferDetails').jqmData('offerID', offerID );
	});		
	
	if( endIndex == offers.length )
		$('#otherOffersButton').hide();
	else
		$('#otherOffersButton').show();
}

function initializePageOffersEventHandler()
{
	console.log('initializePageOffersEventHandler called');
	
	var $pageOffers = $('#pageOffers');
	
	$('#otherOffersButton').bind('click', function()
	{
		var $listOffers = $('#listOffers');
		var numberOfOffers = 
			$('li:not([data-role="list-divider"])', $listOffers ).length;
		
		var dataProvider = DataProvider.getInstance();
		dataProvider.getOffers({
			success: 		
				function( offers )
				{
					appendOffersItem( offers, numberOfOffers, OFFERS_PER_PAGE );
				}
		});
		
		return false;
	});				
	
	$('#pageOffersRefreshButton').bind('click', function()
	{
		var $pageOffers = $('#pageOffers');
		
		var dataProvider = DataProvider.getInstance();
		dataProvider.unsetOffers();
		
		$pageOffers.jqmRemoveData('initialized');
		initializePageOffers();
		
		return false;
	});
	
	$pageOffers.jqmData('initializedHandlers', 'true');
}