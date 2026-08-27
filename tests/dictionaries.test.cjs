const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

function loadTypeScriptModule(relativePath) {
  const sourcePath = path.join(__dirname, "../src", relativePath);
  const previousLoader = require.extensions[".ts"];
  require.extensions[".ts"] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const javascript = ts
      .transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
      })
      .outputText.replace(/(\.\/[^"']+)\.js/g, "$1.ts");
    module._compile(javascript, filename);
  };

  try {
    return require(sourcePath);
  } finally {
    require.extensions[".ts"] = previousLoader;
  }
}

function loadDictionaries() {
  const source = fs.readFileSync(path.join(__dirname, "../src/dictionaries.ts"), "utf8");
  const javascript = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2021 },
  }).outputText;
  const module = { exports: {} };
  new Function("exports", "module", javascript)(module.exports, module);
  return module.exports.dictionaries;
}

test("dictionary routes keep the verified Naver endpoints and meaning fields", () => {
  const dictionaries = loadDictionaries();

  assert.deepEqual(dictionaries, {
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
  });
});

test("autocomplete selection keeps the second same-title entry through detail and URL", async () => {
  const axios = require("axios");
  const originalGet = axios.get;
  const autocompleteEntries = [
    [["reloj"], [], [], ["시계"], ["a94f831ecbb340ee90bc12729ee8e9e6"]],
    [["reloj"], [], [], ["시계"], ["850a351d640f41d29d294051ca1b7b1b"]],
  ];
  const detailItems = [
    {
      entryId: "a94f831ecbb340ee90bc12729ee8e9e6",
      handleEntry: "reloj",
      meansCollector: [{ partOfSpeech: "명사", means: [{ value: "첫 번째 상세" }] }],
    },
    {
      entryId: "850a351d640f41d29d294051ca1b7b1b",
      handleEntry: "reloj",
      meansCollector: [{ partOfSpeech: "명사", means: [{ value: "두 번째 상세" }] }],
    },
  ];

  axios.get = async (url) =>
    url.includes("/ac")
      ? { data: { items: [autocompleteEntries] } }
      : { data: { searchResultMap: { searchResultListMap: { WORD: { items: detailItems } } } } };

  try {
    const { getDictionaryData } = loadTypeScriptModule("api.ts");
    const { fetchWordDetail, getNaverEntryUrl } = loadTypeScriptModule("detail-api.ts");
    const entries = await getDictionaryData("reloj", "esko");
    const selected = entries[1];
    const detail = await fetchWordDetail(selected.title, "esko", selected.entryId);

    assert.equal(entries[0].id, "a94f831ecbb340ee90bc12729ee8e9e6");
    assert.equal(entries[1].id, "850a351d640f41d29d294051ca1b7b1b");
    assert.notEqual(entries[0].id, entries[1].id);
    assert.equal(selected.entryId, "850a351d640f41d29d294051ca1b7b1b");
    assert.equal(detail.entryId, "850a351d640f41d29d294051ca1b7b1b");
    assert.deepEqual(detail.meanings[0].definitions, ["두 번째 상세"]);
    assert.equal(
      getNaverEntryUrl("esko", detail.entryId),
      "https://dict.naver.com/eskodict/#/entry/esko/850a351d640f41d29d294051ca1b7b1b"
    );
    assert.equal(await fetchWordDetail(selected.title, "esko", "missing"), null);
  } finally {
    axios.get = originalGet;
  }
});
