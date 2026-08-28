import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export default function Dropdownadmin() {
  const navigate = useNavigate();

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-full z-[100] justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:shadow-none dark:inset-ring-white/5 dark:hover:bg-white/20">
        administrer
        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5" />
      </MenuButton>

      <MenuItems
        transition
        className="degrade-rouge absolute right-0 z-[100] mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md shadow-lg outline-2 outline-black/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in dark:divide-white/10 dark:bg-gray-800 dark:shadow-none dark:-outline-offset-1 dark:outline-white/10"
      >
        <div className="py-1">
          <MenuItem>
            <button
              type="button"
              onClick={() => navigate("/admin/utilisateurs")}
              className="block w-full text-left px-4 py-2 text-sm text-white data-focus:bg-white/10 data-focus:text-white data-focus:outline-hidden"
            >
              Utilisateurs
            </button>
          </MenuItem>
        </div>
        <div className="py-1">
          <MenuItem>
            <button
              type="button"
              onClick={() => navigate("/admin/quetes")}
              className="block w-full text-left px-4 py-2 text-sm text-white data-focus:bg-white/10 data-focus:text-white data-focus:outline-hidden"
            >
              Quêtes
            </button>
          </MenuItem>
        </div>
        <div className="py-1">
          <MenuItem>
            <button
              type="button"
              onClick={() => navigate("/admin/monstres")}
              className="block w-full text-left px-4 py-2 text-sm text-white data-focus:bg-white/10 data-focus:text-white data-focus:outline-hidden"
            >
              Monstres
            </button>
          </MenuItem>
        </div>
        <div className="py-1">
          <MenuItem>
            <button
              type="button"
              onClick={() => navigate("/admin/objets")}
              className="block w-full text-left px-4 py-2 text-sm text-white data-focus:bg-white/10 data-focus:text-white data-focus:outline-hidden"
            >
              Objets
            </button>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}
