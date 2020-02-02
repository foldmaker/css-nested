import Foldmaker, { tokenize } from 'foldmaker'

export default string => {
  // Tokenize the input
  let tokens = tokenize(
    string.replace(/\r\n/, '\n'),
    [
      ['i', /(\/\/).*?(?=\n|$)/], // Comment
      ['i', /\/\*[\s\S]*?\*\//], // Multiline comment
      ['i', / +|\n/], // spaces or newlines
      ['{', /{/],
      ['}', /}/],
      ['s', /^[^{}\n]+?,/], // Line ending in comma (most probably selector)
      ['p', /^[\s\S]+?;?(?= ?[{}\n])/] // Selector or Property
    ],
    ({ type, value }) => {
      // This function ignores comments, multiline comments and spaces, right from the start
      if (type === 'i') return null
      return { type, value }
    }
  )

  return Foldmaker(tokens)
    .parse(/(s*p)({[1ps]*?})/, result => {
      let selectors = result[1].join('').split(',')
      let body = result[2]
      return { selectors, body }
    })
    .traverse((obj, also) => {
      if (typeof obj === 'object') {
        obj.body
          .filter(child => typeof child === 'object')
          .forEach(child => {
            let newSelectors = []
            obj.selectors.forEach(sel => {
              child.selectors.forEach(ch => {
                newSelectors.push(/&/.exec(ch) ? ch.replace(/&/g, sel.trim()) : sel + ' ' + ch)
              })
            })
            child.selectors = newSelectors
          })
        also(obj.children)
      }
      return obj
    })
    .traverse((obj, also) => {
      if (typeof obj === 'object') return obj.selectors.join(',\n') + '\n' + obj.body.map(also).join('\n')
      else return obj
    }).array[0]
}
