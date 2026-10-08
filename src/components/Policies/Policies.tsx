// Policies page: a single document listing every store policy, with a sidebar
// that acts as anchor navigation — clicking a link smoothly scrolls to the
// matching headline and the link for the section in view stays highlighted.
import React, { useEffect, useRef, useState } from "react";
import "./Policies.css";
import TermOfService from "./TermOfService";
import PrivacyPolicy from "./PrivacyPolicy";
import ReturnPolicy from "./ReturnPolicy";

const SECTIONS = [
  { id: "term-of-service", label: "Terms of Service" },
  { id: "privacy-policy", label: "Privacy Policy" },
  { id: "return-policy", label: "Return Policy" },
] as const;

const Policies: React.FC = () => {
  const contentRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (hash && SECTIONS.some((section) => section.id === hash)) return hash;
    }
    return SECTIONS[0].id;
  });

  // Scroll the matching section to the top of the scrollable content panel.
  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (target && typeof target.scrollIntoView === "function") {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveId(id);
  };

  const handleNavClick = (event: React.MouseEvent, id: string) => {
    event.preventDefault();
    scrollToSection(id);
  };

  // Highlight whichever section is currently in view as the user scrolls.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const isMobile =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(max-width: 640px)").matches
        : window.innerWidth <= 640;
    const root = isMobile ? null : contentRef.current;
    if (!isMobile && !root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { root, rootMargin: "0px 0px -60% 0px", threshold: [0.1, 0.5, 1] }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Honor a deep link such as /policies#return-policy on first render.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && SECTIONS.some((section) => section.id === hash)) {
      requestAnimationFrame(() => scrollToSection(hash));
    }
  }, []);

  return (
    <div className="policies-container">
      <aside className="policies-sidebar">
        <ul>
          {SECTIONS.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={activeId === id ? "active" : ""}
                onClick={(event) => handleNavClick(event, id)}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
      <main className="policies-content" ref={contentRef}>
        <TermOfService />
        <PrivacyPolicy />
        <ReturnPolicy />
      </main>
    </div>
  );
};

export default Policies;
