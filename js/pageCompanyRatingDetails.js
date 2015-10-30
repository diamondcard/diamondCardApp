/*	Function handlePageCompanyRatingDetails:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageCompanyRatingDetails. This function always calls initializePageCompanyRatingDetails
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageCompanyRatingDetails( pageFrom, pageTo )
{
	if( pageTo != "pageCompanyRatingDetails" )
		return false;
	
	console.log("handlePageCompanyRatingDetails called");
	
	initializePageCompanyRatingDetails();
	
	return true;
}

/*	Function initializePageCompanyRatingDetails:
 * 			Retrieve data related to the specific company from the dataProvider
 *			and update the pageCompanyRatingDetails accordingly.
 */		
function initializePageCompanyRatingDetails()
{
	console.log('initializePageCompanyRatingDetails called');
	
	var $pageCompanyRatingDetails = $('#pageCompanyRatingDetails');
	var $listRatingDetails = $('#listRatingDetails');
	
	// Retrieve the companyID saved within the pageCompanyInfo div
	var companyID = $('#pageCompanyInfo').jqmData("companyID");
	
	// Retrieve the ratingID saved within the pageCompanyInfo div
	var ratingID = $pageCompanyRatingDetails.jqmData("ratingID");
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	$listRatingDetails.empty();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info
	// related to the specific company
	dataProvider.getCompanyDetails({
		companyID: companyID,
		success:
			function( company )
			{
				var evaluation = company.getEvaluations( ratingID );
				
				addEvaluationToList( evaluation );
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			}
	});
}

function addEvaluationToList( evaluation )
{
	var $listRatingDetails = $('#listRatingDetails');
				
	var listHeader = 
		'<li data-role="list-divider">' + 
			'<span class="ratingTitle">' + evaluation.getUsername() + '</span>' +
			'<span class="ratingDate">' + printRatingDate( evaluation.getDate()) + '</span>' +
		'</li>';		
			
	$listRatingDetails.append( listHeader );
	
	for( var index = 0; index < evaluation.getVotes().length; index++ )
	{
		var vote = evaluation.getVotes( index );
		var newListElement =
			'<li data-icon="false">' +
				'<h1>' + 
					'<span class="voteDescription">' + vote.getDescription() + '</span>' + 
				'</h1>' +
				'<p class="ui-li-aside">' +
					getCompanyStarAsImage( vote.getValue()) +
				'</p>' +
			'</li>';
			
		$listRatingDetails.append( newListElement );
	}
	
	$listRatingDetails.listview('refresh');
}