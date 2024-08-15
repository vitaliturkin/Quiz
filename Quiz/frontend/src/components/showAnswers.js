import {UrlManager} from "../utils/url-manager.js";
import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class ShowAnswers {
    constructor() {
        this.quiz = null;
        this.routeParams = UrlManager.getQueryParams();

        this.loadCorrectAnswers()

        const userInfo = Auth.getUserInfo();
        const userEmail = localStorage.getItem('userEmail');
        document.getElementById('made-by').innerHTML = `Тест выполнил <span>${userInfo.fullName}, ${userEmail}</span>`;

        this.showAnswersButtonElement = document.getElementById('show');
        this.showAnswersButtonElement.onclick = () => {
            location.href = '#/result?id=' + this.routeParams.id;
        };
    }

    async loadCorrectAnswers() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '/#/';
        }

        try {
            const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);

            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }

                this.quiz = result;
                this.showResults();
            }
        } catch (error) {
            console.log(error)
        }
    }

    showResults() {
        if (!this.quiz) {
            return;
        }

        const test = this.quiz.test || this.quiz;
        document.getElementById('pre-title').innerText = test.name;
        const questionsContainer = document.querySelector('.questions');
        questionsContainer.innerHTML = '';

        test.questions.forEach((question, index) => {
            const questionElement = document.createElement('div');
            questionElement.classList.add('question');

            const questionTitleElement = document.createElement('div');
            questionTitleElement.classList.add('question-title');
            questionTitleElement.innerHTML = `<span>Вопрос ${index + 1}:</span> ${question.question}`;
            questionElement.appendChild(questionTitleElement);

            const optionsElement = document.createElement('div');
            optionsElement.classList.add('test-question-options');

            question.answers.forEach(answer => {
                const optionElement = document.createElement('div');
                optionElement.className = 'question-option';
                const inputId = `answer-${answer.id}`;
                const inputElement = document.createElement('input');
                inputElement.className = 'test-question-option';
                inputElement.setAttribute('id', inputId);
                inputElement.setAttribute('type', 'radio');
                inputElement.setAttribute('name', `question-${question.id}`);
                inputElement.setAttribute('value', answer.id);
                inputElement.setAttribute('disabled', 'disabled');

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);


                if(answer.hasOwnProperty('correct')){
                    if(answer.correct) {
                        optionElement.classList.add('correct');
                    } else {
                        optionElement.classList.add('incorrect');
                    }
                }

                optionsElement.appendChild(optionElement);
            });

            questionElement.appendChild(optionsElement);
            questionsContainer.appendChild(questionElement);
        });
    }
}
