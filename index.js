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

  let result = Foldmaker.from(tokens).parse(
    [
      ['BLOCK', /([s\n]*p)({[ops;\n]*?})/], // Block
      ['UNKNOWN', /([\s\S])/] // Unknown
    ],
    {
      BLOCK(result) {
        let body = result[2]
        let bodyMap = result.m[2]

        bodyMap.split('').forEach((el, i) => {
          switch (el) {
            case 'p':
              let temp = body[i]
              // Adding semicolons after properties if necessary
              if (temp[temp.length - 1] !== ';') body[i] = body[i] + ';'
            case '{':
              // Some formatting on the fly
              body[i] = '  ' + body[i]
            case '}':
              body[i] = body[i] + '\n'
              break
            case 's':
              body[i] = '  ' + body[i]
          }
        })

        // Store selector names as an array, later to be joined with commas
        let selector = result[1].map(el =>
          el[el.length - 1] === ',' ? el.substring(0, el.length - 1) : el
        )

        return { selector, body }
      }
    }
  )

  let output = ''

  let traverseCallback = obj => {
    output +=
      obj.selector.join(',\n').trim() + obj.body.filter(el => typeof el === 'string').join('')

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
  traverseObjects(result.array, traverseCallback)

  // Finalize by adding newline characters where necessary
  return output //.replace(/[{};]/g, $1 => $1 + '\n')
}
