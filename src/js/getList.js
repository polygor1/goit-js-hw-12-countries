export default function getList(searshLine) {
  const url = `https://restcountries.com/v2/name/${searshLine}`;
  return fetch(url).then(response => {
    if (response.ok) { return response.json() }
  })
};
