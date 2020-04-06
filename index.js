import Foldmaker, { tokenize } from './foldmaker'

export default string => {
  // Tokenize the input
  let tokens = tokenize(
    string.replace(/\r\n/, '\n'),
    [
      ['i', /(\/\/).*?(?=\n|$)/], // Comment
      ['i', /\/\*[\s\S]*?\*\//], // Multiline comment
      ['i', /\s+/], // spaces or newlines
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

  let outputString = ''

  Foldmaker(tokens)
    .parse(/(s*p){[1ps]*}/, ({raw, map}) => {
      let selectorsLength = map[1].length
      let selectors = raw.slice(0, selectorsLength).join('').split(',')
      let body = raw.slice(selectorsLength)
      return { selectors, body }
    }, e => console.warn(e))
    .traverse((parent, also) => {
      if (typeof parent === 'object') {
        parent.body
          .filter(child => typeof child === 'object')
          .forEach(child => {
            let newSelectors = []
            parent.selectors.forEach(sel => {
              child.selectors.forEach(ch => {
                newSelectors.push(/&/.exec(ch) ? ch.replace(/&/g, sel.trim()) : sel + ' ' + ch)
              })
            })
            child.selectors = newSelectors
          })
          also(parent.body)
      }
      return parent
    })
    .traverse((obj, also) => {
      if (typeof obj === 'object') {
        let rule = obj.selectors.join(',\n') + ' ' + obj.body.filter(el => typeof el === 'string').join('\n') + '\n'
        outputString += rule
        also(obj.body)
      }
      return obj
    })

    return outputString
}