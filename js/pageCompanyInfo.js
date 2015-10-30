/*	Function handlePageCompanyInfo:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageCompanyInfo. This function always calls initializePageCompanyInfo
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageCompanyInfo( pageFrom, pageTo )
{
	if( pageTo != "pageCompanyInfo" )
		return false;
	
	console.log("handlePageCompanyInfo called");
	
	var $pageCompanyInfo = $('#pageCompanyInfo');
	
	if( $pageCompanyInfo.jqmData('initialized') == undefined )
		initializePageCompanyInfo();
	
	if( $pageCompanyInfo.jqmData('initializedHandlers') == undefined )
		initializePageCompanyInfoHandlers();	
	
	$('#backFromPageCompanyInfo').attr('href', "#pageResult");
	var pageFrom = $pageCompanyInfo.jqmData('pageFrom');
	if( pageFrom == "pageBookmarks" )
	{
		$pageCompanyInfo.jqmRemoveData('pageFrom');
		$('#backFromPageCompanyInfo').attr('href', "#pageBookmarks");
	}	
	else if( pageFrom == "pageLogin" )
	{
		$pageCompanyInfo.jqmRemoveData('pageFrom');
		onConfirmAddToBookmarks(2);
	}	
	
	return true;
}

function preInitializePageCompanyInfo( companyID, companyName )
{
	console.log("preInitializePageCompanyInfo called for: (" + companyID + ", " + companyName );
	
	$('#pageCompanyInfo').jqmData('companyID', companyID );
		
	$('#pageCompanyInfo').jqmRemoveData('initialized');
	$('#pageCompanyInfo div.headerCompanyName').text( companyName );
	
	$('#pageCompanyPhotos').jqmRemoveData('initialized');
	$('#pageCompanyPhotos div.headerCompanyName').text( companyName );
	
	$('#pageCompanyMenu').jqmRemoveData('initialized');
	$('#pageCompanyMenu div.headerCompanyName').text( companyName );
	$('#pageCompanyMenuDetails div.headerCompanyName').text( companyName );
			
	$('#pageCompanyRatings').jqmRemoveData('initialized');
	$('#pageCompanyRatings div.headerCompanyName').text( companyName );
	$('#pageCompanyRatingDetails div.headerCompanyName').text( companyName );
	$('#pageAddEvaluation div.headerCompanyName').text( companyName );
	
	var dataProvider = DataProvider.getInstance();
	dataProvider.unsetCompany();
}

/*	Function initializePageCompanyInfo:
 * 			Retrieve data related to the specific company from the dataProvider
 *			and update the pageCompanyInfo accordingly.
 */		
function initializePageCompanyInfo()
{
	console.log('initializePageCompanyInfo called');
	
	var $pageCompanyInfo = $('#pageCompanyInfo');
	var $pageCompanyInfoContent = $('#pageCompanyInfoContent');
	var $pageCompanyInfoFooter = $('div[data-role="footer"]', $pageCompanyInfo );
	
	// Retrieve the companyID saved within the pageCompanyInfo div
	var companyID = $pageCompanyInfo.jqmData("companyID");
	
	// Show the page loading dialog
	showPageLoadingMsg();
	$pageCompanyInfoContent.hide();
	
	$('div.errorDiv', $pageCompanyInfo ).remove();
	$pageCompanyInfoFooter.hide();
	initializeCompanyInfoPageContent();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info
	// related to the specific company
	dataProvider.getCompanyDetails({
		companyID: companyID,
		success:
			function( company )
			{
				var $pageCompanyInfo = $('#pageCompanyInfo');
				var $pageCompanyInfoContent = $('#pageCompanyInfoContent');
				var $pageCompanyInfoFooter = $('div[data-role="footer"]', $pageCompanyInfo );
				
				handleCompanyNavBar( company );
				printCompanyInformation( company );
				printCompanyLocationDetails( company );				
				printCompanyContactDetails( company );
				
				if( company.isRestaurant())
					createRestaurantDiscountList( company );
				else
					createDiscountList( company );
				
				$pageCompanyInfo.jqmData('initialized', 'true');				
				
				$pageCompanyInfoContent.show();
				$pageCompanyInfoFooter.show();
				
				$('#pageAddEvaluation').jqmData('companyType', 0 );
				if( company.isRestaurant())
					$('#pageAddEvaluation').jqmData('companyType', 1 );
				
				// Hide the page loading dialog
				hidePageLoadingMsg();
			},
		error:
			function( errorData )
			{
				var $pageCompanyInfo = $('#pageCompanyInfo');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageCompanyInfo, errorData );
			}
	});
}

