import { UrlManager } from "../utils/url-manager.js";

export class Result {
    constructor() {
        this.showAnswersButtonElement = null;

        this.routeParams = UrlManager.getQueryParams();

        const { score, total, id, name, lastName, email, chosenAnswerIds } = this.routeParams;

        // Показ результата
        document.getElementById('resultScore').innerText = `${score}/${total}`;

        this.showAnswersButtonElement = document.getElementById('show');
        this.showAnswersButtonElement.onclick = () => {
            this.showAnswers(id, score, total, chosenAnswerIds, name, lastName, email);
        };
    }

    showAnswers(id, score, total, chosenAnswerIds, name, lastName, email) {
        console.log(this.routeParams);
        location.href = `#/showAnswers?id=${id}&score=${score}&total=${total}&answers=${chosenAnswerIds}&name=${name}&lastName=${lastName}&email=${email}`;
    }
}
