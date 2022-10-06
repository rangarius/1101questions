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
    
      <div class="list_row">
        <div class="submit-form">
            <div class="form-group">
              <label for="title">Title</label>
              <input
                type="text"
                class="form-control"
                id="title"
                required
                v-model="question.title"
                name="title"
              />
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <input
                class="form-control"
                id="description"
                required
                v-model="question.description"
                name="description"
              />
            </div>

            <button @click="saveQuestion" class="btn btn-success">Submit</button>
          </div>
      <div class="list row">
        <div class="col-md-6">
          <h4>Question List</h4>
          <ul class="list-group">
            <li
              class="list-group-item"
              :class="{ active: index == currentIndex }"
              v-for="(question, index) in questions"
              :key="index"
            >
              {{ question.title }}
            </li>
          </ul>
        </div>
      </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import QuestionService from "../service/question_service";
import { Question } from "../service/question_service";

export default defineComponent({
  name: "Tab1Page",
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  data() {
    return {
      questions: [] as Question[],
      question: {
        title: "",
        description: "",
        topics: [],
        answers: [],
        right_answers: [],
      } as Question,
    };
  },
  methods: {
    saveQuestion() {
      QuestionService.saveQuestion(this.question);
    },
  },
  mounted() {
    QuestionService.getQuestions().then(questions => {
      this.questions = questions
    })
  }
});
</script>
