(function () {
    const ShowAnswers = {
        quiz: null,
        chosenAnswerIds: [],
        correctAnswerIds: [],

        init() {
            this.loadQuiz();
            this.loadCorrectAnswers();
            this.showResults();

            this.showAnswersButtonElement = document.getElementById('show');
            this.showAnswersButtonElement.onclick = () => {
                this.goBack();
            };
        },

        loadQuiz() {
            const url = new URL(location.href);
            const testId = url.searchParams.get('id');
            const chosenAnswerIdsString = url.searchParams.get('answers');
            this.chosenAnswerIds = chosenAnswerIdsString ? chosenAnswerIdsString.split(',').map(id => parseInt(id, 10)) : [];

            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + testId, false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);
                    document.getElementById('pre-title').innerText = this.quiz.name;
                } catch (e) {
                    location.href = 'index.html';
                }
            } else {
                location.href = 'index.html';
            }
        },

        loadCorrectAnswers() {
            const url = new URL(location.href);
            const testId = url.searchParams.get('id');

            if (!testId) {
                location.href = 'index.html';
                return;
            }

            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + testId, false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.correctAnswerIds = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = 'index.html';
                }
            } else {
                location.href = 'index.html';
            }
        },

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
                    optionElement.classList.add('test-question-option');
                    optionElement.innerText = answer.answer;

                    /*
                    const inputId = 'answer-' + answer.id;
                    const inputElement = document.createElement('input');
                    inputElement.className = 'option-answer';
                    inputElement.setAttribute('id', inputId);
                    inputElement.setAttribute('type', 'radio');
                    inputElement.setAttribute('name', 'answer');
                    inputElement.setAttribute('value', answer.id);
                    inputElement.setAttribute('disabled', 'disabled');
                    inputElement.checked = this.chosenAnswerIds.includes(answer.id);

                    const labelElement = document.createElement('label');
                    labelElement.setAttribute('for', inputId);
                    labelElement.innerText = answer.answer;

                    optionElement.appendChild(inputElement);
                    optionElement.appendChild(labelElement);
                    */

                    const isChosen = this.chosenAnswerIds.includes(answer.id);
                    const isCorrect = this.correctAnswerIds.includes(answer.id);

                    if (isChosen) {
                        optionElement.classList.add('chosen');
                    }
                    if (isChosen && isCorrect) {
                        optionElement.classList.add('correct');
                    } else if (isChosen && !isCorrect) {
                        optionElement.classList.add('incorrect');
                    } else {
                        console.log("Что-то пошло не так!")
                    }

                    optionsElement.appendChild(optionElement);
                });
                questionElement.appendChild(optionsElement);
                questionsContainer.appendChild(questionElement);
            });
        },

        goBack() {
            const url = new URL(location.href);
            const id = url.searchParams.get('id');
            const name = url.searchParams.get('name');
            const lastName = url.searchParams.get('lastName');
            const email = url.searchParams.get('email');

            
            const chosenAnswerIds = this.userResult.map(result => result.chosenAnswerId).join(',');

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://testologia.ru/pass-quiz?id=' + id, false);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.send(JSON.stringify({
                name: name,
                lastName: lastName,
                email: email,
                results: this.userResult
            }));
            if (xhr.status === 200 && xhr.responseText) {
                let result = null;
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = 'index.html';
                }
                if (result) {
                    location.href = 'result.html?id=' + id + '&score=' + result.score + '&total=' + result.total + '&answers=' + chosenAnswerIds;
                }
            } else {
                location.href = 'index.html';
            }
        }
    };

    ShowAnswers.init();
})();
