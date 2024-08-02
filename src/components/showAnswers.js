import { UrlManager } from "../utils/url-manager.js";

export class ShowAnswers {
    constructor() {
        this.quiz = null;
        this.chosenAnswerIds = [];
        this.correctAnswerIds = [];

        this.routeParams = UrlManager.getQueryParams();
        const { score, total, id, name, lastName, email, chosenAnswerIds } = this.routeParams;

        this.loadQuiz(id, name, lastName, email);
        this.loadCorrectAnswers(id);
        this.showResults();

        document.getElementById('made-by').innerHTML = `Тест выполнил <span>${name} ${lastName}, ${email}</span>`;
        this.showAnswersButtonElement = document.getElementById('show');
        this.showAnswersButtonElement.onclick = () => {
            location.href = `#/result?id=${id}&score=${score}&total=${total}&answers=${chosenAnswerIds}&name=${name}&lastName=${lastName}&email=${email}`;
        };
    }

    loadQuiz(id, name, lastName, email) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://testologia.ru/get-quiz?id=${id}`, false);
        xhr.send();

        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.quiz = JSON.parse(xhr.responseText);
                document.getElementById('pre-title').innerText = this.quiz.name;
                document.getElementById('made-by').innerHTML = `Тест выполнил <span>${name} ${lastName}, ${email}</span>`;
                this.chosenAnswerIds = (this.routeParams.answers || "").split(',').map(id => parseInt(id, 10));
            } catch (e) {
                console.log('Не получилось получить данные из теста: ', e);
            }
        } else {
            console.log('Не получилось загрузить тест:', xhr.status, xhr.statusText);
        }
    }

    loadCorrectAnswers(id) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://testologia.ru/get-quiz-right?id=${id}`, false);
        xhr.send();

        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.correctAnswerIds = JSON.parse(xhr.responseText);
            } catch (e) {
                console.log('Не получилось получить правельные ответы:', e);
            }
        } else {
            console.log('Не получилось загрузить ответы:', xhr.status, xhr.statusText);
        }
    }

    showResults() {
        const questionsContainer = document.querySelector('.questions');
        questionsContainer.innerHTML = '';

        this.quiz.questions.forEach((question, index) => {
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
                inputElement.checked = this.chosenAnswerIds.includes(answer.id);

                const labelElement = document.createElement('label');
                labelElement.setAttribute('for', inputId);
                labelElement.innerText = answer.answer;

                optionElement.appendChild(inputElement);
                optionElement.appendChild(labelElement);

                const isChosen = this.chosenAnswerIds.includes(answer.id);
                const isCorrect = this.correctAnswerIds.includes(answer.id);

                if (isChosen) {
                    optionElement.classList.add('chosen');
                }
                if (isCorrect) {
                    optionElement.classList.add(isChosen ? 'correct' : 'correct-not-chosen');
                } else if (isChosen) {
                    optionElement.classList.add('incorrect');
                }

                optionsElement.appendChild(optionElement);
            });
            questionElement.appendChild(optionsElement);
            questionsContainer.appendChild(questionElement);
        });
    }
}
