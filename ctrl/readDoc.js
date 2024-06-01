import { kll } from '../main'

function highlightWords(text) {
  const container = document.createElement('div')
  container.innerHTML = text

  const wordsSan = container.innerText.split(' ') // Séparer les mots et les caractères spéciaux

  return wordsSan
    .map((word, index) => {
      const firstChar = word.charAt(0)
      const lastChar = word.charAt(word.length - 1)
      const specialCharsReg = /[`~!@#$%^&*()_|+\-=?;:,.<>/]/g
      let text = ''
      if (specialCharsReg.test(firstChar)) {
        text += firstChar
        word = word.slice(1)
      }
      if (specialCharsReg.test(lastChar)) {
        word = word.slice(0, -1)
        text += `<span kll-ctrl="word" kll-s-word="${word}" kll-id="word-${word}-${index}-${Math.random()}" class="cursor-pointer">${word}</span>${lastChar}`
      } else {
        text += `<span kll-ctrl="word" kll-s-word="${word}" kll-id="word-${word}-${index}-${Math.random()}" class="cursor-pointer">${word}</span>`
      }

      return text
    })
    .join(' ')
}

function convertBlocksToHTML(blocks) {
  return blocks
    .map((block) => {
      let content = ''
      switch (block.type) {
        case 'header':
          content = `<h${block.data.level}>${highlightWords(
            block.data.text
          )}</h${block.data.level}>`
          break
        case 'paragraph':
          content = `<p>${highlightWords(block.data.text)}</p>`
          break
        case 'list':
          const listTag = block.data.style === 'ordered' ? 'ol' : 'ul'
          content = `<${listTag}>${block.data.items
            .map((item) => `<li>${highlightWords(item)}</li>`)
            .join('')}</${listTag}>`
          break
        case 'table':
          content = `<table>${block.data.content
            .map(
              (row) =>
                `<tr>${row
                  .map((cell) => `<td>${highlightWords(cell)}</td>`)
                  .join('')}</tr>`
            )
            .join('')}</table>`
          break
        case 'quote':
          content = `<blockquote>${highlightWords(
            block.data.text
          )}</blockquote>`
          break
        default:
          break
      }
      return content
    })
    .join('')
}

export const readDoc = {
  state: {},
  render(_, _el, listen) {
    const doc = listen.value

    if (!doc) return

    const container = document.querySelector('[kll-id="docContainer"]')
    if (!container) return

    const blocks = doc?.blocks || []

    const htmlContent = convertBlocksToHTML(blocks)

    container.innerHTML = htmlContent

    kll.reload(container)
  },
}
