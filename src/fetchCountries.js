const fetchCountries = () => {
  return fetch(
    `https://restcountries.com/v3.1/all?fields=name,capital,population,flags,languages`
  ).then(resp => {
    if (!resp.ok) {
      throw new Error(resp.status);
    }

    return resp.json();
  });
};

export default fetchCountries;
