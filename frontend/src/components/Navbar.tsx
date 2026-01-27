"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function Navbar() {
  const pathname = usePathname();

  const [hovered, setHovered] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile via viewport width (no Tailwind needed)
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768); // md breakpoint
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const items = useMemo(
    () => [
      { href: "/", label: "Home" },
      { href: "/model", label: "Model" },
      { href: "/parkRandomizer", label: "Park Randomizer" },
      { href: "/about", label: "About" },
    ],
    []
  );

  const linkStyle = (href: string): React.CSSProperties => {
    const active = pathname === href;
    const hover = hovered === href;

    return {
      textDecoration: "none",
      fontSize: 20,
      fontWeight: active ? 900 : 700,
      color: "#1f3d2b",
      paddingBottom: 6,
      borderBottom: active
        ? "2px solid #66756dff"
        : hover
        ? "2px solid rgba(22, 91, 54, 0.55)"
        : "2px solid transparent",
      transition: "border-color 140ms ease, transform 140ms ease",
      transform: hover && !active ? "translateY(-1px)" : "translateY(0px)",
      cursor: "pointer",
      whiteSpace: "nowrap",
    };
  };

  const mobileLinkStyle = (href: string): React.CSSProperties => {
    const active = pathname === href;
    return {
      textDecoration: "none",
      color: "#1f3d2b",
      fontWeight: active ? 900 : 800,
      fontSize: 18,
      padding: "12px 10px",
      borderRadius: 10,
      background: active ? "rgba(31, 61, 43, 0.06)" : "transparent",
    };
  };

  const hoverProps = (href: string) => ({
    onMouseEnter: () => setHovered(href),
    onMouseLeave: () => setHovered(null),
  });

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        background: "#eef5ef",
        borderBottom: "1px solid #dfe9df",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        {/* LEFT: LOGO */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
            color: "#1f3d2b",
            zIndex: 2,
            minWidth: 0,
          }}
        >
          <Image
            src="/park-pulse-logo.svg"
            alt="Park Pulse"
            width={400}
            height={52}
            priority
            style={{
              display: "block",
              height: "auto",
              maxWidth: isMobile ? 220 : 400, // prevents logo from eating the whole header on mobile
            }}
          />
        </Link>

        {/* CENTER: NAV LINKS (desktop only) */}
        {!isMobile && (
          <div
            style={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 28,
              alignItems: "center",
            }}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={linkStyle(item.href)}
                {...hoverProps(item.href)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* RIGHT: HAMBURGER (mobile only) */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            style={{
              zIndex: 3,
              border: "1px solid rgba(31,61,43,0.18)",
              background: "rgba(255,255,255,0.55)",
              backdropFilter: "blur(6px)",
              borderRadius: 12,
              padding: "10px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Simple hamburger / X icon */}
            <span style={{ position: "relative", width: 18, height: 14, display: "block" }}>
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: menuOpen ? 6 : 0,
                  width: 18,
                  height: 2,
                  background: "#1f3d2b",
                  borderRadius: 2,
                  transform: menuOpen ? "rotate(45deg)" : "none",
                  transition: "all 160ms ease",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: 6,
                  width: 18,
                  height: 2,
                  background: "#1f3d2b",
                  borderRadius: 2,
                  opacity: menuOpen ? 0 : 1,
                  transition: "all 160ms ease",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 0,
                  top: menuOpen ? 6 : 12,
                  width: 18,
                  height: 2,
                  background: "#1f3d2b",
                  borderRadius: 2,
                  transform: menuOpen ? "rotate(-45deg)" : "none",
                  transition: "all 160ms ease",
                }}
              />
            </span>
          </button>
        )}
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobile && menuOpen && (
        <div
          style={{
            borderTop: "1px solid #dfe9df",
            background: "#eef5ef",
            padding: "10px 16px 14px 16px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={mobileLinkStyle(item.href)}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
