import * as Alexa from 'ask-sdk-core'
const skillBuilder = Alexa.SkillBuilders.custom()
const startQuizMessage = 'ミリオンライブの声優に関するクイズを10問出題します。'
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

interface ICharacter {
  characterName: string
  characterKanaName: string
  voiceActorName: string
  voiceActorKanaName: string
}

const data: ICharacter[] = [
  { characterName: '春日 未来', characterKanaName: 'かすがみらい', voiceActorName: '山崎 はるか', voiceActorKanaName: 'やまざきはるか'},
  { characterName: '木下 ひなた', characterKanaName: 'きのしたひなた', voiceActorName: '田村 奈央', voiceActorKanaName: 'たむらなお'},
  { characterName: 'ジュリア', characterKanaName: 'じゅりあ', voiceActorName: '愛美', voiceActorKanaName: 'あいみ' },
  { characterName: '高山 紗代子', characterKanaName: 'たかやまさよこ', voiceActorName: '駒形 友梨', voiceActorKanaName: 'こまがたゆり' },
  { characterName: '田中 琴葉', characterKanaName: 'たなかことは', voiceActorName: '種田 梨沙', voiceActorKanaName: 'たねだりさ' },
  { characterName: '天空橋 朋花', characterKanaName: 'てんくうばしともか', voiceActorName: '小岩井 ことり', voiceActorKanaName: 'こいわいことり' },
  { characterName: '箱崎 星梨花', characterKanaName: 'はこざきせりか', voiceActorName: '麻倉 もも', voiceActorKanaName: 'あさくらもも' },
  { characterName: '松田 亜利沙', characterKanaName: 'まつだありさ', voiceActorName: '村川 梨衣', voiceActorKanaName: 'むらかわりえ' },
  { characterName: '最上 静香', characterKanaName: 'もがみしずか', voiceActorName: '田所 あずさ', voiceActorKanaName: 'たどころあずさ' },
  { characterName: '望月 杏奈', characterKanaName: 'もちづきあんな', voiceActorName: '夏川 椎菜', voiceActorKanaName: 'なつかわしいな' },
  { characterName: '矢吹 可奈', characterKanaName: 'やぶきかな', voiceActorName: '木戸 衣吹', voiceActorKanaName: 'きどいぶき' },
  { characterName: 'エミリー スチュアート', characterKanaName: 'えみりーすちゅあーと', voiceActorName: '郁原 ゆう', voiceActorKanaName: 'かはらゆう' },
  { characterName: '大神 環', characterKanaName: 'おおがみたまき', voiceActorName: '稲川 英里', voiceActorKanaName: 'いながわえり' },
  { characterName: '北上 麗花', characterKanaName: 'きたかみれいか', voiceActorName: '平山 笑美', voiceActorKanaName: 'ひらやまえみ' },
  { characterName: '高坂 海美', characterKanaName: 'こうさかうみ', voiceActorName: '上田 麗奈', voiceActorKanaName: 'うえだれいな' },
  { characterName: '佐竹 美奈子', characterKanaName: 'さたけみなこ', voiceActorName: '大関 英里', voiceActorKanaName: 'おおぜきえり' },
  { characterName: '島原 エレナ', characterKanaName: 'しまばらえれな', voiceActorName: '角元 明日香', voiceActorKanaName: 'かくもとあすか' },
  { characterName: '永吉 昴	', characterKanaName: 'ながよしすばる', voiceActorName: '斉藤 佑圭', voiceActorKanaName: 'さいとうゆか' },
  { characterName: '野々原 茜', characterKanaName: 'ののはらあかね', voiceActorName: '小笠原 早紀', voiceActorKanaName: 'おがさわらさき' },
  { characterName: '馬場 このみ', characterKanaName: 'ばばこのみ', voiceActorName: '高橋 未奈美', voiceActorKanaName: 'たかはしみなみ' },
  { characterName: '福田 のり子', characterKanaName: 'ふくだのりこ', voiceActorName: '浜崎 奈々', voiceActorKanaName: 'はまさきなな' },
  { characterName: '舞浜 歩', characterKanaName: 'まいはまあゆむ', voiceActorName: '戸田 めぐみ', voiceActorKanaName: 'とだめぐみ' },
  { characterName: '真壁 瑞希', characterKanaName: 'まかべみずき', voiceActorName: '阿部 里果', voiceActorKanaName: 'あべりか' },
  { characterName: '百瀬 莉緒', characterKanaName: 'ももせりお', voiceActorName: '山口 立花子', voiceActorKanaName: 'やまぐちりかこ' },
  { characterName: '横山 奈緒', characterKanaName: 'よこやまなお', voiceActorName: '渡部 優衣', voiceActorKanaName: 'わたなべゆい' },
  { characterName: '伊吹 翼', characterKanaName: 'いぶきつばさ', voiceActorName: 'Machico', voiceActorKanaName: 'まちこ' },
  { characterName: '北沢 志保', characterKanaName: 'きたざわしほ', voiceActorName: '雨宮 天', voiceActorKanaName: 'あまみやそら' },
  { characterName: '篠宮 可憐', characterKanaName: 'しのみやかれん', voiceActorName: '近藤 唯', voiceActorKanaName: 'こんどうゆい' },
  { characterName: '周防 桃子', characterKanaName: 'すおうももこ', voiceActorName: '渡部 恵子', voiceActorKanaName: 'わたなべけいこ' },
  { characterName: '徳川 まつり', characterKanaName: 'とくがわまつり', voiceActorName: '諏訪 彩花', voiceActorKanaName: 'すわあやか' },
  { characterName: '所 恵美', characterKanaName: 'ところめぐみ', voiceActorName: '藤井 ゆきよ', voiceActorKanaName: 'ふじいゆきよ' },
  { characterName: '豊川 風花', characterKanaName: 'とよかわふうか', voiceActorName: '末柄 里恵', voiceActorKanaName: 'すえがらりえ' },
  { characterName: '中谷 育', characterKanaName: 'なかたにいく', voiceActorName: '原嶋 あかり', voiceActorKanaName: 'はらしまあかり' },
  { characterName: '七尾 百合子', characterKanaName: 'ななおゆりこ', voiceActorName: '伊藤 美来', voiceActorKanaName: 'いとうみく' },
  { characterName: '二階堂 千鶴', characterKanaName: 'にかいどうちづる', voiceActorName: '野村 香菜子', voiceActorKanaName: 'のむらかなこ' },
  { characterName: '宮尾 美也', characterKanaName: 'みやおみや', voiceActorName: '桐谷 蝶々', voiceActorKanaName: 'きりたにちょうちょ' },
  { characterName: 'ロコ', characterKanaName: 'ろこ', voiceActorName: '中村 温姫', voiceActorKanaName: 'なかむらあつき' },
  { characterName: '桜守 歌織', characterKanaName: 'さくらもりかおり', voiceActorName: '香里 有佐', voiceActorKanaName: 'こうりありさ' },
  { characterName: '白石 紬', characterKanaName: 'しらいしつむぎ', voiceActorName: '南 早紀', voiceActorKanaName: 'みなみさき' },
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

    const question = askQuestion(handleInput)
    const speakOutput = startQuizMessage + question
    const repromptOutput = question

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
    let question = ''

    if (attributes.counter < 5) {
      speakOutput += getCurrentScore(attributes.quizeScore)
      question = askQuestion(handleInput)
      speakOutput += question
      repromptOutput += question

      return response
        .speak(speakOutput)
        .reprompt(repromptOutput)
        .getResponse()
    } else {
      speakOutput += getFinalScore(attributes.quizeScore)
      return response.speak(speakOutput).getResponse()
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

  const question = getQuestion(attributes.counter, item)
  return question
}

const getQuestion = (counter: number, item: ICharacter): string =>
  `第${counter}問。${item.characterName}の声優は誰でしょう？`

const getRandom = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1) + min)

const compareSlots = (slots, value) => {
  console.log('compareSlots')
  return slots['voiceActor'].value === value ? true : false
}

const getSpeechCon = (type: boolean) => {
  console.log('getSpeechCon')
  if (type)
    return `<say-as interpret-as='interjection'>${
      speechConsCorrect[getRandom(0, speechConsCorrect.length - 1)]
    }! </say-as><break strength='strong'/>`
  return `<say-as interpret-as='interjection'>${
    speechConsWrong[getRandom(0, speechConsWrong.length - 1)]
  }! </say-as><break strength='strong'/>`
}

const getAnswer = (item: ICharacter) =>
  `<sub alias="${item.characterKanaName}">${item.characterName}</sub>の声優は<sub alias="${item.voiceActorKanaName}">${item.voiceActorName}</sub>さんでした！`

const getCurrentScore = (score: number) => `現在の正解スコアは${score}です。`

const getFinalScore = (score: number) => `最終スコアは${score}です。`
