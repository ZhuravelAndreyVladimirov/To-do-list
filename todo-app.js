(function () {
    let listSave = [];
    let listName = '';
    //создаем и возвращаем заголовок
    function createAppTitle(tittle) {
        let appTitle = document.createElement('h2');
        appTitle.innerHTML = tittle;
        return appTitle;
    }

    /*Создание и возврат формы*/

    function createTodoItemForm() {
        let appForm = document.createElement('form');
        let appInput = document.createElement('input');
        let appBtn = document.createElement('button');
        let appBtnWraper = document.createElement('div');


        appForm.classList.add('input-group', 'mb-3', '.bg-light');
        appInput.classList.add('form-control', '.bg-light', 'mr-1');
        appInput.placeholder = "Введите название нового дела";
        appBtnWraper.classList.add('input-group-append');
        appBtn.classList.add('btn-primary');
        appBtn.disabled = true;
        appBtn.textContent = 'Добавить новое дело';

        appInput.addEventListener('input', () => {
            if (appInput.value !== "") {
                appBtn.disabled = false;
            } else {
                appBtn.disabled = true;
            }
        })

        appBtnWraper.append(appBtn);
        appForm.append(appInput);
        appForm.append(appBtnWraper);

        return {
            appForm,
            appInput,
            appBtn
        }
    }

    /*создаем список дел*/

    function createTodoList() {
        let appList = document.createElement('ul');
        appList.classList.add('list-group');
        return appList;
    }

    function createTodoItem(obj) {
        //  li - элемент
        let appListItem = document.createElement('li');
        //Кнопки в списке
        let appItemBtnGroup = document.createElement('div');
        let appItemBtnComplited = document.createElement('button');
        let appItemBtnDel = document.createElement('button');

        //задаем стили
        //выстанавливаем кнопки справа за счет флекса
        appListItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
        appListItem.textContent = obj.name;
        //стили группы кнопок
        appItemBtnGroup.classList.add('btn-group', 'btn-group-sm');
        //стили кнопки готово
        appItemBtnComplited.classList.add('btn', 'btn-outline-success', 'mr-1');
        appItemBtnComplited.textContent = 'Готово';
        //стили кнопки удалить
        appItemBtnDel.classList.add('btn', 'btn-outline-danger');
        appItemBtnDel.textContent = 'Удалить';

        if (obj.done === true) {
            appListItem.classList.add('list-group-item-success');
        }

        //Добавляем обработчик событий на кнопки
        //создаем событие нажатия на гнопку ГОТОВО
        appItemBtnComplited.addEventListener('click', () => {
            appListItem.classList.toggle('list-group-item-success');

            for (const item of listSave) {
                if (item.id == obj.id) item.done = true;
            }
            saveList(listSave, listName);
        })
        //создаем событие нажажатия на кнопку УДАЛИТЬ
        appItemBtnDel.addEventListener('click', () => {
            if (confirm('Вы действительно хотите удалить это дело из списка?')) {
                appListItem.remove();
                for (let index = 0; index < listSave.length; index += 1) {
                    if (listSave[index].id == obj.id) listSave.splice(index, 1)
                }
                saveList(listSave, listName);
            }

        })

        //вкладываем кнопки в div
        appItemBtnGroup.append(appItemBtnComplited);
        appItemBtnGroup.append(appItemBtnDel);
        //вкладываем div в li
        appListItem.append(appItemBtnGroup);
        //возвращаем результат
        return {
            appListItem,
            appItemBtnComplited,
            appItemBtnDel,
        }
    }

    function getNewId(ars) {
        let max = 0;
        for (const item of ars) {
            if (item.id > max) max = item.id
        }
        return max + 1;
    }

    function saveList(arr, keyName) {
        localStorage.setItem(keyName, JSON.stringify(arr))
    }

    function createTodoApp(container, title = 'Список дел', keyName, defArray =[]) {
        //собираем список дел      
        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList();

        listName = keyName;
        listSave = defArray;

        container.append(todoAppTitle);
        container.append(todoItemForm.appForm);
        container.append(todoList);

        let localData = localStorage.getItem(listName)

        if(localData !== null && localData !== '') listSave = JSON.parse(localData);

        for (itemList of listSave) {
            let todoItem = createTodoItem(itemList);
            todoList.append(todoItem.appListItem);
        }

        //событие создания списка
        todoItemForm.appForm.addEventListener('submit', (e) => {
            //оключение обновления браузера при нажатии на кнопку/enter
            e.preventDefault();
            //игнор создания пустой формы
            if (!todoItemForm.appInput.value) return;


            let newItem = {
                id: getNewId(listSave),
                name: todoItemForm.appInput.value,
                done: false,
            }

            //создаем и добавляем список
            let todoItem = createTodoItem(newItem);
            //Создаем и добавляем список в дело
            todoList.append(todoItem.appListItem);
            listSave.push(newItem);
            saveList(listSave, listName);

            //обнуляем значение поля и дезактивируем кнопку
            todoItemForm.appBtn.disabled = true;
            todoItemForm.appInput.value = '';
        })
    }

    window.createTodoApp = createTodoApp;

})();
