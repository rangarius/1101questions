import Parse from "parse"

Parse.Cloud.job("seedDataBase", (request) =>  {
    // params: passed in the job call
    // headers: from the request that triggered the job
    // log: the ParseServer logger passed in the request
    // message: a function to update the status message of the job object
    const { params, message } = request;
    
    return setup_db_classes(request);
  });



  function setup_db_classes(request) {
      return setup_question_schema(request)
  }

  function setup_question_schema(request) {
    const questionSchema = new Parse.Schema("question")

    questionSchema.addString("title", {
        required: true,
        "defaultValue": ""
    })

    questionSchema.addString("description", {
        required: true,
        defaultValue: ""
    })

    questionSchema.addArray("topics")

    questionSchema.addArray("answers")
    questionSchema.addArray("right_answers")

    /*questionSchema.setCLP({
        "find": {
            "requiresAuthentication": true,
            "role:admin": true
          },
          "get": {
            "requiresAuthentication": true,
            "role:admin": true
          },
          "create": { "role:admin": true },
          "update": { "role:admin": true },
          "delete": { "role:admin": true }
    })*/

    questionSchema.get().then(() => {
        request.message("Updated Schema")
        return questionSchema.update()
    }, () => {
        request.message("Added Schema")
        return questionSchema.save()
    })

  }