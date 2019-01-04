import * as Alexa from 'ask-sdk-core'
import { ICharacter } from './resources'
import data from './data'
const skillBuilder = Alexa.SkillBuilders.custom()
const startQuizMessage = 'ミリオンライブの声優に関するクイズを5問出題します。'
const states = {
  START: `_START`,
  QUIZ: `_QUIZ`
}
const speechConsCorrect = [
  'やった',
  'やったあ',
  'おめでとう',
  'イェイ',
  'オーケー',
  'オーケーです'
]
const speechConsWrong = [
  'ドンマイ',
  'あ〜あ',
  'あちゃ',
  'あちゃあ',
  'あれれ',
  'ううっ'
]

const LaunchRequestHandler: Alexa.RequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request
    return request.type === 'LaunchRequest'
  },
  handle(handleInput) {
    const welcomeMessage =
      'アイドルマスターミリオンライブに関するクイズで遊べるスキルです、「クイズを開始」と言ってみてください。'
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

    const { speechQuestion } = askQuestion(handleInput)
    const speakOutput = startQuizMessage + speechQuestion
    const repromptOutput = speechQuestion

    return handleInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse()
  }
}

const QuizAnswerHandler = {
  canHandle(handleInput) {
    const attributes = handleInput.attributesManager.getSessionAttributes()
    const request = handleInput.requestEnvelope.request
    return (
      attributes.state === states.QUIZ &&
      request.type === 'IntentRequest' &&
      request.intent.name === 'AnswerInent'
    )
  },
  handle(handleInput) {
    console.log('QiuzAnswerHandler')
    const attributes = handleInput.attributesManager.getSessionAttributes()
    const response = handleInput.responseBuilder

    let speakOutput = ''
    let repromptOutput = ''
    const item = attributes.quizItem
    const isCorrent = compareSlots(
      handleInput.requestEnvelope.request.intent.slots,
      item.voiceActorName
    )

    if (isCorrent) {
      speakOutput = getSpeechCon(true)
      attributes.quizeScore += 1
      handleInput.attributesManager.setSessionAttributes(attributes)
    } else {
      speakOutput = getSpeechCon(false)
    }

    speakOutput += getAnswer(item)

    if (attributes.counter < 5) {
      speakOutput += getCurrentScore(attributes.quizeScore)
      const { speechQuestion } = askQuestion(handleInput)
      speakOutput += speechQuestion
      repromptOutput += speechQuestion

      return response
        .speak(speakOutput)
        .reprompt(repromptOutput)
        .withSimpleCard('答え', getDisplayalbeAnswer(item))
        .getResponse()
    } else {
      speakOutput += getFinalScore(attributes.quizeScore)
      return response.speak(speakOutput)
        .withSimpleCard('答え', getDisplayalbeAnswer(item))
        .getResponse()
    }
  }
}

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest'
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${JSON.stringify(
        handlerInput.requestEnvelope
      )}`
    )
    return handlerInput.responseBuilder.getResponse()
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
  .addRequestHandlers(
    LaunchRequestHandler,
    QuizHandler,
    QuizAnswerHandler,
    SessionEndedRequestHandler
  )
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

  const speechQuestion = getQuestion(attributes.counter, item)
  const displayableQuestion = getDisplayableQuestion(attributes.counter, item)

  return {
    speechQuestion: speechQuestion,
    displayableQuestion: displayableQuestion
  }
}

const getQuestion = (counter: number, item: ICharacter): string =>
  `第${counter}問。<sub alias="${item.characterKanaName}">${
    item.characterName
  }</sub>の声優は誰でしょう？`

const getDisplayableQuestion = (counter: number, item: ICharacter): string =>
  `第${counter}問。${item.characterName}の声優は誰でしょう？`

const getRandom = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min)

const compareSlots = (slots, value) =>
  slots['voiceActor'].value === value ? true : false

const getSpeechCon = (type: boolean) => {
  if (type)
    return `<say-as interpret-as='interjection'>${
      speechConsCorrect[getRandom(0, speechConsCorrect.length - 1)]
    }! </say-as><break strength='strong'/>`
  return `<say-as interpret-as='interjection'>${
    speechConsWrong[getRandom(0, speechConsWrong.length - 1)]
  }! </say-as><break strength='strong'/>`
}

const getAnswer = (item: ICharacter) =>
  `<sub alias="${item.characterKanaName}">${
    item.characterName
  }</sub>の声優は<sub alias="${item.voiceActorKanaName}">${
    item.voiceActorName
  }</sub>さんでした！`

const getDisplayalbeAnswer = (item: ICharacter) =>
  `${item.characterName}の声優は${item.voiceActorName}さんでした！`

const getCurrentScore = (score: number) => `現在の正解スコアは${score}です。`

const getFinalScore = (score: number) => `最終スコアは${score}です。`

const supportsDisplay = (handlerInput: Alexa.HandlerInput) => {
  const hasDisplay =
    handlerInput.requestEnvelope.context &&
    handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display

    return hasDisplay
}