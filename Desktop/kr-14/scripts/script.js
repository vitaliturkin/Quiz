let fullName = document.getElementById('name');
let username = document.getElementById('uname');
let agree = document.getElementById('agree');
let email = document.getElementById('email');
let password = document.getElementById('pass');
let rePassword = document.getElementById('repass');
let signUp = document.getElementById('sign-up');
let loginLink = document.getElementById('login');
let popup = document.getElementById('popup');

// Регулярные выражения для валидации
const namePattern = /^[а-яёА-ЯЁA-Za-z\s]+$/;
const usernamePattern = /^[а-яёА-ЯЁA-Za-z0-9_-]+$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;

window.onload = function () {

    // Сброс данных при обновлении страницы всегда
    fullName.value = '';
    username.value = '';
    email.value = '';
    password.value = '';
    rePassword.value = '';
    agree.checked = false;

    // При нажатии на кнопку “Sign Up”
    signUp.onclick = function () {
        let isValid = true;

        // валидация Full Name
        if (!fullName.value) {
            setError(fullName, 'Заполните поле Full Name');
            isValid = false;
        } else if (!namePattern.test(fullName.value)) {
            setError(fullName, 'Full Name может содержать только буквы и пробел');
            isValid = false;
        } else {
            clearError(fullName);
        }

        //валидация Username
        if (!username.value) {
            setError(username, 'Заполните поле Username');
            isValid = false;
        } else if (!usernamePattern.test(username.value)) {
            setError(username, 'Username может содержать только буквы, цифры, символ подчеркивания и тире');
            isValid = false;
        } else {
            clearError(username);
        }

        //валидация Email
        if (!email.value) {
            setError(email, 'Заполните поле E-mail');
            isValid = false;
        } else if (!emailPattern.test(email.value)) {
            setError(email, 'Введите корректный E-mail');
            isValid = false;
        } else {
            clearError(email);
        }

        // валидация Password
        if (!password.value) {
            setError(password, 'Заполните поле Password');
            isValid = false;
        } else if (!passwordPattern.test(password.value)) {
            setError(password, 'Пароль должен содержать минимум 8 символов, включая хотя бы одну букву в верхнем регистре, одну цифру и один спецсимвол');
            isValid = false;
        } else {
            clearError(password);
        }

        //валидация Repeat Password
        if (!rePassword.value) {
            setError(rePassword, 'Повторите пароль');
            isValid = false;
        } else if (password.value !== rePassword.value) {
            setError(rePassword, 'Пароли не совпадают');
            isValid = false;
        } else {
            clearError(rePassword);
        }

        // валидация Agree
        if (!agree.checked) {
            setError(agree, 'Вы должны согласиться с условиями');
            isValid = false;
        } else {
            clearError(agree);
        }

        if (isValid) {
            // сохранить данные
            let clients = JSON.parse(localStorage.getItem('clients')) || [];
            clients.push({
                fullName: fullName.value,
                username: username.value,
                email: email.value,
                password: password.value
            });
            localStorage.setItem('clients', JSON.stringify(clients));

            // popup
            showPopup();
        }
    }

    loginLink.onclick = function (e) {
        e.preventDefault();
        simulateLoginPage();
    }

    function simulateLoginPage() {
        username.value = '';
        password.value = '';

        // Меняет текст
        document.getElementById('main__title').innerText = 'Log in to the system';
        signUp.innerText = 'Sign In';
        loginLink.innerText = 'Registration';

        // Удаляет лишние элементы
        document.querySelector('label[for="name"]').remove();
        fullName.remove();
        document.querySelector('label[for="email"]').remove();
        email.remove();
        document.querySelector('label[for="repass"]').remove();
        rePassword.remove();
        document.getElementById('main__agree').remove();

        // Обновить слушатель для ссылки "Registration"
        loginLink.onclick = function (e) {
            e.preventDefault();
            location.reload();
        };

        // Проверка
        signUp.onclick = function () {
            let isValid = true;

            // валидация Username
            if (!username.value) {
                setError(username, 'Заполните поле Username');
                isValid = false;
            } else {
                clearError(username);
            }

            // валидация Password
            if (!password.value) {
                setError(password, 'Заполните поле Password');
                isValid = false;
            } else {
                clearError(password);
            }

            if (isValid) {
                let clients = JSON.parse(localStorage.getItem('clients')) || [];
                let user = clients.find(client => client.username === username.value);

                if (!user) {
                    setError(username, 'Такой пользователь не зарегистрирован');
                } else if (user.password !== password.value) {
                    setError(password, 'Неверный пароль');
                } else {
                    // Симуляция успешного входа
                    document.getElementById('main__title').innerText = `Welcome, ${user.fullName}!`;
                    signUp.innerText = 'Exit';

                    // Удалить ненужные элементы
                    document.querySelector('.main__info-text').remove();
                    document.querySelector('label[for="uname"]').remove();
                    document.querySelector('label[for="pass"]').remove();
                    username.remove();
                    password.remove();
                    loginLink.remove();

                    // Обновить слушатель для кнопки "Exit"
                    signUp.onclick = function () {
                        location.reload();
                    };
                }
            }
        };
    }

    function showPopup() {
        popup.style.display = 'block';

        document.getElementById('popup__btn').addEventListener('click', function () {
            popup.style.display = 'none';
            simulateLoginPage();
        });
    }

    function setError(element, message) {
        element.classList.add('error');
        element.style.borderColor = '#DD3142';
        let errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerText = message;
        if (!element.nextElementSibling || !element.nextElementSibling.classList.contains('error-message')) {
            element.parentNode.insertBefore(errorElement, element.nextSibling);
        }
    }

    function clearError(element) {
        element.classList.remove('error');
        element.style.borderColor = '';
        if (element.nextElementSibling && element.nextElementSibling.classList.contains('error-message')) {
            element.nextElementSibling.remove();
        }
    }
}
