// Populates the "view laws" table
// Runs a series of AJAX requests to the WordPress API
// Pulls custom post type "laws"

jQuery( document ).ready(function($){

  const rawURL = 'https://statedronelaw.com';
  const restURL = rawURL + '/wp-json/wp/v2/';
  const jsonURL = restURL + 'laws/?_embed';   //'embed' parameter needed to include 'state' & 'status' custom taxonomies from WP

  function getLaws() {
    // $('.nav-loader').toggle();  //spinner graphic for loading

    // Sends AJAX request to WordPress API, returns 20 most recent laws
    $.ajax({
      dataType: 'json',
      url: jsonURL,
      data: {
        per_page: 20
      }
    })
    .done(function(object){
        createLawList(object);  // Take the response and parse it into a display table
    })
    .fail(function() {
        console.error('REST error. Nothing returned via AJAX.');
    })
    // .always(function() {
    //     $('.nav-loader').remove();  //remove spinner loading graphic
    // })
  }

  function createLawList(object) {
    //Takes the AJAX results and puts it into table-format

    $('.sdl-law-list').empty();

    let lawListItem;

    for(let i=0; i<object.length; i++) {
      lawListItem =
            '<tr>' +
              '<td>' +  //Law ID
                '<a href="/laws/' + object[i].id + '"data-id="' + object[i].id + '">' +
                  object[i].id +
                '</a>' +
              '</td>' +
              '<td>' +  //Law State
                object[i]._embedded['wp:term'][0][0].name +
              '</td>' +
              '<td>' +  //Law Status
                object[i]._embedded['wp:term'][1][0].name +
              '</td>' +
              '<td>' +  //Bill #
                object[i].acf.bill_number +
              '</td>' +
              '<td>' +  //Bill Title
                object[i].acf.bill_name +
              '</td>' +
              '<td>' +  //Keywords
                '(keywords)' +
              '</td>' +
              '<td>' +  //Last update
                object[i].acf.bill_year
              '</td>' +
            '</td></tr>';
        $('.sdl-law-list').append(lawListItem);
    }
    $('.skeleton').removeClass('skeleton');
    $('.ajax-loader').remove('.ajax-loader').remove();
  } //createLawList

  getLaws();

});