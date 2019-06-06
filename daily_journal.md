===== Development Journal =====

*** 6.6.19 ***
Took a bit of a break from this project, but also made some updates without fully documenting here.

*** 1.21 ****
Current Roadmap:
  - Figure out problem with checkChanges(), look into if WordPress REST has a limit on # of calls
  - Add some kind of basic error checking/validation to "Add Law" form.
  - Use app to update 10 states => jot down ideas for further improvements/fixes
  - Nav Bar: Fix "Signed is as ______" when connected to WordPress, "Not Connected to WordPress" if not.

Future:
  - Set up Email Alerts page, integrate with MailChimp
    - Table data: [State Name] | [Last Updated] | [Last Email Alert Sent] | <<Send Email Alert Button>>
    - Also need to develop email template


*** 1.19.2019 ***
The Auto-Updater middleware consists of two functions: runUpdater(), which makes API
calls to OpenStates.org and gathers bill information, and checkChanges() which makes API
calls to StateDroneLaw.com via WordPress REST in order to check which bills are already on
the live site.

Currently, runUpdater() seems to work perfectly, but checkChanges() seems to be unreliable
when there are more than ~10 results to check. Results in many bills being labeled as
"existing" when they should not be. Seems to work fine when there are only a handful
of results to check... I think it's an issue somewhere on the WordPress end.

*** 1.17.2019 ***
Took a bit of a break from this project, was working on other project and also busy
with the holidays. Went through and re-factored the code for my auto-updater middleware.
Previously it was a clunky chain of nested axios calls, and then using an arbitrary setTimeout
to deal with async problems.

A week or so ago I went through a series of YouTube videos on Promises & async/await, feel like I have a better
(but still not perfect) understanding now. Auto-Updater code is a heck of a lot cleaner now via Promise.all(),
and we also avoid the quickfix-solution of needing to use setTimeout. Also added more extensive comments.

*** 12.05 ***
Current to-do's:
  - Add 'OSID' to WordPress ACF for custom post types
  - Make API call to WP to check if law exists for given OSID

  - Currently running into a problem that you can't 'filter' or search results within the WP REST API when looking
  at ACF fields. Various solutions online, consist of adding extra code to WordPress functions.php. Will look into
  more tomorrow.

*** 12.04 ***
    - Been focusing on other things lately, trying to get the ball rolling on this again.
    - Working on tying in the 'scraper' program, which was initially written as a standalone app.
    - Ideally, I can click the "Run Updater" button, it will run the scraper and compile a list of all laws via OpenState API
      - Then, it will check that list against the current list of laws on SDL.com, and highlight new or updated laws
      - Additionally, then auto-fill a draft 'new law' form, so it's easy for me to add to the live site.

*** 9.26 ***
  - Finally successful in making the WordPress custom fields [ACF] editable via the REST API. Was definitely more of a headache
      than I thought it would be.
  - For starters, Custom Post types and ACF fields aren't accessible via REST by default. Had to edit
      my custom CPT-plugin to add 'show_in_rest' and 'edit_in_rest' parameters. Then downloaded ACF-to-REST plugin
      that makes the ACF fields discoverable and editable via REST.
  - Still took a lot of finagling to get it to work, kept getting various combinations of 404 & 500 errors.
      Problem was that I had to change the method from 'POST' to 'PUT', and had to nest the data in a certain way.
      Even though the JSON response from the page shows ACF fields attached to an 'ACF' object, when trying to edit
      via a PUT request, they have to be nested in a 'fields:{}' object.
  - Also, the ACF fields have a different REST url, for some reason. Rather than /wp-json/wp/v2/laws/[#id] (which is
      the endpoint we use for editing post title & content), we have to use /wp-json/acf/v3/laws/[#id]. Because of this,
      right now my 'update' function is making two separate AJAX requests to WordPress. Doesn't seem ideal, but I'm not sure
      if there's a better solution given that we have to access two separate paths.

*** 9.21 ***
  - Working mostly on UI improvements
  - Pulled in all ACF fields
  - Next Steps:
    - Make all ACF fields editable. Need to change the functions in oauth.js a bit for this.
      Current code is just for post title. Think I can create an object {updatedInfo} and
      pass all fields to it as properties. Along those lines, how to I go about making all the
      fields editable when the user clicks 'edit'? I could just copy the current code for
      post title, and re-paste it for each separate field. But there's definitely a DRY-er method.
      It's definitely possible and I'll figure it out once I have more time.
    - Add capability to Delete/Unpublish/Move to Draft in WordPress

    - Issues with WordFence security plugin clashing with REST API/oauth
      1) WordFence plugin problems
      2) CGI enabled on Bluehost, edited .htaccess to allow authorzation headers in API methods
      3) Disabled JWT Auth plugin
      4) Still have to disable WordFence, blocking CORS >> had to whitelist local IP




- Issue with Updater: WordPress sometimes gives 500 error when checking updater bot repsponses with existing site data. Not an issue with WordFence plugin.