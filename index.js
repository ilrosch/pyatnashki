// Глобальне переменные
let itemsInRow; // Кол-во элементов в строке
let indexNull; // Положение нулевого элемента [индекс массива; индекс элемента в массиве]
let counterModal; // Счетчик ходов в модальном окне

let correctArr = []; // Корректный массив (поле)
let currentArr = []; // Текущий массив (поле)

// Отслеживаем нажатие кнопки для начала игры
const btn = document.querySelector('.start-btn');
btn.addEventListener('click', () => { startGame(); })

// Запускаем игру
const startGame = () => {
  const input = document.querySelector('.block-input');
  const value = Number(input.value);
  const counter = document.querySelector('.game-counts-span');

  if (value >= 3 && value <= 10) {
    itemsInRow = value;
    // Положение пустого элемента
    indexNull = [itemsInRow - 1, itemsInRow - 1];

    // Обнуление
    correctArr = [];
    currentArr = [];
    counter.dataset.value = 0;
    counter.textContent = 0;

    generateArrays();
    clickItem();

    // Очистка инпута
    input.value = '';
  }
};

const checkArrays = () => {
  const correct = correctArr.flat();
  const current = currentArr.flat();

  // Сверяем расположение элементов в массиве
  for (let i = 0; i < current.length; i += 1) {
    if (current[i] !== correct[i]) {
      return;
    }
  }

  // Если массив равны открываем модальное окно
  openModalFinish();
};

// Функция отрисовки
const render = (arrs) => {
  const box = document.querySelector('.game-play');
  box.style.gridTemplateColumns = `repeat(${arrs.length}, 1fr)`;
  // Обнуление перед заполнением
  box.innerHTML = '';
  // Отрисовываем элемент на игровом поле
  arrs.forEach(arr => {
    arr.forEach(item => {
      const div = document.createElement('div');
      div.classList.add('game-item');
      div.dataset.item = item;
      div.textContent = item;

      box.append(div);
    });
  });

  // Сравнивам массивы
  checkArrays();
};

// Функция перемешивания массива 
const randomItemsInArray = (correctArray) => {
  const randomArr = [...correctArray];
  for (let i = 0; i < randomArr.length; i += 1) {
    const indexRandom = Math.floor(Math.random() * randomArr.length);
    const item = randomArr[i];
    randomArr[i] = randomArr[indexRandom];
    randomArr[indexRandom] = item;
  }

  return randomArr;
};

// Генерируем перемешанный и корректный массив (расположение элементов)
const generateArrays = () => {
  const countItemsArr = itemsInRow ** 2;
  const correctArray = [];

  // Наполняем массив элементами
  for (let i = 1; i < countItemsArr; i += 1) {
    correctArray.push(i);
  }

  // Получаем перемешанный массив
  const randomArr = randomItemsInArray(correctArray);

  // Добавляем нулевой элемент в конец
  correctArray.push(0);
  randomArr.push(0);

  // Разбиваем массивы на строки
  let rowCorrectArr = [];
  let rowCurrentArr = [];

  for (let i = 0; i <= countItemsArr; i += 1) {
    if (i % itemsInRow === 0 && i !== 0) {
      correctArr.push(rowCorrectArr);
      currentArr.push(rowCurrentArr);

      rowCorrectArr = [];
      rowCurrentArr = [];
    }

    rowCorrectArr.push(correctArray[i]);
    rowCurrentArr.push(randomArr[i]);
  }

  // Запускаем отрисовку
  render(currentArr);
};

// Функция, которая делает ход и проверяет возможность его сделать
const steps = (item) => {
  let indexBtn; // Положение элемента [индекс массива; индекс элемента в массиве]

  for (let i = 0; i < currentArr.length; i += 1) {
    if (currentArr[i].includes(Number(item))) {
      indexBtn = [i, currentArr[i].indexOf(Number(item))];
    }
  }

  // Проверка возможности хода
  if (((indexNull[0] - 1 === indexBtn[0] || indexNull[0] + 1 === indexBtn[0]) && indexNull[1] === indexBtn[1]) ||
    (indexNull[0] === indexBtn[0] && (indexNull[1] - 1 === indexBtn[1] || indexNull[1] + 1 === indexBtn[1]))) {
    // Выполняем перемещени элемента
    currentArr[indexNull[0]][indexNull[1]] = currentArr[indexBtn[0]][indexBtn[1]];
    currentArr[indexBtn[0]][indexBtn[1]] = 0;
    indexNull = indexBtn;

    // Счетчик ходов
    const counter = document.querySelector('.game-counts-span');
    counter.dataset.value = Number(counter.dataset.value) + 1;
    counter.textContent = counter.dataset.value;
    counterModal = counter.dataset.value;

    // Запускаем отрисовку
    render(currentArr);
    clickItem();
  }
};

// Отслеживаем клики по элементам в поле
const clickItem = () => {
  const items = document.querySelectorAll('.game-item');

  items.forEach(item => {
    item.addEventListener('click', () => {
      steps(item.dataset.item);
    });
  });
};

// Открытие модального окна
const openModalFinish = () => {
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');
  const counter = document.querySelector('.modal-count');

  overlay.classList.add('open');
  modal.classList.add('open');

  // Результат
  counter.textContent = counterModal;

  // Закрытие модального окна
  closeModal();
};

// Закрытие модального окна
const closeModal = () => {
  const closes = document.querySelectorAll('.close');
  const overlay = document.querySelector('.overlay');
  const modal = document.querySelector('.modal');

  closes.forEach(close => {
    close.addEventListener('click', () => {
      overlay.classList.remove('open');
      modal.classList.remove('open');

      // Обнуление
      correctArr = [];
      currentArr = [];
    });
  });
};

// При нажатии на Enter начинаем новую игру
document.addEventListener("keypress", (e) => {
  if (e.code === 'Enter') {
    startGame();
  }
});




