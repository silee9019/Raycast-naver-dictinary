import { Action, ActionPanel, List, showToast, Toast } from "@raycast/api";
import { useRef, useState } from "react";
import { DictionaryEntry, getDictionaryData } from "./api.js";
import { type DictionaryCode } from "./dictionaries.js";
import { WordDetail } from "./detail.js";
import { getNaverDictionaryUrl } from "./function.js";

export function DictionarySearch({ dictionaryCode }: { dictionaryCode: DictionaryCode }): JSX.Element {
  const [dictionaryData, setDictionaryData] = useState<DictionaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const latestSearchId = useRef(0);

  const handleSearchTextChange = async (text: string) => {
    const searchId = latestSearchId.current + 1;
    latestSearchId.current = searchId;
    const trimmedSearchText = text.trim();

    if (!trimmedSearchText) {
      setDictionaryData([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await getDictionaryData(trimmedSearchText, dictionaryCode);
      if (latestSearchId.current === searchId) {
        setDictionaryData(data);
      }
    } catch (error) {
      if (latestSearchId.current === searchId) {
        console.error("An error occurred:", error);
        await showToast({
          style: Toast.Style.Failure,
          title: "검색 실패",
          message: error instanceof Error ? error.message : "사전 검색 중 오류가 발생했습니다",
        });
      }
    } finally {
      if (latestSearchId.current === searchId) {
        setIsLoading(false);
      }
    }
  };

  return (
    <List
      throttle
      onSearchTextChange={handleSearchTextChange}
      isLoading={isLoading}
      searchBarPlaceholder="Search word..."
    >
      {dictionaryData?.map((el) => (
        <List.Item
          key={el.id}
          title={el.title}
          subtitle={el.subtitle}
          actions={
            <ActionPanel>
              <Action.Push
                title="상세보기"
                target={
                  <WordDetail
                    dictionaryCode={dictionaryCode}
                    word={el.title}
                    subtitle={el.subtitle}
                    entryId={el.entryId}
                  />
                }
              />
              <Action.CopyToClipboard title="단어 복사" content={el.title} />
              {el.subtitle && (
                <>
                  <Action.CopyToClipboard
                    title="첫 번째 뜻 복사"
                    content={el.subtitle.split(",")[0]?.trim() || el.subtitle}
                    shortcut={{ modifiers: ["cmd"], key: "1" }}
                  />
                  <Action.CopyToClipboard
                    title="전체 뜻 복사"
                    content={el.subtitle}
                    shortcut={{ modifiers: ["cmd"], key: "a" }}
                  />
                </>
              )}
              <Action.OpenInBrowser
                title="네이버 사전에서 열기"
                url={getNaverDictionaryUrl(el.title, dictionaryCode)}
                shortcut={{ modifiers: ["cmd"], key: "`" }}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
}

export default function Command(): JSX.Element {
  return <DictionarySearch dictionaryCode="enko" />;
}
