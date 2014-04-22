/* Facebook pages are used by businesses, organisations and brands to share their stories and connect with users.
 * Here I have tried to create an HTML page that facilitates searching for these "pages",
 * using only JavaScript, HTML and CSS.
 * Documentation for Facebook's public API for searching pages,can be found at :
 * https://developers.facebook.com/docs/reference/api/

 * More about this app :
   1. No External Library used , how ever some CSS have been inspired by bootstrap and other open source projects.
   2. For each search result, user can find out more about the page, by clicking on the name in the table.
   3. The search results are displayed in descending order , I have used my own own custom sort to display the results.
   4. I have tried to use as less as CSS3 possible to make it compitable with older browser.
   5. User is able to Favourite and unfavorite pages for easy access.
   6. Project Cotains no iframe.
 * author : Sanyam Agrawal
 * Date : 21/04/2014
 */

/*Following Reveling Modular Pattern(IIFE) in this code base so that the global namespace is not populated
 * app contains 3 methods which are exposed to the public , rest all the functions and variables are private
 */
var app = (function(windowScope) {

    var favouriteList = [],
        accessToken = "112236402217273|W2sfTkrLWBDkQlFrm17BRH-hNUM";

    /*
     * Handling Key Press on Search Field. We want to start the search as soon as the user press Enter
     * Search Can also be triggered by Clikcing on the search button
     * @type function
     *
     * @public
     */
    function handleKeyPress(event) {
        if (event.keyCode === 13) {
            showResults();
        }
        //return false;
    }

    /* Kicks of the Search for the mentioned Page in the serch Box .
     * @type function
     * @public
     */
    function showResults() {
        var searchTextBox = document.getElementById("fbSearchTextBox"),
            searchString = searchTextBox.value;

        if (searchString) {
            searchTextBox.classList.remove("error");
            getSearchResults(searchString, "pagesCall");
        } else {
            searchTextBox.classList.add("error");
        }
    }

    /* Calls Facebook Graph Search API For Pages based on the search string
        @param : searchString: the string that is used to call the FB API
                 type : type of call
                        1.pagesCall: for pageLevel call,
                        2.undefined : for pageDetail Call
        @private
    */
    function getSearchResults(searchString, type) {
        var url = generateURL(searchString, type),
            node = document.getElementById("searchListBox");

        windowScope.FB.api(url, function(response) {

            if (response && !response.error) {
                /* handle the result */
                showSearchResult(response.data, node);
            }
        }.bind(this));
    }

    /* Returns the URL that needs to be fired for the FB API*/
    function generateURL(param, type) {
        if (type === "pagesCall") {
            return "search?type=page&access_token=" + accessToken + "&q=" + param;
        } else {
            return param;
        }
    }
    /* Function to populate the search result in the View.
        populates both the Search Result and the Favourite List.
    */
    function showSearchResult(data, node) {
        var count = 0,
            page,
            tr,
            td,
            anode,
            buttonnode;

        if (!data.isEmpty()) {

            performeNodeCleanup(node);
            hideErrorDiv();
            data = CustomSort.sort(data);

            for (count; count < data.length; count++) {
                page = data[count];
                tr = document.createElement("tr");
                tr.setAttribute("class", "row");
                tr.style.height = 40 + "px";
                anode = document.createElement("a");
                anode.setAttribute("id", page.id);
                anode.setAttribute("href", "javascript:void(0)");
                anode.innerHTML = page.name;
                anode.addEventListener("click", getPageDetail);

                td = document.createElement("td");
                td.classList.add("pageName");
                td.appendChild(anode);
                tr.appendChild(td);

                td = document.createElement("td");
                td.classList.add("pageCatagory");
                td.innerHTML = page.category;
                tr.appendChild(td);

                if (node.id !== "favouriteListBox") {
                    buttonnode = document.createElement("input");
                    buttonnode.setAttribute("type", "button");
                    buttonnode.setAttribute("name", "Favourite This");

                    setFabButton(buttonnode, isPageFavourite(page));

                    buttonnode.setAttribute("id", page.id);
                    buttonnode.data = page;
                    buttonnode.addEventListener("click", favouriteThisPage);

                    td = document.createElement("td");
                    td.classList.add("favouriteButton");
                    td.appendChild(buttonnode);
                    tr.appendChild(td);
                }

                node.appendChild(tr);
            }
        } else {
            node.innerHTML = "<tr><td colspan='3' class=\"noData centerAligned\">Search resulted in no data</td></tr>";
        }

    }

    /* Responsible for node clean up.
        Currently Cleans up the innerHTML of the node. Removes all the content from the table.
    */
    function performeNodeCleanup(node) {
        /*TODO : Remove Add Event Listerners and perform other cleanup as well .
            Currently only clearning the innerHTML of the div.
        */
        node.innerHTML = "";
    }

    /*API to allow user to favourite a page*/
    function favouriteThisPage(event) {
        var data = event.target.data,
            state = isPageFavourite(data);

        if (state) {
            favouriteList.pop(data);
        } else {
            favouriteList.push(data);
        }

        hideErrorDiv();
        setFabButton(event.target, !state);
        showFavouriteList();
    }

    /* Checks if the page being favourited has already been favourite before.*/
    function isPageFavourite(data) {
        // Ineffectient . Need To Refactor and make Array an map
        var count = 0;
        if (favouriteList.isEmpty()) {
            return false;
        }
        for (count; count < favouriteList.length; count++) {
            if (favouriteList[count].id === data.id) {
                return true;
            }
        }
        return false;
    }

    /* Sets the Button text to the appropriate text based on the state of the page being favourited*/
    function setFabButton(node, state) {
        if (state) {
            node.value = "Unfavourite Page";
        } else {
            node.value = "Favourite Page";
        }
    }

    /* Button Call back to show the list of favourite pages.
       Currently Not required as it gets populated everytime a user favourites a page.

    */
    function showFavouriteList() {
        var favouriteNode = document.getElementById("favouriteListBox");

        if (!favouriteList.isEmpty()) {
            hideErrorDiv();
            showSearchResult(favouriteList, favouriteNode);
        } else {
            favouriteNode.innerHTML = "<tr><td colspan='2' class=\"noData centerAligned\">You havent Favorited Any Facebook Page</td></tr>";
        }
    }

    /* Shows Error Div*/
    function showErrorDiv(message) {
        var errorNode = document.getElementById("errorDiv");
        errorNode.innerHTML = message;
        errorNode.classList.remove("hide");
        errorNode.classList.add("show");
    }

    /* Hide Error Div*/
    function hideErrorDiv() {
        var errorNode = document.getElementById("errorDiv");
        errorNode.classList.remove("show");
        errorNode.classList.add("hide");
    }


    /* API To get Page Details of a Specific page based on which page has been clicked*/
    function getPageDetail(event) {
        var pageElement = event.target,
            pageId = pageElement.id,
            detailsShown;

        detailsShown = pageElement.getAttribute("data-details-shown");
        if (detailsShown) {
            return false;
        } else {
            pageElement.setAttribute("data-details-shown", true);
            getDetailResult(event, pageId);
        }
    }

    /* Facebook API call to get the details of a specific page*/
    function getDetailResult(event, pageId) {
        var url = generateURL(pageId);

        windowScope.FB.api(url, function(event, response) {
            if (response && !response.error) {
                /* handle the result */

                displayDetailResult(event, response);
            }
        }.bind(this, event));
    }

    /* Populates the details of a specific page in the UI.*/
    function displayDetailResult(event, data) {
        var list = event.target.parentElement,
            count,
            outerdiv = document.createElement("div"),
            keys = Object.getOwnPropertyNames(data),
            KeysToShowInUI = ["name", "about", "catagory", "likes", "link", , "talking_about_count"];

        outerdiv.classList.add("detailsDiv");

        for (count = 0; count < keys.length; count++) {

            // I dont want the below key to be in the scpe of the parent function. Hencing making it IIFE
            (function() {

                var currentKey = keys[count],
                    div,
                    label,
                    p;

                if (KeysToShowInUI.indexOf(currentKey) > -1) {
                    div = document.createElement("div");
                    div.classList.add("pageLevelDetail");

                    label = document.createElement("label");
                    label.innerHTML = currentKey;
                    label.classList.add("mylabel");
                    div.appendChild(label);
                    if (currentKey === "link") {
                        p = document.createElement("a");
                        p.setAttribute("href", data[currentKey]);
                        p.setAttribute("target", "_blank");
                    } else {
                        p = document.createElement("p");
                    }
                    p.innerHTML = data[currentKey];
                    div.appendChild(p);
                    outerdiv.appendChild(div);
                }
            }());

        }
        list.appendChild(outerdiv);
        outerdiv.classList.remove("hide");
    }

    /* Externtion of Javasript array to see if an array is empty or not*/
    Array.prototype.isEmpty = function() {
        if (this.length <= 0) {
            return true;
        } else {
            return false;
        }
    };

    /* Reveling Modular Pattern. Only Expose a certain set of API to the user*/
    return {
        showResults: showResults,
        showFavouriteList: showFavouriteList,
        handleKeyPress: handleKeyPress
    };
})(this);

window.addEventListener('DOMContentLoaded', load2, false);


function load2() {
    debugger;
}