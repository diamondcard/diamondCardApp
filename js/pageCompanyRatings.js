/*	Function handlePageCompanyRatings:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageCompanyRatings. This function always calls initializePageCompanyRatings
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageCompanyRatings( pageFrom, pageTo )
{
	if( pageTo != "pageCompanyRatings" )
		return false;
	
	console.log("handlePageCompanyRatings called");
	
	var $pageCompanyRatings = $('#pageCompanyRatings');
	
	if( $pageCompanyRatings.jqmData('initialized') == undefined )
		initializePageCompanyRatings();
	
	return true;
}

/*	Function initializePageCompanyRatings:
 * 			Retrieve data related to the specific company from the dataProvider
 *			and update the pageCompanyRatings accordingly.
 */		
function initializePageCompanyRatings()
{
	console.log('initializePageCompanyRatings called');
	
	var $pageCompanyRatings = $('#pageCompanyRatings');
	var $listRatings = $('#listRatings');
	
	// Retrieve the companyID saved within the pageCompanyInfo div
	var companyID = $('#pageCompanyInfo').jqmData("companyID");
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	$listRatings.empty();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info
	// related to the specific company
	dataProvider.getCompanyDetails({
		companyID: companyID,
		success:
			function( company )
			{
				var $pageCompanyRatings = $('#pageCompanyRatings');
				
				addEvaluationsToList( company );
				
				$pageCompanyRatings.jqmData('initialized', 'true');
					
				// Hide the page loading dialog
				hidePageLoadingMsg();
			}
	});
}

function addEvaluationsToList( company )
{
	var $listRatings = $('#listRatings');
	
	if( company.getNumberOfEvaluations() == 0 )
	{
		var newListElement =
			'<li data-icon="false">' +
				'<h1 class="emptyEvaluations">Nessun giudizio presente</h1>'
			'</li>';
			
		$listRatings.append( newListElement );
	}				
	
	for( var index = 0; index < company.getNumberOfEvaluations(); index++ )
	{
		var rating = company.getEvaluations( index );
		var companyAverageRating = getAverageRating( rating.getVotes());
		var newListElement =
			'<li data-icon="false">' +
			'<a href="#pageCompanyRatingDetails" data-transition="slide">' +
				'<h1>' + 
					'<span class="ratingTitle">' + rating.getUsername() + '</span>';
		
		if( rating.getDate())
			newListElement +=						
					'<span class="ratingDate">' + printRatingDate( rating.getDate()) + '</span>';
		
		newListElement +=
				'</h1>' +
				'<p class="ui-li-aside">' +
					getCompanyStarAsImage( companyAverageRating ) +
				'</p>' +
			'</a></li>';
			
		$listRatings.append( newListElement );
	
		// Save the id of the current rating within the
		// corresponding list item
		$('li:last', $listRatings ).jqmData('ratingID', index );
	}
	
	$listRatings.listview('refresh');
	
	// Once a list item is clicked then set the corresponding 
	// ratingID as #pageCompanyRatingDetails data 
	$('li', $listRatings ).bind('click', function()
	{
		var ratingID = $(this).jqmData('ratingID');
		$('#pageCompanyRatingDetails').jqmData('ratingID', ratingID );
	});
}

function printRatingDate( date )
{
	var dateAsString = "il " + 
		( date.getDate() + 1 ) + "/" + 
		( date.getMonth() + 1 ) + "/" + 
		date.getFullYear();
		
	return dateAsString;
}