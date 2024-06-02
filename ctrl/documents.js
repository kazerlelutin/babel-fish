import { kll } from '../main'
import { Docs } from '../utils/idb'

export const documents = {
  state: {},
  onInit(_, el) {
    el.render()
  },
  async render(_state, el) {
    const docs = await Docs.get()
    el.innerHTML = docs
      .map((doc) => {
        const title = doc?.content?.blocks?.find(
          (block) => block.type === 'header'
        ) || { data: { text: 'No title' } }

        const div = document.createElement('div')
        div.innerHTML = title.data.text
        return `<a href="/doc/${doc.id}" kll-ctrl="link" class="border border-rd-sagwa_young px-3 py-2 rounded text-rd-text">${div.innerText}</a>`
      })
      .join('')

    kll.reload(el)
  },
}
