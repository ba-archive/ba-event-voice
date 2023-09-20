import axios from "axios";
import bgDatas from "../../data/eventBgDatas.json";
const BaseURL = "https://yuuka.cdn.diyigemt.com/image/ba-all-data";
import iconMap from "./iconMap.json";
export const ResourcesApi = axios.create({
  baseURL: "https://yuuka.cdn.diyigemt.com/image/ba-all-data",
});

export function getEventIcons(eventIds: string[]) {
  return eventIds.map((id) => {
    return {
      id: id,
      url: `${BaseURL}/UIs/01_Common/27_EventContent/Enter_Parcel/Event_Enter_${id}_Jp.webp`,
    };
  });
}

export function getBgUrl(eventId: string, category: string) {
  return `${BaseURL}/${
    (bgDatas as Record<string, Record<string, string>>)[eventId][category]
  }.webp`;
}

export function getCategoryIcons(categories: string[]) {
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

  return finalIconArr;
}

export function getBgmUrl(bgmName: string) {
  return `${BaseURL}/${bgmName}.ogg`;
}
