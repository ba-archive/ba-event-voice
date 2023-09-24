import axios from "axios";
import bgDatas from "../../data/eventBgDatas.json";
import eventVoicePlayer from "../player/eventVoicePlayer";
import { CharacterExcelTableItem, RawEventDialogItem } from "./types";
const BaseURL = "https://yuuka.cdn.diyigemt.com/image/ba-all-data";
import iconMap from "../../data/iconMap.json";
import { Spine } from "pixi-spine";
import { Sound } from "@pixi/sound";
import { Assets } from "pixi.js";
import CharacterExcel from "../../data/CharacterExcel.json";
export const ResourcesApi = axios.create({
  baseURL: "https://yuuka.cdn.diyigemt.com/image/ba-all-data",
});

export const CharacterExcelTable = new Map<number, CharacterExcelTableItem>();
for (const item of CharacterExcel["DataList"]) {
  CharacterExcelTable.set(item.CostumeUniqueId, item);
}

export async function getEventIcons(eventIds: string[]) {
  const results = eventIds.map((id) => {
    return {
      id: id,
      url: `${BaseURL}/UIs/01_Common/27_EventContent/Enter_Parcel/Event_Enter_${id}_Jp.webp`,
    };
  });
  await Promise.all(results.map((iconInfo) => axios.get(iconInfo.url)));

  return results;
}

export async function getBgUrl(eventId: string, category: string) {
  const result = `${BaseURL}/${
    (bgDatas as Record<string, Record<string, string>>)[eventId][category]
  }.webp`;
  await axios.get(result);

  return result;
}

export async function getBgmSound(arg: string) {
  return Assets.load(`${BaseURL}/${arg}.ogg`) as Promise<Sound>;
}

export async function getCategoryIcons(categories: string[]) {
  const finalIconArr: { category: string; icon: string }[] = [];
  const iconBaseUrl = `${BaseURL}/eventIcon`;
  for (const category of categories) {
    if (category.endsWith("Lobby")) {
      //默认category使用默认icon
      finalIconArr.push({
        category,
        icon: `${iconBaseUrl}/Event_Icon_Story.png`,
      });
    } else if (category in iconMap) {
      finalIconArr.push({
        category,
        icon: `${iconBaseUrl}/${Reflect.get(iconMap, category)}`,
      });
    } else {
      finalIconArr.push({
        category,
        icon: `${iconBaseUrl}/${category.replace(
          "UIEvent",
          "Event_Icon_"
        )}.png`,
      });
    }
  }

  await Promise.all(finalIconArr.map((iconInfo) => axios.get(iconInfo.icon)));

  return finalIconArr;
}

/**
 * 加载player在某category下的所有资源
 * @param dialogs
 */
export async function initPlayer(dialogs: RawEventDialogItem[]) {
  for (const dialog of dialogs) {
    const urls = getDialogUrls(dialog);
    const characterId = dialog.CostumeUniqueId;
    if (!Array.from(eventVoicePlayer.spineCache.keys()).includes(characterId)) {
      try {
        const spineRes = await Assets.load(urls.spine);
        eventVoicePlayer.spineCache.set(
          characterId,
          new Spine(spineRes.spineData)
        );
      } catch (err) {
        const spineRes = await Assets.load(urls.spineFallback);
        eventVoicePlayer.spineCache.set(
          characterId,
          new Spine(spineRes.spineData)
        );
      }
    }
    if (urls.voice) {
      const voiceId = dialog.VoiceClipsJp[0];
      if (!Array.from(eventVoicePlayer.voiceCache.keys()).includes(voiceId)) {
        try {
          const voice = await Assets.load(urls.voice);
          eventVoicePlayer.voiceCache.set(voiceId, voice);
        } catch {
          const voice = await Assets.load(urls.voiceFallback);
          eventVoicePlayer.voiceCache.set(voiceId, voice);
        }
      }
    }
  }
}

function getDialogUrls(dialog: RawEventDialogItem) {
  const spineArg = CharacterExcelTable.get(dialog.CostumeUniqueId);
  console.log("character info: ", spineArg);
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
  //别问, 问就特殊情况
  characterName = characterName.replace("rin_S_01", "rin");
  let spineFileName = `${characterName}_spr`; //hasumi_spr
  if (characterName === "NP0032_npc") {
    spineFileName = spineFileName.replace("_spr", "");
  }
  if (spineFileName.includes("Hoshino_Swimsuit")) {
    spineFileName = spineFileName.replace("Swim", "swim");
  }
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
      spine: `${eventVoicePlayer.urlPrefixs.spine}/${spineFileName}/${spineFileName}.skel`,
      spineFallback: `${eventVoicePlayer.urlPrefixs.spine}/${spineFallbackFileName}/${spineFallbackFileName}.skel`,
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
      spine: `${BaseURL}/spine/${spineFileName}/${spineFileName}.skel`,
      spineFallback: `${BaseURL}/spine/${spineFallbackFileName}/${spineFallbackFileName}.skel`,
      voice: `${BaseURL}/Audio/VoiceJp/Character_voice/JP_${voicePrefix}/${voiceName}.ogg`,
      voiceFallback: `${BaseURL}/Audio/VoiceJp/Character_voice/JP_${voicePrefix}/${voiceFallbackName}.ogg`,
    };
  }
}
