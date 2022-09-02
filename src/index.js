import './css/styles.css';
import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const body = document.querySelector('body');

//=====FUNCTIONS=====

const cleanData = () => {
  countryInfo.innerHTML = '';
  countryList.innerHTML = '';
};

const countrySearch = e => {
  const countryFind = e.target.value.trim();
  if (!countryFind) {
    cleanData();
    return;
  }
  fetchCountries(countryFind)
    .then(country => {
      if (country.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
        cleanData();
        return;
      } else if (country.length > 1 && country.length <= 10) {
        cleanData(countryInfo.innerHTML);
        renderCountryList(country);
      } else if (country.length === 1) {
        cleanData(countryList.innerHTML);
        renderCountryInfo(country);
      }
    })
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
      cleanData();
      return error;
    });
};

const renderCountryList = country => {
  const markup = country
    .map(({ name, flags }) => {
      return `<li><img src="${flags.svg}" alt="${name.official}"><p>${name.official}</p></li>`;
    })
    .join('');
  countryList.innerHTML = markup;
};

const renderCountryInfo = country => {
  const markup = country
    .map(({ name, capital, population, flags, languages }) => {
      return `<section><h1><img src="${flags.svg}" alt="Flag of ${
        name.official
      }"width="30" hight="20"">&nbsp ${name.official}</h1>
      <p><span>Capital: </span>&nbsp ${capital}</p>
      <p><span>Population:</span>&nbsp ${population}</p>
      <p><span>Languages:</span>&nbsp ${Object.values(languages)}</p><section>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
};

input.addEventListener('input', debounce(countrySearch, DEBOUNCE_DELAY));

body.style.paddingTop = '66px';
body.style.paddingLeft = '70px';
body.style.backgroundColor = '#c7f0c8';

input.style.width = '300px';
input.style.fontWeight = '500';

countryList.style.listStyle = 'none';
countryList.style.margin = 'auto';
countryList.style.padding = '15px';
