(function () {
    const Result = {
        showAnswersButtonElement: null,

        init() {
            const url = new URLSearchParams(location.search);
            const score = url.get('score');
            const total = url.get('total');
            const id = url.get('id');
            const name = url.get('name');
            const lastName = url.get('lastName');
            const email = url.get('email');
            const chosenAnswerIds = url.get('answers');

            document.getElementById('resultScore').innerText = `${score}/${total}`;

            this.showAnswersButtonElement = document.getElementById('show');
            this.showAnswersButtonElement.onclick = () => {
                location.href = `showAnswers.html?id=${id}&score=${score}&total=${total}&answers=${chosenAnswerIds}&name=${name}&lastName=${lastName}&email=${email}`;
            };
        },
    };

    Result.init();
})();
