// Force include jquery:
// (http://stackoverflow.com/questions/7474354/include-jquery-in-the-javascript-console)

//var jq = document.createElement('script');
//jq.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js";
//document.getElementsByTagName('head')[0].appendChild(jq);
//jQuery.noConflict();

// Grab info about the current package from the page
var contentsLink = $("#page-menu > li > a:contains('Contents')");
var contentsPath = contentsLink.attr('href');

// Extract & Remove version numbers
var noVersionPath = contentsPath.replace(/-(\d+\.)+\d+$/, "")
var currentVersion = contentsPath.match(/(\d+\.)+\d+$/)[0]; // TODO: tidyup
var latestPackageUrl = 'http://' + window.location.host + noVersionPath;

// Parse an entire page to find the array of Versions
getVersionsFromPage = function(elem) {
  // Find the element
  var tr = elem.find('table > tbody > tr > th:contains("Versions")').next();
  // Return all links to versions as an array of version numbers
  return $.map(tr.children(), function(e) { return $(e).text(); });
}

// Shortcut to add a nav link
addNav = function(elem) {
  $('#page-menu').prepend(elem);
}

// Render a "latest" link next to the "contents" link.
renderLatestContents = function(currentVersion, versions) {
  var latestVersion = versions[versions.length - 1];

  if(currentVersion < latestVersion) {         
    // Find contents link and add a link to latest
    var contents = $('#package-header > ul > li > a:contains("Contents")');
    contents.css({ paddingRight: '0.25em' });

    // Build the link element
    var link = $('<a>', {
      text: '(Latest)',
      title: 'Latest package',
      href: latestPackageUrl,
      class: ''
    }).css({
      color: 'orange',
      paddingLeft: '0.25em'
    });

    contents.after(link);
  }
}

// Render a button to go to a newer version of the package if available
// TODO: Find out of link is gone in newer version & notify obsolete!
renderNewerPageButton = function(currentVersion, versions) {
  var latestVersion = versions[versions.length - 1];
  var latestPageUrl = window.location.href.replace(/\/(\d+\.)+\d+\//, "/" + latestVersion + "/");

  // If old version, add a button to get to the newer version
  if(currentVersion < latestVersion) {
    addNav($('<li id="version-li"><a class="oldVersion" href="' + latestPageUrl
             + '">Newer - ' + latestVersion + '</a></li>'));
  } else {
    addNav($('<li id="version-li"><span class="latest">Latest</span></li>'));
  }

  // Ajax to check if link is broken.
  checkObsolete(latestPageUrl);
}

checkObsolete = function(url) {
  $.ajax(url).fail(function(jqXHR, textStatus) {
    // If we got a 404, mark this page as obsolete.
    // TODO: find most recent version with this page?
    if(jqXHR.status == 404) {
      $('#version-li').html('<span class="obsolete">Obsolete</span>');
    }
  });
}

// Add list of versions to the page header
renderVersions = function(versions) {
  var header = $('<div id="package-versions" class="header">TEST TEST TEST TEST TEST</div>');
  $('#package-header').after(header);
  console.log('here');
}

// Callback for when page is retrieved
onGetContents = function(jqXHR, textStatus, jqXHR) {
  var page = $(jqXHR.responseText); // Convert to JQuery object
  var versions = getVersionsFromPage(page); // Get array of versions as JQ array

  // Render 'latest' buttons after contents.
  renderLatestContents(currentVersion, versions);

  // Render 'newer' button if newer packages available, or "latest" otherwise
  renderNewerPageButton(currentVersion, versions);

  // Render all versions
  //renderVersions(versions);
};

// Get list of package versions & add button when complete
$.ajax(latestPackageUrl, { success: onGetContents });
