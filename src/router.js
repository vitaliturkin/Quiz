import {Form} from "./components/form.js";
import {Choice} from "./components/choice.js";
import {Result} from "./components/result.js";
import {ShowAnswers} from "./components/showAnswers.js";
import {Test} from "./components/test.js";

export class Router {
    constructor() {
    this.routes = [
        {
            route: '#/',
            title: 'Главная',
            template: 'templates/index.html',
            styles: 'css/index.css',
            load: () => {},
        },
        {
            route: '#/form',
            title: 'Регистрация',
            template: 'templates/form.html',
            styles: 'css/form.css',
            load: () => {
                new Form();
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
        const newRoute = this.routes.find(item=>{
            return item.route === window.location.hash.split('?')[0];
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }
        document.getElementById('content').innerHTML =
            await fetch(newRoute.template).then(response => response.text());
        document.getElementById('styles').setAttribute('href', newRoute.styles);
        document.getElementById('page-title').innerText = newRoute.title;
        newRoute.load();
    }
}