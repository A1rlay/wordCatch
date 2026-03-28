"use client";

import { useState } from "react";

export function DeleteButton({
  action,
  label = "this item",
}: {
  action: () => Promise<void>;
  label?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-red-500/15 px-4 py-2 text-xs font-bold text-red-400 ring-1 ring-inset ring-red-500/30 transition-colors hover:bg-red-500/25 hover:text-red-300"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl">
            <h2 className="text-xl font-extrabold text-[#000D71]">Delete {label}?</h2>
            <p className="mt-2 text-sm text-gray-500">This action cannot be undone.</p>
            <div className="mt-6 flex gap-3">
              <form action={action}>
                <button
                  type="submit"
                  className="rounded-full bg-red-500 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-600"
                >
                  Yes, delete
                </button>
              </form>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border-2 border-gray-200 px-6 py-3 text-sm font-bold text-gray-500 transition-colors hover:border-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
