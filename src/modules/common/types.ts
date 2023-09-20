export interface RawEventDialogItem {
  CostumeUniqueId: number;
  OriginalCharacterId: number;
  EventID: number;
  GroupId: number;
  ProductionStep: "Release";
  DialogCategory:
    | "UIEventBoxGachaShop"
    | "UIEventCardShop"
    | "UIEventFortuneGachaShop"
    | "UIEventLobby"
    | "UIEventMiniGameMission"
    | "UIEventMission"
    | "UIEventShop"
    | "UISpecialOperationLobby";
  DialogCondition:
    | "BoxGachaPrize"
    | "Buy"
    | "CollectionOpen"
    | "Enter"
    | "Idle"
    | "Interaction"
    | "Luck0"
    | "Luck1"
    | "Luck2"
    | "Luck3"
    | "Luck4"
    | "Luck5"
    | "Prize0"
    | "Prize1"
    | "Prize2"
    | "Prize3"
    | "StoryOpen";
  /*条件, 如关闭, 活动第几天*/
  DialogConditionDetail: "Close" | "Day" | "None";
  /*大概是上面conditionDetail的参数值*/
  DialogConditionDetailValue: number;
  /*对话框类型*/
  DialogType: "Talk" | "Think" | "UITalk";
  /*显示时长*/
  Duration: number;
  ActionName: "";
  AnimationName: string;
  LocalizeJP: string;
  LocalizeCN?: string;
  LocalizeTW?: string;
  /*语音列表*/
  VoiceClipsKr: string[];
  VoiceClipsJp: string[];
}

export interface CharacterExcelTableItem {
  CostumeUniqueId: number;
  SpineResourceName: string;
  TextureDir: string;
}

export type DialogType = RawEventDialogItem["DialogType"];

export interface EventSettingItem {
  removeCategories: string[];
  bgm: {
    Path: string;
    LoopStartTime: number;
    LoopEndTime: number;
  };
}
