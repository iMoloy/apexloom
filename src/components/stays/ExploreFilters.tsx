import { collectionOptions, locationOptions } from "@/lib/stays";

type ExploreFiltersProps = {
  search: string;
  collection: string;
  location: string;
  sort: string;
};

export function ExploreFilters({
  search,
  collection,
  location,
  sort,
}: ExploreFiltersProps) {
  return (
    <form className="explore-filters" action="/explore">
      <label className="filter-field filter-field--search">
        <span>Search</span>
        <input
          defaultValue={search}
          name="search"
          placeholder="Search by city, stay type, or travel mood"
          type="search"
        />
      </label>

      <label className="filter-field">
        <span>Collection</span>
        <select defaultValue={collection} name="collection">
          <option value="">All collections</option>
          {collectionOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Location</span>
        <select defaultValue={location} name="location">
          <option value="">All locations</option>
          {locationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="filter-field">
        <span>Sort by</span>
        <select defaultValue={sort} name="sort">
          <option value="featured">Featured first</option>
          <option value="latest">Latest</option>
          <option value="rating">Highest rating</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
        </select>
      </label>

      <button className="filter-submit" type="submit">
        Apply filters
      </button>
    </form>
  );
}