function initializeCompanyInfoPageContent()
{
	var $pageCompanyInfo = $('#pageCompanyInfo');
	var $pageCompanyInfoContent = $('#pageCompanyInfoContent');
	
	var $restaurantDiscountList = $('#restaurantDiscountList', $pageCompanyInfo );
	var $discountList = $('#discountList', $pageCompanyInfo );
	var $notesList = $('#notesList', $pageCompanyInfo );
	
	var $googleMapsIcon = $('div.googleMapsIcon', $pageCompanyInfoContent );
	var $phonesContainer = $('div.companyPhones', $pageCompanyInfoContent );
	var $phonesListContainer = $('div.companyPhonesList');
	var $mobilesContainer = $('div.companyMobiles', $pageCompanyInfoContent );
	var $mobilesListContainer = $('div.companyMobilesList');	
	var $emailsContainer = $('div.companyEmails', $pageCompanyInfoContent );
	var $websitesContainer = $('div.companyWebsites', $pageCompanyInfoContent );
	
	var $companyNavBar = $('div[data-id="companyFooterNavBar"]', $pageCompanyInfo );	
	
	$('p.companyRating', $pageCompanyInfoContent ).empty();
	$('a', $phonesContainer ).remove();
	$('br', $phonesListContainer ).remove();
	$('a', $mobilesContainer ).remove();
	$('br', $mobilesListContainer ).remove();	
	$('a', $emailsContainer ).remove();
	$('a', $websitesContainer ).remove();	
	
	$phonesContainer.hide();
	$mobilesContainer.hide();
	$emailsContainer.hide();
	$websitesContainer.hide();
	
	$restaurantDiscountList.empty();
	$discountList.empty();
	$notesList.empty();
	$phonesListContainer.empty();
	$mobilesListContainer.empty();
	
	$googleMapsIcon.hide();
	
	$('div.navBarIFG', $companyNavBar ).hide();
	$('div.navBarIFMG', $companyNavBar ).hide();
}

function handleCompanyNavBar( company )
{
	var $companyNavBars = $('div[data-id="companyFooterNavBar"]');	
	
	$.each( $companyNavBars, function( index, companyNavBar )
	{
		var $companyNavBar = $(companyNavBar);	
		
		$('div.navBarIFG', $companyNavBar ).hide();
		$('div.navBarIMG', $companyNavBar ).hide();
		$('div.navBarIFMG', $companyNavBar ).hide();		
		
		if( company.isRestaurant())
			$('div.navBarIFMG', $companyNavBar ).show();
		else 
			$('div.navBarIFG', $companyNavBar ).show();
	});
}

function printCompanyInformation( company )
{
	var $pageCompanyInfoContent = $('#pageCompanyInfoContent');

	var companyRating = company.getRatingValue();
	
	var companyRatingElement = 
		'<span class="companyStars">' + 
			getCompanyStarAsImage( companyRating ) +
		'</span>' + 
		'<span class="numberOfEvaluations">' +
			company.getNumberOfEvaluations() + 
		'</span>';
			
	if( company.getNumberOfEvaluations() == 1 )
		companyRatingElement += 'Giudizio';
	else
		companyRatingElement += 'Giudizi';
					
	$('img.companyLogo', $pageCompanyInfoContent ).attr('src', company.getLogoSrc());
	$('p.companyRating', $pageCompanyInfoContent ).append( companyRatingElement );
}

