var unavailableCompanyLogoURL = "http://www.diamondcard.it/img/logo-non-disponibile.gif";

/*	Class Company:
 *			This class stores the information related to a single company.
 * 			Its constructor set the different fields by extracting the data
 *			from a JSON object defined as follows:
 *	
 *	companyJSONObj = 	{	id: number, 
 *							name: string, 
 *							location: LocationJSONObj,
 *							contact: ContactJSONObj, 
 *							rating: number
 *						};
 *
 *	@member id:				the ID specific of the company
 *	@member name:			the name of the category
 *	@member location:		an object containing information about the 
 *							geolocation of the company
 *	@member contact:		an object containing information about the
 *							contact of the company
 *	@member rating:			the user evaluation of the company
 */
function Company( jsonObject )
{
	this.id = jsonObject.id;
	this.name = capitalizeCharactersBeforeSpaces( jsonObject.name );
	
	this.setLocations( jsonObject.location );
	this.setContacts( jsonObject.contact );
	this.setRatingValue( jsonObject.rating );
	this.setLogoSrc( jsonObject.logoSrc );
	
	this.setIsRestaurant( jsonObject.ristorazione );
	
	this.setPhotos( jsonObject.photos );
	this.setThumbnails( jsonObject.thumbnails );
	this.setEvaluations( jsonObject.evaluations );
	
	this.setDiscounts( jsonObject.discount ); 
}

/* Method Company.getID(): return the ID of the company */
Company.prototype.getID = function()
{
	return this.id;
}

/* Method Company.getName(): return the name of the company */
Company.prototype.getName = function()
{
	return this.name;
}

/* Method Company.getNumberOfLocations(): return the number of locations of the company */
Company.prototype.getNumberOfLocations = function()
{
	if( this.locations != undefined )
		return this.locations.length;
	
	return 0;
}

/* Method Company.getLocations(): return the locations of the company */
Company.prototype.getLocations = function( index )
{
	if( this.locations != undefined )
	{
		if( index == undefined )
			return this.locations;
	
		return this.locations[index];
	}
	
	return null;
}

/* Method Company.setLocations(): set the locations of the company */
Company.prototype.setLocations = function( locations )
{
	if( locations != undefined )
	{
		this.locations = new Array();
		for( var index = 0; index < locations.length; index++ )
			this.locations.push( new CompanyLocation( locations[index] ));
	}
}

/* Method Company.getContacts(): return the contacts of the company */
Company.prototype.getContacts = function()
{
	if( this.contacts != undefined )
		return this.contacts;
	
	return null;
}

/* Method Company.setContacts(): set the contacts of the company */
Company.prototype.setContacts = function( contacts )
{
	if( contacts != undefined )
		this.contacts = new CompanyContact( contacts );
}

/* Method Company.getRatingValue(): return the rating value of the company */
Company.prototype.getRatingValue = function()
{
	return this.ratingValue;
}

/* Method Company.setRatingValue(): set the rating value of the company */
Company.prototype.setRatingValue = function( ratingString )
{
	this.ratingValue = getRatingFromString( ratingString );
}

/* Method Company.getLogoSrc(): return the company's logo source */
Company.prototype.getLogoSrc = function()
{
	return this.logoSrc;
}

/* Method Company.setLogoSrc(): set the company's logo source */
Company.prototype.setLogoSrc = function( logoSrc )
{
	if( logoSrc == undefined ||
			logoSrc == "" )
		this.logoSrc = unavailableCompanyLogoURL;
	else
		this.logoSrc = "http://www.diamondcard.it/files/convenzionati/" + 
				this.id + "/logo/" + logoSrc;
}

/* Method Company.isRestaurant(): return the type of the company */
Company.prototype.isRestaurant = function()
{
	return this.restaurant;
}

/* Method Company.setIsRestaurant(): set if the company is a restaurant */
Company.prototype.setIsRestaurant = function( isRestaurant )
{
	this.restaurant = false;
	if( isRestaurant != undefined &&
			isRestaurant == "1")
		this.restaurant = true;
}

/* Method Company.getNumberOfPhotos(): return the number of photos of the company */
Company.prototype.getNumberOfPhotos = function( index )
{
	if( this.photos != undefined )
		return this.photos.length;
	
	return 0;
}

