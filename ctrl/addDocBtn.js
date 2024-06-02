import { kll } from '../main'
import { Docs } from '../utils/idb'

export const addDocBtn = {
  onInit(_, el) {
    kll.plugins.translate(el)
  },
  async onClick() {
    const doc = await Docs.add({
      content: {
        blocks: [
          {
            type: 'header',
            data: {
              text: 'New document',
              level: 2,
            },
          },
        ],
      },
    })
    const path = '/doc/' + doc
    window.history.pushState({}, '', path)
    kll.injectPage(path)
  },
}
