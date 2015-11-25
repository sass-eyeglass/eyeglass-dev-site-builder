var Metalsmith = require("metalsmith");
var path = require("path");
var merge = require("lodash.merge");

function noop(files, metalsmith, done) {
  done();
}

module.exports = function(config, done) {
  config = merge({
    engines: {
      Handlebars: require("handlebars")
    }
  }, config);
  config = require("../config")(config);

  var plugins = require("./plugins")(config);

  return new Metalsmith(config.root)
    .source(config.source)
    .metadata(config)
    .use(plugins.copy({
      pattern: "root/**/*",
      directory: "./",
      move: true
    }))
    .use(plugins.uuid())
    .use(config.isServer && plugins.watch({
      paths: config.watch,
      livereload: !!config.livereload
    }) || noop)
    // this allows us to update handlebars whenever a partial or helper changes
    .use(plugins.configureHandlebars(config.engines.Handlebars, config))
    // filter out files we don't want to process
    .use(plugins.filter())
    .use(config.isProd && plugins.drafts() || noop)
    .use(plugins.collections(config.collections))
    // use handlebars on content
    .use(plugins.inPlace({
      engine: "handlebars",
      pattern: "**/*.{md,html}"
    }))
    // must happen AFTER #inPlace
    .use(plugins.markdown({
      gfm: true,
      tables: true,
      smartLists: true,
      smartypants: true,
      highlight: function (code, lang, callback) {
        return require("highlight.js").highlightAuto(code).value;
      }
    }))
    // gets the collection of tags (must happen AFTER #markdown)
    .use(plugins.tags({
      handle: "tags",
      //metadataKey: "alltags",
      path: "topics/:tag.html",
      // template to use for tag listing
      template: "topic.hbt"
    }))
    // sets data to be used by #permalinks
    .use(plugins.permalinksInfo())
    .use(plugins.permalinks({
      pattern: ":collection/:permaname",
      relative: false
    }))
    .use(plugins.pagedata(config))
    // the order here kinda matters
    // extract the excerpts (this must happen AFTER #markdown and #inPlace)
    .use(plugins.excerpt())
    // fix the collection page data which is now out-of-date (this must happen AFTER #collections, #excerpt, #permalinks, and #pagedata)
    .use(plugins.fixCollections())
    // get topics from the collections (must happen AFTER #fixCollections)
    .use(plugins.collectionTopics())
    // set information about tags (must happen AFTER #collectionTopics)
    .use(plugins.tagdata())
    // set the sidebar information (must happen AFTER #collectionTopics and #tagdata)
    .use(plugins.aside(config))
    // get a list of all the pages (should be the LAST thing we do before we render templates)
    .use(plugins.allpages())

    // use handlebars for layout
    .use(plugins.templateToLayout())  // must happen AFTER #tags, which uses the `template` key instead of `layout`
    .use(plugins.layouts({
      directory: path.resolve(config.root, config.source, "layouts"),
      engine: "handlebars"
    }))

    // this can happen whenever
    .use(plugins.eyeglass({
      outputStyle: config.isProd ? "compressed" : "expanded",
      root: config.root,
      buildDir: "${source}/assets/",
      assetsHttpPrefix: "assets",
      includePaths: [path.resolve(__dirname, "../node_modules/highlight.js/styles/")]
    }))
    // use auto-prefixer (must happen AFTER #eyeglass)
    .use(plugins.autoprefixer())

    .use(plugins.redirect(config.redirect))

    // check that all of our links are valid
    .use(config.linkchecker && plugins.linkchecker({
      cache: "./build/.linkchecker.cache",
      base: /^(?:https?:)?\/\/(?:www\.)?eyeglass\.rocks/,
      exclude: ["https://github.com/**/*/fork"],
      reportOnly: config.isServer
    }) || noop)

    // this is all post-process stuff, which should happen at the very end
    .use(config.isProd && plugins.htmlMinifier() || noop)
    .use(config.isProd && plugins.uglify() || noop)
    .use(config.isServer && plugins.serve({}) || noop)
    .destination(config.dest);
};