/* Method Company.getPhotos(): return the photos of the company */
Company.prototype.getPhotos = function( index )
{
	if( this.photos != undefined )
	{
		if( index == undefined )
			return this.photos;
		
		return this.photos[index];
	}
	
	return null;
}

/* Method Company.setPhotos(): set the photos of the company */
Company.prototype.setPhotos = function( photos )
{
	if( photos != undefined )
	{
		this.photos = new Array();
		
		for( var index = 0; index < photos.length; index++ )
		{ 	
			if( photos[index].length )
			{
				var photoURL = "http://www.diamondcard.it/files/convenzionati/" + 
					this.id + "/galleria-fotografica/" + photos[index];
					 
				this.photos.push( photoURL );
			}
		}
	}
}

/* Method Company.getNumberOfThumbnails(): return the number of thumbnails of the company */
Company.prototype.getNumberOfThumbnails = function( index )
{
	if( this.thumbnails != undefined )
		return this.thumbnails.length;
	
	return 0;
}

/* Method Company.getThumbnails(): return the thumbnails of the company */
Company.prototype.getThumbnails = function( index )
{
	if( this.thumbnails != undefined )
	{
		if( index == undefined )
			return this.thumbnails;
		
		return this.thumbnails[index];
	}
	
	return null;
}

/* Method Company.setThumbnails(): set the thumbnails of the company */
Company.prototype.setThumbnails = function( thumbnails )
{
	if( thumbnails != undefined )
	{
		this.thumbnails = new Array();
		
		for( var index = 0; index < thumbnails.length; index++ )
		{ 	
			if( thumbnails[index].length )
			{
				var thumbnailURL = "http://www.diamondcard.it/files/convenzionati/" + 
					this.id + "/galleria-fotografica/" + thumbnails[index];
					 
				this.thumbnails.push( thumbnailURL );
			}
		}
	}
}

/* Method Company.getNumberOfEvaluations(): return the number evaluations of the company */
Company.prototype.getNumberOfEvaluations = function( index )
{
	if( this.evaluations != null )
		return this.evaluations.length;
	
	return 0;
}

/* Method Company.getEvaluations(): return the evaluations of the company */
Company.prototype.getEvaluations = function( index )
{
	if( this.evaluations != null )
	{
		if( index == undefined )
			return this.evaluations;
		
		return this.evaluations[index];
	}
	
	return null;
}

/* Method Company.setEvaluations(): set the evaluations of the company */
Company.prototype.setEvaluations = function( evaluations )
{
	if( evaluations != undefined )
	{
		this.evaluations = new Array();
		
		for( var index = 0; index < evaluations.length; index++ )
			this.evaluations.push( new CompanyEvaluation( evaluations[index] ));
			
		this.evaluations.sort( compareByDate );
		this.evaluations.reverse();
	}
}

/* Method Company.getDiscounts(): return the discounts of the company */
Company.prototype.getDiscounts = function( index )
{
	if( index == undefined )
		return this.discounts;
	
	return this.discounts[index];
}

/* Method Company.setDiscounts(): set the discounts of the company */
Company.prototype.setDiscounts = function( discount )
{
	if( discount != undefined )
	{
		if( this.restaurant )
			this.discounts = new RestaurantDiscountObject( discount );
		else
		{
			this.discounts = new Array();
			
			for( var index = 0; index < discount.length; index++ )
				this.discounts.push( new DiscountObject( discount[index] ));	
		}	
	}
}

/* Method Company.getNumberOfMenuCategories(): return the number of menu categories of the company */
Company.prototype.getNumberOfMenuCategories = function( index )
{
	if( this.menuCategories != undefined )
		return this.menuCategories.length;
	
	return 0;
}

/* Method Company.getMenuCategories(): return the menu categories of the company */
Company.prototype.getMenuCategories = function( index )
{
	if( this.menuCategories != undefined )
	{
		if( index == undefined )
			return this.menuCategories;
		
		return this.menuCategories[index];
	}
	
	return null;
}

