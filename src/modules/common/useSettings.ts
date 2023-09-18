import { ref } from "vue";

const useSettings = () =>
  ref({
    urlPrefx: "https://yuuka.cdn.diyigemt.com/image/ba-all-data/",
  });
export default useSettings;
