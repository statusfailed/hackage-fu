var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
pageMod.PageMod({
  include: /.*hackage.haskell.org\/package.*/,
  contentScriptFile: [data.url("jquery.min.js"),
                      data.url("hackage.js")],
  contentStyleFile: data.url("hackage-fu.css"),
  contentScriptWhen: "end"
});
