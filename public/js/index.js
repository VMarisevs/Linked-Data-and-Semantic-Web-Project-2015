
// this function is triggers when user clicks to another page button
function MoveBookmark(bookmark){
	// switching the content
	switch(bookmark){
		case "Home-button" :
			document.getElementById("home-content").style.display = 'block';
			document.getElementById("table-content").style.display = 'none';
			break;
		default :
			document.getElementById("table-content").style.display = 'block';
			document.getElementById("home-content").style.display = 'none';
			break;
   }
   
   // calls method to switch the menu design
   switchMenu(bookmark);   
}

// this function is switching menu design
function switchMenu(bookmark){
	// alway clears home button class
	document.getElementById("Home-button").className = "";
	// and clears all class names for all buttons
	for (key in jsDatabases){
		if ( (jsDatabases[key].table+"-button") == bookmark)
			getDatabaseData(jsDatabases[key].table);
		document.getElementById(jsDatabases[key].table+"-button").className = "";
	}
	// sets active only selected button that is passed by method
	document.getElementById(bookmark).className = "active";
}

// getting database data using passed table parameter
function getDatabaseData(table){
	// ajax call to get data
	$.ajax({
		url: '/' + table,
		type: 'GET',
		success: function(data) {
			var msg = "";
			if (data == "Error"){
				msg = "This record doesn't exists...";
				alert(msg);	
			}						
			else {
				//whole received data is loaded into currentDatabase global variable
				currentDatabase = data;
				// and passed to a function to display data
				displayDatabaseData(currentDatabase,table);
			}
								
		}
	});
}


// displaying data on the page
function displayDatabaseData(data,table){
	var varInnerHTML = [];
	var bodyInnerHTML = "";
	var headerInnerHTML = "";
	var varTable = getTableInfo(table);
	
	// generating table header using html tags
	for (key in varTable.columns){
		headerInnerHTML += '<th>' + varTable.columns[key].column + '</th>';
	}
	
	// wrapping around table thead tags
	headerInnerHTML = '<thead class="table"><tr>' + headerInnerHTML + '</tr></thead>';
	
	// generating table rows using html tags
	data.forEach(function(record){
		var tempInnerHTML = "";
		
		varTable.columns.forEach(function(column){
			tempInnerHTML += '<td>' + record[column.column] + '</td>';
		});
		
		varInnerHTML.push('<tr>' + tempInnerHTML + '</tr>');
	});

	// concatinating all array elements together
	for ( i=0; i<varInnerHTML.length; i++){
		bodyInnerHTML += varInnerHTML[i];
	}
	
	// wrapping aroud table body tags
	bodyInnerHTML = "<tbody>" + bodyInnerHTML + "</tbody>";
	// wrapping arout table tags
	headerInnerHTML = '<table class="table">' + headerInnerHTML + bodyInnerHTML +'</table>';
	// setting table element content
	document.getElementById("table-content").innerHTML = headerInnerHTML;
}

// information about selected table
function getTableInfo(table){
	var result;
	for (key in jsDatabases){
		// looking for selected table and returning as result
		if (jsDatabases[key].table == table)
			result = jsDatabases[key];
	}
	return result;
}