/* Method Company.setMenuCategories(): set the menu categories of the company */
Company.prototype.setMenuCategories = function( jsonObject )
{
	if( jsonObject.length )
	{
		this.menuCategories = new Array();
	
		for( var index = 0; index < jsonObject.length; index++ )
			this.menuCategories.push( new CompanyMenuCategory( this.id, jsonObject[index] ));
	}
}

/*	Class CompanyLocation:
 *			This class stores the information related to the geolocation 
 *			of a single company. Its constructor set the different fields 
 *			by extracting the data from a JSON object defined as follows:
 *	
 *	CompanyLocationJSONObj =	{	address: string, 
 *									city: string, 
 *									province: string, 
 *									zipCode: number
 *								};
 *
 *	@member address:		the street address of the company
 *	@member city:			the city of the company
 *	@member province:		the province of the company
 *	@member zipCode:		the zipCode of the company
 *	@member latitude:		the latitude of the company
 *	@member longitude:		the longitude of the company
 *	@member distance:		the distance as the crow flies from the user
 *								 current position and the company geoposition
 */
function CompanyLocation( jsonObject )
{
	if( jsonObject.address != undefined )
		this.address = capitalizeCharactersBeforeSpaces( jsonObject.address );
	
	if( jsonObject.city != undefined )
		this.city = capitalizeCharactersBeforeSpaces( jsonObject.city );
	
	if( jsonObject.province != undefined )
		this.province = jsonObject.province;
	
	if( jsonObject.zipCode != undefined )
		this.zipCode = jsonObject.zipCode;
	
	if( jsonObject.latitude != undefined )
		this.latitude = jsonObject.latitude;
		
	if( jsonObject.longitude != undefined )
		this.longitude = jsonObject.longitude;
	
	this.distance = 0;
}

/* Method CompanyLocation.getAddress(): return the address of the company */
CompanyLocation.prototype.getAddress = function()
{
	if( this.address != undefined )
		return this.address;
	
	return null;
}

/* Method Company.getCity(): return the city of the company */
CompanyLocation.prototype.getCity = function()
{
	if( this.city != undefined )
		return this.city;
	
	return null;
}

/* Method Company.getProvince(): return the province of the company */
CompanyLocation.prototype.getProvince = function()
{
	if( this.province != undefined )
		return this.province;
	
	return null;
}

/* Method Company.getZipCode(): return the zipCode of the company */
CompanyLocation.prototype.getZipCode = function()
{
	if( this.zipCode != undefined )
		return this.zipCode;
	
	return null;
}

/* Method Company.getLatitude(): return the latitude of the company */
CompanyLocation.prototype.getLatitude = function()
{
	if( this.latitude != undefined )
		return this.latitude;
	
	return null;
}

/* Method Company.getLongitude(): return the longitude of the company */
CompanyLocation.prototype.getLongitude = function()
{
	if( this.longitude != undefined )
		return this.longitude;
	
	return null;
}

/* Method CompanyLocation.getDistance(): return the distance of the 
		company geoposition from the user position previously calculated
		through a call to CompanyLocation.updateDistance() */
CompanyLocation.prototype.getDistance = function()
{
	return this.distance;
}

/* Method CompanyLocation.setDistance(): set the distance as the distance 
		of the company geoposition from the point specified as parameter */
CompanyLocation.prototype.setDistance = function( pointCoords )
{
	if( this.getLatitude() == null ||
			this.getLongitude() == null )
		this.distance = -1;
	else
	{
		var earthRadius = 6371;	// Km
	    var deltaLatitude = ( pointCoords.latitude - this.latitude ) * Math.PI / 180;
	    var deltaLongitude = ( pointCoords.longitude - this.longitude ) * Math.PI / 180;
	    var a = Math.sin( deltaLatitude / 2 ) * Math.sin( deltaLatitude / 2 ) +
	    			Math.cos(( pointCoords.latitude ) * Math.PI / 180 ) * 
	    			Math.cos(( this.latitude ) * Math.PI / 180 ) *
	    			Math.sin( deltaLongitude / 2 ) * 
	    			Math.sin( deltaLongitude / 2 );
	    var c = 2 * Math.asin( Math.sqrt( a ));
	    this.distance = earthRadius * c * 1000;
	}
}

