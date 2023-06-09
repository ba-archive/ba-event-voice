import { RawEventDialogItem, CharacterExcelTableItem } from "./types";
import { Application, Assets } from "pixi.js";
import { Spine, ISkeletonData } from "pixi-spine";
import { soundAsset, Sound } from "@pixi/sound";
import { Props } from "./BaEventVoice.vue";
import axios from "axios";
import { Ref } from "vue";

const Idle_Track = 0;
const Face_Track = 1;
const Wink_Track = 2;
const appHeight = 1300;
const appWidth = 1500;

Assets.loader.parsers.push(soundAsset);
/**
 * 活动语音播放器主控制对象
 */
const eventVoicePlayer = {
  app: new Application({
    height: appHeight,
    width: appWidth,
    backgroundAlpha: 0,
  }),
  characterExcelTable: new Map<number, CharacterExcelTableItem>(),
  /**
   * 资源的url前缀
   */
  urlPrefixs: {
    spine: "",
    voice: "",
  },
  currentCharacter: {
    spine: null as Spine | null,
    id: 0,
  },
  /**
   * 正在播放的语音
   */
  playingVoice: null as Sound | null,
  playingId: 0,
  winkId: 0,

  /**
   * 初始化, 加载所需资源
   * @param elementID canvas挂载的element id
   * @param dataUrls 资源地址
   */
  async init(elementID: string, dataUrls: Props["dataUrls"]) {
    await axios.get(dataUrls.characterExcelTable).then((response) => {
      const datas: CharacterExcelTableItem[] = response.data["DataList"];
      for (const data of datas) {
        this.characterExcelTable.set(data["Id"], data);
      }
    });

    this.urlPrefixs.spine = dataUrls.characterSpineDirectory;
    this.urlPrefixs.voice = dataUrls.voiceDirectory;
    document
      .querySelector(`#${elementID}`)
      ?.appendChild(this.app.view as unknown as Node);
  },

  /**
   * 播放一次活动语音
   * @param dialogs 活动语音句子序列
   * @param textRef 文字更新ref
   * @param dialogTypeRef 对话框类型更新ref
   */
  async play(
    dialogs: RawEventDialogItem[],
    textRef: Ref<string>,
    id: number,
    dialogTypeRef: Ref<string>
  ) {
    this.stopPlay();
    this.clearWink();
    this.playingId = id;
    let voicePromise: Promise<void> | null = null;
    for (const dialog of dialogs) {
      if (this.playingId !== id) {
        console.log("play stop");
        return;
      }
      const urls = this.getUrls(dialog);
      dialogTypeRef.value = dialog.DialogType;
      if (this.currentCharacter.id !== dialog.CharacterId) {
        //加载spine资源
        await this.loadCharacterSpine(urls.spine, urls.spineFallback);
        this.currentCharacter.id = dialog.CharacterId;
      }

      this.currentCharacter.spine!.state.setAnimation(
        Face_Track,
        dialog.AnimationName,
        false
      );
      textRef.value = dialog.LocalizeJP;
      if (urls.voice) {
        try {
          this.playingVoice = await Assets.load(urls.voice);
        } catch (e) {
          this.playingVoice = await Assets.load(urls.voiceFallback);
        }
        voicePromise = new Promise<void>((resolve) => {
          this.playingVoice?.play({
            volume: 0.5,
            complete: () => resolve(),
          });
        });
      }
      await waitMs(dialog.Duration);
      if (!dialog.Duration) {
        await voicePromise;
        voicePromise = null;
      }
      console.log(`wait ${dialog.Duration} done`);
    }
    await voicePromise;
    console.log("play done!");
    if (this.playingId === id) {
      const character = this.currentCharacter.spine;
      textRef.value = "";
      this.playingVoice = null;

      if (character) {
        character.state.setAnimation(Face_Track, "01", false);
        console.log("start wink");
        this.wink(++this.winkId);
      }
    }
  },

  /**
   * 停止播放活动语音
   */
  stopPlay() {
    if (this.playingVoice) {
      this.playingVoice.stop();
    }
    this.playingId++;
  },

  getUrls(dialog: RawEventDialogItem) {
    const spineArg = this.characterExcelTable.get(dialog.CharacterId);
    if (!spineArg) {
      throw new Error("没有找到该角色id的对应资料");
    }
    //arg UIs/03_Scenario/02_Character/CharacterSpine_aru
    const temp = spineArg.SpineResourceName.split("/");
    let characterName = temp.pop()!;
    characterName = characterName?.replace("CharacterSpine_", "");
    if (characterName === "Saya_Casual") {
      characterName = "saya_casual";
    }

    //移除有时带有的莫名其妙的nd
    characterName = characterName.replace("ND", "");
    characterName = characterName.replace("nd", "");
    const spineFileName = `${characterName}_spr`; //hasumi_spr
    //首字母可能大写可能小写, 准备一个备用的当资源加载失败时使用
    let spineFallbackFileName = "";
    console.log(spineFileName);
    if (spineFileName[0].toUpperCase() === spineFileName[0]) {
      spineFallbackFileName =
        spineFileName[0].toLocaleLowerCase() + spineFileName.slice(1);
    } else {
      spineFallbackFileName =
        spineFileName[0].toUpperCase() + spineFileName.slice(1);
    }

    if (dialog.VoiceClipsJp.length === 0) {
      return {
        spine: `${this.urlPrefixs.spine}/${spineFileName}/${spineFileName}.skel`,
        spineFallback: `${this.urlPrefixs.spine}/${spineFallbackFileName}/${spineFallbackFileName}.skel`,
      };
    } else {
      characterName =
        characterName?.charAt(0).toUpperCase() + characterName?.slice(1);
      if (characterName.includes("_")) {
        const tempStrs = characterName.split("_");
        characterName = "";
        for (let tempStr of tempStrs) {
          tempStr = tempStr[0].toUpperCase() + tempStr.slice(1);
          characterName += tempStr;
        }
      }

      //声音的前缀根据声音资源名字本身获得
      let voiceName = dialog.VoiceClipsJp[0];
      let voicePrefix = voiceName.split("_").shift();
      if (voicePrefix === "hinata") {
        voicePrefix = "Hinata";
        voiceName = voiceName.replace("hinata", "Hinata");
      }
      let voiceFallbackName = "";

      //有些资源大小写是错的, 为什么能跑, 不理解
      if (voiceName.includes("Eventshop")) {
        voiceFallbackName = voiceName.replace("Eventshop", "EventShop");
      } else if (voiceName.includes("EventShop")) {
        voiceFallbackName = voiceName.replace("EventShop", "Eventshop");
      }
      return {
        spine: `${this.urlPrefixs.spine}/${spineFileName}/${spineFileName}.skel`,
        spineFallback: `${this.urlPrefixs.spine}/${spineFallbackFileName}/${spineFallbackFileName}.skel`,
        voice: `${this.urlPrefixs.voice}/JP_${voicePrefix}/${voiceName}.ogg`,
        voiceFallback: `${this.urlPrefixs.voice}/JP_${voicePrefix}/${voiceFallbackName}.ogg`,
      };
    }
  },

  async loadCharacterSpine(spineUrl: string, fallback: string) {
    if (this.currentCharacter.spine) {
      this.currentCharacter.spine.destroy();
    }
    const initSpine = (spineData: ISkeletonData) => {
      const currentCharacterSpine = new Spine(spineData!);
      currentCharacterSpine.scale.set(0.75);
      currentCharacterSpine.state.setAnimation(Idle_Track, "Idle_01", true);
      currentCharacterSpine.position.set(
        this.app.screen.width / 2,
        this.app.screen.height
      );
      this.app.stage.addChild(currentCharacterSpine);
      this.currentCharacter.spine = currentCharacterSpine;
    };
    try {
      const spineRes = await Assets.load(spineUrl);
      initSpine(spineRes.spineData);
    } catch (e) {
      console.warn(e);
      const spineRes = await Assets.load(fallback);
      initSpine(spineRes.spineData);
    }
  },

  async wink(winkId: number) {
    if (this.winkId !== winkId) {
      return;
    }
    const character = this.currentCharacter.spine;
    if (!character) {
      return;
    }

    const winkTimeout = Math.floor(Math.random() * 1000) + 3500;
    await waitMs(winkTimeout);

    const loopTime = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < loopTime; ++i) {
      if (this.winkId !== winkId) {
        break;
      }
      await winkPromise(character);
    }
    this.wink(winkId);
  },

  clearWink() {
    this.winkId++;
    this.currentCharacter.spine?.state.clearTrack(Wink_Track);
  },

  /**
   * 生成play id
   */
  generateId() {
    return this.playingId + 1;
  },
};

function waitMs(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * wink in promise
 * @param character
 */
function winkPromise(character: Spine) {
  return new Promise<void>((resolve) => {
    character.state.addListener({
      complete() {
        resolve();
        character.state.clearListeners();
      },
    });
    character.state.setAnimation(Wink_Track, "Eye_Close_01", false);
  });
}

export default eventVoicePlayer;
export { appHeight, appWidth };
