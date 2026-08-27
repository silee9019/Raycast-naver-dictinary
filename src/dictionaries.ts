export type DictionaryCode = "enko" | "koko" | "esko";

export interface DictionaryConfig {
  autocompleteUrl: string;
  detailApiUrl: string;
  webBaseUrl: string;
  autocompleteMeaningIndex?: number;
}

export const dictionaries: Record<DictionaryCode, DictionaryConfig> = {
  enko: {
    autocompleteUrl: "https://ac-dict.naver.com/enko/ac",
    detailApiUrl: "https://en.dict.naver.com/api3/enko/search",
    webBaseUrl: "https://en.dict.naver.com",
    autocompleteMeaningIndex: 2,
  },
  koko: {
    autocompleteUrl: "https://ac-dict.naver.com/koko/ac",
    detailApiUrl: "https://ko.dict.naver.com/api3/koko/search",
    webBaseUrl: "https://ko.dict.naver.com",
  },
  esko: {
    autocompleteUrl: "https://ac-dict.naver.com/esko/ac",
    detailApiUrl: "https://dict.naver.com/api3/esko/search",
    webBaseUrl: "https://dict.naver.com/eskodict",
    autocompleteMeaningIndex: 3,
  },
};
