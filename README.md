# [@foldmaker/css-nested](https://www.npmjs.com/package/@foldmaker/css-nested)

**@foldmaker/css-nested** is a plugin to unwrap nested CSS rules (like how SCSS does it). It's extremely lightweight (~65 lines uncommented). 
This plugin does the following transforms:
- Replaces '&' characters in the selectors with the parent selector's name
- Removes comments and multiline comments
- Splits comma-separated selectors into lines
- Formatting: Removes excess whitespace, adds tabs



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
.dashboard-content {
	width: 100%;
}
.dashboard-content__top {
	border-radius: 5px;
	padding: 5px;
}
```
