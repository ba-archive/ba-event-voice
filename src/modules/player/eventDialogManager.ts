import { RawEventDialogItem } from "../common/types";
import { eq, sample } from "lodash-es";
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
    category: string,
    condition: string,
    conditionDetail: string | null
  ) {
    return (
      this.cache.length > 0 &&
      eq(dialogs, this.dialogs) &&
      condition === this.flag.condition &&
      conditionDetail === this.flag.conditionDetail
    );
  },
  getDialog(
    dialogs: RawEventDialogItem[],
    category: string,
    condition: string,
    conditionDetail: string | null
  ) {
    if (!this.checkCondition(dialogs, category, condition, conditionDetail)) {
      this.flag.condition = condition;
      this.flag.conditionDetail = conditionDetail;
      this.dialogs = dialogs;

      this.cache = this.dialogs.filter(
        (dialog) => dialog.DialogCondition === this.flag.condition
      );

      let characterId = 0;
      const characterIds = new Set<number>();
      this.cache.forEach((dialog) =>
        characterIds.add(dialog.OriginalCharacterId)
      );
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
        (dialog) => dialog.OriginalCharacterId === characterId
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
