// Based on https://github.com/andreassolberg/jso/tree/version3
// Built out with help from Morten Rand-Hendrickson's WordPress REST API courses on Lynda.com

var ROOTURL = "https://statedronelaw.com";
const RESTROOT = ROOTURL + '/wp-json';

//Utilizes JSO library to manage authentication via OAuth2
//Documentation: https://oauth.no/jso/
var jso = new JSO({
	providerID: "controller",		//set manually in WordPress via OAuth2 plugin
	client_id: "9gC909jTfBlGPVqpXWQ3aS5jhw0BgghqxUzx3Tri",	//generated manually in WordPress via OAuth2 plugin
	redirect_uri: "http://localhost:3000",		//virtual DNS on localhost: http://sdl-controller.local
	authorization: ROOTURL + "/oauth/authorize"
});

jso.callback();
var token = localStorage.getItem('tokens-controller');

// Trigger OAuth 2 authentication sequence:
function oauthLogin() {
	jso.getToken();
}

// Log out and wipe all memory of the session:
function oauthLogout() {
	jso.wipeTokens();
}

// Monitor the login/logout button and trigger functions on click:
$('#login').click(function() {
    if ( $(this).hasClass("login") ) {
		$(this).text("Log out").removeClass("login").addClass("logout");
		// $("nav").removeClass("loggedIn").addClass("notLoggedIn");
        oauthLogin();
    } else {
        $(this).text("Log in").removeClass("logout").addClass("login");
        oauthLogout();
    }
});

(function() {
	// Update status bar in header to show if user is currently signed into WordPress or not
	// Kinda buggy need to revisit & iron out
	const now = new Date().getTime()/1000;
	const tokenJSON = JSON.parse(token);
	const tokenExpire = tokenJSON[0].expires;
	const tokenDate = new Date(tokenExpire).getTime();
	console.log(tokenDate);
	console.log(now);
	if ( tokenDate >= now ) {
		$('#wp_connect_status').text('Signed into WordPress').addClass('loggedin');
		$('#login').text("Log out").removeClass("login").addClass("logout");
	} else {
		$('#wp_connect_status').text('NOT CONNECTED TO WORDPRESS');
		$('#login').text("Log in").removeClass("logout").addClass("login");
	}
})();
