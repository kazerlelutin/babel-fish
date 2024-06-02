export const wordPreviewClose = {
  async onclick() {
    // === SELECTION ================================
    const allSelectedWords = document.querySelectorAll('.selected-word')
    allSelectedWords.forEach((word) => {
      word.classList.remove('text-rd-highlight', 'selected-word')
    })
    const container = document.getElementById('wordPreview')
    container.innerHTML = ''
  },
}
