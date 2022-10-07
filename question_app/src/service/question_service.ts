import Parse from "parse";

export interface Question {
  id?: string;
  title: string;
  description: string;
  topics: any[];
  answers: [];
  right_answers: [];
  parse_Obj?: Parse.Object;
}

export class QuestionClass implements Question {
  id?: string;
  title: string;
  description: string;
  topics: any[];
  answers: [];
  right_answers: [];
  parse_Obj?: Parse.Object;
  updatedAt?: Date;
  createdAt?: Date;

  constructor() {
    this.title = "";
    this.description = "";
    this.topics = [];
    this.answers = [];
    this.right_answers = [];
    this.updatedAt = undefined;
    this.createdAt = undefined;
  }

  public fromParseObj(parseObj: Parse.Object) {
    this.title = parseObj.get("title");
    this.description = parseObj.get("description");
    this.topics = parseObj.get("topics");
    this.answers = parseObj.get("answers");
    this.right_answers = parseObj.get("right_answers");
    this.updatedAt = parseObj.updatedAt;
    this.createdAt = parseObj.createdAt;
    this.parse_Obj = parseObj;
    return this;
  }

  public writeToDb(): Promise<Parse.Object> | undefined {
    if (!this.parse_Obj) {
      const Question = Parse.Object.extend("question");
      this.parse_Obj = new Question();
    }

    this.parse_Obj!.set("title", this.title);
    this.parse_Obj!.set("description", this.description);
    this.parse_Obj!.set("topics", this.topics);
    this.parse_Obj!.set("answers", this.answers);
    this.parse_Obj!.set("right_answers", this.right_answers);
    return this.parse_Obj?.save();
  }

  public removeFromDb(): Promise<Parse.Object> {
    if (this.parse_Obj) {
      return this.parse_Obj.destroy();
    }

    return Promise.reject("Nothing to remove from DB");
  }
}

class QuestionService {
  constructor() {
    Parse.initialize("yourappid");
    Parse.serverURL = "http://parse:1337/parse";
  }

  getQuestions(): Promise<Question[]> {
    const query = new Parse.Query("question");
    return query.find().then((questions:any) => {
      return questions.map((question:any) => {
        return new QuestionClass().fromParseObj(question);
      });
    });
  }
}

export default new QuestionService();
