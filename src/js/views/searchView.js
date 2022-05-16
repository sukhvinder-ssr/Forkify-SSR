class SearchView {
  _parentEl = document.querySelector('.search');

  getQuerry() {
    const query = this._parentEl.querySelector('.search__field').value;
    this._clearInputs();
    return query;
  }
  _clearInputs() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandelerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
