// Force include jquery:
// (http://stackoverflow.com/questions/7474354/include-jquery-in-the-javascript-console)
// Parse an entire page to find the array of Versions
getVersionsFromPage = function(elem) {
  // Find the element
  var tr = elem.find('table > tbody > tr > th:contains("Version")').next();
  // Return all links to versions as an array of version numbers
  return $.map(tr.children(), function(e) { return $(e).text(); });
}

// Shortcut to add a nav link
addNav = function(elem) {
  if(!oldHackage) {
    $('#page-menu').prepend(elem);
  } else {
    //console.log('adding nav (oldschool)');
    $('td.topbar > table.vanilla > tbody > tr > td.topbut').first().before(elem);
  }
}

// Render a "latest" link next to the "contents" link.
renderLatestContents = function(currentVersion, versions) {
  //console.log('versions: ', versions);
  var latestVersion = versions[versions.length - 1];
  //console.log('latest version: ', latestVersion);

  if(currentVersion != latestVersion) {         
    // Find contents link and add a link to latest
    var contents = null;
    if(!oldHackage) {
      contents = $('#package-header > ul > li > a:contains("Contents")');
    } else {
      contents = $('td.topbar > table.vanilla > tbody > tr > td:nth-child(4) > a');
    }
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
renderNewerPageButton = function(currentVersion, versions) {
  var latestVersion = versions[versions.length - 1];
  var pageUrlVersionRegex = new RegExp(packageName + "-" + currentVersion);
  var latestPageUrl = window.location.href.replace(pageUrlVersionRegex, packageName + "-" + latestVersion);

  // TODO: this is a bit gross...
  var tag = oldHackage ? 'td' : 'li';

  // If old version, add a button to get to the newer version
  if(currentVersion != latestVersion) {
    addNav($('<' + tag + ' id="version-li"><a class="oldVersion" href="' + latestPageUrl
             + '">Newer - ' + latestVersion + '</a></' + tag + '>'));
  } else {
    addNav($('<'+ tag + ' id="version-li"><span class="latest">Latest</span></' + tag + '>'));
  }

  // Ajax to check if link is broken in next version
  checkObsolete(latestPageUrl);
}

checkObsolete = function(url) {
  $.ajax(url).fail(function(jqXHR, textStatus) {
    // If we got a 404, mark this page as obsolete.
    // TODO: find most recent version with this page?
    if(jqXHR.status == 404) {
      $('#version-li').html('<span class="obsolete">Missing</span>');
    }
  });
}

// Add list of versions to the page header
renderVersions = function(versions) {
  var header = $('<div id="package-versions" class="header">TODO</div>');
  $('#package-header').after(header);
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

// Grab info about the current package from the page
var contentsLink = $("#page-menu > li > a:contains('Contents')");
var oldHackage = false;

// Make it work with old hackage
if(!contentsLink.length) { 
  oldHackage = true;
  contentsLink = $('td.topbar > table.vanilla > tbody > tr > td:nth-child(4) > a');
}

var contentsPath = contentsLink.attr('href');

// if we're on the package front page, don't do anything.
if(contentsPath) {
  // Extract & Remove version numbers and package name
  var noVersionPath = contentsPath.replace(/-(\d+\.)+\d+$/, "")

  var packageName = noVersionPath.split('/').reverse()[0]
  var currentVersion = contentsPath.match(/(\d+\.)+\d+$/)[0]; // TODO: tidyup
  var latestPackageUrl = noVersionPath; // Absolute or relative paths work.

  // Get list of package versions & add button when complete
  $.ajax(latestPackageUrl, { success: onGetContents });
}

