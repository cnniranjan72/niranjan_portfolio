import { useEffect, useState } from "react";
import { caseBySlug } from "./cases";

// Hash routing for case studies: works on static hosting with no rewrite rules.
export const PREFIX = "#/case/";

const readSlug = () => (window.location.hash.startsWith(PREFIX) ? window.location.hash.slice(PREFIX.length) : null);

export function openCase(slug: string) {
  const current = readSlug();
  if (current === slug) return;
  if (current) {
    // Case → case: swap in place so "Back" still returns to the site.
    history.replaceState(window.history.state, "", `${PREFIX}${slug}`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  } else {
    window.location.hash = `${PREFIX}${slug}`;
  }
}

export function closeCase() {
  if (window.history.state?.caseFromSite) window.history.back();
  else history.replaceState(null, "", window.location.pathname + window.location.search);
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

export function useCaseRoute() {
  const [slug, setSlug] = useState<string | null>(() => (typeof window === "undefined" ? null : readSlug()));
  useEffect(() => {
    const onHash = () => {
      const next = readSlug();
      if (next && !window.history.state?.caseFromSite) {
        history.replaceState({ caseFromSite: true }, "", window.location.href);
      }
      setSlug(next);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  return slug && caseBySlug(slug) ? slug : null;
}
