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
                  <p class="small"> {{ question.createdAt?.toDateString }} </p>
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
                <ion-segment value="buttons" v-on:ion-change="changeAnswerType($event.detail)">
                  <ion-segment-button value="Person">
                    <ion-label>Person</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="segment">
                    <ion-label>Segment</ion-label>
                  </ion-segment-button>
                  <ion-segment-button value="buttons">
                    <ion-label>Button</ion-label>
                  </ion-segment-button>
                </ion-segment>
                <ion-item>

                </ion-item>
                <ion-button position="center" @click="saveQuestion(question)">
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
import { trashBin } from 'ionicons/icons';
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
  IonSegment,
  IonSegmentButton,
SegmentChangeEventDetail
} from "@ionic/vue";
import QuestionService from "../service/question_service";
import { QuestionClass, AnswerType, AnswerType_Person, AnswerType_Class } from "../service/interfaces";
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
    IonSegment,
    IonSegmentButton
   },
  data() {
    return {
      questions: [] as QuestionClass[],
      question: new QuestionClass(),
      buttons: "default",
      answer: new AnswerType_Class()
    };
  },
  setup() {
    return {
      trashBin
    }
  },
  methods: {
    saveQuestion(question: QuestionClass) {
      if (!question) {
        throw ("Nothing to save")
      }
      question.writeToDb().then(() => {
        this.questions.push(this.question)
        this.question = new QuestionClass()
      }, error => {
        alert(error)
      });

    },
    changeAnswerType(event: SegmentChangeEventDetail) {
      if(event.value) {
        this.answer = new AnswerType_Class().createAnswerType(event.value)
        console.log("Buttons is: ", this.buttons)
        console.log(this.answer)
        this.question.answer = this.answer
      }
     
    },
    refreshQuestions() {
      QuestionService.getQuestions().then((questions) => {
        this.questions = questions;
      });
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
    this.refreshQuestions()
    this.question.withAnswerType(AnswerType.Person);
    this.answer = new AnswerType_Class().createAnswerType("Person")
  },
});
</script>