/*	Class CompanyContact:
 *			This class stores the information related to the geolocation 
 *			of a single company. Its constructor set the different fields 
 *			by extracting the data from a JSON object defined as follows:
 *	
 *	CompanyContactJSONObj =	{	phone: string,
 *								mobile: string, 
 *								email: string
 *							};
 *
 *	@member phone:			the phone number of the company
 *	@member mobile:			the mobile phone number of the company
 *	@member email:			the email address of the company
 */
function CompanyContact( jsonObject )
{
	if( jsonObject.phone != undefined )
	{
		this.phones = new Array();
	
		for( var index = 0; index < jsonObject.phone.length; index++ )
			this.phones.push( jsonObject.phone[index] );
	}
	
	if( jsonObject.mobile != undefined )
	{
		this.mobiles = new Array();
	
		for( var index = 0; index < jsonObject.mobile.length; index++ )
			this.mobiles.push( jsonObject.mobile[index] );
	}
	
	if( jsonObject.email != undefined )
	{
		this.emails = new Array();
	
		for( var index = 0; index < jsonObject.email.length; index++ )
			this.emails.push( jsonObject.email[index] );
	}
	
	if( jsonObject.web != undefined )
	{
		this.websites = new Array();
	
		for( var index = 0; index < jsonObject.web.length; index++ )
			this.websites.push( jsonObject.web[index] );
	}
}

/* Method Company.getNumberOfPhones(): return the number of phone of the company */
CompanyContact.prototype.getNumberOfPhones = function()
{
	if( this.phones != undefined )
		return this.phones.length;
	
	return 0;
}

/* Method Company.getPhone(): return the phone of the company */
CompanyContact.prototype.getPhone = function( index )
{
	if( this.phones != undefined )
	{
		if( index == undefined )
			return this.phones;
	
		return this.phones[index];
	}
	
	return null;
}

/* Method Company.getNumberOfMobiles(): return the number of mobiles of the company */
CompanyContact.prototype.getNumberOfMobiles = function()
{
	if( this.mobiles != undefined )
		return this.mobiles.length;
	
	return 0;
}

/* Method Company.getMobile(): return the mobile phone of the company */
CompanyContact.prototype.getMobile = function( index )
{
	if( this.mobiles != undefined )
	{
		if( index == undefined )
			return this.mobiles;
	
		return this.mobiles[index];
	}
	
	return null;
}

/* Method Company.getNumberOfEmails(): return the number of emails of the company */
CompanyContact.prototype.getNumberOfEmails = function()
{
	if( this.emails != undefined )
		return this.emails.length;
	
	return 0;
}

/* Method Company.getEmail(): return the email address of the company */
CompanyContact.prototype.getEmails = function( index )
{
	if( this.emails != undefined )
	{
		if( index == undefined )
			return this.emails;
	
		return this.emails[index];
	}
	
	return null;
}

/* Method Company.getNumberOfWebsites(): return the number of websites of the company */
CompanyContact.prototype.getNumberOfWebsites = function()
{
	if( this.websites != undefined )
		return this.websites.length;
	
	return 0;
}

/* Method Company.getWebsites(): return the web site of the company */
CompanyContact.prototype.getWebsites = function( index )
{
	if( this.websites != undefined )
	{
		if( index == undefined )
			return this.websites;
	
		return this.websites[index];
	}
	
	return null;
}

function CompanyEvaluation( evaluation )
{
	if( evaluation.date != undefined )
		this.date = new Date( evaluation.date * 1000 );
	
	if( evaluation.username != undefined )
		this.username = evaluation.username;
		
	this.votes = new Array();
	
	for( var index = 0; index < evaluation.descr.length; index++ )
	{
		var newCompanyVote = new CompanyVote( evaluation.descr[index], evaluation.value[index] );
		this.votes.push( newCompanyVote );	
	}	
}

CompanyEvaluation.prototype.getDate = function()
{
	if( this.date != undefined )
		return this.date;
	
	return null;	
}

CompanyEvaluation.prototype.getUsername = function()
{
	if( this.username != undefined )
		return this.username;
	
	return null;	
}

CompanyEvaluation.prototype.getVotes = function( index )
{
	if( index == undefined )
		return this.votes;
		
	return this.votes[index];
}

