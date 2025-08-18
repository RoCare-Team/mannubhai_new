"use client";
import { memo } from "react";

const LazyMapEmbed = memo(({ src, title }) => (
  <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg shadow mt-2">
    <iframe
      src={src}
      width="100%"
      height="100%"
      style={{
        border: 0,
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={title}
      className="rounded-lg"
    />
  </div>
));

LazyMapEmbed.displayName = 'LazyMapEmbed';
export default LazyMapEmbed;