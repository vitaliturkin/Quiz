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
<<<<<<< HEAD
=======
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
>>>>>>> origin/master
    };

    Result.init();
})();
