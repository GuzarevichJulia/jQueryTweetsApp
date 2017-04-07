var tweetsLoader = (function () {
    'use strict';

    var newTweetsArray = [];
    var newTweetsId = [];
    var readTweetsKey = "readTweets";
    var readTweetsIdKey = "readTweetsId";
    var storage = localStorage;
    var readTweetsInStorage = [];
    var readTweetsIdInStorage = [];
    var readCounterElement = $("#readCounter");
    var tweetsContainer = $(".tweets-list");
    var readTweetsId = getDataFromStorage(readTweetsIdKey);
    if (readTweetsId != null) {
        readTweetsIdInStorage = readTweetsId;
    }
    var readTweets = getDataFromStorage(readTweetsKey);
    if (readTweets != null) {
        readTweetsInStorage = readTweets;
    }
    var isDisplayed = false;

    var cb = new Codebird;
    cb.setConsumerKey("QZIkKMeTgJpuZLSsimOexemM8", "3SUFIytalLPqkwu9yDlmq39eWaVOWC4lNFeguzL4ShUu6WtleB");
    cb.setToken("847033435046731778-WOazCo1yxIF7jHbanPgWdEEbSc6y00y", "LBOIsKmTMDdbEbFAPOB65Gpyh5vedeCbpNoMtEv4VTBku");

    var readButtonClickHandler = function(readButtonElement) {
        increaseReadCounter();
        putInClientStorage(readButtonElement);
        deleteReadTweet(readButtonElement);
    }

    return {
        getReadTweetsCount: function () {
            var length = readTweetsInStorage.length > 0 ? readTweetsInStorage.length : 0;
            readCounterElement.text(length);
        },

        getNewTweets: function () {
            cb.__call(
                "search_tweets",
                "q=GurevichJuli",
                function (response) {
                    var statuses = response.statuses;
                    for (var i = 0; i < statuses.length; i++) {
                        var status = statuses[i];
                        if (isNewTweet(String(status.id))) {
                            newTweetsArray.push(status.text);
                            newTweetsId.push(String(status.id));
                            isDisplayed = false;
                        }
                    }
                    displayNewTweets(newTweetsArray, newTweetsId);
                }, true);
        },

        getReadTweets: function () {
            useTemplate(readTweetsIdInStorage, readTweetsInStorage);
        }
    };

    function getDataFromStorage(key) {
        if (storage.getItem(key) != null) {
            return JSON.parse(storage[key]);
        }
        return null;
    }

    function increaseReadCounter() {
        $("#readCounter").text(parseInt($("#readCounter").text())+1);
    }

    function deleteReadTweet(button) {
        button.closest(".tweet").remove();
    }

    function putInClientStorage(button) {
        var readTweetText = button.parent().prev().children()[0].textContent;
        readTweetsInStorage.push(readTweetText);
        readTweetsIdInStorage.push(String(button.attr("name")));
        newTweetsArray.splice(newTweetsArray.indexOf(readTweetText), 1);
        newTweetsId.splice(newTweetsId.indexOf(String(button.attr("name"))), 1);
        storage.setItem(readTweetsKey, JSON.stringify(readTweetsInStorage));
        storage.setItem(readTweetsIdKey, JSON.stringify(readTweetsIdInStorage));
    }

    function useTemplate(idArray, contentArray) {
        var tweetsData = [];
        for (var i = 0; i < contentArray.length; i++) {
            var tweetObject = {
                id: idArray[i],
                content: contentArray[i]
            };
            tweetsData.push(tweetObject);
        }
        ;

        $(function () {
            $('#tweetTemplate').tmpl(tweetsData).appendTo('.tweets-list');
        });
    }

    function displayNewTweets(newTweetsArray, newTweetsId) {
        if (!isDisplayed) {
            useTemplate(newTweetsId, newTweetsArray);
            $(".read-button").bind("click", function() {
                readButtonClickHandler($(this));
            });
        }
    }

    function isNewTweet(id) {
        if (newTweetsId.length > 0) {
            if (readTweetsIdInStorage.length > 0) {
                if ((readTweetsIdInStorage.indexOf(id) == -1) && (newTweetsId.indexOf(id) == -1)) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                if (newTweetsId.indexOf(id) == -1) {
                    return true;
                }
            }
        }
        else {
            if (readTweetsIdInStorage.length > 0) {
                if (readTweetsIdInStorage.indexOf(id) == -1) {
                    return true;
                }
                return false;
            }
            return true;
        }
    }

})();


