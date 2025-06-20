export interface Page<T> {
  content: T[];         // The actual array of items (e.g., Product[])
  pageable: {           // Information about the current page request
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;        // True if this is the last page
  totalPages: number;   // Total number of pages
  totalElements: number; // Total number of elements across all pages
  size: number;         // Number of elements in the current page
  number: number;       // Current page number (0-indexed by default in Spring)
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;       // True if this is the first page
  numberOfElements: number; // Number of elements in the current page (same as 'size' often)
  empty: boolean;       // True if the content array is empty
}
