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
		document.getElementById(jsDatabases[key].table+"-button").className = "";
	}
	
	document.getElementById(bookmark).className = "active";
}