function printCompanyLocationDetails( company )
{
	var $pageCompanyInfoContent = $('#pageCompanyInfoContent');
	
	if( company.getNumberOfLocations() != 0 )
	{		
		var mainLocation = company.getLocations(0);
		
		if( mainLocation.getAddress()) 
			$('p.companyAddress', $pageCompanyInfoContent ).text( mainLocation.getAddress());
		
		if( mainLocation.getCity())
			$('span.companyCity', $pageCompanyInfoContent ).text( mainLocation.getCity());
				
		if( mainLocation.getProvince()) 
			$('span.companyProvince', $pageCompanyInfoContent ).text( '(' + mainLocation.getProvince() + ')' );
			
		if( mainLocation.getZipCode())
			$('span.companyZipCode', $pageCompanyInfoContent ).text( mainLocation.getZipCode());
			
		if( mainLocation.getLatitude() != null && 
				mainLocation.getLongitude())
		{
			var $googleMapsIcon = $('div.googleMapsIcon', $pageCompanyInfoContent );
			$googleMapsIcon.show();
		}
	}
}

function printCompanyContactDetails( company )
{
	var $pageCompanyInfoContent = $('#pageCompanyInfoContent');
	
	var companyContacts = company.getContacts();
	if( companyContacts )
	{
		var $phonesContainer = $('div.companyPhones', $pageCompanyInfoContent );
		var $phonesListContainer = $('div.companyPhonesList');
		if( companyContacts.getNumberOfPhones() != 0 )
		{
			for (i=0; i<companyContacts.getNumberOfPhones(); i++)
			{
				var mainPhoneNumber = companyContacts.getPhone(i);
			
				var printablePhoneNumber = 
					mainPhoneNumber.substr(0,3) + '.' + mainPhoneNumber.substr(3);
				
				var newPhoneButton = 
					'<a data-mini="true" data-inline="true" data-role="button"' +
						' href="tel:' +	mainPhoneNumber + '">' + printablePhoneNumber +
					'</a><br />';
					
				$phonesListContainer.append( newPhoneButton );
				$('a[data-role="button"]', $phonesContainer ).button();
				$phonesContainer.show();
			}
		}
		
		var $mobilesContainer = $('div.companyMobiles', $pageCompanyInfoContent );
		var $mobilesListContainer = $('div.companyMobilesList');
		if( companyContacts.getNumberOfMobiles() != 0 )
		{	
			for (i=0; i<companyContacts.getNumberOfMobiles(); i++)
			{
				var mainMobileNumber = companyContacts.getMobile(i);
				
				var printableMobileNumber = 
					mainMobileNumber.substr(0,3) + '.' + mainMobileNumber.substr(3);
					
				var newMobileButton = 
					'<a data-mini="true" data-inline="true" data-role="button"' +
						' href="tel:' +	mainMobileNumber + '">' + printableMobileNumber +
					'</a><br />';
					
				$mobilesListContainer.append( newMobileButton );
				$('a[data-role="button"]', $mobilesContainer ).button();
				$mobilesContainer.show();
			}
		}
		
		var $emailsContainer = $('div.companyEmails', $pageCompanyInfoContent );
		if( companyContacts.getNumberOfEmails() != 0 )
		{	
			var mainEmail = companyContacts.getEmails(0);
			
			var newEmailLink = 
				'<a data-mini="true" data-inline="true" data-role="button" class="companyEmail"' +
					' href="mailto:' +	mainEmail + '">' + mainEmail +
				'</a>';
				
			$emailsContainer.append( newEmailLink );
			$('a[data-role="button"]', $emailsContainer ).button();
			$emailsContainer.show();
		}
		
		var $websitesContainer = $('div.companyWebsites', $pageCompanyInfoContent );
		if( companyContacts.getNumberOfWebsites() != 0 )
		{	
			var mainWebsite = companyContacts.getWebsites(0);
			
			var newWebsiteLink = 
				'<a data-mini="true" data-inline="true" data-role="button"class="companyEmail"' +
					' href="http://' +	mainWebsite + '" target="_blank">' + mainWebsite +
				'</a>';
				
			$websitesContainer.append( newWebsiteLink );
			$('a[data-role="button"]', $websitesContainer ).button();
			$websitesContainer.show();
		}
	}
}

