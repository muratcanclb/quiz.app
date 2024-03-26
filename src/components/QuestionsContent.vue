<template>
    <div>
        <div v-if="!this.isQuizEnded">
            <BRow class="justify-content-md-center">
                <BCol cols="6" md="6">
                    <p class="display-4">{{ remainingTime }}</p>
                </BCol>
                <BCol cols="6" md="6">
                    <BButton style="margin: 1%; color:white;" disabled variant="primary">10 / {{
            currentQuestionIndex + 1 }}</BButton>
                </BCol>
            </BRow>
            <BRow>
                <BCol>
                    <BButton style="margin: 1%;" v-if="this.remainingTime > 20 && isVisible" variant="outline-warning">
                        İlk 10 saniye işlem gerçekleştirilemez.</BButton>
                </BCol>
            </BRow>
            <BRow class="justify-content-md-center">
                <BCol cols="12" md="8">
                    <BCard v-if="!loading" :title="currentQuestion.title + '  ?'">
                        <ul class="list-group border-0">
                            <li class="list-group-item border-0" v-for="(option, index) in currentQuestion.choices"
                                :key="index">
                                <BButton :disabled="btnDisabled" :class="{ selected: selectedAnswer === index }"
                                    :value="option" :key="index" @click="selectButton(index)"
                                    style="width: 100%; text-align: left;" variant="outline-dark">
                                    {{ questionOptions[index] }} {{ option }}</BButton>
                            </li>
                        </ul>
                    </BCard>
                </BCol>
            </BRow>
            <BRow>
                <BCol cols="12" md="10" v-if="this.currentQuestionIndex <= 8">
                    <BButton @click="nextQuestion()" style="margin: 1%; float: right;" pill variant="outline-success">
                        Sonraki</BButton>
                </BCol>
                <BCol cols="12" md="10" v-else>
                    <BButton @click="finishQuiz()" style="margin: 1%; float: right;" pill variant="outline-info">
                        Sınavı Bitir</BButton>
                </BCol>
            </BRow>
        </div>
        <div>
            <BRow class="justify-content-md-center" style="margin-bottom: 2%;">
                <BCol cols="12" md="8" sm="6">
                    <b-list-group horizontal style="float: right;">
                        <b-list-group-item>
                            <p style="font-size: 12px;">Doğru Cevap Sayısı</p>
                            <BButton disabled variant="outline-success">{{
            correctAnswer }}</BButton>
                        </b-list-group-item>
                        <b-list-group-item>
                            <p style="font-size: 12px;">Yanlış Cevap Sayısı</p>
                            <BButton disabled variant="outline-danger">{{ wrongAnswer
                                }}</BButton>
                        </b-list-group-item>
                        <b-list-group-item>
                            <p style="font-size: 12px;">Boş Bırakılan Cevap Sayısı</p>
                            <BButton disabled variant="outline-secondary">{{
            nullAnswer }}</BButton>
                        </b-list-group-item>

                    </b-list-group>

                </BCol>
                <BCol cols="12" md="4" sm="6">
                    <BRow>
                        <BCol cols="12" md="6" sm="4">
                            <BListGroup>
                                <BListGroupItem> Sınav Puan: <BButton disabled variant="outline-light"
                                        style="color: black; width: 30px;"> {{ score
                                        }} </BButton>
                                </BListGroupItem>
                            </BListGroup>
                        </BCol>
                    </BRow>
                </BCol>
            </BRow>
            <BRow v-for="(question, index2) in questions" :key="index2" class="justify-content-md-center">
                <BCol cols="12" md="8">
                    <BCard style="margin-bottom: 2%;">
                        <span style="float: left;">{{ index2 + 1 }} .SORU </span> <span style="text-align: center; ">{{
            question.title }} ?</span>
                        <ul class="list-group border-0">
                            <li class="list-group-item border-0" v-for="(option, index) in question.choices"
                                :key="index">
                                <div v-if="selectedAnswers[index2] != null && question.correctIndex == index">
                                    <BButton disabled variant="outline-success" style="width: 100%; text-align: left;">
                                        {{ questionOptions[index] }} {{ option }}</BButton>
                                </div>
                                <div v-else-if="selectedAnswers[index2] == index">
                                    <BButton disabled variant="outline-danger" style="width: 100%; text-align: left;">
                                        {{ questionOptions[index] }} {{ option }}</BButton>
                                </div>
                                <div v-else-if="selectedAnswers[index2] == null && question.correctIndex == index">
                                    <BButton disabled variant="outline-primary" style="width: 100%; text-align: left;">
                                        {{ questionOptions[index] }} {{ option }}</BButton>
                                </div>
                                <div v-else>
                                    <BButton disabled variant="outline-dark" style="width: 100%; text-align: left;">{{
                                        questionOptions[index] }} {{ option }}</BButton>
                                </div>
                            </li>
                        </ul>
                    </BCard>
                </BCol>
            </BRow>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

