# Hackage-Fu: Browser plugins to increase Hackage productivity

Now available on the [Chrome Web Store][webstore]!

Hackage-Fu is a Chrome extension to add some useful buttons to
[Hackage][hackage]. My current workflow is as follows:

1. Find a package (or specific module) in google
2. Hit "contents" to find out if i'm on the most recent version
3. If i'm on the most recent version, hit "back", or:
4. Select the most recent version of the package
5. Find the original page I was looking at (which i've usually forgotten!)

Hackage-Fu adds notifications to tell you if you're on the latest version,
links to take you there if you aren't, and informs you if the module you're
looking at no longer exists in the package.

## Features

### Latest Contents

If you're looking at an older version of a package, Hackage-Fu adds a button next
to the "Contents" link on the top navigation bar which will take you to the
contents page of the most recent version of the package.

### Latest version of current page

If there's a version of the current page in the newest version of the package,
Hackage-Fu displays it before the "Source" link in the navbar in orange-
For example [Network.Riak.Value][example-newer-page].

If the current page does not exist in the newest version, it is shown as
"obsolete".

## Developing

In Chrom(e|ium):

1. Clone the repository
2. Click `options -> settings`
3. Tick `Developer Mode` in the top right of the page
4. Click `Load unpacked extension`
5. Navigate to the cloned repository, and select the `chrome` subdirectory

You should now have the hackage-fu extension installed. You can make
changes and reload with `Ctrl+R` in the extensions screen.

### TODO

* Fix bug on 'latest' url e.g. [here][latest-url-bug]
  This appears to be a bug in Hackage- "Contents" button on "latest" page
  links to 0.53.5 instead of 1.0.2
* Port to Firefox
* Port to Greasemonkey
* Menu for navigating to arbitrary versions of the same page
* <del>Fix bug in "old hackage" where links are not displayed, e.g. [here][old-hackage]</del>
* <del>Fix bug incorrectly comparing version strings.</del>

[hackage]: http://hackage.haskell.org/packages/hackage.html
[example-newer-page]: http://hackage.haskell.org/packages/archive/riak/0.6.0.0/doc/html/Network-Riak-Value.html
[webstore]: https://chrome.google.com/webstore/detail/hackage-fu/dnpldbohleinhdgfnhlkofpgkdcfcfmf/related
[old-hackage]: http://hackage.haskell.org/packages/archive/bytestring/0.9.0.4/doc/html/Data-ByteString-Lazy.html
[latest-url-bug]: http://hackage.haskell.org/packages/archive/category-extras/latest/doc/html/Control-Functor-Zip.html
