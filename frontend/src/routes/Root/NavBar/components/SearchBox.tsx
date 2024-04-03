import { TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";

const SearchBox = ({
  searchText,
  handleSearchSubmit,
  handleSearchValueChange,
  toggleSearchFocus,
}: {
  searchText: string;
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleSearchValueChange: (e: React.FormEvent<HTMLInputElement>) => void;
  toggleSearchFocus: () => void;
}) => {
  return (
    <form onSubmit={handleSearchSubmit}>
      <TextInput
        placeholder="Search for products"
        name="search"
        leftSection={<IconSearch />}
        value={searchText}
        onChange={handleSearchValueChange}
        onFocus={toggleSearchFocus}
        onBlur={toggleSearchFocus}
      />
    </form>
  );
};

export default SearchBox;
