import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useEffect, useState, useRef, useCallback } from "react";

import ExpandedNavigation from "~/components/global/ExpandedNavigation";
import HeaderActions from "~/components/global/HeaderActions";
import Navigation from "~/components/global/Navigation";
import { Link } from "~/components/Link";
import { useRootLoaderData } from "~/root";

import { NavigationStateContext } from "./NavigationStateWrapper";

/**
 * A server component that specifies the content of the header on the website
 */
export default function Header() {
  const { layout } = useRootLoaderData();
  const { topLevelLinks, expandedLinks } = layout || {};
  const { navIsOpen, openNav, closeNav } = useContext(NavigationStateContext);
  
  const [isVisible, setIsVisible] = useState(true);
  const [scrollPosition, setScrollPosition] = useState(0);
  const headerRef = useRef<HTMLElement>(null);
  const scrollThreshold = 100; // Minimum scroll amount before hiding header
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);

  // Debounced scroll handler for better performance
  const handleScroll = useCallback(() => {
    const currentScrollPos = window.scrollY;
    
    // Always show the header when at the top of the page
    if (currentScrollPos < 50) {
      setIsVisible(true);
    } else {
      // Determine scroll direction
      const isScrollingUp = currentScrollPos < scrollPosition;
      
      // Show header when scrolling up, hide when scrolling down
      // Only trigger if we've scrolled past the threshold
      if (Math.abs(currentScrollPos - scrollPosition) > 10) {
        setIsVisible(isScrollingUp);
      }
    }
    
    setScrollPosition(currentScrollPos);
  }, [scrollPosition]);

  // Handle scroll events with debouncing
  useEffect(() => {
    const debouncedHandleScroll = () => {
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      scrollTimer.current = setTimeout(() => {
        handleScroll();
      }, 10);
    };

    window.addEventListener('scroll', debouncedHandleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', debouncedHandleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, [handleScroll]);

  return (
    <header 
      className={`navigation-bar ${isVisible ? 'navigation-bar--visible' : 'navigation-bar--hidden'}`} 
      role="banner"
      ref={headerRef}
    >
      <div className="content-wrapper">
        <div className="desktop-only navigation-container">
          {topLevelLinks && (
            <Navigation
              menuLinks={topLevelLinks}
              className="navigation-links"
            />
          )}
          <FontAwesomeIcon icon={faEllipsisH} onClick={openNav} />
        </div>

        <Link to={"/index"} key={"logo"}>
          {/* <img src="/images/logo.png" alt="Koyo." /> */}
          <p className="bold-24 rfc-logo">KOYO  こうよう</p>
        </Link>

        {/* Accounts, country selector + cart toggle */}
        <HeaderActions />

        {expandedLinks && (
          <ExpandedNavigation
            menuLinks={expandedLinks}
            open={navIsOpen}
            onOpen={openNav}
            onClose={closeNav}
          />
        )}
      </div>
    </header>
  );
}
