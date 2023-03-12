import './css/styles.css';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 500;
const searchBox = document.querySelector('input#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const notifyOptions = {
  position: 'center-top',
  distance: '20px',
  timeout: 3500,
  pauseOnHover: false,
};

const getCountry = debounce(() => {
  const trimmedSearchBoxValue = searchBox.value.trim();

  if (!trimmedSearchBoxValue) {
    return erase();
  }

  fetchCountries()
    .then(countries => {
      const filteredCountries = countries.filter(({ name: { common } }) =>
        common.toLowerCase().startsWith(trimmedSearchBoxValue.toLowerCase())
      );

      if (!filteredCountries.length) {
        erase();
        return Notify.failure(
          'Oops, there is no country with that name',
          notifyOptions
        );
      }

      if (filteredCountries.length > 10) {
        erase();
        return Notify.info(
          'Too many matches found. Please enter a more specific name.',
          notifyOptions
        );
      }

      if (filteredCountries.length === 1) {
        erase();
        return renderCountryInfo(filteredCountries);
      }

      erase();
      renderCountryList(filteredCountries);
    })
    .catch(error => console.error(error));
}, DEBOUNCE_DELAY);

searchBox.addEventListener('input', getCountry);

function renderCountryList(filteredCountries) {
  const countryTags = filteredCountries
    .map(({ name: { common }, flags: { svg } }) => {
      return `<li class="country-item">
              <img class="country-img" src="${svg}" width="40px" height="25px" />
              <p class="country-name">${common}</p></li>`;
    })
    .join('');

  countryList.insertAdjacentHTML('afterbegin', countryTags);
}

function renderCountryInfo(filteredCountries) {
  const countryTags = filteredCountries
    .map(
      ({
        name: { common },
        flags: { svg },
        capital,
        population,
        languages,
      }) => {
        const languagesArray = Object.values(languages);

        return `<div class="country-info-box">
                <img class="country-img" src="${svg}" width="50px" height="35px" />
                <h3 class="country-info-name">${common}</h3></div>
                <p class="country-info-text"><span class="country-info-text-first-word">Capital:</span> ${capital}</p>
                <p class="country-info-text"><span class="country-info-text-first-word">Population:</span> ${population}</p>
                <p class="country-info-text"><span class="country-info-text-first-word">Languages:
                </span> ${languagesArray.join(', ')}</p>`;
      }
    )
    .join('');

  countryInfo.insertAdjacentHTML('afterbegin', countryTags);
}

function erase() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
