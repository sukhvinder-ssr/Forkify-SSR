import { View } from './view';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';
class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(this._data.results.length / RES_PER_PAGE);

    // Current page is 1 and there are other page
    if (curPage === 1 && numPages > 1) {
      return this._generateMarkupBtnNext(curPage);
    }

    //There is only 1 page
    if (curPage === 1 && numPages === 1) return ``;

    //Current page is last
    if (curPage === numPages && curPage > 1)
      return this._generateMarkupBtnPrev(curPage);

    //page is in between 1 and last page
    if (curPage > 1 && curPage < numPages) {
      return `${this._generateMarkupBtnPrev(
        curPage
      )} ${this._generateMarkupBtnNext(curPage)}`;
    }
  }
  _generateMarkupBtnPrev(curPage) {
    return `<button data-goto="${curPage - 1}"
     class="btn--inline pagination__btn--prev">
    <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
    </svg>
    <span> Page ${curPage - 1}</span>
  </button>`;
  }
  _generateMarkupBtnNext(curPage) {
    return `<button data-goto="${curPage + 1}"
     class="btn--inline pagination__btn--next">
      <span> Page ${curPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>`;
  }

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      const goto = +btn.dataset.goto;

      if (!btn) return;

      handler(goto);
    });
  }
}
export default new PaginationView();
