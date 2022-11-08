import { QuestionClass, AnswerClass, TagClass, AnswerType } from './interfaces';
import Parse from "parse";
import { reactive } from "vue"



export default reactive({
  
    

    questions: new Array<QuestionClass>(),
    answers: new Array<AnswerClass>(),
    tags: new Array<TagClass>(),

    //Questions

    bootstrap() {
        Parse.initialize("yourappid");
        Parse.serverURL = "http://parse:1986/parse";
    
    const _questionQuery = new Parse.Query("Question")
    _questionQuery.find().then(res => {
        if (res.length > 0) {
            for (const result of res) {
                this.questions.push(new QuestionClass().fromParseObj(result))
            }
        }
    }, error => {
        throw("Error fetich initial Questions")
    })
    _questionQuery.subscribe().then(subscription=> {
        
        subscription.on("open", () => {
            console.log("Question Subscription open")
        })

        subscription.on("enter", object => {
            this.questions.push(new QuestionClass().fromParseObj(object))
        } )

        subscription.on("create", object => {
            this.questions.push(new QuestionClass().fromParseObj(object))
        } )

        subscription.on("update", object => {
            const index = this.questions.findIndex(el => el.id == object.id)
            if (index) {
                this.questions[index] = new QuestionClass().fromParseObj(object)
            }
        } )

        subscription.on("delete", object => {
            const index = this.questions.findIndex(el => el.id == object.id)
            if (index) {
                this.questions.splice(index, 1);
            }
        } )

        subscription.on("leave", object => {
            const index = this.questions.findIndex(el => el.id == object.id)
            if (index) {
                this.questions.splice(index, 1);
            }
        } )

        subscription.on("close", () => {
            throw("question Subscription closed")
        })

    })

    const _answerQuery = new Parse.Query("Answer")
    _answerQuery.subscribe().then(subscription=> {
        
        subscription.on("open", () => {
            console.log("Answer Subscription open")
        })

        subscription.on("enter", async object => {
            const answer = await new AnswerClass().fromParseObj(object)
            this.answers.push(answer)
        } )

        subscription.on("create", async object => {
            const answer = await new AnswerClass().fromParseObj(object)
            this.answers.push(answer)
        } )

        subscription.on("update", async object => {
            const index = this.answers.findIndex(el => el.id == object.id)
            if (index) {
                const answer = await new AnswerClass().fromParseObj(object)
                this.answers[index] = answer
            }
        } )

        subscription.on("delete", object => {
            const index = this.answers.findIndex(el => el.id == object.id)
            if (index) {
                this.answers.splice(index, 1);
            }
        } )

        subscription.on("leave", object => {
            const index = this.answers.findIndex(el => el.id == object.id)
            if (index) {
                this.answers.splice(index, 1);
            }
        } )

        subscription.on("close", () => {
            throw("answer Subscription closed")
        })

    })

    const _tagQuery = new Parse.Query("tag")
    _tagQuery.subscribe().then(subscription=> {
        
        subscription.on("open", () => {
            console.log("tag Subscription open")
        })

        subscription.on("enter", object => {
            this.tags.push(new TagClass(object.get("text"), object.id))
        } )

        subscription.on("create", object => {
            this.tags.push(new TagClass(object.get("text"), object.id))
        } )

        subscription.on("update", object => {
            const index = this.tags.findIndex(el => el.id == object.id)
            if (index) {
                this.tags[index] = new TagClass(object.get("text"), object.id)
            }
        } )

        subscription.on("delete", object => {
            const index = this.tags.findIndex(el => el.id == object.id)
            if (index) {
                this.tags.splice(index, 1);
            }
        } )

        subscription.on("leave", object => {
            const index = this.tags.findIndex(el => el.id == object.id)
            if (index) {
                this.tags.splice(index, 1);
            }
        } )

        subscription.on("close", () => {
            throw("tag Subscription closed")
        })

    })



    },

    removeQuestion(id: string) {
        const index = this.questions.findIndex(el => el.id == id)
        if(!index) {
            throw("Nothing to delete")
        }
        return this.questions[index].parse_Obj.destroy()
    },

    filterAnswers(srcString: string, answerType?: AnswerType | string): AnswerClass[] {
        const string_filter = this.answers.filter(el => el.text.toLowerCase().includes(srcString));
        
        if(answerType) {
            return string_filter.filter(el => el.answerType == answerType)
        }
        return string_filter
        
    }
})