function CompanyVote( description, value )
{
	this.description = description;
	this.value = value;	
}

CompanyVote.prototype.getDescription = function()
{
	return this.description;	
}

CompanyVote.prototype.getValue = function()
{
	return this.value;	
}

var NO_DISCOUNT_STRING = "-";
var CLOSED_STRING = "chiuso";

function RestaurantDiscountObject( jsonObject )
{
	this.setLunchDiscounts( jsonObject.lunch );	
	this.setDinnerDiscounts( jsonObject.dinner );	
	this.setNotes( jsonObject.note );
}

RestaurantDiscountObject.prototype.setLunchDiscounts = function( lunchDiscounts )
{
	if( lunchDiscounts != undefined )
	{
		this.lunchDiscounts = new Array();
		
		for( var index = 0; index < lunchDiscounts.length; index++ )
		{
			var lunchDiscount = NO_DISCOUNT_STRING;
			
			if( lunchDiscounts[index] == "CHIUS" )
				lunchDiscount = CLOSED_STRING;
			else if( lunchDiscounts[index] != "" )
				lunchDiscount = lunchDiscounts[index];
			
			this.lunchDiscounts.push( lunchDiscount );
		}			
	}
}

RestaurantDiscountObject.prototype.getLunchDiscounts = function( index )
{
	if( this.lunchDiscounts != undefined )
	{
		if( index == undefined )
			return this.lunchDiscounts;
		
		return this.lunchDiscounts[index];
	}

	return null;	
}

RestaurantDiscountObject.prototype.getNumberOfDiscountsOnLunch = function()
{
	if( this.lunchDiscounts != undefined )
	{
		var numberOfDiscountsOnLunch = 0;
		
		for( var index = 0; index < this.lunchDiscounts.length; index++ )
			if( this.lunchDiscounts[index] != NO_DISCOUNT_STRING )
				numberOfDiscountsOnLunch++;
				
		return numberOfDiscountsOnLunch;
	}

	return 0;	
}

RestaurantDiscountObject.prototype.setDinnerDiscounts = function( dinnerDiscounts )
{
	if( dinnerDiscounts != undefined )
	{
		this.dinnerDiscounts = new Array();
		
		for( var index = 0; index < dinnerDiscounts.length; index++ )
		{
			var dinnerDiscount = NO_DISCOUNT_STRING;
			
			if( dinnerDiscounts[index] == "CHIUS" )
				dinnerDiscount = CLOSED_STRING;
			else if( dinnerDiscounts[index] != "" )
				dinnerDiscount = dinnerDiscounts[index];
			
			this.dinnerDiscounts.push( dinnerDiscount );
		}			
	}
}

RestaurantDiscountObject.prototype.getDinnerDiscounts = function( index )
{
	if( this.dinnerDiscounts != undefined )
	{
		if( index == undefined )
			return this.dinnerDiscounts;
		
		return this.dinnerDiscounts[index];
	}

	return null;	
}

RestaurantDiscountObject.prototype.getNumberOfDiscountsOnDinner = function()
{
	if( this.dinnerDiscounts != undefined )
	{
		var numberOfDiscountsOnDinner = 0;
		
		for( var index = 0; index < this.dinnerDiscounts.length; index++ )
			if( this.dinnerDiscounts[index] != NO_DISCOUNT_STRING )
				numberOfDiscountsOnDinner++;
				
		return numberOfDiscountsOnDinner;
	}

	return 0;	
}

RestaurantDiscountObject.prototype.getNumberOfNotes = function()
{
	if( this.notes != undefined )
		return this.notes.length;
	
	return 0;			
}

RestaurantDiscountObject.prototype.getNotes = function( index )
{
	if( this.notes != undefined )
	{
		if( index == undefined )
			return this.notes;
	
		return this.notes[index];
	}
	
	return null;		
}

RestaurantDiscountObject.prototype.setNotes = function( notes )
{
	if( notes != undefined )
	{
		this.notes = new Array();
		for( var index = 0; index < notes.length; index++ )
			if( notes[index] != "" )
				this.notes.push( notes[index]);
	}		
}

