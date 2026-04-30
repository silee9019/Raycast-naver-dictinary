export interface DictionaryEntry {
  id: string;
  title: string;
  subtitle: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: string[];
}

export interface WordDetailData {
  word: string;
  entryId?: string;
  phonetic?: string;
  phoneticType?: string;
  audioUrl?: string;
  source?: string;
  dictType?: string;
  meanings: Meaning[];
}

export interface NaverDetailApiResponse {
  searchResultMap?: {
    searchResultListMap?: {
      WORD?: {
        items?: NaverWordItem[];
      };
    };
  };
}

export interface NaverWordItem {
  entryId?: string;
  destinationLink?: string;
  handleEntry?: string;
  expEntry?: string;
  expDictTypeForm?: string;
  sourceDictnameKO?: string;
  searchPhoneticSymbolList?: Array<{
    symbolType?: string;
    symbolTypeCode?: string;
    symbolValue?: string;
    symbolFile?: string;
  }>;
  meansCollector?: Array<{
    partOfSpeech?: string;
    partOfSpeech2?: string;
    means?: Array<{
      order?: string;
      value?: string;
    }>;
  }>;
}
