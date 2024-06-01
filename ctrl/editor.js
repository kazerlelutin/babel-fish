import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
import Table from 'editorjs-table'
import Quote from '@editorjs/quote'

import { demoDoc } from '../data/demo-doc'

export const editor = {
  state: {
    editor: undefined,
    updatedAt: Date.now(),
    content: undefined,
  },
  async onInit(state, el, e) {
    const doc = demoDoc
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
          console.log('Article data: ', outputData)
          state.updatedAt = Date.now()
          state.content = outputData
        })
      },
    })
  },
  render() {},
}
