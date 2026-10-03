"use client";

import Image from "next/image";
import { useState } from "react";

interface RecipeImageProps {
  src: string;
  title: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

const dishEmojiByKeyword: [string, string][] = [
  ["palov", "🍚"],
  ["osh", "🍚"],
  ["somsa", "🥟"],
  ["manti", "🥟"],
  ["chuchvara", "🥟"],
  ["lag'mon", "🍜"],
  ["lagmon", "🍜"],
  ["shurva", "🍲"],
  ["sho'rva", "🍲"],
  ["dimlama", "🍲"],
  ["mastava", "🥣"],
  ["norin", "🍜"],
  ["qozon kabob", "🍖"],
  ["chak-chak", "🍯"],
  ["paxlava", "🍯"],
  ["sumalak", "🥣"],
  ["halvaytar", "🍮"],
  ["nishalda", "🍮"],
  ["parvarda", "🍬"],
];

export function RecipeImage({
  src,
  title,
  className = "",
  sizes = "(max-width: 768px) 100vw, 50vw",
  priority = false,
}: RecipeImageProps) {
  const [failedSource, setFailedSource] = useState("");
  const imageFailed = failedSource === src;
  const normalizedTitle = title.toLocaleLowerCase();
  const dishEmoji = dishEmojiByKeyword.find(([keyword]) => normalizedTitle.includes(keyword))?.[1] ?? "🍽️";

  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      {imageFailed ? (
        <div className="recipe-image-placeholder absolute inset-0 grid place-items-center p-5 text-center" role="img" aria-label={`${title} surati vaqtincha mavjud emas`}>
          <div className="flex flex-col items-center gap-3">
            <span className="text-5xl" aria-hidden="true">{dishEmoji}</span>
            <span className="max-w-[18ch] font-heading text-2xl leading-tight sm:text-3xl">{title}</span>
          </div>
        </div>
      ) : (
        <Image
          src={src}
          alt={title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          onError={() => setFailedSource(src)}
        />
      )}
    </div>
  );
}