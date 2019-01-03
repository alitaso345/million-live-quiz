import * as Alexa from 'ask-sdk-core'
const skillBuilder = Alexa.SkillBuilders.custom()
const startQuizMessage = 'ミリオンライブの声優に関するクイズを10問出題します。'
const states = {
  START: `_START`,
  QUIZ: `_QUIZ`
}

const LaunchRequestHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return request.type === 'LaunchRequest'
  },
  handle(handleInput) {
    const welcomeMessage =
      'アイドルマスターミリオンライブにクイズで遊べるスキルです、「クイズを開始」と言ってみてください。'
    return handleInput.responseBuilder
      .speak(welcomeMessage)
      .reprompt(welcomeMessage)
      .withSimpleCard('ミリオンライブクイズ', welcomeMessage)
      .getResponse()
  }
}

const QuizHandler: Alexa.RequestHandler = {
  canHandle(handleInput) {
    const request = handleInput.requestEnvelope.request
    console.log('QuizHandler')
    console.log(JSON.stringify(request))
    return (
      request.type === 'IntentRequest' &&
      (request.intent.name === 'QuizIntent' ||
        request.intent.name === 'AMAZON.StartOverIntent')
    )
  },
  handle(handleInput) {
    const attributes = handleInput.attributesManager.getSessionAttributes()
    attributes.state = states.QUIZ
    attributes.counter = 0
    attributes.quizeScore = 0

    const question = askQuestion(handleInput)
    const speakOutput = startQuizMessage + question
    const repromptOutput = question

    return handleInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse()
  }
}

const ErrorHandler: Alexa.ErrorHandler = {
  canHandle() {
    return true
  },
  handle(handleInput, error) {
    console.error(`ERROR: `, JSON.stringify(error, null, 2))
    console.log(`handlerInput: `, JSON.stringify(handleInput, null, 2))

    return handleInput.responseBuilder.getResponse()
  }
}

export const handler = skillBuilder
  .addRequestHandlers(LaunchRequestHandler, QuizHandler)
  .addErrorHandlers(ErrorHandler)
  .lambda()

const askQuestion = handlerInput => {
  return '第一問。春日未来の声優は誰でしょう？'
}
