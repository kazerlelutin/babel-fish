import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from 'editorjs-table'
import Quote from '@editorjs/quote'
import { Docs } from '../utils/idb'
import { seed } from '../utils/seed'
import { kll } from '../main'

export const editor = {
  state: {
    editor: undefined,
    updatedAt: Date.now(),
    content: undefined,
  },
  async onInit(state) {
    const { params } = kll.parseRoute()
    if (!params?.id) await seed()
    const docs = await Docs.get()

    if (docs.length === 0) return

    const doc = params.id ? await Docs.getById(parseInt(params.id)) : docs[0]

    const editor = new EditorJS({
      holder: 'editorContainer',
      autofocus: true,

      tools: {
        header: {
          class: Header,
          config: {
            placeholder: 'Enter a header',
            levels: [1, 2, 3, 4, 5, 6],
            defaultLevel: 3,
          },
        },
        list: List,
        table: {
          class: Table,
        },
        quote: Quote,
      },
      data: doc.content,
      onReady: () => {
        state.editor = editor
        state.updatedAt = Date.now()
        state.content = doc.content
      },
      onChange: () => {
        editor.save().then((outputData) => {
          state.updatedAt = Date.now()
          state.content = outputData
          Docs.update({ ...doc, content: outputData })
        })
      },
    })
  },
  render() {},
}
