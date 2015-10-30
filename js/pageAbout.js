/*	Function handlePageAbout:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageAbout. This function calls initializePageAbout
 *		if pageAbout isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageAbout( pageFrom, pageTo )
{
	if( pageTo != "pageAbout" )
		return false;
		
	console.log("handlePageAbout called");
	
	var $pageAbout = $('#pageAbout');			
	
	if( $pageAbout.jqmData('initialized') == undefined )
		initializePageAbout();
	
	return true;
}

/*	Function initializePageAbout:
 * 	Retrieve data related to categories from the dataProvider
 *		and update the pageAbout accordingly.
 */		
function initializePageAbout()
{
	console.log('initializePageAbout called');
	
	var $pageAbout = $('#pageAbout');
	var $pageAboutContent = $('#pageAboutContent');
	
	var $centersDiv = $('div.centers', $pageAbout );
	var $contactsDiv = $('div.contacts', $pageAbout );

	$pageAboutContent.hide();
	// Show the page loading dialog
	showPageLoadingMsg();
		
	$('div.errorDiv', $pageAbout ).remove();
	$('div.center', $centersDiv ).remove();	
	$('p, div.contactsEmails', $contactsDiv ).remove();
	
	var dataProvider = DataProvider.getInstance();
	// Query the dataProvider in order to get info related to categories
	dataProvider.getAboutInformation({
		success: 
			function( aboutInfo )
			{
				var $pageAbout = $('#pageAbout');
				var $pageAboutContent = $('#pageAboutContent');
				var $greenNumberImg = $('div.greenNumber img', $pageAbout );
								
				$greenNumberImg.attr('src', aboutInfo.greenNumber );
				
				for( var index = 0; index < aboutInfo.centers.length; index++ )
					appendCenterDetails( aboutInfo.centers[index] );
				
				appendContactsDetails( aboutInfo.contacts );				
				
				$pageAboutContent.show();
				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				$pageAbout.jqmData('initialized', 'true');
			},
		error:
			function( errorData )
			{
				var $pageAbout = $('#pageAbout');

				// Hide the page loading dialog
				hidePageLoadingMsg();
				
				handleError( $pageAbout, errorData );
			}
	});
}

function appendCenterDetails( center )
{
	var $pageAbout = $('#pageAbout');
	var $centersDiv = $('div.centers', $pageAbout );
	
	var newCenterDiv = '<div class="center"></div>';
	$centersDiv.append( newCenterDiv );
	var $centerDiv = $('div.center:last', $centersDiv );
	
	var titleElement = 
		'<p class="centerTitle">' + center.name + '</p>';
	
	var addressElement = 
		'<p class="centerAddress">' + center.address + '</p>';
	
	var cityElement = 
		'<p class="centerCity">' + 
			'<span class="zipCode">' + center.zipCode + '</span> - ' +
			'<span class="city">' + center.city + '</span>' +
		'</p>';
	
	$centerDiv.append( titleElement );	
	$centerDiv.append( addressElement );
	$centerDiv.append( cityElement );
	
	printPhoneNumbers( center );
	printFaxNumbers( center );
	printEmails( center );
}

function printPhoneNumbers( center )
{
	if( center.phones == undefined )
		return ;
		
	var $pageAbout = $('#pageAbout');
	var $centersDiv = $('div.centers', $pageAbout );
	var $centerDiv = $('div.center:last', $centersDiv );
	
	var phonesContainer = '<div class="centerPhones"></div>';
	$centerDiv.append( phonesContainer );
	var $phonesContainer = $('div.centerPhones', $centerDiv );
	
	for( var index = 0; index < center.phones.length; index++ )
	{	
		var phoneNumber = center.phones[index];
		 
		var printablePhoneNumber = 
			phoneNumber.substr(0,3) + '.' + phoneNumber.substr(3);
		
		var newPhoneButton = 
			'<div>' +
				'<span class="phoneTitle">Telefono:</span>' +
				'<a data-mini="true" data-inline="true" data-role="button"' +
					' href="tel:' +	phoneNumber + '">' + printablePhoneNumber +
				'</a>' +
			'</div>';
			
		$phonesContainer.append( newPhoneButton );
	}
	$('a[data-role="button"]', $phonesContainer ).button();
}

function printFaxNumbers( center )
{
	if( center.faxes == undefined )
		return ;
	
	var $pageAbout = $('#pageAbout');
	var $centersDiv = $('div.centers', $pageAbout );
	var $centerDiv = $('div.center:last', $centersDiv );
	
	var faxesContainer = '<div class="centerFaxes"></div>';
	$centerDiv.append( faxesContainer );
	var $faxesContainer = $('div.centerFaxes', $centerDiv );
	
	for( var index = 0; index < center.faxes.length; index++ )
	{	
		var faxNumber = center.faxes[index];
		 
		var printableFaxNumber = 
			faxNumber.substr(0,3) + '.' + faxNumber.substr(3);
		
		var newFaxButton = 
			'<div>' +
				'<span class="faxTitle">Fax:</span>' +
				'<a data-mini="true" data-inline="true" data-role="button"' +
					' href="' +	faxNumber + '">' + printableFaxNumber +
				'</a>' +
			'</div>';
			
		$faxesContainer.append( newFaxButton );
	}
	$('a[data-role="button"]', $faxesContainer ).button();
}

function printEmails( center )
{
	if( center.emails == undefined )
		return ;
	
	var $pageAbout = $('#pageAbout');
	var $centersDiv = $('div.centers', $pageAbout );
	var $centerDiv = $('div.center:last', $centersDiv );
	
	var emailsContainer = '<div class="centerEmails"></div>';
	$centerDiv.append( emailsContainer );
	var $emailsContainer = $('div.centerEmails', $centerDiv );
	
	for( var index = 0; index < center.emails.length; index++ )
	{	
		var emailAddress = center.emails[index];
		
		var newEmailButton = 
			'<div>' +
				'<span class="emailTitle">Email:</span>' +
				'<a data-mini="true" data-inline="true" data-role="button"' +
					' href="mailto:' +	emailAddress + '">' + emailAddress +
				'</a>' +
			'</div>';
			
		$emailsContainer.append( newEmailButton );
	}
	$('a[data-role="button"]', $emailsContainer ).button();
}

function appendContactsDetails( contacts )
{
	var $pageAbout = $('#pageAbout');
	var $contactsDiv = $('div.contacts', $pageAbout );
	
	var newNotesElement = '<p class="contactsNotes">' + contacts.notes + '</p>';
	$contactsDiv.append( newNotesElement );
	
	var emailsContainer = '<div class="contactsEmails"></div>';
	$contactsDiv.append( emailsContainer );
	var $emailsContainer = $('div.contactsEmails', $contactsDiv );
	
	for( var index = 0; index < contacts.emails.length; index++ )
	{	
		var emailAddress = contacts.emails[index];		
		
		var newEmailButton = 
			'<div><a data-mini="true" data-inline="true" data-role="button"' +
				' href="mailto:' +	emailAddress + '">' + emailAddress +
			'</a></div>';
				
		$emailsContainer.append( newEmailButton );
	}
	$('a[data-role="button"]', $emailsContainer ).button();
}

