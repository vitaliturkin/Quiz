import { UrlManager } from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.init();

        this.showAnswersButtonElement = document.getElementById('show');
        this.showAnswersButtonElement.onclick = () => {
            this.showAnswers();
        };

    }

    async init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
           location.href = '#/';
        }

        if (this.routeParams.id) {
            try {
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId);

                if (result) {
                    if (result.error) {
                        throw new Error(result.error);
                    }
                    document.getElementById('resultScore').innerText = result.score + '/' + result.total;
                }
            } catch (error) {
                console.log(error)
            }
        }
    }

    async showAnswers() {
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

                location.href = '#/showAnswers?id=' + this.routeParams.id;
            }
        } catch (error) {
            console.log(error)
        }
    }
}
