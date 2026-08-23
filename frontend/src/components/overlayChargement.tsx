import { type ReactNode } from "react";

interface LoadingOverlayProps {
  chargement: boolean;
  texte?: string;
  children: ReactNode;
}

export default function OverlayChargement({
  chargement,
  texte = "Chargement...",
  children,
}: LoadingOverlayProps) {
  return (
    <div className="relative w-full">
      {chargement && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-black/60 backdrop-blur-[2px] cursor-wait rounded-lg">
          <svg
            className="animate-spin h-8 w-8 text-amber-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>

          {texte && (
            <p className="text-sm font-serif text-amber-200 tracking-wide select-none">
              {texte}
            </p>
          )}
        </div>
      )}

      <div
        className={`flex flex-col items-center w-full transition-opacity duration-200 ${
          chargement ? "pointer-events-none select-none opacity-40" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}