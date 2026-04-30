import axios from "axios";
import * as crypto from "crypto";
import { DictionaryEntry } from "./types.js";

export type { DictionaryEntry } from "./types.js";

const NAVER_DICTIONARY_URL = "https://ac-dict.naver.com/enko/ac";

/**
 * 네이버 자동완성 API 응답 구조
 * items[categoryIndex][entryIndex][fieldIndex][valueIndex]
 * - fieldIndex 0: 검색어 (영단어)
 * - fieldIndex 2: 뜻 (한글 번역)
 */
interface AutocompleteResponse {
  items?: AutocompleteItem[][][];
}

/** 자동완성 항목 - [값, ...추가정보] 형태의 배열 */
type AutocompleteItem = string[];

export async function getDictionaryData(word: string): Promise<DictionaryEntry[]> {
  if (!word?.trim()) {
    return [];
  }

  const trimmedWord = word.trim();

  const response = await axios.get<AutocompleteResponse>(NAVER_DICTIONARY_URL, {
    params: {
      q_enc: "utf-8",
      st: 11001,
      r_format: "json",
      r_enc: "utf-8",
      r_lt: 10001,
      r_unicode: 0,
      r_escape: 1,
      q: trimmedWord,
    },
  });

  return processData(response.data);
}

function processData(data: AutocompleteResponse): DictionaryEntry[] {
  if (!data.items) {
    return [];
  }

  return data.items.flatMap((items) =>
    items
      .filter((item) => {
        return item.length > 2 && item[0]?.[0] !== undefined && item[2]?.[0] !== undefined;
      })
      .map((item) => ({
        id: crypto.randomUUID(),
        title: item[0][0],
        subtitle: item[2][0],
      }))
  );
}
