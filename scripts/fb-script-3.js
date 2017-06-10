/**
 * Created by Ahmad on 10/20/2016.
 */
$(document).ready(function() {

    var savedUser = "";
    var savedUserCategories = "";
    var newCatId = "";
    var vidSrc = "";
    var filterThumb;
    var vidPrivacy = "public";
    var currentBtn = "";

    var loaderGif = chrome.extension.getURL('../images/vibentoLoader.gif');

    var showLoader = function(){
        var controlLocker = "<div style='background: url(" + loaderGif + ") center no-repeat rgba(0,0,0,0.6);' class='vibentoOverlay controlLock'></div>";
        if ($(".vibentoOverlay").length){
            $(".vibentoOverlay").append(controlLocker);
        }
        else{
            $("body").append(controlLocker);
        }
    };

    var hideLoader = function(){
        $(".controlLock").remove();
    }

    $("body").on('click', '.vibentoBtn', (function (e) {
        //get saved user.. if not saved..show login form
        showLoader();
        currentBtn = e.currentTarget;
        vidSrc = currentBtn.getAttribute("data-src");
        getSavedUser().done(function(){
            getCategories(savedUser).done(function(){
                hideLoader();
                showFormDialogue(currentBtn, savedUserCategories).done(function(){
                });
            }).fail(function(){
                chrome.runtime.sendMessage({method: "clearUser"});
                hideLoader();
                //if(!alert("Something wrong happened.. Make sure that your account is active.")) 
                
                    document.location = document.location;
            });
        }).fail(function(){
            chrome.runtime.sendMessage({method: "clearUser"});
            hideLoader();
        });
    }));


    setInterval(function(){
        injectButtons()
    },3000);

    function injectButtons() {
        if (document.location.host == "www.facebook.com") {
            //vidSrc = "facebook";
            $("._5pcr").each(function () {
                if (($(this).find(".vibentoBtn").length) || ($(this).find(".uiStreamSponsoredLink").length)) {
                    return 0;
                }
                var contentURL = "";

                if ($(this).find("._6kt._6l-.__c_").length > 0){
                    //debugger
                    //var contentURL = $(this).find("._6kt._6l-.__c_").attr("href");
                    var contentURL = ($(this).find(".mbs._6m6._2cnj._5s6c a").attr("onmouseover")).split(', "')[1].split('")')[0];
                    var videoTitle = $(this).find("._6kt._6l-.__c_").attr("aria-label");
                    var imageUrl = chrome.extension.getURL('../images/button.png');
                    var vidSrc = "youtube";
                    console.log(vidSrc + "|" + contentURL + "|" + videoTitle);
                    var newContent = "<div class='buttonContainer'><div data-src='" + vidSrc + "' data-title='" + videoTitle + "' data-link='" + contentURL + "' class='vibentoBtn'><img src='" + imageUrl + "'></div></div>";
                    $(this).find("._6kt._6l-.__c_").after(newContent);
                }
                if ($(this).find("._6n7").length > 0){
                    var contentURL = $(this).find("._6n7").attr("href");
                    var videoTitle = $(this).find("._6o3").text();
                    var imageUrl = chrome.extension.getURL('../images/button.png');
                    var videoThumb = $(this).find(".uiScaledImageContainer img").attr("src");
                    var vidSrc = "vimeo";
                    var newContent = "<div class='buttonContainer'><div data-src='" + vidSrc + "' data-thumb='" + videoThumb + "' data-title='" + videoTitle + "' data-link='" + contentURL + "' class='vibentoBtn'><img src='" + imageUrl + "'></div></div>";
                    $(this).find("._6n_").after(newContent);

                }

                var postHead = $(this).find("span.fcg").text();
                if (postHead !== undefined) {
                    if (postHead.indexOf("shared") <= 0) {
                        contentURL = "https://www.facebook.com" + $(this).find("a._5pcq").attr("href");
                    }
                    else if (postHead.indexOf("video") > -1) {
                        contentURL = "https://www.facebook.com" + $(this).find("span.fcg > a:nth-child(3)").attr("href");
                    }
                    else return;
                }

                var videoTitle = $(this).find("._5pbx p").text();
                var imageUrl = chrome.extension.getURL('../images/button.png');
                var vidSrc = "facebook";
                var newContent = "<div class='buttonContainer'><div data-src='" + vidSrc + "' data-title='" + videoTitle + "' data-link='" + contentURL + "' class='vibentoBtn'><img src='" + imageUrl + "'></div></div>";
                $(this).find("._53j5").prepend(newContent);
            });


            //if video page opened with lightbox
            var injectInLightbox = function(){
                $("body ._3ixn + div ._5g7d").each(function(){
                    if ($(this).find(".vibentoBtn").length) {
                        return 0;
                    }
                    else{

                        var contentURL = "";
                        contentURL = "https://www.facebook.com" + $(this).find("._zcj").attr("href");
                        var videoTitle = $(this).find("._5o2k").text();
                        var imageUrl = chrome.extension.getURL('../images/button.png');
                        var vidSrc = "facebook";
                        var newContent = "<div class='buttonContainer'><div data-src='" + vidSrc + "' data-title='" + videoTitle + "' data-link='" + contentURL + "' class='vibentoBtn'><img src='" + imageUrl + "'></div></div>";
                        $(this).find("._53j5").prepend(newContent);
                    }
                });
            };
            injectInLightbox();
            setInterval(function(){
                injectInLightbox();
            },5000);


            var videoStrip = 0;
            $("body").on("mouseenter", "._50zn", (function () {
                videoStrip = 1;
                $(this).find("._3el6 span ._38a2").each(function () {
                    if (($(this).find(".vibentoBtn").length) || ($(this).find(".uiStreamSponsoredLink").length)) {
                        return 0;
                    }

                    $(this).css("position", "relative");
                    var videoTitle = $(this).find("._38a4._2yu").text();
                    var imageUrl = chrome.extension.getURL('../images/button.png');
                    var contentURL = $(this).attr("href");
                    var vidSrc = "facebook";
                    var newContent = "<div class='buttonContainer'><div data-src='" + vidSrc + "' data-title='" + videoTitle + "' data-link='" + contentURL + "' class='vibentoBtn'><img src='" + imageUrl + "'></div></div>";
                    $(this).prepend(newContent);
                });
            }));
        }

        else if (document.location.host == "www.youtube.com" || document.location.host == "youtube.com") {
            //vidSrc = "youtube";
            var contentURL, videoTitle, imageUrl;
            var addYtBtn = function() {
                $("#player:not('.btnAdded')").each(function(){
                    $(this).find(".buttonContainer").remove();
                    contentURL = window.location;
                    videoTitle = $(".watch-title-container #eow-title").text();
                    imageUrl = chrome.extension.getURL('../images/button.png');
                    var vidSrc = "youtube";
                    var newContent = "<div class='buttonContainer'><div data-src='" + vidSrc + "' data-title='" + videoTitle + "' data-link='" + contentURL + "' class='vibentoBtn'><img src='" + imageUrl + "'></div></div>";
                    $(this).prepend(newContent);
                    $(this).addClass("btnAdded");
                });

            };
            setInterval(function(){
                addYtBtn();
            },3000);
        }

        else if (document.location.host == "vimeo.com"){
            //vidSrc = "vimeo";
            $(".browse_videos_videos li").each(function(){
                if ($(this).find(".vibentoBtn").length) {
                    return 0;
                }
                filterThumb = 1;
                var videoId = $(this).find(".faux_player").attr("data-clip-id");
                var videoThumb = $(this).find(".faux_player").css("background-image");
                var videoTitle = $(this).find(".title a").text();
                var contentURL = "https://vimeo.com/" + videoId;
                var imageUrl = chrome.extension.getURL('../images/button.png');
                var vidSrc = "vimeo";
                var newContent = "<div class='buttonContainer'><div data-src='" + vidSrc + "' data-thumb='"+ videoThumb +"' data-id='" + videoId + "' data-title='" + videoTitle + "' data-link='" + contentURL + "' class='vibentoBtn'><img src='" + imageUrl + "'></div></div>";
                $(this).find(".data").prepend(newContent);
            });

            $(".clip_main .player.js-player").each(function(){
                if ($(this).find(".vibentoBtn").length) {
                    return 0;
                }
                var videoId = $(this).attr("id");
                var videoThumb = $(this).find(".video").attr("data-thumb");
                filterThumb = 0;
                var videoTitle = $(".clip_info-header").text();
                var contentURL = "https://vimeo.com/" + videoId;
                var imageUrl = chrome.extension.getURL('../images/button.png');
                var vidSrc = "vimeo";
                var newContent = "<div class='buttonContainer'><div data-src='" + vidSrc + "' data-thumb='"+ videoThumb +"' data-id='" + videoId + "' data-title='" + videoTitle + "' data-link='" + contentURL + "' class='vibentoBtn'><img src='" + imageUrl + "'></div></div>";
                $(this).prepend(newContent);
            });
            $(".iris_btn-browse, .contextclip-item").click(function(){
                setTimeout(function(){
                    location.reload();
                },3000);
            });
        }
    }

    var getSavedUser = function() {
        var savedUserDfd = $.Deferred();
        chrome.runtime.sendMessage({method: "getUser"}, function (response) {
            if (!response) {
                // User is previously not logged in...
                showLoginDialogue().done(function(){
                    getSavedUser().done(function(){
                        console.log("user logged in");
                        savedUserDfd.resolve();
                    });
                }).fail(function(){
                    savedUserDfd.reject();
                });
            }
            else { 
                savedUser = response;
                savedUserDfd.resolve();
            }
        });
        return savedUserDfd.promise();
    };

    var showLoginDialogue = function(){
        var isUserLoggedDfd = $.Deferred();
        var loginDialogue = "";
        var docHeight = $(document).height() + "px";
        loginDialogue += "<div class='vibentoOverlay vibentoLogin' style='height: " + docHeight + "'>";
        loginDialogue += "<div class='formContainer'>";
        loginDialogue += "<div class='form'>";
        loginDialogue += "<div class='vib-logo'><img src='" + chrome.extension.getURL('images/logo.png') + "'></div>";
        loginDialogue += "<div class='vib-form-heading cont'><h2>Login</h2></div>";
        loginDialogue += "<div class='vib-form-status cont'><p></p></div>";
        loginDialogue += "<div class='vib-username cont'><input id='username' placeholder='Enter Email Address' type='text' ></div>";
        loginDialogue += "<div class='vib-password cont'><input id='password' placeholder='Enter Password' type='password' ></div>";
        loginDialogue += "<div class='vib-form-buttons cont'><button style='float:left;' id='vib-cancel-login'>Cancel</button><button style='float:right;' id='vib-login-btn'>Submit</button></div>";
        loginDialogue += "<div class='vib-form-new-user cont'><p>New account? <a href='https://tickit.tv/login.php'>Click here</a></p></div>";

        loginDialogue += "</div></div></div>";
        $("body").append(loginDialogue);
        //Close Login
        $("body").on("click", ".vib-close-btn", function () {
            $(".vibentoOverlay").remove();
        });
        $("body").on("click", "#vib-cancel-login", function () {
            $(".vibentoOverlay").remove();
        });
        // Validate Login
        $("body").on("click", "#vib-login-btn", function () {
            //Retrieving values from Form

            showLoader();
            var username = $("#username").val();
            var password = $("#password").val();
            var reqURL = 'https://tickit.tv/playground/client.php';
            var reqType = 'POST';
            var reqData = 'post_data_string=';
            var request = '{"method":"login_user","body":[{"lu_uEmail":"' + username + '","lu_uPassword":"' + password + '" }]}';
            $.ajax({
                url: reqURL,
                type: reqType,
                data: (reqData + request),
                success: function (resp) {
                    resp = JSON.parse(resp);
                    if (resp) {
                        if (resp.result == 1) {
                            chrome.runtime.sendMessage({method: "setUser", message: resp.key}, function () {
                                $(".vibentoOverlay").hide(100);
                                hideLoader();
                                isUserLoggedDfd.resolve();
                            });
                        }
                        else {
                            hideLoader();
                            $(".vib-form-status p").text("Invalid Login Information. Please try again..");
                        }
                    }
                }
            });
        });
        return isUserLoggedDfd.promise();
    };

    var showFormDialogue = function(currentBtn, savedUserCategories) {
        var noCategory;
        if (savedUserCategories[0] == ""){
            noCategory = true;
        }
        var saveVideoFormDfd = $.Deferred();
        var docHeight = $(document).height() + "px";
        var facebookThumb = "";
        var formContent = "";

        formContent += "<div class='vibentoOverlay' style='height: " + docHeight + "'>";
        formContent += "<div class='formContainer'>";
        formContent += "<div class='form'>";
        formContent += "<div class='vib-logo'><img src='" + chrome.extension.getURL('images/logo.png') + "'></div><button id='closeOverlay' class='closex'></button>";
        formContent += "<div class='clearfix'></div>"
        formContent += "<div class='vib-form-status cont'><p></p></div>";
        formContent += "<div class='vib-left vib-part'>";
        formContent += "<div class='vib-form-heading cont'><h2>Save this video</h2></div>";
        formContent += "<div class='video-info cont'><div class='video-thumb'><img src=''></div><div class='video-title'><h1>" + currentBtn.getAttribute("data-title") + "</h1></div></div>";
        /*formContent += "<div class='vib-form-private cont'><label><input id='videoPrivate' type='checkbox'> Make Video Private </label></div>";*/
        formContent += '<ul class="toggle-controls"><li class="public active"><a href="#">Public</a></li><li class="private"><a href="#">Private</a></li></ul>';
        formContent += "</div>";
        formContent += "<div class='vib-right vib-part'>";
        formContent += "<div class='page-1'>";
        formContent += "<div class='vib-form-cat cont'><div>Choose Category</div><select class='custom'>";
        for (var i = 0; i < savedUserCategories.length; i++){
            formContent += "<option value='" + savedUserCategories[i][0] + "'>" + savedUserCategories[i][1] + "</option>";
        }
        formContent += "</select></div>";
        formContent += "<div class='vib-new-cat cont'><img src='" + chrome.extension.getURL('images/plus-icon.png') + "'>or create new</div>";
        formContent += "<div class='vib-form-tit cont'><div>Video Title</div><div><input id='videoTitle' type='text' value='" + currentBtn.getAttribute("data-title") + "'></div></div>";
        formContent += "<div class='vib-form-src cont'><div>Video Source</div><div><input id='videoSrc' type='text' value='" + currentBtn.getAttribute("data-src") + "'></div></div>";
        formContent += "<div class='vib-form-url cont'><div>Video URL</div><div><input id='videoURL' type='text' value='" + currentBtn.getAttribute("data-link") + "'></div></div>";
        formContent += "<div class='vib-form-buttons cont'><button id='addVideo'>Save</button></div>";
        /*<button id='closeOverlay'>Cancel</button>*/
        formContent += "</div>";
        formContent += "<div class='page-2'>";
        formContent += "<div class='vib-new-cat-add cont'><div>Category Name</div><div><input type='text' id='new-cat'> </div></div>";
        formContent += "<div class='vib-form-tit cont'><div>Video Title</div><div><input id='videoTitle2' type='text' value='" + currentBtn.getAttribute("data-title") + "'></div></div>";
        formContent += "<div class='vib-form-src cont'><div>Video Source</div><div><input id='videoSrc2' type='text' value='" + currentBtn.getAttribute("data-src") + "'></div></div>";
        formContent += "<div class='vib-form-goPro'><a href='https://tickit.tv/login.php'>go Pro?</a></div>";
        formContent += "<div class='vib-form-buttons cont'><button id='vib-go-back'>Cancel</button><button id='vib-add-cat'>Save</button></div>";
        formContent += "</div></div>";
        formContent += "<div class='clearfix'></div>";
        formContent += "</div></div>";


        $("body").append(formContent);
        if (noCategory == true){
            $(".page-1").hide();
            $(".page-2").show();
            //$("#vib-go-back").attr("id", "closeOverlay").text("Cancel");
        }
        //debugger
        if (currentBtn.getAttribute("data-src") == "facebook") {
            $.ajax({
                url: "https://graph.facebook.com/" + getVideoIdFb(currentBtn.getAttribute("data-link")),
                success: function (response) {
                    facebookThumb = response.picture;
                    $(".video-thumb img").attr("src", facebookThumb);
                }
            });
        }

        if (currentBtn.getAttribute("data-src") == "youtube") {
            /*if (document.location.href="www.facebook.com"){
             currentBtn.getAttribute("data-link") = currentBtn.getAttribute("data-link").split("?u=")
             }*/
            var filteredId = getVideoIdYt(currentBtn.getAttribute("data-link"));
            if (filteredId == "fail"){
                alert("fail");
                $(".vibentoOverlay").remove();
                return;
            }
            else {
                //alert("http://i1.ytimg.com/vi/" + filteredId + "/mqdefault.jpg");
                $(".vibentoOverlay .video-thumb img").attr("src", "http://i1.ytimg.com/vi/" + filteredId + "/mqdefault.jpg");
            }
        }

        if (currentBtn.getAttribute("data-src") == "vimeo"){
            var videoThumb = currentBtn.getAttribute("data-thumb");
            if (filterThumb == 1){
                videoThumb = videoThumb.split('"')[1].split('"')[0];
            }
            $(".video-thumb img").attr("src", videoThumb);
        }


        $("body").on("click", ".vibentoOverlay .toggle-controls li", function(){
            
            $(".vibentoOverlay .toggle-controls li").removeClass("active");
            $(this).addClass("active");
            if ($(this).hasClass("private")){
                vidPrivacy = "private";
            }
            else{
                vidPrivacy = "public";
            }
            
        });

        // when free user trying create a new category
        $("body").on("click", ".vibentoOverlay .vib-new-cat", function(){

            $("body .vibentoOverlay .page-1").slideUp(300);
            $("body .vibentoOverlay .page-2").slideDown(300);
                        
        });
        $("body").on("click", ".vibentoOverlay #vib-go-back", function(){
            $("body .vibentoOverlay .page-2").slideUp(300);
            $("body .vibentoOverlay .page-1").slideDown(300);
            $("#new-cat").val("");
        });
        $("body").on("click", ".vibentoOverlay #closeOverlay", function(){
            $(".vibentoOverlay").fadeOut(300).queue(function() {
                $(this).remove();
            });
        });

        $("body").on("click", ".vibentoOverlay #addVideo, .vibentoOverlay #vib-add-cat", function() {
            //e.stopImmediatePropagation();
            showLoader();
            //debugger
            var catId = $(".vib-form-cat select").val();
            var vidTitle = $("#videoTitle").val();
            vidTitle = vidTitle.replace(/\"/g, "");
            var vidURL = $("#videoURL").val();
            var vidId = "";
            var currentVidSrc = $("#videoSrc").val();
            //debugger
            if (currentVidSrc == "facebook"){
                if (vidURL.indexOf("?") > -1) {
                    vidURL = vidURL.split("?")[0];
                }
                var lastChar = vidURL.substr(vidURL.length - 1);
                if (lastChar != "/") {
                    vidURL = vidURL + "/";
                }
                vidId = getVideoIdFb(vidURL);
            }
            else if (currentVidSrc == "youtube") {
                vidURL = vidURL.split("&list=")[0];
                vidId = getVideoIdYt(vidURL);
            }
            else if (currentVidSrc == "vimeo"){
                if (vidURL.indexOf("?") > -1) {
                    vidURL = vidURL.split("?")[0];
                }
                var lastChar = vidURL.substr(vidURL.length - 1);
                if (lastChar != "/") {
                    vidURL = vidURL + "/";
                }
                vidId = getVideoIdVm(vidURL);
            }
            if ($(this).attr("id") == "vib-add-cat") { 

                if ($("#new-cat").val() == "") {
                    
                    $(".vib-form-status p").text("Please enter the category name..");
                    $(".vib-form-status p").fadeIn(300).delay(3000).fadeOut(300);
                    hideLoader();
                
                } else {

                    var reqURL = 'https://tickit.tv/playground/client.php';
                    var reqType = 'POST';
                    var reqData = 'post_data_string=';
                    var request = ' {"method":"add_category","body":[{"cat_Name":"test","API_KEY":"' + savedUser + '"}]}';
                    $.ajax({
                        url: reqURL,
                        type: reqType,
                        data: (reqData + request),
                        success: function (resp) {
                            resp = JSON.parse(resp);
                            if (resp) { 
                                if (resp.result == 1) {
                                    createNewCategory().done(function(){ 
                                        catId = newCatId;
                                        saveVideo(vidId, catId, vidTitle, vidURL, currentVidSrc, vidPrivacy).done(function(){
                                            $(".vibentoOverlay").delay(3000).fadeOut(300).queue(function() {
                                                $(this).remove();
                                                hideLoader(); 
                                            });
                                        });
                                    });
                                }
                                else
                                {   
                                    $(".vib-form-status p").text(resp.message);
                                    $(".vib-form-status p").fadeIn(300).delay(3000).fadeOut(300);
                                    hideLoader();
                                }
                                
                            }
                        }
                    }); 
                    
                }
               
            }
            else{
                if (vidPrivacy == "private") {
                    var reqURL = 'https://tickit.tv/playground/client.php';
                    var reqType = 'POST';
                    var reqData = 'post_data_string=';
                    var request = ' {"method":"add_video","body":[{"Cat_Id":"6111","web_link":"https://www.facebook.com/SaintOfficiall/videos/983267691731662/?video_source=pages_finch_trailer","title":"videotitle","subtitle":"videosubtitle","description":"videodescription","video_source":"youtube","video_fullpath":"https://www.youtube.com/watch?v=2odD6NLSnrM","video_id":"2odD6NLSnrM","status":"private","API_KEY":"' + savedUser + '"}]}';
                    $.ajax({
                        url: reqURL,
                        type: reqType,
                        data: (reqData + request),
                        success: function (resp) {
                            resp = JSON.parse(resp);
                            if (resp) { 
                                if (resp.result == 1) {
                                    saveVideo(vidId, catId, vidTitle, vidURL, currentVidSrc, vidPrivacy).done(function(){
                                        $(".vibentoOverlay").delay(3000).fadeOut(300).queue(function() {
                                            $(this).remove();
                                            hideLoader();
                                        });
                                    });
                                }
                                else
                                {   
                                    $(".vib-form-status p").text(resp.message);
                                    $(".vib-form-status p").fadeIn(300).delay(3000).fadeOut(300);
                                    hideLoader();
                                }
                                
                            }
                        }
                    }); 
                } else {
                    saveVideo(vidId, catId, vidTitle, vidURL, currentVidSrc, vidPrivacy).done(function(){
                        $(".vibentoOverlay").delay(3000).fadeOut(300).queue(function() {
                            $(this).remove();
                            hideLoader();
                        });
                    });
                }

            }

        });
        return saveVideoFormDfd.promise();
    }


    var getCategories = function(savedUser){
        var getCategoriesDfd = $.Deferred();
        var myCategoriesRequest = 'post_data_string={"method":"get_categories","body":[{"API_KEY":"' + savedUser + '"}]}';
        $.ajax({
            url: 'https://tickit.tv/playground/client.php',
            type: 'POST',
            data: myCategoriesRequest,
            success: function (resp) {
                var noCategory;
                if (resp && resp !== "null") {
                    resp = JSON.parse(resp);
                    var myCategories = [];
                    for (var key in resp.categories) {
                        if (resp.categories[key] !== null) {
                            myCategories.push([resp.categories[key].cid, resp.categories[key].name]);
                        }
                        else {
                            noCategory = true;
                        }
                    }
                    if (noCategory == true){
                        savedUserCategories = [""];
                        getCategoriesDfd.resolve();
                    }
                    else{
                        savedUserCategories = myCategories;
                        getCategoriesDfd.resolve();
                    }
                }
                else{
                    getCategoriesDfd.reject();
                }
            }
        });
        return getCategoriesDfd.promise();
    };

    var getVideoIdFb = function (url){
        var videoURL = url;
        if (videoURL.indexOf("?") > -1) {
            videoURL = videoURL.split("?")[0];
        }
        var lastChar = videoURL.substr(videoURL.length -1);
        if (lastChar != "/") {
            videoURL = videoURL + "/";
        }
        var videoId = videoURL.split("/")[(videoURL.split("/").length-2)];
        return videoId;
    }

    var getVideoIdYt = function(url){
        var videoURL = url;
        console.log(videoURL);
        if(videoURL.indexOf("?v=") != -1) {
            videoId = videoURL.split("?v=")[1];
            if (videoId.indexOf("&t=") != -1) {
                videoId = videoId.split("?t=")[0];
            }
            if (videoId.indexOf("&list=") != -1) {
                videoId = videoId.split("&list=")[0];
            }
            return videoId;
        }
        else{
            return "fail";
        }
    }

    var getVideoIdVm = function(url){
        var videoURL = url;
        videoId = videoURL.split(".com/")[1];
        if (videoId.indexOf("/") > -1) {
            videoId = videoId.split("/")[0];
        }
        return videoId;
    }

    var createNewCategory = function(){
        var createNewCategoryDfd = $.Deferred();
        getSavedUser().done(function(){
            var newCat = $("#new-cat").val();
            var duplicateCat = false;
            var myCategories = savedUserCategories;
            for (var i = 0; i < myCategories.length; i++){
                if (myCategories[i][1] == newCat){
                    duplicateCat = true;
                    break;
                }
            }
            if (duplicateCat == true) {
                $(".vib-form-status p").text("Category with the same name already exists..");
                $(".vib-form-status p").fadeIn(300).delay(3000).fadeOut(300);
            }
            else{
                if (newCat.trim() != "") {
                    var requestString = 'post_data_string={"method":"add_category","body":[{"cat_Name":"' + newCat + '","API_KEY":"' + savedUser + '"}]}';
                    $.ajax({
                        url: 'https://tickit.tv/playground/client.php',
                        type: 'POST',
                        data: requestString,
                        success: function (resp) {
                            if (resp) {
                                resp = JSON.parse(resp);
                                newCatId = resp.Cat_Id;
                                createNewCategoryDfd.resolve();
                            }
                            else{
                                createNewCategoryDfd.reject();
                            }
                        }
                    });
                }
                
            }
        });
        return createNewCategoryDfd.promise();
    }

    var saveVideo = function (vidId, vidCat, vidTitle, vidURL, currentVidSrc, vidPrivacy){
        var saveVideoDfd = $.Deferred();
        getSavedUser().done(function() {
            var requestString = ('post_data_string={"method":"add_video","body":[{"status":"' + vidPrivacy + '","Cat_Id":"' + vidCat + '","web_link":"' + vidURL + '","title":"' + vidTitle + '","subtitle":"","description":"' + vidTitle + '","video_source":"' + currentVidSrc + '","video_fullpath":"' + vidURL + '","video_id":"' + vidId + '","API_KEY":"' + savedUser + '"}]}');
            console.log(requestString);
            $.ajax({
                url: 'https://tickit.tv/playground/client.php',
                type: 'POST',
                data: requestString,
                success: function (resp) {
                    if (resp) {
                        resp = JSON.parse(resp);

                        $(".vib-form-status p").text("VIDEO SAVED");
                        $(".vib-form-status p").fadeIn(300).delay(3000).fadeOut(300);

                        saveVideoDfd.resolve();
                    }
                }
            });
        });
        return saveVideoDfd.promise();
    }

});


