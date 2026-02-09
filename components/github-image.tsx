"use client";

import { useState, useEffect } from "react";
import { fetchGitHubIssueImage } from "@/lib/github-image-loader";
import { Skeleton } from "@/components/ui/skeleton";

interface GitHubImageProps {
  src: string | undefined;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  showLoadingState?: boolean;
}

/**
 * Smart image component that automatically fetches images from GitHub issues
 * or displays regular image URLs.
 */
export function GitHubImage({
  src,
  alt,
  className = "",
  fallbackSrc,
  showLoadingState = true,
}: GitHubImageProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // If no src, use fallback
    if (!src) {
      setDataUrl(fallbackSrc || null);
      setLoading(false);
      return;
    }

    // If it's a GitHub issue URL, fetch the image
    if (src.includes("github.com/") && src.includes("/issues/")) {
      setLoading(true);
      setError(false);

      fetchGitHubIssueImage(src)
        .then((url) => {
          setDataUrl(url);
          setError(false);
        })
        .catch((err) => {
          console.error("Failed to load GitHub issue image:", err);
          setError(true);
          setDataUrl(fallbackSrc || null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // Regular URL, use as-is
      setDataUrl(src);
      setLoading(false);
    }
  }, [src, fallbackSrc]);

  // Show loading skeleton
  if (loading && showLoadingState) {
    return <Skeleton className={className} />;
  }

  // Show fallback or nothing if error and no fallback
  if (error && !dataUrl) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-muted text-muted-foreground text-sm`}
      >
        Image unavailable
      </div>
    );
  }

  // Show the image
  return dataUrl ? <img src={dataUrl} alt={alt} className={className} /> : null;
}
