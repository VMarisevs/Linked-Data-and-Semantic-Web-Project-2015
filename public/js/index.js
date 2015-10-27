function MoveBookmark(bookmark){
	
	
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
   
   switchMenu(bookmark);
   
}

function switchMenu(bookmark){
	
	document.getElementById("Home-button").className = "";
	
	for (key in jsDatabases){
		if ( (jsDatabases[key].table+"-button") == bookmark)
			getDatabaseData(jsDatabases[key].table);
		document.getElementById(jsDatabases[key].table+"-button").className = "";
	}
	
	document.getElementById(bookmark).className = "active";
}

function getDatabaseData(table){
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
				currentDatabase = data;
				displayDatabaseData(currentDatabase,table);
			}
								
		}
	});
}

function displayDatabaseData(data,table){
	var varInnerHTML = [];
	var bodyInnerHTML = "";
	var headerInnerHTML = "";
	var varTable = getTableInfo(table);
	
	for (key in varTable.columns){
		headerInnerHTML += '<th>' + varTable.columns[key].column + '</th>';
	}
	
	headerInnerHTML = '<thead class="table"><tr>' + headerInnerHTML + '</tr></thead>';
	
	data.forEach(function(record){
		var tempInnerHTML = "";
		//alert(JSON.stringify(record));
		varTable.columns.forEach(function(column){
			tempInnerHTML += '<td>' + record[column.column] + '</td>';
		});
		
		varInnerHTML.push('<tr>' + tempInnerHTML + '</tr>');
	});

	for ( i=0; i<varInnerHTML.length; i++){
		bodyInnerHTML += varInnerHTML[i];
	}
	
	bodyInnerHTML = "<tbody>" + bodyInnerHTML + "</tbody>";
	
	headerInnerHTML = '<table class="table">' + headerInnerHTML + bodyInnerHTML +'</table>';
	document.getElementById("table-content").innerHTML = headerInnerHTML;
}

function getTableInfo(table){
	var result;
	for (key in jsDatabases){
		if (jsDatabases[key].table == table)
			result = jsDatabases[key];
	}
	return result;
}














