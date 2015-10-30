var getCategoriesURL 		= "http://app.diamondcard.it/smartApp/json/get_categories.php";
var getProvincesURL 		= "http://app.diamondcard.it/smartApp/json/get_locations.php";
var getCompaniesURL			= "http://app.diamondcard.it/smartApp/json/get_companies.php";
var getCompanyDetailsURL	= "http://app.diamondcard.it/smartApp/json/get_company_details.php";
var getCompanyMenuURL		= "http://app.diamondcard.it/smartApp/json/get_company_menu.php";
var getNewsURL				= "http://app.diamondcard.it/smartApp/json/get_news.php";
var getOffersURL			= "http://app.diamondcard.it/smartApp/json/get_offers.php";
var getEventsURL			= "http://app.diamondcard.it/smartApp/json/get_events.php";
var getAboutInformationURL	= "http://app.diamondcard.it/smartApp/json/get_dcg_info.php";
var getUserDetailsURL		= "http://app.diamondcard.it/smartApp/json/get_user_details.php";
var getUserBookmarksURL		= "http://app.diamondcard.it/smartApp/json/get_user_bookmarks.php";
var addBookmarkURL			= "http://app.diamondcard.it/smartApp/json/add_bookmark.php";
var removeBookmarkURL		= "http://app.diamondcard.it/smartApp/json/remove_bookmark.php";
var getEvaluationTypesURL	= "http://app.diamondcard.it/smartApp/json/get_evaluation_types.php";
var saveEvaluationURL		= "http://app.diamondcard.it/smartApp/json/save_evaluation.php";

/*	Class DataProvider:
 *			It allows clients to retrieve information about categories,
 *			locations and companies. A DataProvider instance makes an
 *			AJAX request in order to obtain such information, and eventually
 *			stores them in suitable fields, preventing further interactions
 *			with the remote server.
 */
function DataProvider()
{
	// An array storing the information related to categories
	this.categories = null;
	
	// An array storing the information related to locations
	this.provinces = null;
	
	// An array storing the information related to the last companies result list
	this.companies = null;
	
	// An object containing information about a specific company
	this.company = null;
			
	// An array storing the information related to news 
	this.news = null;
	
	// An array storing the information related to offers 
	this.offers = null;	
	
	// An array storing the information related to events
	this.events = null;
	
	// An array storing the information related to user bookmarks
	this.bookmarks = null;
}

/*	Function DataProvider.getInstance():
 *			implements the Singleton pattern allowing clients to create instances
 *			of the DataProvider once. This function has to be used in order to get
 *			the existing instance or in order to create a new one, instead of the
 *			DataProvider constructor. 
 */
DataProvider.getInstance = function()
{
	if( arguments.callee.instance == undefined )
		arguments.callee.instance = new DataProvider();
	return arguments.callee.instance; 
}

/*	Method DataProvider.getCategories:
 *			Retrieve the information related to categories by 
 *			fetching them through an AJAX request. Such information
 *			is stored within the categories field, in order to avoid
 *			further queries to the remote server			
 *
 *	@param options:	an object with at least the following field:
 *								option.success: a callback to be invoked as the
 *														AJAX request has been completed  
 */
