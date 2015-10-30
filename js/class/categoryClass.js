/*	Class Category:
 *			This class stores the information related to a single category.
 * 			Its constructor set the different fields by extracting the data
 *			from a JSON object defined as follows:
 *	
 *	CategoryJSONObj	=	{	id: number, 
 *							name: string, 
 *							subcategories: {[ SubCategoryJSONObj_1, ..., SubCategoryJSONObj_N ]}
 *						};
 *
 *	@member id:				the ID specific of a category
 *	@member name:			the name of the category
 *	@member subcategories:	an array of Subcategory object
 */
function Category( jsonObject )
{
	this.id = jsonObject.id;	
	this.name = capitalizeCharactersBeforeSpaces( jsonObject.nome );
	this.subcategories = new Array();
	
	for( var index = 0; index < jsonObject.subcategories.length; index++ )
		this.subcategories.push( new Subcategory( jsonObject.subcategories[index] ));
		
	// Sort the subcategories array alphabetically
	this.subcategories.sort( compareByName );
}

/* Method Category.getID(): return the ID of the category */
Category.prototype.getID = function()
{
	return this.id;	
}

/* Method Category.getName(): return the name of the category */
Category.prototype.getName = function()
{
	return this.name;	
}

/* Method Category.getSubcategories(): return an array of Subcategory object  */
Category.prototype.getSubcategories = function()
{
	return this.subcategories;
}

/* Method Category.getNumberOfSubcategories(): return the number of subcategories  */
Category.prototype.getNumberOfSubcategories = function()
{
	return this.subcategories.length;
}

/* Method Category.getSubcategory(): 
 *			return the Subcategory object having the ID specified as parameter */
Category.prototype.getSubcategory = function( categoryID )
{
	for( var index = 0; index < this.subcategories.length; index++ )
		if( this.subcategories[index].getID() == categoryID )
			return this.subcategories[index];
	
	return null;
}

/*	Class Subcategory:
 *			This class stores the information related to a single subcategory.
 * 			Its constructor set the different fields by extracting the data
 *			from a JSON object defined as follows:
 *	
 *	SubCategoryJSONObj	=	{	id: number, 
 *								name: string,
 *								numberOfAffiliates: number
 *							};
 *
 *	@member id:					the ID specific of a subcategory
 *	@member name:				the name of the subcategory
 *	@member numberOfCompanies:	the number of companies belonging to the subcategory
 */
function Subcategory( jsonObject )
{
	this.id = jsonObject.id;
	this.name = capitalizeCharactersBeforeSpaces( jsonObject.nome );
	this.numberOfCompanies = jsonObject.n_conv;
}

/* Method Subategory.getID(): return the ID of the subcategory */
Subcategory.prototype.getID = function()
{
	return this.id;	
}

/* Method Subcategory.getName(): return the name of the subcategory */
Subcategory.prototype.getName = function()
{
	return this.name;	
}

/* Method Subcategory.getNumberOfCompanies(): 
 *			return the number of companies belonging to the subcategory */
Subcategory.prototype.getNumberOfCompanies = function()
{
	return this.numberOfCompanies;
}
