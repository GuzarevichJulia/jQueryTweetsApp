tweetsLoader.getReadTweetsCount();
setInterval(tweetsLoader.getNewTweets(), 6000);
$("[name=tweetsListButton]").bind('click',function () {
    location.href = 'TweetsList.html';
});