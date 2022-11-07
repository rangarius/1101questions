<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-grid>
        <ion-row>
          <ion-col>
            <ion-list>
              <ion-list-header>
                <h4>Question List</h4>
              </ion-list-header>
              <ion-item class="list-group-item" v-for="(question, index) in questions" :key="index">
                <ion-label class="ion-text-wrap">
                  <p class="small"> {{ question.createdAt?.toDateString() }} </p>
                  <h3> {{ question.title }} </h3>
                  <p> {{ question.questionText }} </p>
                </ion-label>
                <ion-button slot="end" color="none" @click="removeQuestion(question)">
                  <ion-icon color="danger" slot="icon-only" :icon="trashBin"></ion-icon>
                </ion-button>
              </ion-item>
            </ion-list>
          </ion-col>
          <ion-col>
            <div class="submit-form">
              <ion-list>
                <ion-list-header>
                  <ion-label> Die Frage </ion-label>
                </ion-list-header>
                <ion-item counter="true">
                  <ion-label position="floating"> Fragetitel </ion-label>
                  <ion-input type="text" maxlength=50 class="form-control" id="title" required v-model="question.title"
                    name="title" />
                </ion-item>

                <ion-item>
                  <ion-label position="floating"> Fragetext </ion-label>
                  <ion-textarea class="form-control" id="description" required v-model="question.questionText"
                    name="description"></ion-textarea>
                </ion-item>

              </ion-list>
              <ion-list class="ion-margin-top">
                <ion-list-header>
                  <ion-label> Die richtige Antwort </ion-label>
                </ion-list-header>
                <ion-item>
                  <ion-label> Antwort-Art: </ion-label>
                  <ion-radio-group v-model="answer.answerType">
                    <ion-chip v-for="type in answer_types" v-bind:key="type[0]">

                      <ion-radio :value="type[1]"></ion-radio>
                      <ion-label class="ion-padding-start">{{ type[1] }}</ion-label>

                    </ion-chip>
                  </ion-radio-group>



                </ion-item>

                <ion-item>
                  <ion-label position="floating"> Antwort </ion-label>
                  <ion-textarea class="form-control" id="description" required v-model="answer.text" name="description">
                  </ion-textarea>
                </ion-item>
              </ion-list>

              <ion-list class="ion-margin-top">
                <ion-header>
                  <ion-label> Falsche Antworten </ion-label>
                </ion-header>
                <ion-item v-for="wAnswer in wrongAnswers" v-bind:key="wAnswer.id">
                  <ion-item>
                  <ion-label> Antwort-Art: </ion-label>
                  <ion-radio-group v-model="wAnswer.answerType">
                    <ion-chip v-for="type in answer_types" v-bind:key="type[0]">

                      <ion-radio :value="type[1]"></ion-radio>
                      <ion-label class="ion-padding-start">{{ type[1] }}</ion-label>

                    </ion-chip>
                  </ion-radio-group>



                </ion-item>

                <ion-item>
                  <ion-label position="floating"> Antwort </ion-label>
                  <ion-textarea class="form-control" id="description" required v-model="wAnswer.text" name="description">
                  </ion-textarea>
                </ion-item>
                </ion-item>
                <ion-item>
                  <ion-button @click="addWrongAnswer()">
                    <ion-icon :icon="add" ></ion-icon>
                  </ion-button>
                </ion-item>
              </ion-list>

              <ion-list>
                <ion-button position="center" @click="saveQuestion(question, answer, wrongAnswers)">
                  Submit
                </ion-button>
              </ion-list>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { trashBin, add } from 'ionicons/icons';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonListHeader,
  IonList,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonTextarea,
  IonInput,
  IonItem,
  IonLabel,
  IonIcon,
  IonRadio,
  IonRadioGroup,
  IonChip,
} from "@ionic/vue";
import stateProvider from "@/service/stateProvider";
import { QuestionClass, AnswerType, AnswerClass } from "../service/interfaces";
import dayjs from "dayjs";

export default defineComponent({
  name: "Tab1Page",
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonList,
    IonListHeader,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonTextarea,
    IonInput,
    IonItem,
    IonLabel,
    IonIcon,
    IonRadio,
    IonRadioGroup,
    IonChip,
  },
  data() {
    return {
      questions: [] as QuestionClass[],
      question: new QuestionClass(),
      answer: new AnswerClass(),
      answer_types: Object.entries(AnswerClass),
      wrongAnswers: [] as AnswerClass[]

    };
  },
  setup() {
    return {
      trashBin,
      add,
      AnswerType
    }
  },
  methods: {
    saveQuestion(question: QuestionClass, answer?: AnswerClass, wrongAnswers?: AnswerClass[]) {
      if (!question) {
        throw ("Nothing to save")
      }
      if(answer) {
        question.answer = answer
      }
      
      question.relatedAnswers = this.wrongAnswers;
      console.log("Question is: ", question)
      question.writeToDb().then(() => {
        this.questions.push(this.question)
        this.question = new QuestionClass()
      }, error => {
        alert(error)
      });

    },
    addWrongAnswer() {
      console.log("Adding wrong Answer")
      this.wrongAnswers.push(new AnswerClass())
      console.log(this.wrongAnswers)
    },
    removeQuestion(question: QuestionClass) {
      if (!question) {
        throw ("Nothing to remove")
      }
      question.removeFromDb().then(() => {
        this.questions.filter((item, index) => {
          if (item === question) {
            this.questions.splice(index, 1)
          }
        })
      }, error => {
        alert(error)
      })
    },
    formatDate(dateString: Date) {
      const date = dayjs(dateString)
      return date.format("DD.MM.YYYY - HH:mm")
    }
  },
  mounted() {
    this.questions = stateProvider.questions
    console.log(AnswerType)
    this.answer_types = Object.entries(AnswerType).filter(el => parseInt(el[0]))

  },
});
</script>
