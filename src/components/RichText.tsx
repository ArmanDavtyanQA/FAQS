"use client";

import DOMPurify from "dompurify";
import { useMemo } from "react";

type Props = {
  html: string;
  className?: string;
};

export default function RichText({ html, className }: Props) {
  const safe = useMemo(() => DOMPurify.sanitize(html), [html]);
  return <div className={className} dangerouslySetInnerHTML={{ __html: safe }} />;
}

