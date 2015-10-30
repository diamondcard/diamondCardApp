/*	Class Province:
 *			This class stores the information related to a single province.
 * 			Its constructor set the different fields by extracting the data
 *			from a JSON object defined as follows:
 *	
 *	ProvinceJSONObj		=	{	id: number, 
 *								name: string, 
 *								cities: {[ CityObj_1, ..., CityObj_N ]}
 *							};
 *
 *	@member id:				the ID specific of a province
 *	@member name:			the name of the province
 *	@member cities:			an array of City object
 */
function Province( jsonObject )
{
	this.id = jsonObject.id;
	this.name = capitalizeCharactersBeforeSpaces( jsonObject.nome );
	this.cities = new Array();
	
	for( var index = 0; index < jsonObject.citta.length; index++ )
		this.cities.push( new City( jsonObject.citta[index] ));
		
	// Sort the cities array alphabetically
	this.cities.sort( compareByName );
}

/* Method Province.getID(): return the ID of the province */
Province.prototype.getID = function()
{
	return this.id;	
}

/* Method Province.getName(): return the name of the province */
Province.prototype.getName = function()
{
	return this.name;	
}

/* Method Province.getCities(): return an array of City objects  */
Province.prototype.getCities = function()
{
	return this.cities;
}

/* Method Province.getNumberOfCities(): return the number of cities  */
Province.prototype.getNumberOfCities = function()
{
	return this.cities.length;
}

/* Method Province.getCity(): 
 *			return the City object having the ID specified as parameter */
Province.prototype.getCity = function( cityID )
{
	for( var index = 0; index < this.cities.length; index++ )
		if( this.cities[index].getID() == cityID )
			return this.cities[index];
	
	return null;
}

/*	Class City:
 *			This class stores the information related to a single city.
 * 			Its constructor set the different fields by extracting the data
 *			from a JSON object defined as follows:
 *	
 *	CityJSONObj		=	{	id: number, 
 *							name: string
 *						};
 *
 *	@member id:					the ID specific of a city
 *	@member name:				the name of the city
 */
function City( jsonObject )
{
	this.id = jsonObject.id;
	this.name = capitalizeCharactersBeforeSpaces( jsonObject.nome );
}

/* Method City.getID(): return the ID of the city */
City.prototype.getID = function()
{
	return this.id;	
}

/* Method City.getName(): return the name of the city */
City.prototype.getName = function()
{
	return this.name;	
}
