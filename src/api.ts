import axios from "axios";
import { dictionaries, type DictionaryCode } from "./dictionaries.js";
import { DictionaryEntry } from "./types.js";

export type { DictionaryEntry } from "./types.js";

const REQUEST_TIMEOUT_MS = 5000;

/**
 * 네이버 자동완성 API 응답 구조
 * items[categoryIndex][entryIndex][fieldIndex][valueIndex]
 * - fieldIndex 0: 표제어
 * - 뜻 필드는 사전별 설정의 autocompleteMeaningIndex로 선택
 */
interface AutocompleteResponse {
  items?: AutocompleteField[][];
}

/**
 * 자동완성 항목의 필드 구조
 * - item[0][0]: 표제어
 * - item[사전별 의미 필드][0]: 첫 번째 뜻
 */
type AutocompleteField = string[][];

export async function getDictionaryData(word: string, dictionaryCode: DictionaryCode): Promise<DictionaryEntry[]> {
  if (!word?.trim()) {
    return [];
  }

  const trimmedWord = word.trim();

  const response = await axios.get<AutocompleteResponse>(dictionaries[dictionaryCode].autocompleteUrl, {
    timeout: REQUEST_TIMEOUT_MS,
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

  return processData(response.data, dictionaryCode);
}

function processData(data: AutocompleteResponse, dictionaryCode: DictionaryCode): DictionaryEntry[] {
  if (!data.items) {
    return [];
  }

  return data.items.flatMap((items) =>
    items
      .map((item): DictionaryEntry | null => {
        const title = item[0]?.[0];
        const subtitle: string | undefined = item[dictionaries[dictionaryCode].autocompleteMeaningIndex ?? -1]?.[0];
        if (!title) {
          return null;
        }

        const entryId = item[4]?.[0];
        return {
          id: entryId || `${title}::${subtitle || ""}`,
          entryId,
          title,
          subtitle,
        };
      })
      .filter((entry): entry is DictionaryEntry => entry !== null)
  );
}
