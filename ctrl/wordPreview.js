export const wordPreview = {
  state: {
    title: undefined,
  },

  render(state, el) {
    if (state.title) {
      el.innerHTML = state.title
      el.removeAttribute('data-hide')
    } else {
      el.setAttribute('data-hide', true)
    }
  },
}
