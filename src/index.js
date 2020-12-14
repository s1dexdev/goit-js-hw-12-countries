import debounce from 'lodash.debounce';
import temaplateList from './templates/list-countries.hbs';
import countryInfo from './templates/country-info.hbs';
import fetchCountries from './js/fetchCountries.js';
import { showMessage, showError } from './js/notification.js';
import './styles.css';

const refs = {
  mainBox: document.querySelector('.js-container'),
  input: document.querySelector('.js-input'),
  listCountries: null,
  country: null,
};

refs.input.addEventListener('input', debounce(fetchHandler, 500));

function fetchHandler() {
  if (this.value === '') {
    return;
  }

  const queryResult = fetchCountries(this.value.trim());

  queryResult
    .then(data => data.json())
    .then(countries => dataСheck(countries))
    .catch(() => showError());
}

function dataСheck(countries) {
  const result = isValid(countries);

  if (!result) {
    showError();
    return;
  }

  const quantity = countries.length;

  if (quantity > 10) {
    showMessage();
  } else if (quantity >= 2 && quantity <= 10) {
    createlListMarkup(countries);
  } else if (quantity === 1) {
    createMarkup(countries);
  }
}

function createlListMarkup(countries) {
  const markup = temaplateList(countries);

  if (refs.listCountries !== null) {
    refs.listCountries.remove();
    refs.listCountries = null;
  } else if (refs.country !== null) {
    refs.country.remove();
    refs.country = null;
  }

  refs.mainBox.insertAdjacentHTML('beforeend', markup);
  refs.listCountries = document.querySelector('.container .js-list');
}

function createMarkup(country) {
  const markup = countryInfo(country);

  if (refs.country !== null) {
    refs.country.remove();
    refs.country = null;
  } else if (refs.listCountries !== null) {
    refs.listCountries.remove();
    refs.listCountries = null;
  }

  refs.mainBox.insertAdjacentHTML('beforeend', markup);
  refs.country = document.querySelector('.container .js-country');
}

function isValid(value) {
  if (Array.isArray(value)) {
    return true;
  }

  return false;
}
