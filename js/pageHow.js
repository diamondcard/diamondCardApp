/*	Function handlePageHow:
 *		Handles the pagebeforechange event with a toPage parameter 
 *		equals to pageHow. This function calls initializePageHow
 *		if pageHow isn't initialized, doing nothing otherwise.
 *	
 *	@param event: 	the event pagebeforechange
 *	@param url:		the url to the page that has to be loaded into the DOM
 *	@return:		true if the event is handled by the function; false otherwise
 */
function handlePageHow( pageFrom, pageTo )
{
	if( pageTo != "pageHow" )
		return false;
	
	console.log("handlePageHow called");
	
	var $pageHow = $('#pageHow');			
	
	initializePageHow();	
	
	if( $pageHow.jqmData('initializedHandlers') == undefined )
		initializePageHowHandlers();
			
	return true;
}

function initializePageHow()
{
	console.log("initializePageHow called");
	
	var $selectCategory = $('#selectCategory');
	var selectedCategory = $('option:selected', $selectCategory ).attr('value');
	
	var $otherOptionsDiv = $('#otherOptionsDiv');
	
	if( selectedCategory == 8 )
		$otherOptionsDiv.show();
	else
		$otherOptionsDiv.hide();
}

function initializePageHowHandlers()
{
	var $pageHow = $('#pageHow');
	
	$('#pageHowSearch').bind('click', searchByOptions );
	
	$('#pageHowSelectableStarDiv span').bind('click', function()
	{
		if( $(this).attr('selected') != undefined &&
			$(this).next().attr('selected') == undefined )
		{
			$('#pageHowSelectableStarDiv span').removeAttr('selected');
			$('#pageHowSelectableStarDiv img').attr('src', './css/images/star_empty.png');
			
			return ;
		}
		
		$('#pageHowSelectableStarDiv span').removeAttr('selected');
		$('#pageHowSelectableStarDiv img').attr('src', './css/images/star_empty.png');
				
		$(this).attr('selected', 'true');
		$('img', $(this)).attr('src', './css/images/star_full.png');
		
		var $starSpans = $(this).prevAll();
		for( var index = 0; index < $starSpans.length; index++ )
		{
			$($starSpans[index]).attr('selected', 'true');
			$('img', $starSpans[index]).attr('src', './css/images/star_full.png');		
		}		
	});
	
	$pageHow.jqmData('initializedHandlers', 'true');
}


function searchByOptions()
{
	console.log("searchByOptions called");
	
	var queryString = "";
	
	var $selectCategory = $('#selectCategory');
	var $selectSubCategory = $('#selectSubCategory');

	var categoriesList = getOptionsAsList( $selectCategory, $selectSubCategory );
	
	if( categoriesList != "" ) 
		queryString += "categorie=" + categoriesList + "&";

	var $selectProvince = $('#selectProvince');
	var $selectCity = $('#selectCity');
	var citiesList = getOptionsAsList( $selectProvince, $selectCity );
	
	if( citiesList != "" ) 
		queryString += "comuni=" + citiesList + "&";
	
	queryString += getDiscountDays();
	
	var $rdDiscount = $('input[name="rcDiscount"]:checked');
	if( $rdDiscount.length )
		queryString += "sconto=" + $rdDiscount.attr('value') + "&";
		
	var $rcRating = $('#pageHowSelectableStarDiv span[selected="selected"]');
	if( $rcRating.length )
		queryString += "giudizio=" + $rcRating.length + "&";
		
	var $cbFixedMenu = $('input[name="cbFixedMenu"]');
	if( $cbFixedMenu.is(':checked'))
		queryString += "menuFisso=1&";
		
	var $cbBeach = $('input[name="cbBeach"]');
	if( $cbBeach.is(':checked'))
		queryString += "sulMare=1&";
	
	var $cbOpenSpace = $('input[name="cbOpenSpace"]');
	if( $cbOpenSpace.is(':checked'))
		queryString += "salaAperta=1&";
	
	var $cbSky = $('input[name="cbSky"]');
	if( $cbSky.is(':checked'))
		queryString += "sky=1&";
		
	var $cbHolidays = $('input[name="cbHolidays"]');
	if( $cbHolidays.is(':checked'))
		queryString += "festivita=1&";
	
	var $pageResult = $('#pageResult');
	
	console.log("searchByOptions queryString: " + queryString );	
	
	$pageResult.jqmData('queryString', queryString );
}

function getOptionsAsList( selectElement, subSelectElement )
{
	var queryString = ""; 
	
	var selectedID = 
			$('option:selected', selectElement ).attr('value');
	
	if( selectedID != -1 )
	{
		var $subOptionsSelected = 
			$('option:selected', subSelectElement );			
		
		if( $subOptionsSelected.length == 1 &&
			$subOptionsSelected.attr('value') == -1 )
		{
			var $subOptions = $('option:not(:selected)', subSelectElement );
			$.each( $subOptions, function( index, subOption )
			{
				if( index != 0 )
					queryString += ",";
													
				queryString += $(subOption).attr('value');
			});					
		}
		else if( $subOptionsSelected.attr('value') != -1 )
		{
			var $subOptions = $('option:selected', subSelectElement );
			$.each( $subOptions, function( index, subOption )
			{
				if( index != 0 )
					queryString += ",";
													
				queryString += $(subOption).attr('value');
			});
		}
	}
		
	return queryString;
}	

function getDiscountDays()
{
	var queryString = "";
	var $cbLunch = $('#cbLunch');
	var $cbDinner = $('#cbDinner');
	
	var $daysSelected = $('input[name="cbDay"]:checked');
		
	if(	$daysSelected.length == 0 )
		return "";
	
	var daysSelectedString = "";		
	$.each( $daysSelected, function( index, day )
	{
		if( index != 0 )
			daysSelectedString += ",";
		
		daysSelectedString += $(day).attr('value')
	});
	
	if( $cbLunch.is(':checked') || 
			$cbDinner.is(':checked'))
	{
		if( $cbLunch.is(':checked'))
			queryString += "sconto_pranzo=" + daysSelectedString + "&";
	
		if( $cbDinner.is(':checked'))
			queryString += "sconto_cena=" + daysSelectedString + "&";
	}
	else
		queryString += "sconto_pranzo=" + daysSelectedString + "&" +
						"sconto_cena=" + daysSelectedString + "&";
						
	return queryString;
}