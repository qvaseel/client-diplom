"use client";

import { PAGES } from "@/shared/constants/pages";
import { Heading, Link, TabNav } from "@radix-ui/themes";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { AcademicCapIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import useAuthStore from "@/store/authStore";

interface Props {
  className?: string;
}

export const Sidebar: React.FC<Props> = () => {
  const pathname = usePathname();
  const { decodedUser } = useAuthStore();
  const [pages, setPages] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (decodedUser) {
      const role = decodedUser?.roles?.[0] || "STUDENT";
      const rolePages =
        role === "ADMIN"
          ? PAGES.ADMIN
          : role === "STUDENT"
          ? PAGES.STUDENT
          : role === "TEACHER"
          ? PAGES.TEACHER
          : PAGES.STUDENT;
      setPages(rolePages);
    }
  }, [decodedUser]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);
  const closeSidebar = () => setIsOpen(false);

  return (
    <div>
      <div className="lg:hidden p-4 absolute top-0 left-0 z-51">
        <button onClick={toggleSidebar}>
          {isOpen ? (
            <XMarkIcon className="h-8 w-8 text-gray-800" />
          ) : (
            <Bars3Icon className="h-8 w-8 text-gray-800" />
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 h-screen w-[240px] bg-white shadow-xl p-6
          z-50 transform transition-transform duration-300 ease-in-out pt-16 lg:pt-6
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center gap-2 mb-6">
          <AcademicCapIcon className="h-10 w-10" />
          <Heading>Веб-Вуз</Heading>
        </div>
        {!!pages.length && (
          <TabNav.Root className="flex-col items-left w-full">
            {pages.map((link, index) => (
              <TabNav.Link
                className="w-full"
                asChild
                active={pathname === `/${link.link}`}
                key={index}
              >
                <Link href={`/${link.link}`} onClick={() => setIsOpen(false)}>
                  <link.icon className="h-5 w-5 mr-3" />
                  {link.title}
                </Link>
              </TabNav.Link>
            ))}
          </TabNav.Root>
        )}
      </div>
    </div>
  );
};