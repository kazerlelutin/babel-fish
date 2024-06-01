import { kll } from '../main'

const words = ['안녕하세요', 'nouvelles']

export const word = {
  state: {
    word: '',
  },
  onInit(state, el, e) {
    if (words.includes(state.word)) {
      console.log('el', el)
      el.classList.add('text-rd-highlight')
    }
  },
  async onclick(state, el, e) {
    // === SELECTION ================================
    const allSelectedWords = document.querySelectorAll('.selected-word')
    allSelectedWords.forEach((word) => {
      word.classList.remove('text-rd-highlight', 'selected-word')
    })
    el.classList.add('selected-word')

    // === MATCH WORD ================================

    const container = document.getElementById('wordPreview')
    container.innerHTML = ''

    //SI PAS DE MATCH, MODALE POUR AJOUTER LE MOT
    const template = await kll.processTemplate('wordPreview')

    //TODO on recherche le mot pour tout mettre dedans, toutes les infos
    kll.plugins.smartRender(template, {
      word: state.word,
    })
    container.appendChild(template)
    console.log('word ctrl onclick', state.word)
  },
  render() {},
}
