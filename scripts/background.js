'use strict';

chrome.runtime.onInstalled.addListener(function(details){
    chrome.storage.local.clear();
});

var userKey = "";
refreshKey();
function refreshKey(){
    chrome.storage.local.get("userKey",function(resp){
        userKey = resp.userKey;
    });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

    if (request.method == "logout"){ 
        chrome.tabs.reload(request.tabid);
        chrome.storage.local.clear();
        localStorage.setItem("keyUser", "");
        chrome.runtime.reload();
        sendResponse("Done");
    }

    if (request.method == "clearUser"){
        chrome.storage.local.clear();
        localStorage.setItem("keyUser", "");
    }
    if (request.method == "getUser") { 
        sendResponse(userKey);
    }
    else if (request.method == "setUser"){ 
        chrome.storage.local.set({'userKey': request.message});
        userKey = request.message;
        refreshKey();
        console.log(userKey); 
        localStorage.setItem("keyUser", userKey);
        return 1;
    }
    else
        sendResponse({}); // snub them.
    return;
});

