# site builder for eyeglass

This is the site builder for [eyeglass.rocks](http://eyeglass.rocks), which is a hub for [`eyeglass`](https://github.com/sass-eyeglass/eyeglass).

## Usage

```js
var SiteBuilder = require("eyeglass-dev-site-builder");
var site = new SiteBuilder({
  root: __dirname
});

site.build();
```

## Tests

Make sure you didn't break anything by running the tests :)

```sh
gulp test
```

## Releasing

```sh
gulp release # release a new version
gulp publish # publish to npm
```
