import { useContext, useState } from "react";
import { WebviewContext } from "../../WebviewContext";
import { SearchContainer, SearchResultContainer } from "./styles";
import SearchField from "../../components/SearchField";
import SearchResult from "../../components/SearchResult";
import { SearchCodebase } from "../../types";

export default function Search() {
  const { callApi } = useContext(WebviewContext);

  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<SearchCodebase[]>([]);

  const [disabled, setDisabled] = useState(false);

  const search = async () => {
    if (searchText && searchText.length > 0) {
      setDisabled(true);
      let results = await callApi("search", searchText);
      setDisabled(false);
      console.log(`raider-chat web-raider search results (client): ${results}`);
      setSearchResults(results);
    }
  };

  return (
    <SearchContainer>
      <SearchField
        input={searchText}
        setInput={setSearchText}
        handleSearch={search}
        disabled={disabled}
      />
      <SearchResultContainer>
        {searchResults.map((result, index) => (
          <SearchResult key={index} result={result} />
        ))}
      </SearchResultContainer>
    </SearchContainer>
  );
}
