(function () {
    const Result = {
        showAnswersButtonElement: null,

        init() {
            const url = new URL(location.href);
            const score = url.searchParams.get('score');
            const total = url.searchParams.get('total');
            const id = url.searchParams.get('id');

            document.getElementById('resultScore').innerText = `${score}/${total}`;

            this.showAnswersButtonElement = document.getElementById('show');
            this.showAnswersButtonElement.onclick = () => {
                this.showMore(score, total, id);
            };
        },
        showMore(score, total, id) {
            const url = new URL(location.href);
            const name = url.searchParams.get('name');
            const lastName = url.searchParams.get('lastName');
            const email = url.searchParams.get('email');

            const chosenAnswerIds = url.searchParams.get('answers');

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://testologia.ru/pass-quiz?id=' + id, false);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.send(JSON.stringify({
                name: name,
                lastName: lastName,
                email: email,
                results: chosenAnswerIds.split(',').map(id => ({ chosenAnswerId: parseInt(id, 10) }))
            }));

            if (xhr.status === 200 && xhr.responseText) {
                let result = null;
                try {
                    result = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = 'index.html';
                }
                if (result) {
                    location.href = 'showAnswers.html?id=' + id +
                        '&score=' + result.score +
                        '&total=' + result.total +
                        '&answers=' + chosenAnswerIds +
                        '&name=' + name +
                        '&lastName=' + lastName +
                        '&email=' + email;
                }
            } else {
                location.href = 'index.html';
            }
        }
    };

    Result.init();
})();
