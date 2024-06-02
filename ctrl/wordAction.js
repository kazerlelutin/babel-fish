import { kll } from '../main'
import { Words } from '../utils/idb'

export const wordAction = {
  state: {
    state: '',
    word: '',
  },

  async onClick(state, el) {
    const word = await Words.getById(state.word)
    if (!word) return
    await Words.update({
      ...word,
      state: state.state,
    })
    const actions = document.querySelectorAll('[data-action]')
    actions.forEach((action) => {
      action.removeAttribute('disabled')
    })
    el.setAttribute('disabled', true)
    const doc = document.querySelector('[kll-id="editor"]')
    doc.state.updateAt = Date.now()
  },
}
