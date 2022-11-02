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
  

  export class AnswerType_Class<Type> {
    parseObj: Parse.Object;
    class_type?: "Person" | "Place" | "Thing" | "Event" | "Timespan" | "Date";


    constructor() {
      this.parseObj = Parse.Object.extend("")
      
    }

    createAnswerType(type: string): AnswerType_Class<Type>{
      if(type === "Person") {
        this.class_type = "Person";
        return new AnswerType_Person()
      }
      return new AnswerType_Class()
    }

    async fromParseObj<Type>(parseObj: Parse.Object): Promise<AnswerType_Class<Type>> {
      return new AnswerType_Class<any>()
    }

    saveToDB(): Promise<Parse.Object> {
      return this.parseObj.save()
    }
  }

  export class AnswerType_Person extends AnswerType_Class<AnswerType_Person> {
    id?: string;
    name: string;
    fictional: boolean;
    description: string;
    designation: string[];
    questions: QuestionClass[];
    timeFrom?: string;
    timeTo?: string;
    dateTimeFormat?: DateTimeFormat
    tags: TagClass[];
    parseObj: Parse.Object;

    constructor() {
      super()
      this.name = "";
      this.designation = [];
      this.fictional= false;
      this.description ="";
      this.id = "";
      this.timeFrom = ""
      this.timeTo = "";
      this.dateTimeFormat = DateTimeFormat.epoch;
      this.questions = [];
      this.tags = [];
      this.class_type = "Person"
      this.parseObj = Parse.Object.extend("Person")
    }

    public fromParseObj(parseObj: Parse.Object): Promise<AnswerType_Person> {
      return parseObj.fetchWithInclude(["questions", "designation", "tags"]).then(parseObj => {
        this.name = parseObj.get("name");
        this.fictional= parseObj.get("fictonal");
        this.designation = parseObj.get("designation");
        this.id = parseObj.id;
        this.timeFrom = parseObj.get("timeFrom")
        this.timeTo = parseObj.get("timeTo");
        this.dateTimeFormat = parseObj.get("format");
        parseObj.get("tags").forEach((tag: Parse.Object) => {
          this.tags.push(new TagClass(tag.get("text"), tag.id));
        });
        this.parseObj = parseObj;
        parseObj.get("questions").forEach((question: Parse.Object) => {
          this.questions.push(new QuestionClass().fromParseObj(question))
        });
        return this
      })

    }

    public saveToDB(): Promise<Parse.Object> {
        this.parseObj.set("name", this.name);
        this.parseObj.set("fictional", this.fictional);
        this.parseObj.set("timeFrom", this.timeFrom);
        this.parseObj.set("timeTo", this.timeTo);
        this.parseObj.set("format", this.dateTimeFormat);
        this.parseObj.set("tags", this.tags.map(el => el.parseObj));
        this.parseObj.set("questions", this.questions.map(el => el.parse_Obj));
  
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
    answerType: AnswerType;
    answers: AnswerType_Class<any>[];
    author?: any;
    parse_Obj: Parse.Object;
    updatedAt?: Date;
    createdAt?: Date;
  
    constructor() {
      this.title = "";
      this.questionText = "";
      this.tags = [];
      this.answerType = AnswerType.Person
      this.parse_Obj = new Parse.Object("Question")
      this.answers = [];
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
      this.answerType = parseObj.get("answers");
      this.updatedAt = parseObj.updatedAt;
      this.createdAt = parseObj.createdAt;
      this.parse_Obj = parseObj;
      const query = new Parse.Query(this.answerType.toString())
      query.equalTo("question", this.id).find().then(res => {
        for(const answer_obj of res) {
          new AnswerType_Class<AnswerType.Person>().createAnswerType(AnswerType.Person.toString()).fromParseObj(answer_obj).then(res => {
            this.answers.push(res)
          });
        }

      })
      return this;
    }
  
    public writeToDb(): Promise<Parse.Object | undefined> {
  
      this.parse_Obj.set("title", this.title);
      this.parse_Obj.set("questionText", this.questionText);
      this.parse_Obj.set("tags", this.tags.map(el => el.parseObj));
      this.parse_Obj.set("answerType", this.answerType)
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

    public withAnswerType(answerType: AnswerType) {
      this.answerType = answerType;      
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