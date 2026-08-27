import { useState } from "react";

interface DropdownFormProps {
    choix: string[]
}

export const DropdownForm = ({choix}: DropdownFormProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("Sélectionnez");


    const handleSelect = (c: string) => {
        setSelected(c);
        setIsOpen(false);
    };

    return (
        <div className="flex flex-col w-44 text-sm relative">
            <button type="button" onClick={() => setIsOpen(!isOpen)}
                className="w-full text-left px-4 pr-2 py-2 border rounded bg-white text-gray-800 border-gray-300 shadow-sm hover:bg-gray-50 focus:outline-none"
            >
                <span>{selected}</span>
                <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280" >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <ul className="absolute top-full z-50 w-full bg-white border border-gray-300 rounded shadow-md mt-1 py-2">
                    {choix.map((c) => (
                        <li key={c} className="px-4 py-2 hover:bg-indigo-500 hover:text-white cursor-pointer" onClick={() => handleSelect(c)} >
                            {c}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}