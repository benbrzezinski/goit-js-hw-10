import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;
const searchBox = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const getCountry = debounce(() => {
  const trimmedSearchBoxValue = searchBox.value.trim();

  if (!trimmedSearchBoxValue) {
    countryList.innerHTML = '';
    return;
  }

  fetchCountries()
    .then(countries => {
      const filteredCountries = countries.filter(({ name: { common } }) =>
        common.toLowerCase().startsWith(trimmedSearchBoxValue.toLowerCase())
      );

      if (filteredCountries.length === 0) {
        countryList.innerHTML = '';
        return;
      }

      renderCountryList(filteredCountries);
    })
    .catch(error => console.error(error));
}, DEBOUNCE_DELAY);

searchBox.addEventListener('input', getCountry);

function renderCountryList(filteredCountries) {
  console.log(filteredCountries);
  countryList.innerHTML = '';

  const countryTags = filteredCountries
    .map(({ name: { common }, flags: { svg } }) => {
      return `<li class="country-item">
      <img class="country-img" src="${svg}" width="40px" height="25px" />
      <p class="country-name">${common}</p></li>`;
    })
    .join('');

  countryList.insertAdjacentHTML('beforeend', countryTags);
}
