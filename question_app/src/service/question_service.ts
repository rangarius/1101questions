import Parse  from 'parse';



export interface Question {
    id?: string;
    title: string;
    description: string;
    topics: any[];
    answers: [];
    right_answers: [];
    parse_Obj?: Parse.Object
}

class QuestionService {
    

    constructor() {
        Parse.initialize("yourappid")
        Parse.serverURL = "http://parse:1337/parse";
        }

    getQuestions(): Promise<Question[]>{
        const query = new Parse.Query("question")
        return query.find().then(questions => {
            return questions.map(question =>{
                return this.transform_parse_to_model(question)
            })
        })
    }

    saveQuestion(question: Question): Promise<any> {
        return this.transform_model_to_parse(question).save()
    }

    transform_parse_to_model(questionP: any): Question {
        const question = {
            id: questionP.id ?? null,
            title: questionP.get("title"),
            description: questionP.get("description"),
            topics: questionP.get("topics"),
            answers: questionP.get("answers"),
            right_answers: questionP.get("right_answers"),
            parse_Obj: questionP
        }
        return question

    }

    transform_model_to_parse(question: Question): Parse.Object {
        if(!question.parse_Obj) {
            const Question = Parse.Object.extend("question");
            question.parse_Obj = new Question;
        }
        console.log(question.parse_Obj) 
        question.parse_Obj!.set("title", question.title);
        question.parse_Obj!.set("description", question.description);
        question.parse_Obj!.set("topics", question.topics);
        question.parse_Obj!.set("answers", question.answers);
        question.parse_Obj!.set("right_answers", question.right_answers);
        return question.parse_Obj!
        
    }

}

export default new QuestionService();