import { translation } from '../data/translation'
import { kll, translateLsKey } from '../main'
import { Words } from '../utils/idb'

function highlightWords(text) {
  const container = document.createElement('div')
  container.innerHTML = text

  const wordsSan = container.innerText.split(' ') // Séparer les mots et les caractères spéciaux

  return wordsSan
    .map((word) => {
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
        text += `<span data-word="${word}" class="cursor-pointer">${word}</span>${lastChar}`
      } else {
        text += `<span data-word="${word}" class="cursor-pointer">${word}</span>`
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
  async render(_, _el) {
    const editorContainer = document.querySelector('[kll-id="editor"]')
    const doc = editorContainer?.state?.content

    if (!doc) return

    const container = document.querySelector('[kll-id="docContainer"]')
    if (!container) return

    const blocks = doc?.blocks || []

    const htmlContent = convertBlocksToHTML(blocks)

    container.innerHTML = htmlContent

    const lang = localStorage.getItem(translateLsKey)
    const spans = container.querySelectorAll('span[data-word]')

    const actionTemplate = await kll.processTemplate('wordAction')

    const states = ['unknown', 'familiar', 'known']

    for (const span of spans) {
      if (!span.dataset.word) continue
      const word = await Words.findOrCreate(span.dataset.word, lang)

      span.setAttribute('data-word-state', word.state)

      span.addEventListener('click', async () => {
        // === SELECTION ================================
        const allSelectedWords = document.querySelectorAll('.selected-word')
        allSelectedWords.forEach((word) => {
          word.classList.remove('text-rd-highlight', 'selected-word')
        })
        span.classList.add('selected-word')

        // === MATCH WORD ================================

        const word = await Words.findOrCreate(span.dataset.word, lang)

        const container = document.getElementById('wordPreview')
        container.innerHTML = ''

        //SI PAS DE MATCH, MODALE POUR AJOUTER LE MOT
        const template = await kll.processTemplate('wordPreview')
        kll.initsIds = [
          ...kll.initsIds.filter((id) => !id.match(/wordPreview/)),
        ]

        kll.plugins.smartRender(template, {
          ...word,
          word: word.name,
          translation: word.translation || '',
          placeholder:
            translation.translationPlaceholder?.[lang] || 'placeholder',
          info: word?.info || translation.noInfo?.[lang] || 'no info',
        })

        container.appendChild(template)
        const actionsContainer = container.querySelector('#wordActions')

        for (const state of states) {
          const action = actionTemplate.cloneNode(true)
          action.innerText = translation[state][lang]

          action.setAttribute('kll-ctrl', 'wordAction')
          action.setAttribute('kll-s-state', state)
          action.setAttribute('data-state', state)
          action.setAttribute('kll-s-word', word.name)
          if (word.state === state) action.setAttribute('disabled', true)
          actionsContainer.appendChild(action)
        }

        const input = container.querySelector('#wordTranslation')

        input?.addEventListener('input', async () => {
          word.translation = input.value
          await Words.update(word)
        })

        kll.reload(container)
        kll.plugins.translate(container)
      })
    }
  },
}
