const debounce = require('lodash.debounce');

import error from './pnotify';
import {refs} from './refs';
import getList from './getList';
import elementMarkupTemlate from '../templates/markup.hbs';

// Вводим строку в input и ждем
refs.input.addEventListener('input',
  debounce(getSearchString, 500),
);
// Проверяем значение с инпута 
function getSearchString(event) {
// убираем пробелы
  let inputValue = event.target.value.trim();
// если пустая строка - ругаемся
  if (!inputValue) {      
    errorRequest();
    return;
  };
// если норм лезем искать по списку в сети и получаем array или ругаемся
  getList(inputValue)
    .then(array => showResult(array))
    .catch(error => errorRequest(error));
};
// Выводим значение в зависимости от полученого к-ва объектов массива
function showResult(array) {
// document.addEventListener("click", clearContent());
  if (array.length < 2) {
    // сразу показываем контент выбранного элемента
    clearContent();
    showContentsElement(array);
  };

  if (array.length >= 2 && array.length <= 10) {
    // чистим место
    refs.inputList.innerHTML = '';
    refs.countryContainer.innerHTML = '';  
    // выводим .name списка элементов
    array.forEach(element => {
        refs.inputList.insertAdjacentHTML('beforeend',`<li>${element.name}</li>`)
    });
    // ждем клика по элементу списка
    refs.inputList.addEventListener('click', event => {
      clearContent();
      // выбираем элемент из списка
      const targetElement = array.find(element => {
        return element.name === event.target.textContent
      });
      // показываем контент выбранного элемента
      showContentsElement({ targetElement });
    });
  };
 
  if (array.length > 10) {
    // чистим место
    refs.countryContainer.innerHTML = '';  
    // ругаемся и ждем следующую букву
    const message = 'Too many matches found. Please enter a more specific query!'
    error({
      text: message,
      delay: 2000,  
    }); 
  }
}

// Создаем разметку для элемента по шаблону из .hbs
function showContentsElement(element) {
  const markup = elementMarkupTemlate(element);
   //   Добавляем новую разметку для элемента
  refs.countryContainer.insertAdjacentHTML('beforeend', markup);
};

function errorRequest(err){
  clearContent();
  const message = 'Invalid request. Please try again'
      error({
      text: message,
      delay: 7000,  
    }); 
};

function clearContent(){
  refs.input.value = '';
  refs.inputList.innerHTML = '';
  refs.countryContainer.innerHTML = '';  
};

