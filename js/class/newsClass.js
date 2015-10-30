/*	Class News:
 *			This class stores the information related to a single news.
 * 			Its constructor set the different fields by extracting the data
 *			from a JSON object defined as follows:
 *	
 *	NewsJSONObj	=	{	id: number, 
 *						title: string, 
 *						content: string,
 *						date: timestamp,
 *						imageSrc: string
 *					};
 *
 */
function News( jsonObject )
{
	this.id = jsonObject.id;	
	this.title = jsonObject.title;	
	this.content = jsonObject.content;	
	this.date = new Date( jsonObject.date * 1000 );	
	
	this.setImageSrc( jsonObject.src );
}

/* Method News.getID(): return the ID of the news */
News.prototype.getID = function()
{
	return this.id;	
}

/* Method News.getTitle(): return the title of the news */
News.prototype.getTitle = function()
{
	return this.title;	
}

/* Method News.getContent(): return the content of the news */
News.prototype.getContent = function()
{
	return this.content;	
}

/* Method News.getDate(): return the date of the news */
News.prototype.getDate = function()
{
	return this.date;	
}

/* Method News.getImageSrc(): return the imageSrc of the news */
News.prototype.getImageSrc = function()
{
	return this.imageSrc;	
}

/* Method News.setImageSrc(): set the imageSrc of the news */
News.prototype.setImageSrc = function( imageSrc )
{
	var DEFAULT_IMAGE_NEWS = 
		"http://app.diamondcard.it/smartApp/img/icona_news.png";
		
	if( imageSrc != "" )
		this.imageSrc = "http://www.diamondcard.it/files/news/" + 
			imageSrc;	
	else 
		this.imageSrc = DEFAULT_IMAGE_NEWS;
}