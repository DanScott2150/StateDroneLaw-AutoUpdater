# StateDroneLaw (semi)-Auto-updater bot
Node.js App developed to help automate the process of keeping StateDroneLaw.com up-to-date.

### Tech Used:
  - Node.js & Express
  - Third-party APIs:
    - OpenStates.org
    - WordPress REST API
  - OAuth & JSO to handle WordPress authentication
  - AJAX
  - Bootstrap CSS

### Setup
Configure OAuth:
  - via WordPress Admin Panel to set up & authorize access
  - via js/oauth.js to match configuration

Run via 'node app.js', open browser to localhost:3000

### Background:
A major hurdle for StateDroneLaw.com has been that the site needs to be updated regularly, but the process of updating it manually is labor-intensive and time consuming.

Originally, my process for updating the site consisted of:
  1) visit a single state's legislature website
  2) search the site for bills containing the keywords "drone" or "unmanned" (since drones are sometimes referred to as unmanned aerial vehicles)
  3) compare the list of resulting bills with the bills I currently have posted on StateDroneLaw.com
  4) go into WordPress and add/update individual bills as needed
  5) **repeat this process for each state**.

Clearly not a viable long-term solution.

This app, while still a work-in-progress, aims to automate as much of that process as possible.

### Current Functionality:
  - "Run Updater" functionality uses the OpenStates.org API to search all 50 state legislature for legislation containing keywords "drone" or "unmanned". Both keywords are necessary because drones are sometimes referred to as "unmanned aerial vehicles" or "unmanned aerial systems" in legislation. The data returned from the API call gives us an array of objects, each containing data for a given law.
  - The App then connects to StateDroneLaw.com via the WordPress REST API. The data returned from the OpenStates API call is cross-referenced with laws currently posted on StateDroneLaw.com to determine which laws already exist on the site, and which laws need to be added.
  - The results from the OpenStates API call are displayed to the user in table format. The laws do NOT currently exist on StateDroneLaw.com are sorted to the top of the table, labeled as "NEW", and include a link to "Add" the law to the website. All other laws are listed on the table, with a link to "edit" the information as it appears on the site.
  - Clicking "Add" on a law brings the user to a form, which the majority of the fields pre-filled based on the data returned from the OpenStates API. User still needs to manually add a summarized title & description.
  - Submitting this form will use the WordPress REST API to create a new WordPress post (custom post type), resulting in the new law being published to the live site.

### Known issues
  - App crashes sometimes when there are lots (over 10? Not sure the exact cutoff) of results returned from OpenStates. This happens when the app is trying to check StateDroneLaw.com to see which laws are new vs. existing. I think the WordPress API has a limit on how many times you can hit it in rapid succession. Because of this, right now the app is configured (/middleware/scraperbot.js) to only check one state at a time, and for some larger states you need to further configure it to run the "drone" and "unmanned" queries separately.

  - Since we're running two separate OpenStates queries (for keywords "drone" and "unmanned"), there's the potential for duplicate laws in the results, if a law happens to use both keywords.

  - Minor update: change styling around logged in/logged out text in header.

  - Some states return data from OpenStates that's formatted weirdly. Some have weird source URLs (or multiple source URLs), weirdly formatted timestamps, etc.

  - WordPress API throws an error for big datasets.

  - WordPress REST API currently accessed via AJAX. I did this because the tutorials I followed for the WordPress REST API did it this way. Is it possible/would it be better to access this via node instead?

  - Currently loading two different versions of jQuery, v3.3.1 in the footer.ejs partial and thus loads on every page, and then v2.1.3 in the laws/index.ejs page - I think I did this as a quick-fix for something, want to re-visit and eliminate if possible.

### Future ideas
  - More robust automation: Is there a way to set it up so it runs automatically once per day, and then sends me an email with the specific states/laws that need to be updated?

  - Batch updates: When the updater middleware returns a table of New Laws, is there a way to easily cycle through and add all of them? Right now you have to add each law individually, and re-run the updater to re-populate the table.

  - Deeper comparisons: Right now the app checks if a law returned from OpenStates.org is posted on StateDroneLaw.com, would like to add some kind of way to check an existing law to see if it needs to get updated. i.e. if a bill was previously 'pending' but then gets signed into law and becomes 'current'. Right now the app will only see that the law already exists and move on.

  - Archived Data: An early version of this app took the data returned from the OpenStates API and exported it into a .csv file. Might be worthwhile to re-implement this, so that archived data can be accessed? Not sure if this would be useful, but seems like it would be relatively easy to implement.

  - Email Alerts: A (currently inactive) feature of StateDroneLaw.com is that users can subscribe to updates for a certain state, and then receive an email alert whenever the laws are updated for that state. Subscriber list is currently managed via MailChimp, it would be nice to integrate their API into the app so that email alerts can be automated, i.e. the updater runs and updates the laws for Arizona, and then automatically sends out an email to Arizona subscribers.

  - Add some kind of 'loading' spinner. For example when adding a new law and clicking 'submit', not clear that it's actually doing anything until the new page loads.

  - Sidebar: Add direct link that opens actual WordPress Admin panel

  - OpenStates API data also includes information regarding the law's sponsor/co-sponsor or other legislators who are involved with it. Maybe incorporate this data into the site somehow? 