/*	Class Offer:
 *			This class stores the information related to a single offer.
 * 			Its constructor set the different fields by extracting the data
 *			from a JSON object defined as follows:
 *	
 *	OfferJSONObj	=	{	id: number, 
 *							title: string, 
 *							content: string,
 *							date: timestamp,
 *							imageSrc: string
 *						};
 *
 */
function Offer( jsonObject )
{
	this.id = jsonObject.id;	
	this.title = jsonObject.title;	
	this.content = jsonObject.content;	
	this.date = new Date( jsonObject.date * 1000 );	
	
	this.setImageSrc( jsonObject.src );
}

/* Method Offer.getID(): return the ID of the offer */
Offer.prototype.getID = function()
{
	return this.id;	
}

/* Method Offer.getTitle(): return the title of the offer */
Offer.prototype.getTitle = function()
{
	return this.title;	
}

/* Method Offer.getContent(): return the content of the offer */
Offer.prototype.getContent = function()
{
	return this.content;	
}

/* Method Offer.getDate(): return the date of the offer */
Offer.prototype.getDate = function()
{
	return this.date;	
}

/* Method Offer.getImageSrc(): return the imageSrc of the offer */
Offer.prototype.getImageSrc = function()
{
	return this.imageSrc;	
}

/* Method Offer.setImageSrc(): set the imageSrc of the news */
Offer.prototype.setImageSrc = function( imageSrc )
{
	var DEFAULT_IMAGE_OFFER = 
		"http://app.diamondcard.it/smartApp/img/icona_promozioni.png";
		
	if( imageSrc != "" )
		this.imageSrc = "http://www.diamondcard.it/files/promo/" + 
			imageSrc;	
	else 
		this.imageSrc = DEFAULT_IMAGE_OFFER; 
}