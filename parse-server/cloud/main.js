const ClassesInUse = [
    "_User",
    "_Session",
    "_Role",
    "Question",
    "Person",
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
      await setup_answer_types_person_schema(request)
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
    questionSchema.addString("answerType", {
        required: true,
        default: "Person"
    })

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



  async function setup_answer_types_person_schema(request) {
    const answerTypePerson = new Parse.Schema("Person");
    answerTypePerson.addString("name", {
        required: true,
        default: ""
    })
    answerTypePerson.addString("description", {
        required: false,
        default: ""
    })
    answerTypePerson.addArray("designation")
    answerTypePerson.addBoolean("fictional", {
        required: true,
        default: false
    })
    answerTypePerson.addArray("questions")
    answerTypePerson.addArray("tags")
    answerTypePerson.addDate("timeFrom")
    answerTypePerson.addDate("timeTo")
    answerTypePerson.addString("dateFormat")
    answerTypePerson.get().then(() => {
        request.message("Updated Schema")
        return answerTypePerson.update()
    }, () => {
        request.message("Added Schema")
        return answerTypePerson.save()
    })
  }

  async function setup_designation_schema(request) {
    const designationSchema = new Parse.Schema("Designation")
    designationSchema.addString("name", {
        required: true,
        default: ""
    })

    designationSchema.get().then(() => {
        request.message("Updated Schema")
        return designationSchema.update()
    }, () => {
        request.message("Added Schema")
        return designationSchema.save()
    })
  }

  