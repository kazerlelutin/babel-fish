import { Docs, Words, openDatabase } from '../utils/idb'
import { WORD_STATES } from '../utils/word-states'

export const exportDb = {
  async onClick() {
    await openDatabase()

    const words = await Words.get()
    const docs = await Docs.get()

    const data = {
      // no necessary to get empty words, they will be regenerated anyway
      words: words.filter(
        (word) =>
          !word.info &&
          !word.translation &&
          !word.emoji &&
          !word.lang &&
          word.state === 'unknown'
      ),
      docs,
    }

    const utf8Bytes = new TextEncoder().encode(JSON.stringify(data))
    const binaryString = Array.from(utf8Bytes)
      .map((byte) => String.fromCharCode(byte))
      .join('')
    const encodedText = btoa(binaryString)

    console.log(words)

    //  console.log(JSON.parse(decodeURIComponent(escape(atob(encodedText)))))

    //CREER LE DOWNLOAD DU FICHIER TXT
    const a = document.createElement('a')
    a.href = `data:text/plain;base64,${encodedText}`
    a.download = 'kllbalelfish.txt'
    a.click()
    a.remove()
  },
}
