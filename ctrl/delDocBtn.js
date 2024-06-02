import { kll } from '../main'
import { Docs } from '../utils/idb'

export const delDocBtn = {
  state: {
    confirm: false,
    callback: null,
    text: 'confirmDelDoc',
    subText: '',
  },
  async onInit(state) {
    const { params } = kll.parseRoute()

    const redirect = () => {
      const path = '/docs'
      window.history.pushState({}, '', path)
      kll.injectPage(path)
    }
    if (params.id) {
      const doc = await Docs.getById(parseInt(params.id))
      state.callback = async () => {
        await Docs.remove(doc.id)
        redirect()
      }
    } else {
      const editorEl = document.querySelector('[kll-id="editor"]')
      state.callback = async () => {
        await Docs.remove(editorEl?.state.id)
        redirect()
      }
    }
  },
}
