"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);

  const linkStyle = (href: string): React.CSSProperties => {
    const active = pathname === href;
    const hover = hovered === href;

    return {
      textDecoration: "none",
      fontSize: 20,
      fontWeight: active ? 900 : 700,
      color: active ? "#1f3d2b" : "#1f3d2b",
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
          }}
        >
          <Image
            src="/park-pulse-logo.svg"
            alt="Park Pulse"
            width={400}
            height={52}
            priority
            style={{ display: "block" }}
          />
        </Link>

        {/* CENTER: NAV LINKS (absolute center) */}
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
          <Link href="/" style={linkStyle("/")} {...hoverProps("/")}>
            Home
          </Link>

          <Link href="/model" style={linkStyle("/model")} {...hoverProps("/model")}>
            Model
          </Link>

          <Link
            href="/ParkRandomizer"
            style={linkStyle("/ParkRandomizer")}
            {...hoverProps("/ParkRandomizer")}
          >
            Park Randomizer
          </Link>

          <Link href="/about" style={linkStyle("/about")} {...hoverProps("/about")}>
            About
          </Link>
        </div>
      </div>
    </nav>
  );
}
