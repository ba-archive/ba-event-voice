import { RawEventDialogItem, CharacterExcelTableItem } from './types'
import { Application, Loader } from 'pixi.js'
import { Spine, SpineParser, ISkeletonData } from 'pixi-spine'
import { Props } from './BaEventVoice.vue'
import { Sound } from '@pixi/sound'
import axios from 'axios'
import { Ref } from 'vue'

const Idle_Track = 0
const Face_Track = 1
const appHeight = 1300
const appWidth = 1000

/**
 * 活动语音播放器主控制对象
 */
const eventVoicePlayer = {
  app: new Application({ height: appHeight, width: appWidth, backgroundAlpha: 0 }),
  characterExcelTable: new Map<number, CharacterExcelTableItem>(),
  /**
   * 资源的url前缀
   */
  urlPrefixs: {
    spine: '',
    voice: ''
  },
  currentCharacter: {
    spine: null as Spine | null,
    id: 0
  },

  /**
   * 初始化, 加载所需资源
   * @param elementID canvas挂载的element id
   * @param dataUrls 资源地址
   */
  async init(elementID: string, dataUrls: Props['dataUrls']) {
    await axios.get(dataUrls.characterExcelTable).then(response => {
      const datas: CharacterExcelTableItem[] = response.data['DataList']
      for (const data of datas) {
        this.characterExcelTable.set(data['Id'], data)
      }
    })
    Loader.registerPlugin(SpineParser)

    this.urlPrefixs.spine = dataUrls.characterSpineDirectory
    this.urlPrefixs.voice = dataUrls.voiceDirectory
    document.querySelector(`#${elementID}`)?.appendChild(this.app.view)
  },

  /**
   * 播放一次活动语音
   * @param dialogs 活动语音句子序列
   * @param textRef 文字更新ref
   */
  async play(dialogs: RawEventDialogItem[], textRef: Ref<string>) {
    let voicePromise: Promise<void> | null = null
    for (const dialog of dialogs) {
      const urls = this.getUrls(dialog)
      if (this.currentCharacter.id !== dialog.CharacterId) {
        //加载spine资源
        await this.loadCharacterSpine(urls.spine, urls.spineFallback)
        this.currentCharacter.id = dialog.CharacterId
      }

      this.currentCharacter.spine!.state.setAnimation(Face_Track, dialog.AnimationName, false)
      textRef.value = dialog.LocalizeJP
      if (urls.voice) {
        console.log(urls.voice)
        const voice = Sound.from(urls.voice)
        voicePromise = new Promise<void>(resolve => {
          voice.play({
            volume: 0.5,
            complete: () => resolve(),
          })
        })
      }
      await waitMs(dialog.Duration)
      if (!dialog.Duration) {
        await voicePromise
        voicePromise = null
      }
      console.log(`wait ${dialog.Duration} done`)
    }
    await voicePromise
    console.log('play done!')
    this.currentCharacter.spine?.state.setAnimation(Face_Track, '01', false)
    textRef.value = ''
  },

  getUrls(dialog: RawEventDialogItem) {
    const spineArg = this.characterExcelTable.get(dialog.CharacterId)
    if (!spineArg) {
      throw new Error('没有找到该角色id的对应资料')
    }
    //arg UIs/03_Scenario/02_Character/CharacterSpine_aru
    const temp = spineArg.SpineResourceName.split('/')
    let characterName = temp.pop()!
    characterName = characterName?.replace('CharacterSpine_', '')
    characterName = characterName.replace('ND', '')
    const spineFileName = `${characterName}_spr` //hasumi_spr
    //首字母可能大写可能小写, 准备一个备用的当资源加载失败时使用
    let spineFallbackFileName = ''
    if (spineFileName[0].toUpperCase() === spineFileName[0]) {
      spineFallbackFileName = spineFileName[0].toLocaleLowerCase() + spineFileName.slice(1)
    }
    else {
      spineFallbackFileName = spineFileName[0].toUpperCase() + spineFileName.slice(1)
    }

    if (dialog.VoiceClipsJp.length === 0) {
      return {
        spine: `${this.urlPrefixs.spine}/${spineFileName}/${spineFileName}.skel`,
        spineFallback: `${this.urlPrefixs.spine}/${spineFallbackFileName}/${spineFallbackFileName}.skel`,
      }
    }
    else {
      characterName = characterName?.charAt(0).toUpperCase() + characterName?.slice(1)
      if (characterName.includes('_')) {
        const tempStrs = characterName.split('_')
        characterName = ''
        for (let tempStr of tempStrs) {
          tempStr = tempStr[0].toUpperCase() + tempStr.slice(1)
          characterName += tempStr
        }
      }
      return {
        spine: `${this.urlPrefixs.spine}/${spineFileName}/${spineFileName}.skel`,
        spineFallback: `${this.urlPrefixs.spine}/${spineFallbackFileName}/${spineFallbackFileName}.skel`,
        voice: `${this.urlPrefixs.voice}/JP_${characterName}/${dialog.VoiceClipsJp[0]}.ogg`
      }
    }
  },

  loadCharacterSpine(spineUrl: string, fallbackUrl: string) {
    if (this.currentCharacter.spine) {
      this.currentCharacter.spine.destroy()
    }
    return new Promise<void>((resolve, reject) => {
      const initSpine = (spineData: ISkeletonData) => {
        const currentCharacterSpine = new Spine(spineData!)
        currentCharacterSpine.scale.set(0.75)
        currentCharacterSpine.state.setAnimation(Idle_Track, 'Idle_01', true)
        currentCharacterSpine.position.set(this.app.screen.width / 2,
          this.app.screen.height )
        this.app.stage.addChild(currentCharacterSpine)
        this.currentCharacter.spine = currentCharacterSpine
        resolve()
      }

      this.app.loader.add(spineUrl, spineUrl, res => {
        if (res.spineData) {
          initSpine(res.spineData)
        }
        else {
          this.app.loader.reset()
          this.app.loader.add(fallbackUrl, fallbackUrl, res => {
            if (res.spineData) {
              initSpine(res.spineData)
            }
            else {
              reject(`spine资源未加载成功, url:${spineUrl}`)
            }
          })
        }
        this.app.loader.load()
      })
      this.app.loader.load()
    })
  }
}

function waitMs(ms: number) {
  return new Promise<void>(resolve => setTimeout(resolve, ms))
}

export default eventVoicePlayer
export { appHeight, appWidth }