(function () {
  //создаем массив со списком дел, которые должны быть загружены при загрузке формы
  let listTodoLoadForm = [];
  let keyList = '';
  //создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }
  //создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    // делаем не активной кнопку добавить при загрузке формы
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    return {
      form,
      input,
      button
    }
  }
  //создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }
  // добавление в список дел введенного в поле дела
  function changeColorElement(item, done, wrapText, doneButton, condition) {
    // condition  =  0 -загрузка формы
    // condition = 1 - при нажатии кнопки выполнено / не выполнено
    //классs кнопки
    let btnClassSuccess = 'btn-success';
    let btnClassNotSuccess = 'btn-secondary';

    let btnTextSuccess = 'выполнено';
    let btnTextNotSuccess = 'не выполнено';
    //класс item
    let itemClassSuccess = 'list-group-item-success';
    let itemClassNotSuccess = 'list-group-item-secondary';

    if (condition === 0) {

      if (done) {
        item.classList.add(itemClassNotSuccess);
        doneButton.classList.add(btnClassNotSuccess);
        doneButton.textContent = btnTextNotSuccess;
        wrapText.style.textDecoration = 'line-through';
      } else {

        doneButton.classList.add('btn', btnClassSuccess);
        doneButton.textContent = btnTextSuccess;
        wrapText.style.textDecoration = 'none';
      }
    }
    if (condition === 1) {
      if (doneButton.classList.contains(btnClassSuccess)) {
        doneButton.textContent = btnTextNotSuccess;
        wrapText.style.textDecoration = 'line-through';
      } else {
        doneButton.textContent = btnTextSuccess;
        wrapText.style.textDecoration = 'none';
      };
      doneButton.classList.toggle(btnClassSuccess);
      doneButton.classList.toggle(btnClassNotSuccess);
      item.classList.toggle(itemClassNotSuccess);
    }
  }


  function createTodoItem(objNewItem) {
    let item = document.createElement('li');
    // кнопки отметить дело как сделанное и удалить дело положим в отдельный div
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');
    let wrapText = document.createElement('div');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    wrapText.textContent = objNewItem.name;
    //wrapText.classList.add('wrapText');
    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'удалить';
    changeColorElement(item, objNewItem.done, wrapText, doneButton, 0);

    doneButton.addEventListener('click', function () {
      for (let item of listTodoLoadForm) {
        //если item.name из массива со значениями = новому значению, то меняем ему выполнение задания
        if (item.id == objNewItem.id) {
          item.done = !item.done;
          break;
        }

      }
      saveList(listTodoLoadForm, keyList);
      changeColorElement(item, objNewItem.done, wrapText, doneButton, 1);
    });
    deleteButton.addEventListener('click', function () {
      if (confirm('вы уверены?')) {
        let idNextAfterDelete = -1;
        item.remove();
        for (let item of listTodoLoadForm) {
          //если item.name из массива со значениями = новому значению, то меняем ему выполнение задания
          if (item.id == objNewItem.id) {
            listTodoLoadForm.splice(objNewItem.id - 1, 1);
            idNextAfterDelete = objNewItem.id;
            break;
          }
        }
        if (idNextAfterDelete!==-1){
        for(let i=idNextAfterDelete-1; i<listTodoLoadForm.length;i++){
          listTodoLoadForm[i].id -= 1;
        }
        }
        saveList(listTodoLoadForm, keyList);
      }
    });

    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(wrapText);
    item.append(buttonGroup);

    return {
      item,
      doneButton,
      deleteButton,
    };

  }

  function getNewId(arrItemTodo) {
    let max = 0;
    for (const item of arrItemTodo) {
      if (item.id > max) max = item.id;
    }
    return max + 1;
  }

  function saveList(arr, key) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function createTodoApp(container, title = 'список дел', key, defaulCases) {
    //let container = document.getElementById('todo-app');
    //	let todoAppTitle = createAppTitle('Список дел');
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    //добавим два дела
    // let todoItems =[
    // 	createTodoItem('сходить за хлебом'),
    // 	createTodoItem('купить молока')
    // ];

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);
    keyList = key;
    let localData = localStorage.getItem(keyList);
    if (localData !== null && localData !== '') {
      listTodoLoadForm = JSON.parse(localData);
    } else {
      listTodoLoadForm = defaulCases;
      saveList(listTodoLoadForm, keyList);
    }
    for (const item of listTodoLoadForm) {
      let todoItem = createTodoItem(item);
      todoList.append(todoItem.item);
    }

    // навешиваем событие на поле ввода: не активна кнопка добавить, если поле ввода пустое
    todoItemForm.input.addEventListener('input', function () {
      (todoItemForm.input.value.trim()) ? todoItemForm.button.disabled = false: todoItemForm.button.disabled = true;

    })



    // todoList.append(todoItems[0].item);
    // todoList.append(todoItems[1].item);
    // по нажатию кнопки и по enter
    todoItemForm.form.addEventListener('submit', function (e) {
      // чтобы страница не перезагружалась при отправке формы
      e.preventDefault();
      // делаем не активной кнопку добавить после добавления дела
      todoItemForm.button.disabled = true;
      // игнор создание элемента, если пользователь ничего не ввел
      if (!todoItemForm.input.value) {
        return;
      };
      // todoList.append(createTodoItem(todoItemForm.input.value).item);
      //let todoItem = createTodoItem(todoItemForm.input.value);

      let newItem = {
        id: getNewId(listTodoLoadForm), //max id в массиве дел, которые мы ввели
        name: todoItemForm.input.value, // название задания
        done: false, //выполнено ли задание
      };

      let todoItem = createTodoItem(newItem);

      listTodoLoadForm.push(newItem);

      todoList.append(todoItem.item);
      saveList(listTodoLoadForm, keyList);
      todoItemForm.input.value = '';


    })
  }
  window.createTodoApp = createTodoApp;
  // localStorage.setItem('key', 'u1')
  document.addEventListener('DOMContentLoaded', function () {

    // createTodoApp(document.getElementById('my-todos'),'мои дела');
    // createTodoApp(document.getElementById('mom-todos'),'дела мамы');
    // createTodoApp(document.getElementById('dad-todos'),'дела папы');

  });

})();
