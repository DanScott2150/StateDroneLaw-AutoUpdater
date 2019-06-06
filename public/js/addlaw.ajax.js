// Script for adding a new law to StateDroneLaw.com
// Uses AJAX to send data from the "Add Law" form to the WordPress API
// WordPress Authentication handled via JSO library

/* Right now we need to make two AJAX requests to WordPress
	First, for the WordPress native fields (title, content, metadata)
	Second, for the ACF custom fields (law info, url reference, etc)
	This is because the two sets of fields have different API endpoints, for some reason
	There's probably a more streamlined way to do this, but for now we're sending two different calls
*/

//Is ajax the best way to do this? Or should it be via a node 'create' route in app.js?
	// Need to look into authentication? Right now it's handled via JSO/OAuth, would have to change to node?
	// -- http://wp-api.org/node-wpapi/authentication/

function createLaw(newLawData) {
	
	// Need to convert user input for 'state' and 'status' to their corresponding WordPress ID's
	// For now at least, can't figure out how to pass state & status taxonomy data to WordPress
	// 	 via ajax JSON, unless it's as the ID #.
	var stateID = stateLookup(newLawData.state);
	var statusID = statusLookup(newLawData.lawStatus);

	// Can't submit if no state is selected
	// Should build out better error handling
	if(!stateID){
		console.log("Not a valid state");
		return;
	} else {

	//Using JSO library to handle OAuth validation with WordPress, make AJAX call to WP API
		JSO.enablejQuery($);
		jso.ajax({
			url: RESTROOT + '/wp/v2/laws/', //RESTROOT defined in oauth.js
			method: 'POST',
			data: {
				'title': newLawData.state + ' - ' + newLawData.number.replace(/\s+/g, ''),
				'content' : newLawData.lawCustomContent,
				'state' : [stateID],
				'lawStatus' : [statusID],
				'status' : 'publish'
			}
		})
		.done(function(object) {
			//Need to make a second AJAX request, since ACF fields have a different API endpoint in WordPress
			jso.ajax({
				url: RESTROOT + '/acf/v3/laws/' + object.id,
				method: 'POST',
				data: {
					"fields" : {
						"osid" : newLawData.OSID,
						"bill_number" : newLawData.number,
						"bill_name" : newLawData.summaryTitle,
						"bill_year" : newLawData.session,
						"ref_title" : newLawData.source,
						"ref_link" : newLawData.url
					}
				}
			})
			.done(function(response){
				window.location.href = "/laws/"; // + response.id;
				// console.log("AJAX complete");
			})
			.fail(function(response){
				console.log("ACF AJAX request failed")
				console.log(response);
			})
		})

		.fail(function() {
			console.error("REST error. Nothing returned for AJAX.");
		})

		.always(function() {

		})
	}
}

// Convert Law data into JSON before sending it to WordPress
function generateJSON() {
	console.log("generateJSON");
	let newLawData = {
		// "status": "private",
		"summaryTitle": $('input[name=newlaw_summaryTitle]').val(),
		"lawCustomContent": $('textarea[name=new_lawCustomContent]').val(),
		"OSID": $('input[name=newlaw_OSID]').val(),
		"number" :  $('input[name=newlaw_number]').val(),
		"lawName" : $('input[name=new_lawName]').val(),
		"session" : $('input[name=newlaw_session]').val(),
		"source" : $('input[name=newlaw_sourceName]').val(),
		"url" : $('input[name=newlaw_url]').val(),
		"state" : $('input[name=newlaw_state]').val(),
		"lawStatus" : $('input[name=lawStatus]:checked').val(),
		"urlSlug" : $('input[name=newlaw_slug]').val()
	};

	createLaw(newLawData);
}

// To assign a law to a State, need to pass the state's ID number into WordPress
// These ID's are from the custom taxonomy in the StateDroneLaw WP theme
function stateLookup(currentState){
	const STATES = {
		AK : 71, AL : 70, AR : 73, AZ : 72, CA : 65,
		CO : 74, CT : 75, DC : 00, DE : 76, FL : 77, 
		GA : 78, HI : 79, IA : 83, ID : 80, IL : 81,
		IN : 82, KS : 84, KY : 85, LA : 86, MA : 89,
		MD : 88, ME : 87, MI : 90, MN : 61, MO : 92,
		MS : 91, MT : 93, NC : 100, ND : 101, NE : 94,
		NH : 96, NJ : 97, NM : 98, NV : 95, NY : 99,
		OH : 102, OK : 103, OR : 104, PA : 105, RI : 106,
		SC : 107, SD : 108, TN : 109, TX : 66, UT : 110,
		VA : 112, VT : 111, WA : 113, WI : 115, WV : 114,
		WY : 116
	}

	return STATES[currentState];
}

// To assign a status to a law, need to pass the status's ID number into WordPress
// These ID's are from the custom taxonomy in the StateDroneLaw WP theme
function statusLookup(currentStatus){
	const STATUSES = {
		currentLaw : 62, pendingLaw: 63, otherLaw : 68
	}

	return STATUSES[currentStatus];
}

// User clicks "Submit", triggers generateJSON() which then triggers createLaw()
$('.create').click(function(){
	console.log("click");
	generateJSON();
});

// Placeholder for "generate live preview" function
// $('.preview').click(function(){
// 	console.log("preview clicked");
// 	$('#preview-title').html($('input[name=new_lawNum]').val());
// });