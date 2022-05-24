import { async } from 'regenerator-runtime';
import { API_URL, KEY, RES_PER_PAGE, SPOON_API, SPOON_KEY } from './config';
import { AJAX } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    resultPerPage: RES_PER_PAGE,
    page: 1,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    image: recipe.image_url,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadingRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${KEY}`);
    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(marks => marks.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    throw err;
  }
};

export const loadingSearchResults = async function (query) {
  state.search.query = query;
  const data = await AJAX(
    `https://forkify-api.herokuapp.com/api/v2/recipes?search=${query}&key=${KEY}`
  );

  state.search.results = data.data.recipes.map(rec => {
    return {
      id: rec.id,
      image: rec.image_url,
      publisher: rec.publisher,
      ...(rec.key && { key: rec.key }),
      title: rec.title,
    };
  });
  state.search.page = 1;
};

export const calculateCalories = async function () {
  try {
    // 1) Retrieve spoonacular API ingredient IDs and add attribute to ingredient list objects

    const ingredientID = state.recipe.ingredients.map(async ingObj => {
      const data = await AJAX(
        `${SPOON_API}/search?query=${ingObj.description}&apiKey=${SPOON_KEY}`
      );

      return await { ...ingObj, id: data.results[0]?.id };
    });

    // 2) Iterate over ingredients to calculate total calories

    const calories = await ingredientID.reduce(
      async (total, ingPro) =>
        await retrieveIngredientCalories(await total, ingPro),
      0
    );

    state.recipe.calories = calories > 0 ? calories : undefined;
  } catch (err) {
    console.log(err);
    state.recipe.calories = undefined;
  }
};

const retrieveIngredientCalories = async function (total, ingPro) {
  try {
    const { id, quantity: amount, unit } = await ingPro.then(ingObj => ingObj);
    if (!id) return total;

    // Retrieve ingredient data from spoonacular API for specified ID, amount, and unit
    const data = await AJAX(
      `${SPOON_API}/${id}/information?apiKey=${SPOON_KEY}${
        amount ? `&amount=${amount}` : ''
      }${unit ? `&unit=${unit}` : ''}`
    );

    const ingCals = data.nutrition?.nutrients.filter(
      obj => obj.name === 'Calories'
    )[0].amount;

    return total + (ingCals || 0);
  } catch (err) {
    return total;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage; //0
  const end = page * state.search.resultPerPage; // 9 slice doesnt count last

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
    // new quantity = old quantity * new serving/ old serving
  });
  state.recipe.servings = newServings;
};

const presistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};
export const addBookmark = function (recipe) {
  //Add recipe to Bookmarks
  state.bookmarks.push(recipe);

  //Mark current recipe as bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  presistBookmark();
};

export const deleteBookmark = function (id) {
  // Delete Bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark Current Recipe As not Bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;

  presistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();
export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredients Format.Please use Correct Format :)'
          );
        const [quantity, unit, description] = ingArr;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      cooking_time: +newRecipe.cookingTime,

      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      ingredients: ingredients,
      servings: +newRecipe.servings,
      source_url: newRecipe.sourceUrl,
      title: newRecipe.title,
    };

    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
    console.log(state.bookmarks);
  } catch (err) {
    throw err;
  }
};
