/*	Function handlePageCompanyPhotos:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageCompanyPhotos. This function always calls initializePageCompanyPhotos
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageCompanyPhotos( pageFrom, pageTo )
{
	if( pageTo != "pageCompanyPhotos" )
		return false;
		
	console.log("handlePageCompanyPhotos called");
	
	var $pageCompanyPhotos = $('#pageCompanyPhotos');
	
	if( $pageCompanyPhotos.jqmData('initialized') == undefined )
		initializePageCompanyPhotos();
	
	return true;
}

/*	Function initializePageCompanyPhotos:
 * 			Retrieve data related to the specific company from the dataProvider
 *			and update the pageCompanyInfo accordingly.
 */		
function initializePageCompanyPhotos()
{
	console.log('initializePageCompanyPhotos called');
	
	var $pageCompanyPhotos = $('#pageCompanyPhotos');
	var $pageCompanyPhotosContent = 
		$('#pageCompanyPhotosContent');
	
	// Retrieve the companyID saved within the pageCompanyInfo div
	var companyID = $('#pageCompanyInfo').jqmData("companyID");
	
	// Show the page loading dialog
	showPageLoadingMsg();
	
	$pageCompanyPhotosContent.empty();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info
	// related to the specific company
	dataProvider.getCompanyDetails({
		companyID: companyID,
		success:
			function( company )
			{
				var $pageCompanyPhotos = $('#pageCompanyPhotos');
				
				appendPhotosToList( company );
				
				// Hide the page loading dialog
				hidePageLoadingMsg();		
			
				$pageCompanyPhotos.jqmData('initialized', 'true');
			}
	});
}

function appendPhotosToList( company )
{
	var $pageCompanyPhotosContent = 
		$('#pageCompanyPhotosContent');
	
	if( company.getNumberOfPhotos() == 0 )
	{
		var listContainer =
			'<ul data-role="listview">' +
				'<li data-icon="false">' +
					'<h1 class="emptyPhotos">Nessuna foto presente</h1>' +
				'</li>' +
			'</ul>';
		
		$pageCompanyPhotosContent.append( listContainer );
		$('ul', $pageCompanyPhotosContent ).listview();
	}
	else
	{
		var galleryContainer =
			'<ul class="gallery"></ul>';
		
		$pageCompanyPhotosContent.append( galleryContainer );	
		var $galleryContainer = $('ul.gallery', $pageCompanyPhotosContent );
	 
		for( var index = 0; index < company.getThumbnails().length; index++ )
		{
			var currentThumbnail = company.getThumbnails( index );
			var currentPhoto = company.getPhotos( index );
			
			addPhotoItem( currentThumbnail, currentPhoto );
		}
		
		$('ul.gallery a', $pageCompanyPhotosContent ).photoSwipe(
		{ 
			enableMouseWheel: false ,
			enableKeyboard: false
		});
	}
}

function addPhotoItem( thumbnailURL, photoURL )
{
	var $pageCompanyPhotos = $('#pageCompanyPhotos');
	var $pageCompanyPhotosContent = $('#pageCompanyPhotosContent');
	var $galleryContainer = $('ul.gallery', $pageCompanyPhotosContent ); 
	
	var newListElement = 
		'<li>' +
			'<a href="' + photoURL + '">' + 
			'<img src="' + thumbnailURL + '" style="width: 90%; height: 90%;" />' +
			'</a>' +
		'</li>';
	
	$galleryContainer.append( newListElement );	
}
