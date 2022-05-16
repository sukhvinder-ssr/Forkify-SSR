import icons from 'url:../../img/icons.svg';
export class View {
  _data;
  /**
   *Render the received object to the DOM
   * @param {Object | Object[]} data the data to be rendered (e.g. recipe)
   * @param {boolean} [render = true] If false create markup string instead renderin to DOM
   * @returns {undefined | string} Markup string is return If render= false
   * @this {object} view instance
   * @author Sukhvinder singh
   * @todo Finish implementaion
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (render === false) return markup;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Change Text
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      // Change Attribute
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(newAt => {
          curEl.setAttribute(newAt.name, newAt.value);
        });
    });
  }
  renderSpinner() {
    const markup = `<div class="spinner">
    <svg>
      <use href="${icons}.svg#icon-loader"></use>
    </svg>
  </div> `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `<div class="error">
    <div>
      <svg>
        <use href="${icons}.svg#icon-alert-triangle"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div> `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderMessage(message = this._message) {
    const markup = `<div class="message">
    <div>
      <svg>
        <use href="${icons}.svg#icon-smile"></use>
      </svg>
    </div>
    <p>${message}</p>
  </div> `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  _clear() {
    this._parentEl.innerHTML = '';
  }
}
