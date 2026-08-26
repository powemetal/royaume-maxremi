interface BarreRechercheProps {
  placeholder?: string;
  className?: string;
}

export default function BarreRecherche({
  placeholder = "Rechercher...",
  className,
}: BarreRechercheProps) {
  return (
    <div
      className={`flex items-center border pl-3 gap-2 bg-white border-gray-500/30 h-[46px] rounded-md overflow-hidden w-full ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 30 30"
        fill="#6B7280"
      >
        <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full h-full outline-none text-gray-500 placeholder-gray-500 text-sm"
      />
    </div>
  );
}
