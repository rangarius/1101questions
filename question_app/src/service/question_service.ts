import { QuestionClass } from './interfaces';
import Parse from "parse";

class QuestionService {
  constructor() {
    Parse.initialize("yourappid");
    Parse.serverURL = "http://parse:1986/parse";
  }

  getQuestions(): Promise<QuestionClass[]> {
    const query = new Parse.Query("question");
    return query.find().then((questions:Parse.Object[]) => {
      return questions.map((question) => {
        return new QuestionClass().fromParseObj(question);
      });
    });
  }
}

export default new QuestionService();