DataProvider.prototype.getCategories = function( options )
{
	console.log('DataProvider:getCategories called');
	
	// If the AJAX request has been made once, then return the data
	// related to categories cached within the DataProvider instance
	if( this.categories )
	{
		options.success( this.categories );
		return ;
	}
	
	// Save the instance of the DataProvider calling getCategories
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;
	
	console.log('DataProvider.getCategories: making an Ajax request');
	// Make the AJAX request to the remote server
	$.ajax({
		url: getCategoriesURL,
		dataType: 'json',
		success: 
			function( categories )
			{
				// Save the returned JSON object					
				dataProviderInstance.categories = new Array();
				for( var index = 0; index < categories.length; index++ )
					dataProviderInstance.categories.push( new Category( categories[index] ));
				
				// Sort the categories array alphabetically
				dataProviderInstance.categories.sort( compareByName );
				
				// Call the success callback provided as parameter
				// with the returned JSON object as parameter
				options.success( dataProviderInstance.categories );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

/*	Method DataProvider.getSubCategories:
 *			Retrieve the information related to subcategories by 
 *			fetching them through an AJAX request. Such information
 *			is stored within the categories field, in order to avoid
 *			further queries to the remote server			
 *
 *	@param options:	an object with at least the following field:
 *								options.success: a callback to be invoked as the
 *														AJAX request has been completed
 *								options.categoryID: the ID of the category  
 */
DataProvider.prototype.getSubCategories = function( options )
{
	console.log('DataProvider:getSubCategories called');
	
	// If the AJAX request has been made once, then return the data
	// related to the specific category cached within the 
	// DataProvider instance
	if( this.categories )
	{
		// Look for the category having the same ID 
		// as the one provided as parameter
		for( var index = 0; index < this.categories.length; index++ )
			if( this.categories[index].getID() == options.categoryID )
			{
				// Call the success callback provided as parameter
				// with a Category object containing the required information
				options.success( this.categories[index] );
				return ;
			}
		console.log('DataProvider.getSubCategories: warning! Unknown categoryID: ' + 
				options.categoryID + '.');
	}
}

/*	Method DataProvider.getProvinces:
 *			Retrieve the information related to locations by 
 *			fetching them through an AJAX request. Such information
 *			is stored within the provinces field, in order to avoid
 *			further queries to the remote server			
 *
 *	@param options:	an object with at least the following field:
 *								option.success: a callback to be invoked as the
 *														AJAX request has been completed  
 */
DataProvider.prototype.getProvinces = function( options )
{
	console.log('DataProvider:getProvinces called');
		
	// If the AJAX request has been made once, then return the data
	// related to locations cached within the DataProvider instance
	if( this.provinces )
	{
		options.success( this.provinces );
		return ;
	}
		
	// Save the instance of the DataProvider calling getCategories
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;
	
	console.log('DataProvider.getProvinces: making an Ajax request.');
	// Make the AJAX request to the remote server
	$.ajax({
		url: getProvincesURL,
		dataType: 'json',
		success: 
			function( provinces )
			{
				// Save the returned JSON object
				dataProviderInstance.provinces = new Array();
				for( var index = 0; index < provinces.length; index++ )
					dataProviderInstance.provinces.push( 
						new Province( provinces[index] ));
				
				// Sort the provinces array alphabetically
				dataProviderInstance.provinces.sort( compareByName );
				
				// Call the success callback provided as parameter
				// with the Provinces array as parameter
				options.success( dataProviderInstance.provinces );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

/*	Method DataProvider.getCities:
 *			Retrieve the information related to cities by 
 *			fetching them through an AJAX request. Such information
 *			is stored within the provinces field, in order to avoid
 *			further queries to the remote server			
 *
 *	@param options:	an object with at least the following field:
 *					options.success: 	a callback to be invoked as the
 *										AJAX request has been completed
 *					options.provinceID: the ID of the province  
 */
DataProvider.prototype.getCities = function( options )
{
	console.log('DataProvider:getCities called');

	// If the AJAX request has been made once, then return the data
	// related to the specific province cached within the 
	// DataProvider instance
	if( this.provinces )
	{
		// Look for the province having the same ID 
		// as the one provided as parameter
		for( var index = 0; index < this.provinces.length; index++ )
			if( this.provinces[index].getID() == options.provinceID )
			{
				// Call the success callback provided as parameter
				// with a Province object containing the required information
				options.success( this.provinces[index] );
				return ;
			}
		console.log('DataProvider.getCities: warning! Unknown provinceID: ' +
				options.provinceID + '.');
	}
}

/*	Method DataProvider.getCompanies:
 *			Retrieve the information related to companies by 
 *			fetching them through an AJAX request.	
 *
 *	@param options:	an object with at least the following field:
 *						option.success: a callback to be invoked as the
 *										AJAX request has been completed  
 */
DataProvider.prototype.getCompanies = function( options )
{
	console.log('DataProvider:getCompanies called');
	
	// If the client's query is equal to the last query made
	// then return the array of companies cached avoiding
	// an useless interaction with the remote server	
	if( this.companies )	
	{
		options.success( this.companies );
		return ;
	}
	
	// Define the query URL to request to the remote server
	var url = getCompaniesURL + '?' + options.queryString;
	
	// Save the instance of the DataProvider calling getCompanies
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;		
	
	console.log('DataProvider.getCompanies: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		contentType: "application/json; charset=utf-8",
		url: url,	
		dataType: 'json',
		success: 
			function( companies )
			{
				// Save the returned JSON object
				dataProviderInstance.companies = new Array();
				for( var index = 0; index < companies.length; index++ )
				{
					dataProviderInstance.companies.push( 
						new Company( companies[index] ));
				}

				options.success( dataProviderInstance.companies );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

/*	Method DataProvider.getCompanyDetails:
 *			Retrieve the information related to a specific company by 
 *			fetching them through an AJAX request.	
 *
 *	@param options:	an object with at least the following field:
 *						option.success: a callback to be invoked as the
 *										AJAX request has been completed  
 */
DataProvider.prototype.getCompanyDetails = function( options )
{
	console.log('DataProvider:getCompanyDetails called');
	
	if( this.company )
	{
		// Call the success callback provided as parameter
		// with a Company object containing the required information
		options.success( this.company );
		return ;
	}
	
	var url = getCompanyDetailsURL + '?id=' + options.companyID;
	// Save the instance of the DataProvider calling getCompanyDetails
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;		
		
	console.log('DataProvider.getCompanyDetails: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		url: url,
		dataType: 'json',
		success: 
			function( company )
			{
				// Save the returned JSON object
				dataProviderInstance.company = new Company( company );
				options.success( dataProviderInstance.company );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

/*	Method DataProvider.getCompanyMenu:
 *			Retrieve the information related to a specific company by 
 *			fetching them through an AJAX request.	
 *
 *	@param options:	an object with at least the following field:
 *						option.success: a callback to be invoked as the
 *										AJAX request has been completed  
 */
DataProvider.prototype.getCompanyMenu = function( options )
{
	console.log('DataProvider:getCompanyMenu called');
	
	if( this.company.getMenuCategories())
	{
		// Call the success callback provided as parameter
		// with a Company object containing the required information
		options.success( this.company );
		return ;
	}
	
	var url = getCompanyMenuURL + '?id=' + options.companyID;
	// Save the instance of the DataProvider calling getCompanyMenu
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;		
		
	console.log('DataProvider.getCompanyMenu: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		url: url,
		dataType: 'json',
		success: 
			function( companyMenu )
			{
				// Save the returned JSON object
				dataProviderInstance.company.setMenuCategories( companyMenu );
				options.success( dataProviderInstance.company );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

DataProvider.prototype.getEvaluationTypes = function( options )
{
	console.log('DataProvider:getEvaluationTypes called');
	
	console.log('DataProvider.getEvaluationTypes: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		url: getEvaluationTypesURL + "?companyType=" + options.companyType,
		dataType: 'json',
		success: 
			function( evaluationTypes )
			{
				options.success( evaluationTypes );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

DataProvider.prototype.saveEvaluation = function( options )
{
	console.log('DataProvider:saveEvaluation called');
	
	var url = saveEvaluationURL + "?" + options.queryString;
	
	// Save the instance of the DataProvider calling getCompanyMenu
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;		
	
	console.log('DataProvider.saveEvaluation: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		url: url,
		dataType: 'json',
		success: 
			function( evaluations )
			{
				dataProviderInstance.company.setEvaluations( evaluations );
				options.success();
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

/*	Method DataProvider.getNews:
 *			Retrieve the information related to news by 
 *			fetching them through an AJAX request. Such information
 *			is stored within the news field, in order to avoid
 *			further queries to the remote server			
 *
 *	@param options:	an object with at least the following field:
 *								option.success: a callback to be invoked as the
 *												AJAX request has been completed  
 */
DataProvider.prototype.getNews = function( options )
{
	console.log('DataProvider:getNews called');
	
	// If the AJAX request has been made once, then return the data
	// related to news cached within the DataProvider instance
	if( this.news )
	{
		if( options.newsID != undefined )
		{
			// Look for the news having the same ID 
			// as the one provided as parameter
			for( var index = 0; index < this.news.length; index++ )
			{
				if( this.news[index].getID() == options.newsID )
				{
					// Call the success callback provided as parameter
					// with a News object containing the required information
					options.success( this.news[index] );
					return ;
				}
			}
			
			console.log('DataProvider.getNewsDetails: warning! Unknown newsID: ' +
					options.newsID + '.');
		}
		else
			options.success( this.news );
		
		return ;
	}
	
	// Save the instance of the DataProvider calling getNews
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;
	
	console.log('DataProvider.getNews: making an Ajax request');
	// Make the AJAX request to the remote server
	$.ajax({
		url: getNewsURL,
		dataType: 'json',
		success: 
			function( news )
			{
				// Save the returned JSON object					
				dataProviderInstance.news = new Array();
				for( var index = 0; index < news.length; index++ )
					dataProviderInstance.news.push( new News( news[index] ));
				
				// Sort the news array by publishing date
				dataProviderInstance.news.sort( compareByDate ).reverse();
				
				if( options.newsID != undefined )
				{
					// Look for the news having the same ID 
					// as the one provided as parameter
					for( var index = 0; index < this.news.length; index++ )
					{
						if( dataProviderInstance.news[index].getID() == options.newsID )
						{
							// Call the success callback provided as parameter
							// with a News object containing the required information
							options.success( dataProviderInstance.news[index] );
							return ;
						}
					}
					
					console.log('DataProvider.getNewsDetails: warning! Unknown newsID: ' +
							options.newsID + '.');
				}
				else
					// Call the success callback provided as parameter
					// with the returned JSON object as parameter
					options.success( dataProviderInstance.news );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

/*	Method DataProvider.getOffers:
 *			Retrieve the information related to offers by 
 *			fetching them through an AJAX request. Such information
 *			is stored within the offers field, in order to avoid
 *			further queries to the remote server			
 *
 *	@param options:	an object with at least the following field:
 *					option.success: a callback to be invoked as the
 *									AJAX request has been completed  
 */
DataProvider.prototype.getOffers = function( options )
{
	console.log('DataProvider:getOffers called');
	
	// If the AJAX request has been made once, then return the data
	// related to the offers cached within the DataProvider instance
	if( this.offers )
	{
		if( options.offerID != undefined )
		{
			// Look for the offer having the same ID 
			// as the one provided as parameter
			for( var index = 0; index < this.offers.length; index++ )
			{
				if( this.offers[index].getID() == options.offerID )
				{
					// Call the success callback provided as parameter
					// with a Offer object containing the required information
					options.success( this.offers[index] );
					return ;
				}
			}
			
			console.log('DataProvider.getOfferDetails: warning! Unknown offerID: ' +
					options.newsID + '.');
		}
		else
			options.success( this.offers );
		
		return ;
	}
	
	// Save the instance of the DataProvider calling getOffers
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;
	
	console.log('DataProvider.getOffers: making an Ajax request');
	// Make the AJAX request to the remote server
	$.ajax({
		url: getOffersURL,
		dataType: 'json',
		success: 
			function( offers )
			{
				// Save the returned JSON object					
				dataProviderInstance.offers = new Array();
				for( var index = 0; index < offers.length; index++ )
					dataProviderInstance.offers.push( new Offer( offers[index] ));
				
				// Sort the offers array by publishing date
				dataProviderInstance.offers.sort( compareByDate ).reverse();
				
				if( options.offerID != undefined )
				{
					// Look for the offer having the same ID 
					// as the one provided as parameter
					for( var index = 0; index < this.offers.length; index++ )
					{
						if( dataProviderInstance.offers[index].getID() == options.offerID )
						{
							// Call the success callback provided as parameter
							// with a Offer object containing the required information
							options.success( dataProviderInstance.offers[index] );
							return ;
						}
					}
					
					console.log('DataProvider.getOfferDetails: warning! Unknown offerID: ' +
							options.newsID + '.');
				}
				else
					// Call the success callback provided as parameter
					// with the returned JSON object as parameter
					options.success( dataProviderInstance.offers );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

/*	Method DataProvider.getEvents:
 *			Retrieve the information related to events by 
 *			fetching them through an AJAX request. Such information
 *			is stored within the events field, in order to avoid
 *			further queries to the remote server			
 *
 *	@param options:	an object with at least the following field:
 *					option.success: a callback to be invoked as the
 *									AJAX request has been completed  
 */
DataProvider.prototype.getEvents = function( options )
{
	console.log('DataProvider:getEvents called');
	
	// If the AJAX request has been made once, then return the data
	// related to events cached within the DataProvider instance
	if( this.events )
	{
		if( options.eventID != undefined )
		{
			// Look for the event having the same ID 
			// as the one provided as parameter
			for( var index = 0; index < this.events.length; index++ )
			{
				if( this.events[index].getID() == options.eventID )
				{
					// Call the success callback provided as parameter
					// with a Event object containing the required information
					options.success( this.events[index] );
					return ;
				}
			}
			
			console.log('DataProvider.getEventDetails: warning! Unknown eventID: ' +
					options.eventID + '.');
		}
		else
			options.success( this.events );
		
		return ;
	}
	
	// Save the instance of the DataProvider calling getEvents
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;
	
	console.log('DataProvider.getEvents: making an Ajax request');
	// Make the AJAX request to the remote server
	$.ajax({
		url: getEventsURL,
		dataType: 'json',
		success: 
			function( events )
			{
				// Save the returned JSON object					
				dataProviderInstance.events = new Array();
				for( var index = 0; index < events.length; index++ )
					dataProviderInstance.events.push( new Event( events[index] ));
				
				// Sort the events array by publishing date
				dataProviderInstance.events.sort( compareByDate ).reverse();
				
				if( options.eventID != undefined )
				{
					// Look for the event having the same ID 
					// as the one provided as parameter
					for( var index = 0; index < dataProviderInstance.events.length; index++ )
					{
						if( dataProviderInstance.events[index].getID() == options.eventID )
						{
							// Call the success callback provided as parameter
							// with a Event object containing the required information
							options.success( dataProviderInstance.events[index] );
							return ;
						}
					}
					
					console.log('DataProvider.getEventDetails: warning! Unknown eventID: ' +
							options.eventID + '.');
				}
				else
					// Call the success callback provided as parameter
					// with the returned JSON object as parameter
					options.success( dataProviderInstance.events );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

DataProvider.prototype.getAboutInformation = function( options )
{
	console.log('DataProvider:getAboutInformation called');
	
	console.log('DataProvider.getAboutInformation: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		url: getAboutInformationURL,
		dataType: 'json',
		success: 
			function( result )
			{
				options.success( result );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

DataProvider.prototype.getUserDetails = function( options )
{
	console.log('DataProvider:getUserDetails called');
	
	var url = getUserDetailsURL + 
		"?username=" + options.username +
		"&password=" + options.password;
	
	console.log('DataProvider.getUserDetails: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		url: url,
		dataType: 'json',
		success: 
			function( jsonUser )
			{
				options.success( jsonUser );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

DataProvider.prototype.getUserBookmarks = function( options )
{
	console.log('DataProvider:getUserBookmarks called');
	
	var url = getUserBookmarksURL + 
		"?username=" + options.username +
		"&password=" + options.password;
	
	// Save the instance of the DataProvider calling getEvents
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;
	
	console.log('DataProvider.getUserBookmarks: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		url: url,
		dataType: 'json',
		success: 
			function( jsonBookmarks )
			{
				dataProviderInstance.bookmarks = new Array();
				for( var index = 0; index < jsonBookmarks.length; index++ )
				{
					dataProviderInstance.bookmarks.push( 
						new Company( jsonBookmarks[index] ));
				}
				
				options.success( dataProviderInstance.bookmarks );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

DataProvider.prototype.addBookmark = function( options )
{
	console.log('DataProvider:addBookmark called');
	
	var url = addBookmarkURL + 
		"?username=" + options.username +
		"&password=" + options.password +
		"&id=" + options.companyID;
	
	// Save the instance of the DataProvider calling addBookmark
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;
	
	console.log('DataProvider.addBookmark: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		url: url,
		dataType: 'json',
		success: 
			function( jsonBookmarks )
			{
				dataProviderInstance.bookmarks = new Array();
				for( var index = 0; index < jsonBookmarks.length; index++ )
				{
					dataProviderInstance.bookmarks.push( 
						new Company( jsonBookmarks[index] ));
				}
				
				options.success( dataProviderInstance.bookmarks );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

DataProvider.prototype.removeBookmark = function( options )
{
	console.log('DataProvider:removeBookmark called');
	
	var url = removeBookmarkURL + 
		"?username=" + options.username +
		"&password=" + options.password +
		"&id=" + options.companyID;
	
	// Save the instance of the DataProvider calling removeBookmark
	// in order to have a reference to it within the success callback
	var dataProviderInstance = this;
	
	console.log('DataProvider.removeBookmark: making an Ajax request.');	
	// Make the AJAX request to the remote server
	$.ajax({
		url: url,
		dataType: 'json',
		success: 
			function( jsonBookmarks )
			{
				dataProviderInstance.bookmarks = new Array();
				for( var index = 0; index < jsonBookmarks.length; index++ )
				{
					dataProviderInstance.bookmarks.push( 
						new Company( jsonBookmarks[index] ));
				}
				
				options.success( dataProviderInstance.bookmarks );
			},
		error:
			function( data )
			{
				options.error( data.readyState );	
			}
	});
}

/*	Method DataProvider.unsetCompany:
 *			Remove the information related to a specific company 
 *			stored within the news field of this dataProvider instance
 */
DataProvider.prototype.unsetCompany = function()
{
	console.log('DataProvider:unsetCompany called');
	this.company = null;
}

/*	Method DataProvider.unsetCompanies:
 *			Remove the information related to companies 
 *			stored within the news field of this dataProvider instance
 */
DataProvider.prototype.unsetCompanies = function()
{
	console.log('DataProvider:unsetCompanies called');
	this.companies = null;
}

/*	Method DataProvider.unsetNews:
 *			Remove the information related to news 
 *			stored within the news field of this dataProvider instance
 */
DataProvider.prototype.unsetNews = function()
{
	console.log('DataProvider:unsetNews called');
	this.news = null;
}

/*	Method DataProvider.unsetOffers:
 *			Remove the information related to offers 
 *			stored within the news field of this dataProvider instance
 */
DataProvider.prototype.unsetOffers = function()
{
	console.log('DataProvider:unsetOffers called');
	this.offers = null;
}

/*	Method DataProvider.unsetEvents:
 *			Remove the information related to events 
 *			stored within the news field of this dataProvider instance
 */
DataProvider.prototype.unsetEvents = function()
{
	console.log('DataProvider:unsetEvents called');
	this.events = null;
}

/*	Method DataProvider.unsetBookmarks:
 *			Remove the information related to bookmarks 
 *			stored within the news field of this dataProvider instance
 */
DataProvider.prototype.unsetBookmarks = function()
{
	console.log('DataProvider:unsetBookmarks called');
	this.bookmarks = null;
}