function createRestaurantDiscountList( company )
{
	var $pageCompanyInfo = $('#pageCompanyInfo');

	var discounts = company.getDiscounts();	
		
	if(( discounts.getNumberOfDiscountsOnLunch() != 0 ) ||
		( discounts.getNumberOfDiscountsOnDinner() != 0 ))
	{
		var $discountList = $('#restaurantDiscountList', $pageCompanyInfo );									
		
		var listHeader = 
			'<li data-role="list-divider">' +
				'<span class="discountLunch">Pranzo</span>' +
				'<span class="discountDinner">Cena</span>' +
			'</li>';
		
		$discountList.append( listHeader );					
		
		for( var index = 0; index < daysOfTheWeek.length; index++ )
		{
			var lunchDiscount = discounts.getLunchDiscounts( index );
			var dinnerDiscount = discounts.getDinnerDiscounts( index );
			
			var newListElement = 
				'<li>' + daysOfTheWeek[index] +
					'<p class="ui-li-count discountLunch">' + 
						lunchDiscount;
			
			if( lunchDiscount != CLOSED_STRING &&
					lunchDiscount != NO_DISCOUNT_STRING )  
				newListElement +=
						'<span>%</span>';
						
			newListElement +=
					'</p>' +
					'<p class="ui-li-count discountDinner">' + 
						dinnerDiscount;
						
			if( dinnerDiscount != CLOSED_STRING &&
					dinnerDiscount != NO_DISCOUNT_STRING )
				newListElement +=
						'<span>%</span>';
						
			newListElement +=
					'</p>' +
				'</li>';
			
			$discountList.append( newListElement );
		} 
		
		$discountList.listview('refresh');
	}
	
	if( discounts.getNumberOfNotes() != 0 )
	{
		var $notesList = $('#notesList', $pageCompanyInfo );
		var notesListHeader = 
			'<li data-role="list-divider">Note</li>';
		
		$notesList.append( notesListHeader );
				
		for( var index = 0; index < discounts.getNumberOfNotes(); index++ )
		{
			var newListElement = 
				'<li>' + discounts.getNotes( index ) + '</li>';
			
			$notesList.append( newListElement );
		}
		 
		$notesList.listview('refresh');
	}
}

function createDiscountList( company )
{
	var discounts = company.getDiscounts();	
	
	var $pageCompanyInfo = $('#pageCompanyInfo');
	var $discountList = $('#discountList', $pageCompanyInfo );									
	
	var listHeader = 
		'<li data-role="list-divider">Sconti</li>';
	
	$discountList.append( listHeader );					
	
	for( var index = 0; index < discounts.length; index++ )
	{
		var newListElement = '<li>';
		
		if( discounts[index].getValue() != null )
			newListElement += 
				'<span class="discountValue">' +
					discounts[index].getValue() +
				'</span>';
		
		if( discounts[index].getNote() != null )
			newListElement += 
				'<span class="discountNote">' +
					discounts[index].getNote() +
				'</span>';
			 
		newListElement += '</li>';
		
		$discountList.append( newListElement );
	} 
	
	$discountList.listview('refresh');
}