import { BRow, BCol, BButton, BCard, BListGroup, BListGroupItem } from 'bootstrap-vue'
export default {
    components: {
        BRow, BCol, BButton, BCard, BListGroup, BListGroupItem
    },
    data() {
        return {
            userId: 0,
            selectedAnswers: [],
            isClicked: false,
            questions: [],
            currentQuestionIndex: 0,
            questionOptions: ['A )', 'B )', 'C )', 'D )'],
            isQuizEnded: false,
            loading: true,
            //refreshData
            remainingTime: 30,
            btnDisabled: true,
            selectedAnswer: null,
            //resultQuizData
            correctAnswer: 0,
            wrongAnswer: 0,
            nullAnswer: 0,
            score: 0,
            //alert
            isVisible: false,
        }
    },
    created() {
        setTimeout(() => {
            this.loading = false
        }, 2000),
            this.userId = Math.floor(Math.random() * 10);
        this.fetchQuestions();
        this.startCountdown();
    },
    computed: {
        currentQuestion() {
            return this.questions[this.currentQuestionIndex];
        },
        buttonColor() {
            return this.isClicked ? 'outline-info' : 'outline-dark'; // Tıklanmışsa 'red', tıklanmamışsa 'blue'
        }
    },
    methods: {
        choicesSplit(str) {
            const choicesValue = str.split('\n');
            return choicesValue;
        },
        async fetchQuestions() {
            try {
                const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
                const filteredData = response.data.filter(question => question.userId == this.userId);
                this.questions = filteredData.map(question => ({
                    id: question.id,
                    title: question.title,
                    choices: this.choicesSplit(question.body),
                    correctIndex: Math.floor(Math.random() * 4),
                    answered: false
                }));
                this.loading = false;
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        },

        selectButton(index) {
            if (this.selectedAnswer == index) {
                this.selectedAnswer = null
            }
            else { this.selectedAnswer = index; }
        },
        nextQuestion() {
            if (this.remainingTime <= 20) {
                if (this.currentQuestionIndex <= 8) {
                    this.currentQuestionIndex += 1;
                    this.selectedAnswers.push(this.selectedAnswer)
                    //Reset prop
                    this.remainingTime = 30;
                    this.selectedAnswer = null;
                    this.btnDisabled = true;
                    this.isVisible = false;
                }
                else {
                    return false;
                }
            } else { this.isVisible = true }
        },
        finishQuiz() {
            if (this.remainingTime <= 20) {
                this.selectedAnswers.push(this.selectedAnswer)
                this.isQuizEnded = true;
                this.resultQuiz();
            }
        },
        resultQuiz() {
            this.questions.forEach((item, index) => {
                if (this.selectedAnswers[index] == null) {
                    this.nullAnswer++;
                }
                else if (item.correctIndex == this.selectedAnswers[index]) {
                    this.correctAnswer++;
                    this.score += 10;
                }
                else if (item.correctIndex != this.selectedAnswers[index]) {
                    this.wrongAnswer++;
                }

            });
        },
        startCountdown() {
            // Geri sayımı her saniye güncelleyen setInterval fonksiyonu
            this.timer = setInterval(() => {
                if (this.remainingTime <= 20) {
                    this.btnDisabled = false;
                }
                if (this.remainingTime > 0) {
                    this.remainingTime--;
                } else {

                    if (this.currentQuestionIndex <= 8 && this.remainingTime == 0) { this.nextQuestion(); }
                    if (this.currentQuestionIndex == 9 && this.remainingTime == 0) { this.finishQuiz(); clearInterval(this.timer); }

                }
            }, 1000);
        },
    },
    beforeDestroy() {
        // Timer'ı durdurma
        clearInterval(this.timer);
    }
}
</script>
<style scoped>
.selected {
    background-color: #7367F0;
    /* Seçilen butonun arka plan rengi */
    color: white;
    /* Seçilen butonun metin rengi */
}
</style>