# [@foldmaker/css-nested](https://www.npmjs.com/package/@foldmaker/css-nested)

An extremely lightweight  plugin to unwrap nested CSS rules (like SCSS). (~65 lines without comments) Built with [Foldmaker](https://github.com/foldmaker/foldmaker).
This plugin does the following transforms:
- Unwraps nested rules
- Replaces '&' characters in the selectors with the parent selector's name
- Removes comments and multiline comments
- Formatting: Removes excess whitespace, adds tab characters
- Formatting: Splits comma-separated selectors into lines



## Usage

This plugin can be installed with [npm](https://docs.npmjs.com/getting-started/what-is-npm), by the following command:

```sh
npm install @foldmaker/css-nested
```
Use to preprocess your nested CSS string:
```js
import cssNested from '@foldmaker/css-nested'
let result = cssNested(YOUR_CSS)
```


## Example
```scss
.dashboard {
  &-header, &-sidebar {
    display: flex;
  }
  img {
    display: block;
  }
  // Dashboard Content
  &-content {
    width: 100%;
    &__top {
      border-radius: 5px;
      padding: 5px;
    }
  }
}
```
will be processed to:
```css
.dashboard {
}
.dashboard-header,
.dashboard-sidebar {
	display: flex;
}
.dashboard img {
  display: block;
}
.dashboard-content {
	width: 100%;
}
.dashboard-content__top {
	border-radius: 5px;
	padding: 5px;
}
```
