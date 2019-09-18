import Foldmaker, { tokenize, traverseObjects } from 'foldmaker'

export let cssNested = string => {
  // Tokenize the input
  let tokens = tokenize(
    string,
    [
      ['i', /(\/\/).*?(?=\n|$)/], // Comment
      ['i', /\/\*[\s\S]*?\*\//], // Multiline comment
      ['i', / +/], // spaces
      ['i', /\n/],
      ['{', /{/],
      ['}', /}/],
      ['s', /^[^{}\n]+?,/], // Line ending in comma (most probably selector)
      ['p', /^[\s\S]+?(;?)(?= ?[{}\n])/], // Selector or Property
      ['u', /[\s\S]/] // Unknown
    ],
    ({ type, value }) => {
      // This function ignores comments, multiline comments and spaces, right from the start
      if (type === 'i') return null
      return { type, value }
    }
  )
  console.log(tokens)

  let result = Foldmaker.from(tokens).parse(
    [
      ['BLOCK', /([s\n]*p)({[ops;\n]*?})/], // Block
      ['UNKNOWN', /([\s\S])/] // Unknown
    ],
    {
      BLOCK(result) {
        let body = result[2]
        result.m[2].split('').forEach((el, i) => {
          if (el === 'p') {
            let temp = body[i]
            // Adding semicolons after properties if necessary
            if (temp[temp.length - 1] !== ';') body[i] = body[i] + ';'
            // Some formatting on the fly
            body[i] = '  ' + body[i]
          } else if (el === '{') {
            // More formatting
            body[i] = ' ' + body[i]
          }
        })
        return {
          selector: result[1].join('').split(','),
          body
        }
      }
    }
  )
  let output = ''

  let traverseCallback = obj => {
    output += obj.selector.join(',').trim() + obj.body.filter(el => el.length).join('')

    traverseObjects(obj.body, childObj => {
      // Do selector parent-child prefix magic
      let parentSelector = obj.selector
      let selector = childObj.selector
      let newSelector = []
      selector.forEach(sel => {
        parentSelector.forEach(par => {
          let newSel = /&/.exec(sel) ? sel.replace(/&/g, par.trim()) : par + ' ' + sel
          newSelector.push(newSel)
        })
      })
      childObj.selector = newSelector
      traverseCallback(childObj)
    })
  }
  traverseObjects(result, traverseCallback)

  // Finalize by adding newline characters where necessary
  return output.replace(/[{},;]/g, $1 => $1 + '\n')
}
