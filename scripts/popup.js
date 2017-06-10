/**
 * Created by Ahmad on 11/26/2016.
 */
$("document").ready(function(){
	
	var userKey;
	userKey = localStorage.getItem("keyUser");
	
	if (userKey)
		document.getElementById("tickit-logout").innerText = "Logout";
	else
		document.getElementById("tickit-logout").innerText = "Login";

    $("#tickit-logout").click(function(){
        chrome.tabs.getSelected(null, function(tab) {
            tabId = tab.id;
            chrome.runtime.sendMessage({method:"logout", tabid:tabId});
            
        });

        localStorage.setItem("keyUser", "");
    });    

});

