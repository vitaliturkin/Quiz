(function () {
    const ShowAnswers = {
        quiz: null,
        chosenAnswerIds: [],
        correctAnswerIds: [],

        init() {
            const urlP = new URLSearchParams(location.search);
            const score = urlP.get('score');
            const total = urlP.get('total');
            const id = urlP.get('id');
            const name = urlP.get('name');
            const lastName = urlP.get('lastName');
            const email = urlP.get('email');
            const chosenAnswerIds = urlP.get('answers');

            this.loadQuiz();
            this.loadCorrectAnswers();
            this.showResults();

            document.getElementById('made-by').innerHTML = 'Тест выполнил <span>' + name + ' ' + lastName + ', ' + email + '</span>';
            this.showAnswersButtonElement = document.getElementById('show');
            this.showAnswersButtonElement.onclick = () => {
                location.href = `result.html?id=${id}&score=${score}&total=${total}&answers=${chosenAnswerIds}&name=${name}&lastName=${lastName}&email=${email}`;
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
                    const name = url.searchParams.get('name');
                    const lastName = url.searchParams.get('lastName');
                    const email = url.searchParams.get('email');
                    document.getElementById('made-by').innerHTML = 'Тест выполнил <span>' + name + ' ' + lastName + ', ' + email + '</span>';
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
                    optionElement.className = 'question-option';
                    const inputId = 'answer-' + answer.id;
                    const inputElement = document.createElement('input');
                    inputElement.className = 'test-question-option';
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

                    const isChosen = this.chosenAnswerIds.includes(answer.id);
                    const isCorrect = this.correctAnswerIds.includes(answer.id);

                    if (isChosen) {
                        optionElement.classList.add('chosen');
                    }
                    if (isChosen && isCorrect) {
                        optionElement.classList.add('correct');
                        inputElement.classList.add('correct');
                    } else if (isChosen && !isCorrect) {
                        optionElement.classList.add('incorrect');
                        inputElement.classList.add('incorrect');
                    }

                    optionsElement.appendChild(optionElement);
                });
                questionElement.appendChild(optionsElement);
                questionsContainer.appendChild(questionElement);
            });
        },
    };

    ShowAnswers.init();
})();
