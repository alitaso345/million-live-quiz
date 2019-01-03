import * as Alexa from 'ask-sdk-core'
const skillBuilder = Alexa.SkillBuilders.custom()
const startQuizMessage = 'ミリオンライブの声優に関するクイズを10問出題します。'
const states = {
  START: `_START`,
  QUIZ: `_QUIZ`
}

interface ICharacter {
  characterName: string
  voiceActorName: string
}

const data: ICharacter[] = [
  { characterName: '春日未来', voiceActorName: '山崎はるか' }
]

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
  const random = getRandom(0, data.length - 1)
  const item = data[random]

  const attributes = handlerInput.attributesManager.getSessionAttributes()

  attributes.selectedItemIndex = random
  attributes.quizItem = item
  attributes.counter += 1

  handlerInput.attributesManager.setSessionAttributes(attributes)

  const question = getQuestion(attributes.counter, item)
  return question
}

const getQuestion = (counter: number, item: ICharacter): string => (
  `第${counter}問。${item.characterName}の声優は誰でしょう？`
)

const getRandom = (min: number, max: number): number => (
  Math.floor((Math.random() * ((max - min) + 1)) + min)
)
