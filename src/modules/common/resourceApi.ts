import axios from "axios";
import bgDatas from "../../data/eventBgDatas.json";
const BaseURL = "https://yuuka.cdn.diyigemt.com/image/ba-all-data";
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
