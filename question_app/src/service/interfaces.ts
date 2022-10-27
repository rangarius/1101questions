import Parse from "parse";

export enum AnswerType {
    "Person",
    "Place",
    "Thing",
    "Event",
    "Timespan",
    "Date"
  }
  
  export interface _AnswerType {
    answerId: string,
    answerType: AnswerType
  }

  export class QuestionClass {
    id?: string;
    title: string;
    questionText: string;
    tags: TagClass[];
    answerType: _AnswerType;
    answer?: Record<string, unknown>;
    author?: any;
    parse_Obj: Parse.Object;
    updatedAt?: Date;
    createdAt?: Date;
  
    constructor() {
      this.title = "";
      this.questionText = "";
      this.tags = [];
      this.answerType = {
        answerId: "",
        answerType: AnswerType.Person
      };
      this.parse_Obj = new Parse.Object("Question")
      this.answer = undefined;
      this.author = undefined;
      this.updatedAt = undefined;
      this.createdAt = undefined;
    }
  
    public fromParseObj(parseObj: Parse.Object) {
      this.title = parseObj.get("title");
      this.questionText = parseObj.get("questionText");
      const tags = parseObj.get("tags") as Parse.Object[]
      this.tags = tags.map((el):TagClass => {
        return new TagClass("").fromDBObj(el)
      })
      this.answerType = parseObj.get("answer");
      this.updatedAt = parseObj.updatedAt;
      this.createdAt = parseObj.createdAt;
      this.parse_Obj = parseObj;
      return this;
    }
  
    public writeToDb(): Promise<Parse.Object | undefined> {
  
      this.parse_Obj.set("title", this.title);
      this.parse_Obj.set("questionText", this.questionText);
      this.parse_Obj.set("tags", this.tags.map(el => el.parseObj));
      this.parse_Obj.set("answer", this.answer);
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