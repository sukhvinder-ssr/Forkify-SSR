import { View } from './view';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';
class AddRecipe extends View {
  _parentEl = document.querySelector('.upload');
  _overlay = document.querySelector('.overlay');
  _windowRecipe = document.querySelector('.add-recipe-window');
  _closebtn = document.querySelector('.btn--close-modal');
  _showBtn = document.querySelector('.nav__btn--add-recipe');
  _message = 'Recipe was uploaded successfully ';
  constructor() {
    super();
    this._addHandlerAddRecipe();
    this._addHandlerCloseAddRecipe();
  }

  toggleClass() {
    this._windowRecipe.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }
  _keyPress(e) {
    if (
      e.key === 'Escape' &&
      !this._windowRecipe.classList.contains('hidden')
    ) {
      this.toggleClass();
    }
  }

  _addHandlerAddRecipe() {
    this._showBtn.addEventListener('click', this.toggleClass.bind(this));
  }
  _addHandlerCloseAddRecipe() {
    this._closebtn.addEventListener('click', this.toggleClass.bind(this));
    this._overlay.addEventListener('click', this.toggleClass.bind(this));
    document.addEventListener('keydown', this._keyPress.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('click happen');
      const dataArr = [...new FormData(this)];
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }
}
export default new AddRecipe();
