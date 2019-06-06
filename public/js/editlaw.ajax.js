//For editing LAW data

//Used in single law show.ejs view
//Used in conjunction with lib/jso.js and oauth.js, which are called in separately via footer.ejs partial

//Populate data for active law
const $LAW = {
	title: $('.law-title'),
	content: $('.law-content'),
	law_number: $('.law-number'),
	law_name: $('.law-name'),
	law_year: $('.law-year'),
	law_ref_title: $('.law-ref-title'),
	law_ref_link: $('.law-ref-link')
};


//Edit/update info via PUT request using WordPress REST API & ajax
//Currently we need to run two separate AJAX requests. First one updates
//the title & content (WordPress native fields), and then we need to run a
//separate AJAX request to update the ACF custom field data. There's probably
//a more streamlined way to do this, will re-visit later
function updateLaw(lawID,updatedInfo) {
	// console.log("running updateLaw()");

	JSO.enablejQuery($);
  //Run first ajax request for WordPress native fields
	jso.ajax({
		url: RESTROOT + '/wp/v2/laws/' + lawID, //RESTROOT defined in oauth.js
		method: 'PUT',
		data:{
			'title' : updatedInfo.newTitle,
			'content' : updatedInfo.newContent,
		}
	})
	.done(function(response) {
  //Run second ajax request for ACF fields
		jso.ajax({
			url: RESTROOT + '/acf/v3/laws/' + lawID,
			method: 'PUT',
			data: {
				"fields" : {
					"bill_number" : updatedInfo.newNumber,
					"bill_name" : updatedInfo.newName,
					"bill_year" : updatedInfo.newYear,
					"ref_title" : updatedInfo.newRefTitle,
					"ref_link" : updatedInfo.newRefLink
				}
			}

		})
		.done(function(response){
      //Toggle input fields back to static text, updated to new values
			$('#title-input').toggle();
			$('#content-input').toggle();
			$('#law_number-input').toggle();
			$('#law_name-input').toggle();
			$('#law_year-input').toggle();
			$('#law_ref_title-input').toggle();
			$('#law_ref_link-input').toggle();
			$LAW.title.text(updatedInfo.newTitle);
			$LAW.content.text(updatedInfo.newContent);
			$LAW.law_number.text(updatedInfo.newNumber);
			$LAW.law_name.text(updatedInfo.newName);
			$LAW.law_year.text(updatedInfo.newYear);
			$LAW.law_ref_title.text(updatedInfo.newRefTitle);
			$LAW.law_ref_link.text(updatedInfo.newRefLink);
			$LAW.title.toggle();
			$LAW.content.toggle();
			$LAW.law_number.toggle();
			$LAW.law_name.toggle();
			$LAW.law_year.toggle();
			$LAW.law_ref_title.toggle();
			$LAW.law_ref_link.toggle();

      //Change 'save' button back to 'edit' button
			$('.edit-title.edit-button').toggle();
			$('.edit-title.save').toggle();
		})
	}) //end of second AJAX request

	.fail(function(response) {
		// console.error(response);
		$('#title-input').toggle();
		$LAW.title.toggle();
		$('.edit-title.save').toggle();
		$LAW.title.after('<aside class="error" style="background-color: #8b0000; color: white;">Something went wrong.</aside>');
	});
} //updateLaw()

// Enable editing when user clicks the 'edit' button:
$('.edit-title.edit-button').click(function(){
// console.log("Edit clicked");

//Save initial values for law info
  let $originalLaw = {
    title: $LAW.title.text(),
    content: $LAW.content.text(),
    law_number: $LAW.law_number.text(),
    law_name: $LAW.law_name.text(),
    law_year: $LAW.law_year.text(),
    law_ref_title: $LAW.law_ref_title.text(),
    law_ref_link: $LAW.law_ref_link.text()
  }

  //Change each property in $LAW from text to an input box, pre-filled with current data
  for(var key in $LAW){
    if($LAW.hasOwnProperty(key)){
      $LAW[key].toggle();
      $LAW[key].after(`<input id="${key}-input" type="text">`);
      document.querySelector(`#${key}-input`).value = $originalLaw[key];
    }
  }

  //Change 'edit' button to 'save' button
  $(this).toggle();
  $('.edit-title.save').toggle();

}); //edit button click function

//When user clicks 'save' button:
$('.save').click(function(){
  // console.log("Save clicked");

  //get the WordPress ID of the law, used to pass the AJAX call
  let lawID = document.querySelector('.currentLaw').getAttribute('data-id');

  //Capture updated info from input fields, store in an object that gets passed to the AJAX function
  let updatedInfo = {
    newTitle: document.querySelector('#title-input').value,
    newContent: document.querySelector('#content-input').value,
    newNumber: document.querySelector('#law_number-input').value,
    newName: document.querySelector('#law_name-input').value,
    newYear: document.querySelector('#law_year-input').value,
    newRefTitle: document.querySelector('#law_ref_title-input').value,
    newRefLink: document.querySelector('#law_ref_link-input').value
  };

  //Pass updated info into updateLaw() function
  updateLaw(lawID,updatedInfo);
});
