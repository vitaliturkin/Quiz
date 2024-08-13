import {Form} from "./components/form.js";
import {Choice} from "./components/choice.js";
import {Result} from "./components/result.js";
import {ShowAnswers} from "./components/showAnswers.js";
import {Test} from "./components/test.js";
import {Auth} from "./services/auth.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = document.getElementById('styles');
        this.titleElement = document.getElementById('page-title');
        this.profileElement = document.getElementById('profile');
        this.profileFullNameElement = document.getElementById('profile-full-name');

    this.routes = [
        {
            route: '#/',
            title: 'Главная',
            template: 'templates/index.html',
            styles: 'css/index.css',
            load: () => {},
        },
        {
            route: '#/signup',
            title: 'Регистрация',
            template: 'templates/signup.html',
            styles: 'css/form.css',
            load: () => {
                new Form('signup');
            },
        },
        {
            route: '#/login',
            title: 'Вход в систему',
            template: 'templates/login.html',
            styles: 'css/form.css',
            load: () => {
                new Form('login');
            },
        },
        {
            route: '#/choice',
            title: 'Выбор теста',
            template: 'templates/choice.html',
            styles: 'css/choice.css',
            load: () => {
                new Choice();
            },
        },
        {
            route: '#/test',
            title: 'Прохождение теста',
            template: 'templates/test.html',
            styles: 'css/test.css',
            load: () => {
                new Test();
            },
        },
        {
            route: '#/result',
            title: 'Результат теста',
            template: 'templates/result.html',
            styles: 'css/result.css',
            load: () => {
                new Result();
            },
        },
        {
            route: '#/showAnswers',
            title: 'Ответы теста',
            template: 'templates/showAnswers.html',
            styles: 'css/showAnswers.css',
            load: () => {
                new ShowAnswers();
            },
        }
    ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/login';
            return;
        }

        const newRoute = this.routes.find(item=>{
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }
        this.contentElement.innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        this.stylesElement.setAttribute('href', newRoute.styles);
        this.titleElement.innerText = newRoute.title;

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            this.profileElement.style.display = 'flex';
            this.profileFullNameElement.innerText = userInfo.fullName;
        } else {
            this.profileElement.style.display = 'none';
        }

        newRoute.load();
    }
}