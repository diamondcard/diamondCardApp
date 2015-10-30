var NEWS_PER_PAGE = 5;

/*	Function handlePageNews:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageNews. This function calls initializePageNews
 *		if pageNews isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageNews( pageFrom, pageTo )
{
	if( pageTo != "pageNews" )
		return false;
	
	console.log("handlePageNews called");
	
	var $pageNews = $('#pageNews');			
	
	if( $pageNews.jqmData('initialized') == undefined )
		initializePageNews();
	
	if( $pageNews.jqmData('initializedHandlers') == undefined )
		initializePageNewsEventHandler();
	
	return true;
}

/*	Function initializePageNews:
 * 	Retrieve data related to news from the dataProvider
 *		and update the pageNews accordingly.
 */		
function initializePageNews()
{
	console.log('initializePageNews called');
	
	var $pageNews = $('#pageNews');
	var $listNews = $('#listNews');
	
	$('div.errorDiv', $pageNews ).remove();
	$listNews.empty();	
	$('#otherNewsButton').hide();
		
	// Show the page loading dialog
	showPageLoadingMsg();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to news
	dataProvider.getNews({
		success: 
			function( news )
			{
				var $pageNews = $('#pageNews');
				
				appendNewsItem( news, 0, NEWS_PER_PAGE );
				
				$('#otherNewsButton').show();
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				// Set flag 'initialized' to true 
				// in order to prevent further initializations
				$pageNews.jqmData('initialized', 'true');
			},
		error:
			function( errorData )
			{
				var $pageNews = $('#pageNews');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageNews, errorData );
			}
	});
}

function appendNewsItem( news, startIndex, endIndex )
{	
	console.log('appendNewsItem called (' + startIndex + ', ' + endIndex + ')');
	
	var $listNews = $('#listNews');
	
	endIndex += startIndex;
	if( endIndex > news.length )
		endIndex = news.length;
	
	// For each news create a new list element and
	// append it to the ul element
	for( var index = startIndex; index < endIndex; index++ )
	{				
		var singleNews = news[index];
		
		var newsDate = singleNews.getDate();
		var dividerDateString = 
			months[newsDate.getMonth()] + " " + newsDate.getFullYear();
		var dateString = 
			newsDate.getDate() + " " + months[newsDate.getMonth()];
		
		var currentDividerDate = $('li[data-role="list-divider"]:last', $listNews ).text();
		
		if( currentDividerDate != dividerDateString )
		{			
			$listNews.append('<li data-role="list-divider">' + dividerDateString + '</li>');
			currentDividerDate = dividerDateString;
		}
		
		var newListElement = 
			'<li class="ui-li-has-thumb" data-icon="false">' + 
			'<a href="#pageNewsDetails" data-transition="slide">' +
				'<img src="' + singleNews.getImageSrc() + '" />' +
				'<h1>' + singleNews.getTitle() + '</h1>' + 
			'</a></li>';
		
		$listNews.append( newListElement );
		
		// Save the id of the current news within the
		// corresponding list item 
		$('li:last', $listNews ).jqmData('id', singleNews.getID());
	}
	
	// Update the news ul element
	$listNews.listview('refresh');
	
	// Once a list item is clicked then set the corresponding 
	// news ID as #pageNewsDetails data 
	$('li', $listNews ).bind('click', function()
	{
		var newsID = $(this).jqmData('id');
		$('#pageNewsDetails').jqmData('newsID', newsID );
	});		
	
	if( endIndex == news.length )
		$('#otherNewsButton').hide();
	else
		$('#otherNewsButton').show();
}

function initializePageNewsEventHandler()
{
	console.log('initializePageNewsEventHandler called');
	
	var $pageNews = $('#pageNews');
		
	$('#otherNewsButton').bind('click', function()
	{
		var $listNews = $('#listNews');
		var numberOfNews = 
			$('li:not([data-role="list-divider"])', $listNews ).length;
		
		var dataProvider = DataProvider.getInstance();
		dataProvider.getNews({
			success: 		
				function( news )
				{
					appendNewsItem( news, numberOfNews, NEWS_PER_PAGE );
				}
		});
		
		return false;
	});				
	
	$('#pageNewsRefreshButton').bind('click', function()
	{
		var $pageNews = $('#pageNews');
		
		var dataProvider = DataProvider.getInstance();
		dataProvider.unsetNews();
		
		$pageNews.jqmRemoveData('initialized');
		initializePageNews();
		
		return false;
	});	
	
	$pageNews.jqmData('initializedHandlers', 'true');
}