function initializePageCompanyInfoHandlers()
{
	console.log('initializePageCompanyInfoHandlers called');
	
	var $pageCompanyInfo = $('#pageCompanyInfo');
	
	$('#showResultOnMap', $pageCompanyInfo ).bind('click', function()
	{
		var $pageCompanyInfo = $('#pageCompanyInfo');
		var $pageMap = $('#pageMap');
		
		// Retrieve the companyID saved within the pageCompanyInfo div
		var companyID = $pageCompanyInfo.jqmData("companyID");
	 
		$pageMap.jqmData('queryString', companyID );
		$pageMap.jqmData('pageFrom', "pageCompanyInfo");	
	});
	
	$('#addCompanyToBookmarks').bind('click', function()
	{
		console.log('addCompanyToBookmarks clicked');
		
		navigator.notification.confirm(
    		'Vuoi aggiungere il convenzionato ai preferiti?',
    		onConfirmAddToBookmarks,
    		'Conferma',
    		'Indietro,Aggiungi'
		);		
	});
	
	$pageCompanyInfo.jqmData('initializedHandlers', 'true');	
}

function onConfirmAddToBookmarks( buttonIndex )
{
	console.log('onConfirmAddToBookmarks called');
	
	if( buttonIndex == 2 )
	{
		var authenticationHandler = 
			AuthenticationHandler.getInstance();
		
		if( !authenticationHandler.isAuthenticated )
		{
			console.log('user is not authenticated: redirecting to login page');
			
			var $pageLogin = $('#pageLogin');
			
			$pageLogin.jqmData('pageFrom', 'pageCompanyInfo');
			$.mobile.changePage( $pageLogin, { transition: 'slide' } );
			
			return ;
		}	
		
		console.log('user is authenticated: adding company to bookmarks');
		
		// Show the page loading dialog
		showPageLoadingMsg();
	
		var dataProvider = DataProvider.getInstance();	
		dataProvider.getUserBookmarks({
			username: authenticationHandler.getUsername(),
			password: authenticationHandler.getPassword(),
			success: 
				function( companies )
				{
					console.log(companies);
					var $pageCompanyInfo = $('#pageCompanyInfo');
		
					// Hide the page loading dialog
					hidePageLoadingMsg();
	
					// Retrieve the companyID saved within the pageCompanyInfo div
					var companyID = $pageCompanyInfo.jqmData("companyID");
					
					for( var index = 0; index < companies.length; index++ )
					{
						if( companies[index].getID() == companyID )
						{
							console.log('company ' + companyID + ' already in bookmarks list');
							navigator.notification.confirm(
							    'Convenzionato già presente tra i preferiti',
							    viewBookmarks,
							    'Attenzione',
							    'Fine, Visualizza preferiti'
							);
																
							return ;
						}	
					}
					
					console.log('adding company ' + companyID + ' to bookmarks list');
					
					// Show the page loading dialog
					showPageLoadingMsg();
					
					dataProvider.addBookmark({
						username: authenticationHandler.getUsername(),
						password: authenticationHandler.getPassword(),
						companyID: companyID,
						success: 
							function( companies )
							{
								console.log('company ' + companyID + ' added to bookmarks');
								
								// Hide the page loading dialog
								hidePageLoadingMsg();
								
								navigator.notification.confirm(
								    'Convenzionato aggiunto ai preferiti',
								    viewBookmarks,
								    'Fatto!',
								    'Fine, Visualizza preferiti'
								);
							},
						error:
							function()
							{
								console.log('error while adding company ' + companyID + ' to bookmarks list');
								
								// Hide the page loading dialog
								hidePageLoadingMsg();
								
								/*
								navigator.notification.confirm(
								    'Si &egrave; verificato un errore',
								    function () {},
								    'Ops!',
								    'Fine'
								);
								*/
								
								navigator.notification.confirm(
								    'Connessione ad internet non disponibile, controlla le tue impostazioni di connessione.',
								    function () {},
								    'Ops!',
								    'Fine'
								);
							}
					});
				}
		});
	}
}

function viewBookmarks( buttonIndex )
{
	console.log('viewBookmarks called');
	
	if( buttonIndex == 2 )
		$.mobile.changePage( $('#pageBookmarks'), { transition: 'slide' } );
}