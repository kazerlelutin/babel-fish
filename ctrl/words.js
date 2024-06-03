import { translation } from '../data/translation'
import { kll, translateLsKey } from '../main'
import { Words, openDatabase } from '../utils/idb'

export const words = {
  state: {},
  async onInit(_, el) {
    await openDatabase()
    const words = await Words.get()
    const lang = localStorage.getItem(translateLsKey)

    el.innerHTML = words
      .sort((a, b) => {
        const statusOrder = { known: 1, familiar: 2, unknown: 3 }
        if (statusOrder[a.state] < statusOrder[b.state]) {
          return -1
        }
        if (statusOrder[a.state] > statusOrder[b.state]) {
          return 1
        }
        if (a.name < b.name) {
          return -1
        }
        if (a.name > b.name) {
          return 1
        }

        return 0
      })
      .map((word) => {
        return `<div class="border border-rd-urban_gray p-5  rounded flex justify-between">
          <div class="first-letter:uppercase">${word.name}</div>
          <div data-word-state="${word.state}">${
          translation?.[word.state]?.[lang]
        }</div>
        </div>`
      })
      .join('')

    kll.reload(el)
  },
  render() {},
}
