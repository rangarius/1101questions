const ClassesInUse = [
    "_User",
    "_Session",
    "_Role",
    "Answer",
    "Question",
    "Tag"
]

Parse.Cloud.job("seedDataBase", (request) =>  {
    // params: passed in the job call
    // headers: from the request that triggered the job
    // log: the ParseServer logger passed in the request
    // message: a function to update the status message of the job object

    const { params, headers, log, message } = request;
    
    return setup_db_classes(request);
  });



  async function setup_db_classes(request) {
      await purgeUnusedClasses(request)
      await setup_tags_schema(request)
      await setup_question_schema(request)
      await setup_answer_schema(request)
      await setup_answer_types_schema(request)
      await setup_designation_schema(request)
  }

  async function purgeUnusedClasses(request) {
    Parse.Schema.all().then(async classes => {
        for(let el of classes) {
            if (!ClassesInUse.includes(el.className)) {
                request.log.error(el)
                const classSchema = new Parse.Schema(el.className)
                await classSchema.purge()
                await classSchema.delete()
            }
        }
    })
    return true
  }

  async function setup_tags_schema(request) {
    const tagSchema = new Parse.Schema("Tag")
    tagSchema.addString("text", {
        required: true,
        default: ""
    })

    tagSchema.get().then(() => {
        request.message("Updated Schema")
        return tagSchema.update()
    }, () => {
        request.message("Added Schema")
        return tagSchema.save()
    })
  }

  async function setup_question_schema(request) {
    const questionSchema = new Parse.Schema("Question")
    questionSchema.addString("title", {
        required: true,
        default: ""
    })
    questionSchema.addString("questionText", {
        required: true,
        default: ""
    })
    questionSchema.addArray("tags")
    questionSchema.addPointer("answer", "Answer", {
        required: true,
        default: null
    })
    questionSchema.addCollection("relatedQuestions", "Question")

    questionSchema.addPointer("author", "_User", {
        required: false
    })

  questionSchema.get().then(() => {
    request.message("Updated Schema");
    return questionSchema.update();
  }, () => {
    request.message("Added Schema");
    return questionSchema.save();
  });
}

  async function setup_answer_schema(request) {
    const answerSchema = new Parse.Schema("Answer")
    answerSchema.addString("text", {
        required: true,
        default: ""
    })
    answerSchema.addString("answerType", {
        required: true,
        default: ""
    })

    answerSchema.addPointer("author", "_User");

    answerSchema.addCollection("questions", "Question");

    answerSchema.get().then(() => {
        request.message("Updated Schema")
        return answerSchema.update()
    }, () => {
        request.message("Added Schema")
        return answerSchema.save()
    })
  }

  