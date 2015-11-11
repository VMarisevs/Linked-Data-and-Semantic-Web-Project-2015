
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
	var idType;
	
	// generating table header using html tags
	varTable.columns.forEach(function (column){
		headerInnerHTML += '<th>' + column.column + '</th>';
		if (column.column == "id" && column.type == "INTEGER PRIMARY KEY AUTOINCREMENT"){
			idType = column.column;
		} else if (column.column == "_id" && column.type == "String"){
			idType = column.column;
		}
	});
	
	// one empty header for column edit/delete action button
	headerInnerHTML += "<th>&nbsp;</th>" + "<th>&nbsp;</th>";

	
	// wrapping around table thead tags
	headerInnerHTML = '<thead class="table"><tr>' + headerInnerHTML + '</tr></thead>';
	
	var record = [];
	// generating table header using html tags
	varTable.columns.forEach(function (column){
		var print = "";
		switch (column.column){
			case "id":
				print = "&nbsp;";
				break;
			case "_id":
				print = "&nbsp;";
				break;
			default:
				var coltype;
				
				switch(column.type){
					case "FLOAT" : 
						coltype = "type=\"number\" step=\"0.0000000001\"";	
						break
					default:
						coltype = "type=\"text\"";
						break;
				}
				
				print = "<input " + coltype + " id=\"INSERT-" + table + "-" + column.column + "\">";
				record.push(column.column);
				break;
		}
		
		headerInnerHTML += '<td>' + print + '</td>';
	});	
	
	headerInnerHTML += "<td><a button type=\"button\" class=\"btn btn-success\" onclick=\"insertRecord('"
							+ record +"','"
							+ table +"');\">Insert</button></td>";
	
	
	headerInnerHTML = '<tr>' + headerInnerHTML + '</tr>';
	
	// generating table rows using html tags
	data.forEach(function(record){
		var tempInnerHTML = "";
		
		varTable.columns.forEach(function(column){
			tempInnerHTML += '<td>' + record[column.column] + '</td>';
		});
		
		// action button that will contains info about request
		tempInnerHTML += "<td><button type=\"button\" class=\"btn btn-warning\" onclick=\"showRecord('"
							+ record[idType] +"','"
							+ table +"');\">Edit</button></td>";
		
		tempInnerHTML += "<td><button type=\"button\" class=\"btn btn-danger\" onclick=\"deleteRecord('"
							+ record[idType] +"','"
							+ table +"');\">Delete</button></td>";

		
		// wrapping around row
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


// get record to display origin data to edit
function showRecord(record_id, table){
	// ajax call to get a row based on id to fill in the form
	$.ajax({
		url: '/' + table + '/' + record_id,
		type: 'GET',
		success: function(data) {
			var msg = "";
			if (data == "Error"){
				msg = "This record doesn't exists...";
				alert(msg);	
			}						
			else {
				// received record is received
				currentRecord = data;	
				//alert(JSON.stringify(currentRecord));
				var msg = showRecordHtml(currentRecord,table);
				$("#edit-dialog").html(msg);
				
				$("#edit-dialog").dialog("open");				
			}
								
		}
	});

}

// preparing selected record
function showRecordHtml(record,table){
	var recordHtml = "";
	
	for (key in record){
		if (key != "id" &&  key != "_id" && key != "_rev"){
			recordHtml += "<tr><td>" + key 
							+"</td><td><input type='text' id='"
							+ table + "-" + key + "' value='" + record[key] +"'></td></tr>";
		} else{
			recordHtml += "<tr><td></td><td><input type='hidden' id='"
							+ table + "-" + key + "' value='"+record[key]+"'></td></tr>";
			
		}
	}
 
	recordHtml +=	"<tr><td></td><td>"
						+ "<button type=\"button\" class=\"btn btn-success\" onclick=\"saveRecord('"
						+ table +"');\">Save</button>"
					+"</td></tr>";

	
	recordHtml = "<table>" + recordHtml + "</table>";
	
	return recordHtml;
}

// function to save record in db
function saveRecord(table){
	// collecting all information based on id 
	
	var newRecord = {};
	
	for (key in currentRecord){
		var elementId = "#" + table + "-" + key;
		newRecord[key] = $(elementId).val();
	}
	
	var params = JSON.stringify(newRecord);

	$.ajax({
			url: "/" + table + "/update",
			type: 'POST',
			data: 	params,
			success: function(data) {
				showNotification("Record Updated " + JSON.stringify(params));
				MoveBookmark( table + '-button');
			}
		});
	
	$("#edit-dialog").dialog("close");
}

// function to delete record from db
function deleteRecord(record_id,table){
	
	
	var answer = confirm("Do You want delete record" 
						//	+" with id:" + record_id 
							+ "?");
	// if user confirms
	if (answer){
		
		var params = { id : record_id};
		
		$.ajax({
			url: "/" + table + "/delete",
			type: 'DELETE',
			data: 	params,
			success: function(data) {
				showNotification("Record deleted! " + JSON.stringify(params));
				MoveBookmark( table + '-button');
			}
		});
	}
	
}

// function to insert record into db
function insertRecord(record,table){
	// getting array in string format
	var columns = record.split(',');
	
	// getting table column types
	var tableInfo = getTableInfo(table);
	var columnTypesDef = tableInfo["columns"];
	var columnTypes = {};
	
	
	for (var i = 0; i < columnTypesDef.length; i++){
		columnTypes[columnTypesDef[i].column] = columnTypesDef[i].type;
	}
	
	// if no data was inserted, 
	var valid = [];
	var validResult = false;
	// set them all false
	for (var i = 0; i < columnTypes.size; i++){
		valid.push(0);
	}
	
	// declaring new record object array
	var newRecord = {};
	// looping through html elements to pick up information
	for (var i = 0; i < columns.length; i++){
		// element id
		var elementId = "#INSERT-" + table + "-" + columns[i];
		// getting value
		newRecord[columns[i]] = $(elementId).val();
		
		// if record is not empty
		if (newRecord[columns[i]] != "")
			valid[i] = true;
			
	}
	
	// making a result
	for (var i = 0; i < valid.length; i++){
		if (valid[i] == null){
			validResult = false;
			break;
		} else{
			validResult = true;
		}
	}
	
	
	
	if (validResult){
		var params = newRecord;		
		$.ajax({
				url: "/" + table + "/insert",
				type: 'PUT',
				data: 	params,
				success: function(data) {
					// refreshing the page
					showNotification("Insert Record " + JSON.stringify(params));
					MoveBookmark( table + '-button');
				}
			});
	}
	
}


function showNotification(text){
	
	$("#notification").fadeIn("slow").html(text);
	
	setTimeout(function(){ 
			$("#notification").fadeOut("slow");						
	}, 2000);
}


