import Parse from "parse";

export interface Error {
  code: string,
  message: string
}

export enum DateTimeFormat {
  "minute",
  "hour",
  "day",
  "month",
  "year",
  "epoch"
}

export enum AnswerType {
    "Person",
    "Place",
    "Thing",
    "Event",
    "Timespan",
    "Date"
  }
  

  export class AnswerClass {
    id?: string;
    text: string;
    questions: QuestionClass[];
    tags: TagClass[];
    parseObj: Parse.Object;
    answerType: AnswerType | "Person" | "Thing" | "Event" | "Timespan" | "Date";
    // TODO: Implement Author
    author: any;

    constructor() {
      this.text = ""
      this.id = "";
      this.questions = [];
      this.tags = [];
      this.parseObj = Parse.Object.extend("Answer");
      this.author = ""
      this.answerType = AnswerType.Person

    }

    public fromParseObj(parseObj: Parse.Object): Promise<AnswerClass> {
      return parseObj.fetchWithInclude(["questions", "tags"]).then(obj => {
        this.text = obj.get("text");
        this.id = obj.id;
        this.answerType = AnswerType[obj.get("answerType") as keyof typeof AnswerType]
        for (const questionObj of obj.get("questions") as Parse.Object[]) {
          this.questions.push( new QuestionClass().fromParseObj(questionObj));
        }
        for (const tagObj of obj.get("tags") as Parse.Object[]) {
          this.tags.push( new TagClass(tagObj.get("text"), tagObj.id));
        }
        return this
      })
    }

    public saveToDB(): Promise<Parse.Object> {
        this.parseObj.set("text", this.text);
        this.parseObj.set("tags", this.tags.map(el => el.parseObj));
        this.parseObj.set("questions", this.questions.map(el => el.parse_Obj));

        this.parseObj.set("answerType", this.answerType.toString())
  
        return this.parseObj.save().then((answer) => {
          return answer
        }, error => {
          return error
        })
    }

  }

  export class QuestionClass {
    id?: string;
    title: string;
    questionText: string;
    tags: TagClass[];
    answer: AnswerClass;
    relatedAnswers: AnswerClass[];
    author?: any;
    parse_Obj: Parse.Object;
    updatedAt?: Date;
    createdAt?: Date;
  
    constructor() {
      this.title = "";
      this.questionText = "";
      this.tags = [];
      this.parse_Obj = new Parse.Object("Question")
      this.answer = new AnswerClass();
      this.relatedAnswers = [];
      this.author = undefined;
      this.updatedAt = undefined;
      this.createdAt = undefined;
    }
  

    public fromParseObj(parseObj: Parse.Object) {
      this.title = parseObj.get("title");
      this.questionText = parseObj.get("questionText");
      if(parseObj.get("tags")) {
        const tags = parseObj.get("tags")
        if(tags.length > 0) {
          this.tags = tags.map((el:Parse.Object) => {
            return new TagClass("").fromDBObj(el)
          })
        }
      }


      this.answer.fromParseObj(parseObj.get("answer")).then(answer => {
        this.answer = answer
      });

      this.updatedAt = parseObj.updatedAt;
      this.createdAt = parseObj.createdAt;
      this.parse_Obj = parseObj;
      return this;
    }
  
    public writeToDb(): Promise<Parse.Object | undefined> {
  
      this.parse_Obj.set("title", this.title);
      this.parse_Obj.set("questionText", this.questionText);
      this.parse_Obj.set("tags", this.tags.map(el => el.parseObj));
      if(this.answer) {
        console.log("THIS ANSER:", this.answer)
        this.answer.parseObj.set("questions", [this.parse_Obj])
        this.answer.saveToDB().then((answer) =>
        this.parse_Obj.set("answer", answer) )
      }

      //TODO: Rework for Current User
      this.parse_Obj.set("author", null);
      return this.parse_Obj.save();
    }
  
    public removeFromDb(): Promise<Parse.Object> {
      if (this.parse_Obj) {
        return this.parse_Obj.destroy();
      }
  
      return Promise.reject("Nothing to remove from DB");
    }
  }

  export class TagClass {
    id?: string
    text: string
    parseObj: Parse.Object

    constructor(text: string, id?: string) {
        this.id = id;
        this.text = text;
        this.parseObj = new Parse.Object("Tag")
    }

    fromDBObj(parseObj: Parse.Object): TagClass {
        this.id = parseObj.id;
        this.text = parseObj.get("text");
        this.parseObj = parseObj;
        return this
    }

    toDb(): Promise<any> {
        this.parseObj.set("text", this.text)
        //TODO: Rework to better return value
        return this.parseObj.save()
    }
}