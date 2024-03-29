import { RawEventDialogItem } from "../common/types";
import { isEqual, sample } from "lodash-es";
const manager = {
  flag: {
    condition: "",
    conditionDetail: null as null | string,
  },
  idleCharacterId: 0,
  cache: [] as RawEventDialogItem[],
  dialogs: [] as RawEventDialogItem[],
  /**
   * 是否符合dialog条件且cache仍有剩余
   * @param dialogs
   * @param category
   * @param condition
   * @param conditionDetail
   */
  checkCondition(
    dialogs: RawEventDialogItem[],
    condition: string,
    conditionDetail: string | null
  ) {
    return (
      this.cache.length > 0 &&
      isEqual(dialogs, this.dialogs) &&
      condition === this.flag.condition &&
      conditionDetail === this.flag.conditionDetail
    );
  },
  getDialog(
    dialogs: RawEventDialogItem[],
    condition: string,
    conditionDetail: string | null
  ) {
    if (!this.checkCondition(dialogs, condition, conditionDetail)) {
      this.flag.condition = condition;
      this.flag.conditionDetail = conditionDetail ? conditionDetail : null;
      this.dialogs = dialogs;

      this.cache = this.dialogs.filter(
        (dialog) => dialog.DialogCondition === this.flag.condition
      );

      let characterId = 0;
      const characterIds = new Set<number>();
      this.cache.forEach((dialog) => characterIds.add(dialog.CostumeUniqueId));
      characterId = sample(Array.from(characterIds)) || 0;
      if (condition === "Idle") {
        if (characterIds.has(this.idleCharacterId)) {
          characterId = this.idleCharacterId;
        }
      } else if (condition === "Enter") {
        this.idleCharacterId = characterId;
        //conditionDetail只在enter情况下有效
        this.cache = this.cache.filter(
          (dialog) => dialog.DialogConditionDetail === this.flag.conditionDetail
        );
      }
      this.cache = this.cache.filter(
        (dialog) => dialog.CostumeUniqueId === characterId
      );
    }

    const groupIds = new Set<number>();
    this.cache.forEach((dialog) => groupIds.add(dialog.GroupId));
    const groupId = sample(Array.from(groupIds));
    const playDialogs = this.cache.filter(
      (dialog) => dialog.GroupId === groupId
    );
    this.cache = this.cache.filter((dialog) => dialog.GroupId !== groupId);
    return playDialogs;
  },
};

export default manager;
