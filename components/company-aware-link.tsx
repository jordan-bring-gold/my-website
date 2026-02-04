"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface CompanyAwareLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function CompanyAwareLink({
  href,
  children,
  className,
}: CompanyAwareLinkProps) {
  const pathname = usePathname();

  // Extract company name from pathname if present
  const companyMatch = pathname?.match(/^\/([^\/]+)\/?/);
  const company =
    companyMatch?.[1] &&
    companyMatch[1] !== "portfolio" &&
    companyMatch[1] !== "resume" &&
    companyMatch[1] !== "contact" &&
    companyMatch[1] !== "default"
      ? companyMatch[1]
      : null;

  const finalHref = company ? `/${company}${href}` : href;

  return (
    <Link href={finalHref} className={className}>
      {children}
    </Link>
  );
}
