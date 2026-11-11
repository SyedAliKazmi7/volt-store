"use client";

import { useRef, useState } from "react";

const MAX_IMAGES = 6;

export default function ImageUploader({ images, onChange }) {
  const input = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");

  const upload = async (fileList) => {
    const room = MAX_IMAGES - images.length;
    const files = Array.from(fileList).slice(0, room);

    if (files.length === 0) {
      setError(`A product can have up to ${MAX_IMAGES} pictures.`);
      return;
    }

    setError("");
    setUploading(true);
    const added = [];

    for (const file of files) {
      const body = new FormData();
      body.append("file", file);

      try {
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || "Upload failed.");
          break;
        }
        added.push(data.url);
      } catch {
        setError("Could not reach the server. Try again.");
        break;
      }
    }

    if (added.length > 0) onChange([...images, ...added]);
    setUploading(false);
    if (input.current) input.current.value = "";
  };

  const remove = (index) => onChange(images.filter((_, i) => i !== index));
  const makeMain = (index) => onChange([images[index], ...images.filter((_, i) => i !== index)]);

  return (
    <div className="mt-5">
      {/* Thumbnails */}
      {images.length > 0 && (
        <ul className="mb-4 grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <li key={url} className="rise group relative block aspect-square overflow-hidden rounded-xl border border-white/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110" />

              {index === 0 ? (
                <span className="absolute left-1 top-1 rounded-full bg-volt px-2 py-0.5 text-[10px] font-bold text-ink">Main</span>
              ) : (
                <button
                  type="button"
                  onClick={() => makeMain(index)}
                  className="absolute left-1 top-1 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-bold hover:bg-volt hover:text-ink"
                >
                  Make main
                </button>
              )}

              <button
                type="button"
                aria-label="Remove picture"
                onClick={() => remove(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 font-bold hover:bg-hot"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Drop zone */}
      <button
        type="button"
        disabled={uploading}
        onClick={() => input.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          upload(event.dataTransfer.files);
        }}
        className={`w-full rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all duration-300 disabled:cursor-wait ${
          dragging
            ? "scale-[1.02] border-volt bg-volt/10 shadow-[0_0_40px_rgba(182,255,46,0.25)]"
            : "border-white/20 hover:border-volt hover:bg-white/5"
        } ${uploading ? "animate-pulse" : ""}`}
      >
        <span key={uploading ? "busy" : "idle"} className="rise font-bold">
          {uploading ? "Uploading…" : "Click to choose pictures, or drop them here"}
        </span>
        <span className="mt-1 block text-xs text-mist">JPG, PNG or WebP · up to 4 MB each · {images.length}/{MAX_IMAGES}</span>
      </button>

      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hidden
        onChange={(event) => upload(event.target.files)}
      />

      {error && <p className="rise mt-3 block text-sm font-bold text-hot">{error}</p>}
    </div>
  );
}