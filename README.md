# @foldmaker/css-nested

A plugin to unwrap nested CSS rules (like SCSS). It's extremely lightweight (~70 lines without comments).
The plugin does the following transforms:
- Unwraps nested rules
- Replaces '&' characters in the selectors with parent selector's name
- If '&' character is not present, add parent selector’s name to the beginning
- Adds semicolons after property names, if they are not present. (considers newline characters as delimiters if semicolons are absent)
- Removes comments and multiline comments
- Formatting: Removes excess whitespace, adds tab characters
- Formatting: Splits comma-separated selectors into lines

## Usage

```js
import cssNested from '@foldmaker/css-nested'
let result = cssNested(YOUR_CSS)
```


## Example
```scss
.dashboard, custom {
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
.dashboard,
custom {
}
.dashboard-header,
.dashboard-sidebar,
custom-header,
custom-sidebar {
display: flex;
}
.dashboard img,
custom img {
display: block;
}
.dashboard-content,
joe-content {
width: 100%;
}
.dashboard-content__top,
joe-content__top {
border-radius: 5px;
padding: 5px;
}
```
