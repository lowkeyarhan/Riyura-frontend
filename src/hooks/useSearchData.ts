import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { MediaType } from "@/src/props/global/mediaType";
import { type SearchProp, SearchSortBy } from "@/src/props/search/search";

const RESULTS_PER_PAGE = 15;

const SEARCH_PARAMS = {
  q: "q",
  page: "page",
  sort: "sort",
  tab: "tab",
} as const;

const isValidSort = (v: string): v is SearchSortBy =>
  Object.values(SearchSortBy).includes(v as SearchSortBy);

const isValidTab = (v: string): v is "all" | "movies" | "tv" =>
  ["all", "movies", "tv"].includes(v);

function parseSearchParams(params: URLSearchParams) {
  const q = params.get(SEARCH_PARAMS.q)?.trim() ?? "";
  const page = Math.max(
    0,
    parseInt(params.get(SEARCH_PARAMS.page) ?? "0", 10) || 0,
  );
  const sort = isValidSort(params.get(SEARCH_PARAMS.sort) ?? "")
    ? (params.get(SEARCH_PARAMS.sort) as SearchSortBy)
    : SearchSortBy.RELEASE_DATE_DESC;
  const tab = isValidTab(params.get(SEARCH_PARAMS.tab) ?? "")
    ? (params.get(SEARCH_PARAMS.tab) as "all" | "movies" | "tv")
    : "all";
  return { q, page, sort, tab };
}

function buildSearchUrl(
  path: string,
  params: { q?: string; page?: number; sort?: SearchSortBy; tab?: string },
) {
  const url = new URL(path, window.location.origin);
  if (params.q) url.searchParams.set(SEARCH_PARAMS.q, params.q);
  if (params.page != null)
    url.searchParams.set(SEARCH_PARAMS.page, String(params.page));
  if (params.sort) url.searchParams.set(SEARCH_PARAMS.sort, params.sort);
  if (params.tab) url.searchParams.set(SEARCH_PARAMS.tab, params.tab);
  return url.pathname + url.search;
}

interface SearchData {
  searchQuery: string;
  isLoading: boolean;
  isLoadingMore: boolean;
  lastQuery: string;
  activeTab: "all" | "movies" | "tv";
  sortBy: SearchSortBy;
  hasMore: boolean;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: "all" | "movies" | "tv") => void;
  setSortBy: (sort: SearchSortBy) => void;
  handleSearch: (query?: string) => Promise<void>;
  loadMore: () => Promise<void>;
  clearSearch: () => void;
  filteredResults: SearchProp[];
}

