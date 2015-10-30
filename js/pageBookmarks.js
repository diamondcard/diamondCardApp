/*	Function handlePageBookmarks:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageBookmarks. This function calls initializePageBookmarks
 *		if pageBookmarks isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageBookmarks( pageFrom, pageTo )
{
	if( pageTo != "pageBookmarks" )
		return false;
	
	console.log("handlePageBookmarks called");
	
	var $pageBookmarks = $('#pageBookmarks');	
	
	if( pageFrom == "pageMain" ||
		pageFrom == "pageCompanyInfo" )
		$('#backFromPageBookmarks').attr('href', '#' + pageFrom );	
	
	initializePageBookmarks( pageFrom );
	
	if( $pageBookmarks.jqmData('initializedHandlers') == undefined )
		initializePageBookmarksHandlers();
	
	return true;
}

function initializePageBookmarksHandlers()
{
	console.log("initializePageBookmarksHandlers called");
	
	var $pageBookmarks = $('#pageBookmarks');
	
	$('#modifyBookmarks').bind('click', initializePageBookmarksListForModify );	
	$('#endModifyBookmarks').bind('click', initializePageBookmarksList );	
	
	$pageBookmarks.jqmData('initializedHandlers', 'true');
}

function initializePageBookmarks( pageFrom )
{
	console.log("initializePageBookmarks called");
	
	var $pageBookmarks = $('#pageBookmarks');	
	
	var authenticationHandler = 
		AuthenticationHandler.getInstance();
		
	if( !authenticationHandler.isAuthenticated )
	{
		var $pageLogin = $('#pageLogin');
		
		$pageBookmarks.jqmRemoveData('initialized');
		$('#modifyBookmarks').hide();
		$('#endModifyBookmarks').hide();
		$('#pageBookmarksContent').hide();
	
		$pageLogin.jqmData('pageFrom', 'pageBookmarks');
		$.mobile.changePage( $pageLogin, { transition: 'slide' } );
	}
	else
		initializePageBookmarksList( pageFrom );
}

function initializePageBookmarksList( pageFrom )
{
	console.log("initializePageBookmarksList called");
	
	var $pageBookmarks = $('#pageBookmarks');
	var $pageBookmarksContent = $('#pageBookmarksContent');
	var $listBookmarks = $('#listBookmarks');
	
	// Show the page loading dialog
	showPageLoadingMsg();

	$listBookmarks.empty();
	$('#modifyBookmarks').show();
	$('#endModifyBookmarks').hide();
	$pageBookmarksContent.hide();
	
	var authenticationHandler = 
		AuthenticationHandler.getInstance();
	
	var dataProvider = DataProvider.getInstance();
	dataProvider.getUserBookmarks({
		username: authenticationHandler.getUsername(),
		password: authenticationHandler.getPassword(),
		success: 
			function( bookmarks )
			{
				var $pageBookmarksContent = $('#pageBookmarksContent');
				
				if( bookmarks.length != 0 )
				{	
					addCompaniesToBookmarksList( bookmarks );
					
					$('form', $pageBookmarksContent ).show('blind', {}, 200, function()
					{
						var $listBookmarks = $('#listBookmarks');
						$listBookmarks.listview('refresh');
					});
				}
				else
				{
					$('#modifyBookmarks').hide();
					$('#endModifyBookmarks').hide();
						
					var emptyListElement = 
						'<li class="emptyListResult">' +
							'<h1>Nessun preferito</h1>' +
						'</li>';
					
					$listBookmarks.append( emptyListElement );
					
					// Update the category ul element
					$listBookmarks.listview('refresh');
					$('form', $pageBookmarksContent ).hide();
				}
				
				$pageBookmarksContent.show();
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			},
		error:
			function()
			{
				
			}
	});
}

function addCompaniesToBookmarksList( bookmarks )
{	
	var $listBookmarks = $('#listBookmarks');
	
	// For each subcategory create a new list element and
	// append it to the ul element
	$.each( bookmarks, 
		function( index, company )
		{
			var newListElement = 
				'<li data-icon="false">' +
				'<a href="#pageCompanyInfo">' + 
					'<img src="' + company.getLogoSrc() + '" />' +
					'<h1>' + 
						'<span class="companyName">' + company.getName() + '</span>' +
					'</h1>' +					
					'<p class="companyAddress extendedAddress">' + 
						printCompanyAddress( company ) + 
					'</p>' +
					'<p class="companyCity extendedAddress">' + 
						printCompanyCity( company ) + 
					'</p>' +
				'</a>' +
				'</li>';
			
			$listBookmarks.append( newListElement );
			
			// Save the id of the current company within the
			// corresponding list item
			$('li:last', $listBookmarks ).jqmData('companyID', company.getID());
		});
	
	// Update the listBookmarks element
	$listBookmarks.listview('refresh');
	
	// Once a list item is clicked then set the corresponding 
	// company ID as #pageCompanyDetails data 
	$('li', $listBookmarks ).bind('click', function()
	{
		console.log("listBookmarks.li clicked");

		var companyID = $(this).jqmData('companyID');
		var companyName = $('span.companyName', $(this)).text();
		
		$('#pageCompanyInfo').jqmData('pageFrom', 'pageBookmarks');				
		preInitializePageCompanyInfo( companyID, companyName );
	});
}

function initializePageBookmarksListForModify()
{
	console.log("initializePageBookmarksListForModify called");
	
	var $pageBookmarks = $('#pageBookmarks');
	var $pageBookmarksContent = $('#pageBookmarksContent');
	var $listBookmarks = $('#listBookmarks');
	
	// Show the page loading dialog
	showPageLoadingMsg();

	$listBookmarks.empty();
	$('#modifyBookmarks').hide();
	$('#endModifyBookmarks').show();
	$pageBookmarksContent.hide();
	
	var authenticationHandler = 
		AuthenticationHandler.getInstance();
	
	var dataProvider = DataProvider.getInstance();
	dataProvider.getUserBookmarks({
		username: authenticationHandler.getUsername(),
		password: authenticationHandler.getPassword(),
		success: 
			function( bookmarks )
			{
				var $pageBookmarksContent = $('#pageBookmarksContent');
				
				if( bookmarks.length != 0 )
				{	
					addCompaniesToBookmarksListForModify( bookmarks );
					
					$('form', $pageBookmarksContent ).show('blind', {}, 200, function()
					{
						var $listBookmarks = $('#listBookmarks');
						$listBookmarks.listview('refresh');
					});
				}
				else
				{
					var emptyListElement = 
						'<li class="emptyListResult">' +
							'<h1>Nessun risultato trovato</h1>' +
						'</li>';
					
					$listBookmarks.append( emptyListElement );
					
					// Update the category ul element
					$listBookmarks.listview('refresh');
					$('form', $pageBookmarksContent ).hide();
				}
				
				$pageBookmarksContent.show();
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			},
		error:
			function()
			{
				
			}
	});
}

function addCompaniesToBookmarksListForModify( bookmarks )
{	
	var $listBookmarks = $('#listBookmarks');
	
	// For each subcategory create a new list element and
	// append it to the ul element
	$.each( bookmarks, 
		function( index, company )
		{
			var newListElement = 
				'<li class="removeBookmarkLi" data-icon="false">' +
				'<a>' + 
					'<img src="' + company.getLogoSrc() + '" />' +
					'<h1>' + 
						'<span class="companyName">' + company.getName() + '</span>' +
					'</h1>' +					
					'<p class="companyAddress extendedAddress">' + 
						printCompanyAddress( company ) + 
					'</p>' +
					'<p class="companyCity extendedAddress">' + 
						printCompanyCity( company ) + 
					'</p>' +
				'</a>' +
				'<a class="removeBookmarkButton"></a>' +
				'</li>';
			
			$listBookmarks.append( newListElement );
			
			// Save the id of the current company within the
			// corresponding list item
			$('li:last', $listBookmarks ).jqmData('companyID', company.getID());
		});
	
	// Update the listBookmarks element
	$listBookmarks.listview('refresh');
	
	// Once a list item is clicked then set the corresponding 
	// company ID as #pageCompanyDetails data 
	$('a.removeBookmarkButton', $listBookmarks ).bind('click', function()
	{
		console.log("removeBookmark clicked");
		
		var companyID = $(this).parents('li').jqmData('companyID');
		 
		var authenticationHandler = 
			AuthenticationHandler.getInstance();
		
		var dataProvider = DataProvider.getInstance();
		dataProvider.removeBookmark({
			username: authenticationHandler.getUsername(),
			password: authenticationHandler.getPassword(),
			companyID: companyID,
			success: initializePageBookmarksListForModify
		});
	});
}