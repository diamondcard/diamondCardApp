/*	Function handlePageOfferDetails:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageOfferDetails. This function calls initializePageOfferDetails
 *		if pageOfferDetails isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageOfferDetails( pageFrom, pageTo )
{
	if( pageTo != "pageOfferDetails" )
		return false;
	
	console.log("handlePageOfferDetails called");
	
	initializePageOfferDetails();
	
	event.preventDefault();
	return true;
}

/*	Function initializePageOfferDetails:
 * 	Retrieve data related to offers from the dataProvider
 *		and update the pageOfferDetails accordingly.
 */		
function initializePageOfferDetails()
{
	console.log('initializePageOfferDetails called');
	
	var $pageOfferDetails = $('#pageOfferDetails');
	var $pageOfferDetailsContent = $('#pageOfferDetailsContent');
	
	var offerID = $pageOfferDetails.jqmData('offerID');	
	
	$pageOfferDetailsContent.empty();	
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to offers
	dataProvider.getOffers({
		offerID: offerID,
		success: 
			function( offer )
			{
				var $pageOfferDetails = $('#pageOfferDetails');
				var $pageOfferDetailsContent = $('#pageOfferDetailsContent');
					
				var offerTitle = '<h1>' + offer.getTitle() + '</h1>';
				var offerDate = offer.getDate();
				var offerDateString = offerDate.getDate() + " " + 
						months[offerDate.getMonth()] + " " + offerDate.getFullYear();			
				var offerSubTitle = '<h2>' + offerDateString + '</h1>';
				
				$pageOfferDetailsContent.append( offerTitle );
				$pageOfferDetailsContent.append( offerSubTitle );		
				
				var contentText = $('<div />').html( offer.getContent()).text();
				contentText = contentText.replace( /\n/g,'<br />');
				
				if( offer.getImageSrc())
				{
					var imageElement = '<img src="' + offer.getImageSrc() + '" />';
					$pageOfferDetailsContent.append( imageElement );				
				}
				
				$pageOfferDetailsContent.append( contentText );
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			}
	});
}
