"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, Compass, Heart, House, LoaderCircle, Menu, Search, ShoppingBag, Store, X } from "lucide-react";
import { BrandLogo } from "@/components/store/brand-logo";
import { AuthButton } from "@/components/store/auth-button";
import styles from "./site-header.module.css";

type SiteHeaderProps = { cartCount: number; savedCount: number };
type SearchSuggestion = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  image: string;
};

export function SiteHeader({ cartCount, savedCount }: SiteHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (!searchOpen || trimmedQuery.length < 2) return;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");

      try {
        const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`Search suggestions returned ${response.status}.`);
        const data = await response.json() as { suggestions: SearchSuggestion[] };
        setSuggestions(data.suggestions);
      } catch (error) {
        if (controller.signal.aborted) return;
        console.error("Unable to load search suggestions.", error);
        setSuggestions([]);
        setSearchError("Suggestions couldn’t load. Press Enter to search anyway.");
      } finally {
        if (!controller.signal.aborted) setSearchLoading(false);
      }
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !searchRef.current?.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [searchOpen]);

  const openSearch = () => {
    setSearchOpen(true);
    window.setTimeout(() => searchInputRef.current?.focus(), 0);
  };

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      searchInputRef.current?.focus();
      return;
    }
    setSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setSearchOpen(false);
      return;
    }

    if (event.key === "ArrowDown" && suggestions.length > 0) {
      event.preventDefault();
      setActiveSuggestion((current) => (current + 1) % suggestions.length);
    } else if (event.key === "ArrowUp" && suggestions.length > 0) {
      event.preventDefault();
      setActiveSuggestion((current) => (current <= 0 ? suggestions.length - 1 : current - 1));
    } else if (event.key === "Enter" && activeSuggestion >= 0 && suggestions[activeSuggestion]) {
      event.preventDefault();
      const selected = suggestions[activeSuggestion];
      setSearchOpen(false);
      router.push(`/products/${selected.slug}`);
    }
  };

  return (
    <>
      <header
        className={`
        [height:68px] [display:flex] [align-items:center] [justify-content:space-between]
        [padding:0_5vw] [border-bottom:1px_solid_var(--line)] [position:relative] [z-index:1]
        [background:var(--brand-paper)] max-[960px]:[height:70px]
        max-[960px]:[padding:0_20px]
      `}
      >
        <button
          className="[display:none] max-[960px]:[display:block]"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={21} />
        </button>
        <div
          className={`
          [display:flex] [align-items:center] [gap:12px] [&_.brand-logo]:[width:58px]
          [&_.brand-logo]:[height:58px] [&>div]:[display:flex] [&>div]:[flex-direction:column]
          [&>div]:[gap:3px] [&_strong]:[font:600_25px_var(--brand-serif)] [&_strong]:[letter-spacing:.14em]
          [&_small]:[font:500_7px_var(--sans)] [&_small]:[letter-spacing:.18em] [&_small]:[color:var(--muted)]
          max-[960px]:[&_.brand-logo]:[width:48px] max-[960px]:[&_.brand-logo]:[height:48px]
          max-[960px]:[&_strong]:[font-size:16px] max-[960px]:[&_small]:[font-size:6px]
        `}
        >
          <BrandLogo href="#top" label="Right Intent" />
          <div>
            <strong>RIGHT INTENT</strong>
            <small>BUILD WITH PURPOSE.</small>
          </div>
        </div>
        <nav
          className={`${mobileOpen ? "main-nav is-open" : "main-nav"} [display:flex] [flex:1] [justify-content:center] [gap:30px] [margin-left:0] [font:11px_var(--sans)] [&_a]:[transition:color_.2s_ease] [&_a:hover]:[color:var(--terra)] max-[960px]:[position:fixed] max-[960px]:[inset:0] max-[960px]:[z-index:20] max-[960px]:[display:none] max-[960px]:[flex-direction:column] max-[960px]:[align-items:center] max-[960px]:[justify-content:center] max-[960px]:[gap:25px] max-[960px]:[margin:0] max-[960px]:[background:var(--brand-paper)] max-[960px]:[font-size:14px] max-[960px]:[&.is-open]:[display:flex]`}
          aria-label="Main navigation"
        >
          <button
            className="[display:none] max-[960px]:[display:block] max-[960px]:[position:absolute] max-[960px]:[top:24px] max-[960px]:[right:20px]"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          >
            <X size={21} />
          </button>
          <Link href="/products" onClick={() => setMobileOpen(false)}>
            Shop all
          </Link>
          <Link href="/category/objects" onClick={() => setMobileOpen(false)}>
            Collections
          </Link>
          <Link href="/#intelligent-trader" onClick={() => setMobileOpen(false)}>
            Intelligent Trader
          </Link>
          <Link href="/#story" onClick={() => setMobileOpen(false)}>
            Our story
          </Link>
          <Link href="/#journal" onClick={() => setMobileOpen(false)}>
            Journal
          </Link>
        </nav>
        <div
          className={`
          [&_button]:[transition:color_.2s_ease] [&_button]:[position:relative] [&_button]:[display:flex]
          [&_button:hover]:[color:var(--terra)] [display:flex] [align-items:center] [gap:20px]
          [&_small]:[position:absolute] [&_small]:[top:-9px] [&_small]:[right:-9px]
          [&_small]:[min-width:14px] [&_small]:[height:14px] [&_small]:[border-radius:50%]
          [&_small]:[display:grid] [&_small]:[place-items:center] [&_small]:[font:9px_var(--mono)]
          [&_small]:[color:var(--paper)] [&_small]:[background:var(--terra)] max-[960px]:[gap:14px]
        `}
        >
          <AuthButton />
          {!isSearchPage && <div className={styles.searchControl} ref={searchRef}>
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Open search"}
            aria-expanded={searchOpen}
            onClick={() => searchOpen ? setSearchOpen(false) : openSearch()}
          >
            {searchOpen ? <X size={19} /> : <Search size={19} />}
          </button>
          {searchOpen && (
            <div className={styles.searchPanel} id="header-search-panel">
              <form className={styles.searchForm} onSubmit={submitSearch}>
                <Search size={18} aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  type="search"
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActiveSuggestion(-1);
                    setSuggestions([]);
                    setSearchError("");
                    setSearchLoading(event.target.value.trim().length >= 2);
                  }}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search journals, planners, gifts..."
                  aria-label="Search products"
                  role="combobox"
                  aria-autocomplete="list"
                  aria-expanded={searchOpen}
                  aria-controls="header-search-panel"
                  aria-activedescendant={activeSuggestion >= 0 ? `search-suggestion-${activeSuggestion}` : undefined}
                />
                {searchLoading && <LoaderCircle className={styles.spinner} size={16} aria-label="Loading suggestions" />}
                <button className={styles.searchSubmit} type="submit" disabled={!query.trim()}>
                  Search
                </button>
              </form>

              {query.trim().length < 2 ? (
                <div className={styles.popularSearches}>
                  <span>Explore a collection</span>
                  <div>
                    {["Journals", "Planners", "Objects", "Gifts"].map((term) => (
                      <button type="button" key={term} onClick={() => setQuery(term)}>
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              ) : searchLoading ? (
                <p className={styles.searchMessage} role="status">Finding matching products…</p>
              ) : searchError ? (
                <p className={styles.searchMessage} role="status">{searchError}</p>
              ) : suggestions.length === 0 ? (
                <p className={styles.searchMessage} role="status">No products found for “{query.trim()}”. Press Enter to see search results.</p>
              ) : (
                <div className={styles.suggestionList} id="header-search-suggestions" role="listbox" aria-label="Product suggestions">
                  {suggestions.map((suggestion, index) => (
                    <Link
                      className={`${styles.suggestion} ${activeSuggestion === index ? styles.suggestionActive : ""}`}
                      id={`search-suggestion-${index}`}
                      role="option"
                      aria-selected={activeSuggestion === index}
                      href={`/products/${suggestion.slug}`}
                      key={suggestion.id}
                      onClick={() => setSearchOpen(false)}
                    >
                      <span className={styles.suggestionImage}>
                        {suggestion.image && <Image src={suggestion.image} alt="" width={48} height={48} unoptimized />}
                      </span>
                      <span className={styles.suggestionDetails}>
                        <strong>{suggestion.name}</strong>
                        <small>{suggestion.category}</small>
                      </span>
                      <span className={styles.suggestionPrice}>₹{suggestion.price.toLocaleString("en-IN")}</span>
                    </Link>
                  ))}
                </div>
              )}

              {query.trim().length >= 2 && (
                <button className={styles.viewAllResults} type="button" onClick={() => router.push(`/search?q=${encodeURIComponent(query.trim())}`)}>
                  View all results for “{query.trim()}” <ArrowRight size={15} />
                </button>
              )}
            </div>
          )}
          </div>}
          <Link
            href="/wishlist"
            aria-label="Saved items"
            className="[&_small:empty]:[display:none] max-[960px]:[display:none]"
          >
            <Heart size={19} fill={savedCount ? "currentColor" : "none"} />
            <small>{savedCount || ""}</small>
          </Link>
          <Link href="/cart" aria-label="Open cart" className="cart-button [&_small:empty]:[display:none]">
            <ShoppingBag size={19} />
            <small>{cartCount || ""}</small>
          </Link>
        </div>
      </header>
      {!isSearchPage && <form className={styles.mobileSearch} role="search" onSubmit={submitSearch}>
        <Search size={18} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search journals, planners & gifts"
          aria-label="Search products"
        />
        <button type="submit" aria-label="Submit product search" disabled={!query.trim()}>
          <ArrowRight size={17} aria-hidden="true" />
        </button>
      </form>}
      <nav className={styles.mobileBottomNav} aria-label="Quick shop navigation">
        <Link href="/#top" aria-current={pathname === "/" ? "page" : undefined}>
          <House size={19} aria-hidden="true" />
          <span>Home</span>
        </Link>
        <Link href="/products" aria-current={pathname.startsWith("/products") ? "page" : undefined}>
          <Store size={19} aria-hidden="true" />
          <span>Shop</span>
        </Link>
        <Link href="/category/objects" aria-current={pathname.startsWith("/category") ? "page" : undefined}>
          <Compass size={19} aria-hidden="true" />
          <span>Discover</span>
        </Link>
        <Link href="/wishlist" aria-current={pathname === "/wishlist" ? "page" : undefined}>
          <Heart size={19} aria-hidden="true" />
          <span>Saved</span>
        </Link>
        <Link href="/cart" aria-current={pathname === "/cart" ? "page" : undefined}>
          <ShoppingBag size={19} aria-hidden="true" />
          <span>Bag{cartCount > 0 ? ` (${cartCount})` : ""}</span>
        </Link>
      </nav>
    </>
  );
}
