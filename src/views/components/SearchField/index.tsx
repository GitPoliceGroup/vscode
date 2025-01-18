import { CircularProgress, IconButton } from "@mui/material";
import {
  SearchInput,
  SearchInputContainer,
  SearchInputIconContainer,
} from "./styles";
import { Search } from "@mui/icons-material";

export type SearchFieldProps = {
  input: string;
  setInput: (it: string) => void;
  handleSearch: () => void;
  disabled: boolean;
};

export default function SearchField({
  input,
  setInput,
  handleSearch,
  disabled,
}: SearchFieldProps) {
  const onEnter = (evt: React.KeyboardEvent) => {
    if (evt.key === "Enter") {
      evt.preventDefault();
      handleSearch();
    }
  };
  return (
    <SearchInputContainer>
      <SearchInput
        maxRows={10}
        placeholder="Search now..."
        multiline
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onEnter}
        endAdornment={
          <SearchInputIconContainer position="end">
            {disabled ? (
              <CircularProgress size={20} />
            ) : (
              <IconButton
                aria-label="send chat"
                edge="end"
                onClick={handleSearch}
                disabled={
                  disabled || !input || input.length == 0 ? true : false
                }
              >
                <Search />
              </IconButton>
            )}
          </SearchInputIconContainer>
        }
      />
    </SearchInputContainer>
  );
}
