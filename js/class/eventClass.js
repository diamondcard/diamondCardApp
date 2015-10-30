/*	Class Event:
 *			This class stores the information related to a single event.
 * 			Its constructor set the different fields by extracting the data
 *			from a JSON object defined as follows:
 *	
 *	EventJSONObj	=	{	id: number, 
 *							title: string, 
 *							content: string,
 *							date: timestamp,
 *							imageSrc: string
 *						};
 *
 */
function Event( jsonObject )
{
	this.id = jsonObject.id;	
	this.title = jsonObject.title;	
	this.content = jsonObject.content;	
	this.date = new Date( jsonObject.date * 1000 );	
	
	this.imageSrc = null;
	if( jsonObject.src != "" )
		this.imageSrc = "http://www.diamondcard.it/files/eventi/" + 
			jsonObject.id + "/" + jsonObject.src;
}

/* Method Event.getID(): return the ID of the event */
Event.prototype.getID = function()
{
	return this.id;	
}

/* Method Event.getTitle(): return the title of the event */
Event.prototype.getTitle = function()
{
	return this.title;	
}

/* Method Event.getContent(): return the content of the event */
Event.prototype.getContent = function()
{
	return this.content;	
}

/* Method Event.getDate(): return the date of the event */
Event.prototype.getDate = function()
{
	return this.date;	
}

/* Method Event.getImageSrc(): return the imageSrc of the event */
Event.prototype.getImageSrc = function()
{
	return this.imageSrc;	
}

/* Method Event.setImageSrc(): set the imageSrc of the news */
Event.prototype.setImageSrc = function( imageSrc )
{
	var DEFAULT_IMAGE_EVENTS = 
		"http://app.diamondcard.it/smartApp/img/icona_eventi.png";
		
	if( imageSrc != "" )
		this.imageSrc = "http://www.diamondcard.it/files/eventi/" + 
			this.getID() + "/" + imageSrc;	
	else 
		this.imageSrc = DEFAULT_IMAGE_NEWS 
}