export function useSearchData(): SearchData {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchProp[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState("");
  const [activeTab, setActiveTabState] = useState<"all" | "movies" | "tv">(
    "all",
  );
  const [sortBy, setSortByState] = useState<SearchSortBy>(
    SearchSortBy.RELEASE_DATE_DESC,
  );
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const lastRestoredKey = useRef<string | null>(null);

  const updateUrl = useCallback(
    (updates: {
      q?: string;
      page?: number;
      sort?: SearchSortBy;
      tab?: string;
    }) => {
      const current = parseSearchParams(searchParams);
      const merged = {
        q: updates.q ?? current.q,
        page: updates.page ?? current.page,
        sort: updates.sort ?? current.sort,
        tab: updates.tab ?? current.tab,
      };
      if (merged.q)
        lastRestoredKey.current = `${merged.q}-${merged.page}-${merged.sort}`;
      router.replace(buildSearchUrl("/search", merged), { scroll: false });
    },
    [router, searchParams],
  );

  const fetchPage = useCallback(
    async (query: string, pageNum: number, sort: SearchSortBy) => {
      const url = new URL("/api/search", window.location.origin);
      url.searchParams.set("q", query);
      url.searchParams.set("page", String(pageNum));
      url.searchParams.set("sort_by", sort);
      const res = await fetch(url.toString());
      const data = await res.json();
      return (data?.results || []) as SearchProp[];
    },
    [],
  );

  const fetchSearch = useCallback(
    async (
      query: string,
      pageNum: number,
      append: boolean,
      sort: SearchSortBy,
    ) => {
      if (!query.trim()) return;

      setIsLoading(true);
      try {
        const items = await fetchPage(query, pageNum, sort);

        if (append) {
          setResults((prev) => [...prev, ...items]);
        } else {
          setResults(items);
        }
        setHasMore(items.length >= RESULTS_PER_PAGE);
        if (!append) setLastQuery(query);
      } catch (error) {
        console.error("Search error:", error);
        if (!append) setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchPage],
  );

  // Restore from URL on mount or when navigating back
  useEffect(() => {
    const { q, page: urlPage, sort, tab } = parseSearchParams(searchParams);
    setActiveTabState(tab);
    setSortByState(sort);

    if (!q) {
      lastRestoredKey.current = null;
      return;
    }

    const urlKey = `${q}-${urlPage}-${sort}`;
    if (lastRestoredKey.current === urlKey) return;
    lastRestoredKey.current = urlKey;

    setSearchQuery(q);
    setLastQuery(q);
    setPage(urlPage);

    if (urlPage === 0) {
      fetchSearch(q, 0, false, sort);
      return;
    }

    // Restore multiple pages
    setIsLoading(true);
    Promise.all(
      Array.from({ length: urlPage + 1 }, (_, i) => fetchPage(q, i, sort)),
    )
      .then((allPages) => {
        setResults(allPages.flat());
        setHasMore((allPages[urlPage]?.length ?? 0) >= RESULTS_PER_PAGE);
      })
      .catch((error) => {
        console.error("Search restore error:", error);
        setResults([]);
      })
      .finally(() => setIsLoading(false));
  }, [searchParams, fetchSearch, fetchPage]);

  const setActiveTab = useCallback(
    (tab: "all" | "movies" | "tv") => {
      setActiveTabState(tab);
      if (lastQuery) updateUrl({ tab });
    },
    [lastQuery, updateUrl],
  );

  const setSortBy = useCallback(
    (sort: SearchSortBy) => {
      setSortByState(sort);
      if (lastQuery) {
        setPage(0);
        updateUrl({ sort, page: 0 });
        fetchSearch(lastQuery, 0, false, sort);
      }
    },
    [lastQuery, updateUrl, fetchSearch],
  );

  const handleSearch = useCallback(
    async (q?: string) => {
      const query = (q ?? searchQuery).trim();
      if (!query) return;

      setPage(0);
      updateUrl({ q: query, page: 0, sort: sortBy, tab: activeTab });
      await fetchSearch(query, 0, false, sortBy);
    },
    [searchQuery, sortBy, activeTab, updateUrl, fetchSearch],
  );

  const loadMore = useCallback(async () => {
    const query = lastQuery.trim();
    if (!query || isLoading) return;

    const nextPage = page + 1;
    updateUrl({ page: nextPage });
    await fetchSearch(query, nextPage, true, sortBy);
    setPage(nextPage);
  }, [lastQuery, isLoading, page, sortBy, updateUrl, fetchSearch]);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setResults([]);
    setLastQuery("");
    setPage(0);
    setHasMore(false);
    router.replace("/search", { scroll: false });
  }, [router]);

  const filteredResults = results.filter(
    (item) =>
      activeTab === "all" ||
      item.media_type ===
        (activeTab === "movies" ? MediaType.Movie : MediaType.TV),
  );

  const isLoadingMore = isLoading && results.length > 0;

  return {
    searchQuery,
    isLoading,
    isLoadingMore,
    lastQuery,
    activeTab,
    sortBy,
    hasMore,
    setSearchQuery,
    setActiveTab,
    setSortBy,
    handleSearch,
    loadMore,
    clearSearch,
    filteredResults,
  };
}
