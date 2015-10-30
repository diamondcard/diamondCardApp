var months = ["Gennaio", "Febbraio", "Marzo",
			  "Aprile", "Maggio", "Giugno",
			  "Luglio", "Agosto", "Settembre",
			  "Ottobre", "Novembre", "Dicembre"]; 

var daysShort = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];
 
var daysOfTheWeek = ["Lunedi", "Martedi", "Mercoledi", 
		"Giovedi", "Venerdi", "Sabato", "Domenica"];

// var DEFAULT_ERROR_MESSAGE = "Ops! Si &egrave; verificato un errore.";
var DEFAULT_ERROR_MESSAGE = "Ops! Connessione ad internet non disponibile, controlla le tue impostazioni di connessione.";
var OFFLINE_ERROR_MESSAGE = "Nessuna connessione ad internet.";

function handleError( $page, errorCode )
{
	console.log("handleError called with code:" + errorCode );
	
	var $content = $('div[data-role="content"]', $page );
	
	var errorMessage = DEFAULT_ERROR_MESSAGE;
	
	if( navigator.network != undefined )
	{
		if( navigator.network.connection.type == Connection.NONE )
			errorMessage = OFFLINE_ERROR_MESSAGE;
	}
	else
		if( !navigator.onLine )
			errorMessage = OFFLINE_ERROR_MESSAGE;
	
	var errorDiv = 
		'<div class="errorDiv">' + 
			'<p>' + errorMessage + '</p>' +
			'<a class="tryAgainButton"' +
				' data-role="button"' +
				' data-inline="true">Riprova</a>' +
		'</div>';
	
	$content.append( errorDiv );
	$('a.tryAgainButton', $content ).button();
	$('a.tryAgainButton', $content ).bind('click', function()
	{
		var pageName = $page.attr('id');
		
		if( pageName == "pageWhat")
			initializePageWhat();
		if( pageName == "pageWhere")
			initializePageWhere();
		if( pageName == "pageCategory")
			initializePageCategory();
		if( pageName == "pageResult")
			initializePageResult();
		if( pageName == "pageCompanyInfo")
			initializePageCompanyInfo();
		if( pageName == "pageNews")
			initializePageNews();		
		if( pageName == "pageOffers")
			initializePageOffers();
		if( pageName == "pageEvents")
			initializePageEvents();
		if( pageName == "pageAddEvaluation")
			initializePageAddEvaluation();	
		if( pageName == "pageLogin")
			initializePageLogin();	
		if( pageName == "pageAbout")
			initializePageAbout();	
				
		return false;		
	});
}

function capitalizeCharactersBeforeSpaces( string )
{
	if( string == null )
		return null;

	var resultString = "";
	
	string = string.toLowerCase();
	
	var spaceBefore = true;
	// Capitalize each character following a space
	for( var index = 0; index < string.length; index++ )
	{
		if( spaceBefore )
			resultString += string.substr( index , 1 ).toUpperCase();
		else
			resultString += string.substr( index , 1 );
		
		if( string.charAt( index ) == ' ' || 
			string.charAt( index ) == '.' )
			spaceBefore = true;
		else
			spaceBefore = false;
	}
	
	// Modifica le 'e' precedute e seguite da uno spazio
	resultString = resultString.replace(/ E /g, " e ");	
	
	return resultString;
}

function getDistanceAsString( company )
{
	if( company.getNumberOfLocations() == 0 )
		return '-';

	var distance = company.getLocations(0).getDistance() * 1.2;
	
	if( distance == -1 )
		return '-';		
	if( distance <= 50 )
		return '50 m';
	if( distance <= 100 )
		return ( Math.ceil( distance / 10 ) * 10 ) + ' m';
	if( distance <= 1000 )
	{
		var distanceMajor = ( Math.ceil( distance / 100 ) * 100 );
		var distanceMinor = (( distance % 100 ) < 50 ) ? 0 : 50;
		
		if(( distanceMajor + distanceMinor ) == 1000 )
			return '1 Km';			
		
		return ( distanceMajor + distanceMinor ) + ' m';
	}
	if( distance <= 10000 )
		return ( Math.ceil( distance / 100 ) / 10 ) + ' km';
	
	return ( Math.ceil( distance / 1000 )) + ' km';
}

function getAverageRating( votes )
{
	var averageRating = 0;
	
	for( var index = 0; index < votes.length; index++ )
		averageRating += parseFloat( votes[index].getValue());
	
	averageRating /= votes.length;
	
	return getRatingFromString( averageRating );
}

function getRatingFromString( ratingString )
{
	var rating = parseInt( ratingString );
	var ratingDecimalPart = parseFloat( ratingString ) % 1;
	
	if( ratingDecimalPart >= 0.25 &&
	 		ratingDecimalPart < 0.75 )
		rating += 0.5;
	else if( ratingDecimalPart >= 0.75 )
		rating += 1;
		
	return rating;
}

function getCompanyStarAsImage( companyRating )
{
	var returnString = "";
	var numberOfStars = parseInt( companyRating ); 
	var numberOfEmptyStars = 5 - Math.ceil( companyRating );
	 
	var starIndex = 0;
	
	for( var starIndex = 0; starIndex < numberOfStars; starIndex++ )
		returnString +=
			'<img class="ratingStarImage" src="./css/images/star_full.png" />';	
		
	if( companyRating.toString().length != 1 )
		returnString +=
			'<img class="ratingStarImage" src="./css/images/star_half.png" />';
	
	for( var emptyStarIndex = 0; emptyStarIndex < numberOfEmptyStars; emptyStarIndex++ )
		returnString +=
			'<img class="ratingStarImage" src="./css/images/star_empty.png" />';
			
	return returnString;
}

function compareCompaniesByDistance( company1, company2 )
{
	if( company1.getNumberOfLocations() != 0 &&
			company2.getNumberOfLocations() != 0 )
	{
		var distance1 = company1.getLocations(0).getDistance();
		var distance2 = company2.getLocations(0).getDistance();
		
		if( distance1 == -1 && 
				distance2 == -1 )
			return compareByName( company1, company2 );
		
		if( distance1 == -1 )
			return 1;
		
		if( distance2 == -1 )
			return -1;
		
		return distance1 - distance2;
	}
	
	if( company1.getNumberOfLocations() != 0 )
	{
		var distance1 = company1.getLocations(0).getDistance();
		
		if( distance1 == -1 )
			return compareByName( company1, company2 );
		
		return -1;
	}
	
	if( company2.getNumberOfLocations() != 0 )
	{
		var distance2 = company2.getLocations(0).getDistance();
		
		if( distance2 == -1 )
			return compareByName( company1, company2 );
		
		return 1;
	}	
	
	return compareByName( company1, company2 );
}

function compareCompaniesByRating( company1, company2 )
{
	var rating1 = company1.getRatingValue();
	var rating2 = company2.getRatingValue();
	
	if( rating1 == rating2 )
		return compareByName( company1, company2 );
	
	return company2.getRatingValue() - company1.getRatingValue();
}

function compareByName( object1, object2 )
{
	return object1.getName().localeCompare( object2.getName());
}

function compareByDate( object1, object2 )
{
	return object1.getDate() - object2.getDate();
}