function DiscountObject( jsonObject )
{
	if( jsonObject.importo != undefined )
		this.value = jsonObject.importo + "&euro;";
	else if( jsonObject.sconto != undefined )
		this.value = jsonObject.sconto + "%";
	
	if( jsonObject.note != undefined )
		this.note = jsonObject.note;
}

DiscountObject.prototype.getValue = function()
{
	if( this.value != undefined )
		return this.value;
	
	return null;	
}

DiscountObject.prototype.getNote = function()
{
	if( this.note != undefined )
		return this.note;
		
	return null;	
}

function CompanyMenuCategory( companyID, jsonObject )
{
	if( jsonObject.category != undefined )
		this.name = jsonObject.category;	
			
	if( jsonObject.items != undefined )
	{
		this.items = new Array();
		
		for( var index = 0; index < jsonObject.items.length; index++ )
			this.items.push( new CompanyMenuItem( companyID, jsonObject.items[index] ));
	}
}

/* Method CompanyMenuCategory.getCategoryName(): return the name of the menu category */
CompanyMenuCategory.prototype.getCategoryName = function()
{
	if( this.name != undefined )
		return this.name;
	
	return null;	
}

/* Method CompanyMenuCategory.getNumberOfItems(): return the number of items */
CompanyMenuCategory.prototype.getNumberOfItems = function( index )
{
	if( this.items != undefined )
		return this.items.length;
	
	return 0;
}

/* Method CompanyMenuCategory.getItems(): return the items */
CompanyMenuCategory.prototype.getItems = function( index )
{
	if( this.items != undefined )
	{
		if( index == undefined )
			return this.items;
			
		return this.items[index];
	}
	
	return null;
}

function CompanyMenuItem( companyID, jsonObject )
{
	if( jsonObject.name != undefined )
		this.name = jsonObject.name;	
	if( jsonObject.ingredients != undefined )
		this.ingredients = jsonObject.ingredients;	
	
	this.setPrice( jsonObject.price );
		
	this.setThumbnail( companyID, jsonObject.thumbSrc );
	this.setImage( companyID, jsonObject.imageSrc );
}

/* Method CompanyMenuItem.getName(): return the name */
CompanyMenuItem.prototype.getName = function()
{
	if( this.name != undefined )
		return this.name;
	
	return null;	
}

/* Method CompanyMenuItem.getIngredients(): return the ingredients */
CompanyMenuItem.prototype.getIngredients = function()
{
	if( this.ingredients != undefined )
		return this.ingredients;
	
	return null;	
}

/* Method CompanyMenuItem.getPrice(): return the price */
CompanyMenuItem.prototype.getPrice = function()
{
	if( this.price != undefined )
		return this.price;
	
	return null;	
}

/* Method CompanyMenuItem.setPrice(): set the price */
CompanyMenuItem.prototype.setPrice = function( price )
{
	if( price != undefined )
	{
		var priceString = price.replace(',','.');
		var priceFloat = parseFloat( priceString );
		
		this.price = priceFloat.toFixed(2).replace('.',',') + " &euro;";
	}
}

/* Method CompanyMenuItem.getThumbnail(): return the thumbnail */
CompanyMenuItem.prototype.getThumbnail = function()
{
	if( this.thumbnail != undefined )
		return this.thumbnail;
	
	return null;	
}
	
/* Method CompanyMenuItem.setThumbnail(): set the thumbnail */
CompanyMenuItem.prototype.setThumbnail = function( companyID, thumbSrc )
{
	if( thumbSrc != undefined )
		this.thumbnail = 
			"http://www.diamondcard.it/files/convenzionati/" +
				companyID + "/menu/" + thumbSrc;
}

/* Method CompanyMenuItem.getImage(): return the image */
CompanyMenuItem.prototype.getImage = function()
{
	if( this.image != undefined )
		return this.image;
	
	return null;	
}
	
/* Method CompanyMenuItem.setImage(): set the image */
CompanyMenuItem.prototype.setImage = function( companyID, imageSrc )
{
	if( imageSrc != undefined )
		this.image = 
			"http://www.diamondcard.it/files/convenzionati/" +
				companyID + "/menu/" + imageSrc;
}