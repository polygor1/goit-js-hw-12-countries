const debounce = require('lodash.debounce');

import error from './pnotify';
import {refs} from './refs';
import getList from './getList';
import elementMarkupTemlate from '../templates/markup.hbs';

// ========= main start ===========
// Вводим строку в input и ждем
refs.input.addEventListener('input',
  debounce(getSearchString, 750),
);
// ========= main end =============

// Проверяем значение с инпута 
function getSearchString(event) {
// убираем пробелы
  let inputValue = event.target.value.trim();
// если пустая строка - ругаемся
  if (!inputValue) {
    clearContent();
    errorRequest('Invalid request. Please try again');
    return;
  };
// если норм лезем искать по списку в сети и получаем array или ругаемся
  getList(inputValue)
    .then(array => showResult(array))
    .catch(error => errorRequest(error));
};
// Выводим значение в зависимости от полученого к-ва объектов массива
function showResult(array) {

  if (array.length > 10) {
    // чистим место для списка
    refs.elementContainer.innerHTML = '';  
    // прикольней было вывести первые 10 элементов array 
    showResult(array.slice(0, 9));
    // но мы ругаемся и return ждать следующую букву
    errorRequest('Too many matches found. Please enter a more specific query!');
    return;
  }

  if (array.length <= 10 && array.length >= 2) {
    // чистим место
    refs.inputList.innerHTML = '';
    refs.elementContainer.innerHTML = '';  
    // выводим name списка элементов
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
    return;
  };
  // console.log('во всех остальных случаях');
  // console.log(array.status);
  if (array.status === 404) {
    errorRequest('Nothing found. Please try again');
    clearContent();
    return;
  };
      
  clearContent();
  showContentsElement(array);
};
// Создаем разметку для элемента по шаблону из .hbs
function showContentsElement(element) {
  window.addEventListener('keydown', onKeyPress);
  window.addEventListener('click', onOverlayClick);
  const markup = elementMarkupTemlate(element);
  // Добавляем новую разметку для элемента
  refs.elementContainer.insertAdjacentHTML('beforeend', markup);
};
// сообщние об ошибке
function errorRequest(message){
  error({
    title: '',
    text: message,
    delay: 2500,  
  }); 
};
// чистка экрана
function clearContent(){
  refs.input.value = '';
  refs.inputList.innerHTML = '';
  refs.elementContainer.innerHTML = '';  
};
// вываливание по ESC
function onKeyPress(event) {
  switch (event.code) {
    case 'Escape': {
      clearContent();
      break;
      // можно еще case добавить
    };
  }
};
// вываливание по клику мышкой на экране
function onOverlayClick(event) {
  const target = event.target;
  if (target.classList.value === "screen__overlay") {
    clearContent();
  }
};