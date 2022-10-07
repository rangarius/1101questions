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
              <ion-item
                class="list-group-item"
                
                v-for="(question, index) in questions"
                :key="index"
              >
              <ion-label class="ion-text-wrap">
                <p class="small"> {{formatDate(question.createdAt)}} </p>
                <h3> {{ question.title }} </h3>
                <p> {{question.description}} </p>
              </ion-label>
              <ion-button color="danger" slot="end" @click="removeQuestion(question)">
                <ion-icon slot="icon-only" :name="trashBin"></ion-icon>
              </ion-button>
              </ion-item>
            </ion-list>
          </ion-col>
          <ion-col>
            <div class="submit-form">
              <ion-list>
              <ion-item counter="true">
                <ion-label position="floating"> Fragetitel </ion-label>
                <ion-input
                  maxlength=50
                  type="text"
                  class="form-control"
                  id="title"
                  required
                  v-model="question.title"
                  name="title"
                />
              </ion-item>

              <ion-item>
                <ion-label position="floating"> Fragetext </ion-label>
                <ion-textarea
                  class="form-control"
                  id="description"
                  required
                  v-model="question.description"
                  name="description"
                ></ion-textarea>
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
  IonIcon
} from "@ionic/vue";
import QuestionService from "../service/question_service";
import { Question, QuestionClass } from "../service/question_service";
import dayjs from "dayjs";

export default defineComponent({
  name: "Tab1Page",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonList, IonListHeader, IonButton, IonGrid, IonRow, IonCol, IonTextarea, IonInput,IonItem, IonLabel, IonIcon},
  data() {
    return {
      questions: [] as Question[],
      question: new QuestionClass()
    };
  },
  setup() {
    return {
      trashBin
    }
  },
  methods: {
    saveQuestion(question: QuestionClass) {
      if(!question) {
        throw("Nothing to save")
      }
      question.writeToDb()!.then(() => {
        this.questions.push(this.question)
        this.question = new QuestionClass()
      }, error => {
        alert(error)
      });
      
    },
    refreshQuestions() {
      QuestionService.getQuestions().then((questions) => {
        this.questions = questions;
      });
    },
    removeQuestion(question: QuestionClass) {
      if(!question) {
        throw("Nothing to remove")
      }
      question.removeFromDb().then(() => {
        this.questions.filter((item, index) => {
          if(item === question) {
            this.questions.splice(index, 1)
          }
        })
      }, error => {
        alert("Error")
      })
    },
    formatDate(dateString: Date) {
      const date = dayjs(dateString)
      return date.format("DD.MM.YYYY - HH:mm")
    }
  },
  mounted() {
    this.refreshQuestions()
  },
});
</script>
