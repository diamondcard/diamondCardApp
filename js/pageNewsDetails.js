/*	Function handlePageNewsDetails:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageNewsDetails. This function calls initializePageNewsDetails
 *		if pageNewsDetails isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageNewsDetails( pageFrom, pageTo )
{
	if( pageTo != "pageNewsDetails" )
		return false;
	
	console.log("handlePageNewsDetails called");
	
	initializePageNewsDetails();
	
	event.preventDefault();
	return true;
}

/*	Function initializePageNewsDetails:
 * 	Retrieve data related to news from the dataProvider
 *		and update the pageNewsDetails accordingly.
 */		
function initializePageNewsDetails()
{
	console.log('initializePageNewsDetails called');
	
	var $pageNewsDetails = $('#pageNewsDetails');
	var $pageNewsDetailsContent = $('#pageNewsDetailsContent');
	
	var newsID = $pageNewsDetails.jqmData('newsID');	
	
	$pageNewsDetailsContent.empty();	
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to news
	dataProvider.getNews({
		newsID: newsID,
		success: 
			function( news )
			{
				var $pageNewsDetailsContent = $('#pageNewsDetailsContent');
					
				var newsTitle = '<h1>' + news.getTitle() + '</h1>';
				var newsDate = news.getDate();
				var newsDateString = newsDate.getDate() + " " + 
						months[newsDate.getMonth()] + " " + newsDate.getFullYear();			
				var newsSubTitle = '<h2>' + newsDateString + '</h1>';
				
				$pageNewsDetailsContent.append( newsTitle );
				$pageNewsDetailsContent.append( newsSubTitle );		
				
				var contentText = $('<div />').html( news.getContent()).text();
				contentText = contentText.replace( /\n/g,'<br />');
				
				if( news.getImageSrc())
				{
					var imageElement = '<img src="' + news.getImageSrc() + '" />';
					$pageNewsDetailsContent.append( imageElement );				
				}
				
				$pageNewsDetailsContent.append( contentText );
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			}
	});
}
