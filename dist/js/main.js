// Открытие меню по кнопке
const bodyEl = document.querySelector("body");
const sidebarBtn = document.querySelector(".header .header__btn");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");

if (sidebar) {
    sidebarBtn.addEventListener('click', () => {
        bodyEl.classList.add('sidebar-open');
    })

    overlay.addEventListener("click", function() {
        bodyEl.classList.remove('sidebar-open');
    });
}



// Проверка валидности
const validate = (type, value) => {
    if (type === 'text') {
        if (value > 18 && value < 65) {
            return true;
        }
    } else if (type === 'radio') {
        return true;
    } else if (type === 'email' || type === 'tel') {
        let reg;
        if (type === 'email') {
            reg = '^(([^<>()[\\]\\\\.,;:\\s@"]+(\\.[^<>()[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
        } else if (type === 'tel') {
            reg = '^((7|8|\\+7)[\\- ]?)?(\\(?\\d{3,5}\\)?[\\- ]?)?[\\d\\- ]{5,15}$';
        }

        if (reg) {
            return String(value)
                .toLowerCase()
                .match(new RegExp(reg));
        }
    }

    return null;
};

const form = document.querySelector("form");

if (form) {

    // Очистка placeholder при клике

    const inputsAll = form.querySelectorAll("input");

    if (inputsAll.length) {
        for (let i = 0; i < inputsAll.length; i++) {
            let inputEl = inputsAll[i];
            let placeholderInputValue = inputEl.placeholder;
            inputEl.addEventListener('click', function() {
                inputEl.placeholder = "";
            });

            document.addEventListener("click", function(event) {
                if (event.target !== inputEl) {
                    inputEl.placeholder = placeholderInputValue;
                }
            })
        }
    }


    // Показ поля "возраст" в форме
    const radioBtns = document.querySelectorAll("form input[type='radio']");

    if (radioBtns.length) {
        for(let radioBtn of radioBtns) {
            radioBtn.addEventListener('click', () => {
                if (radioBtn.id === "male") {
                    form.classList.add('male-checked');
                } else if (radioBtn.id === "female") {
                    form.classList.remove('male-checked');
                }
            });
        }
    }


    // Отправка формы
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (inputsAll.length) {

            let data = {};
            let hasError = false;

            for (let input of inputsAll) {

                if (
                    input.getAttribute("type") === "email"
                    || input.getAttribute("type") === "tel"
                    || input.getAttribute("type") === "radio"
                    || (input.getAttribute("type") === "text") && form.classList.contains('male-checked')
                ) {
                    let error;
                    const formItem = input.closest('.form__item');
                    const errorBlock = formItem.querySelector('.error-block');
                    const valueBtn = input.value;

                    if (valueBtn === "") {
                        error = 'Поле пустое';
                    } else if (validate(input.getAttribute("type"), valueBtn) === null) {
                        error = 'Неверное значение';
                    }

                    if (error) {
                        hasError = true;
                        formItem.classList.add('error');
                        errorBlock.innerHTML = error;
                        // e.preventDefault();
                    } else {
                        formItem.classList.remove('error');
                        errorBlock.innerHTML = "";

                        // Формирование данных для отправки
                        data[input.getAttribute("type")] = valueBtn;
                    }
                }
            }

            if (!hasError) {

                // определяем query-строку
                const urlSearchParams = new URLSearchParams(window.location.search);
                const params = Object.fromEntries(urlSearchParams.entries());

                // если есть query, добавляем в наши данные
                if (Object.keys(params).length !== 0) {
                    data = Object.assign(data, params);
                }

                // формируем запрос
                let xhr = new XMLHttpRequest();
                xhr.open('POST', 'test', false);
                xhr.send(JSON.stringify(data));

                // Ответ от сервера, т.к. пути нет, приходит 404, берем его за правильный
                if (xhr.status === 404) {
                    form.innerHTML = "Успешно отправлено";
                    setTimeout(function () {
                        $.fancybox.close();
                    }, 3000);
                }
            }
        }
    })
}



