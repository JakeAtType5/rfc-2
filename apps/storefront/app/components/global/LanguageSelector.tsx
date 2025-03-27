import { Listbox } from "@headlessui/react";
import { useFetcher, useLocation } from "@remix-run/react";
import clsx from "clsx";
import { useState } from "react";
import invariant from "tiny-invariant";

import { ChevronDownIcon } from "~/components/icons/ChevronDown";
import RadioIcon from "~/components/icons/Radio";
import { countries } from "~/data/countries";
import { DEFAULT_LOCALE } from "~/lib/utils";
import { useRootLoaderData } from "~/root";
import type { Locale } from "~/types/shopify";

type Props = {
  align?: "center" | "left" | "right";
};

// Group countries by language
const getLanguageGroups = () => {
  const languageGroups: Record<string, Locale> = {};
  
  Object.keys(countries).forEach((countryKey) => {
    const locale = countries[countryKey];
    const language = locale.language.toLowerCase();
    
    // Only add the first occurrence of each language
    if (!languageGroups[language]) {
      languageGroups[language] = locale;
    }
  });
  
  return languageGroups;
};

export function LanguageSelector({ align = "center" }: Props) {
  const fetcher = useFetcher();
  const [listboxOpen, setListboxOpen] = useState(false);

  const selectedLocale = useRootLoaderData()?.selectedLocale ?? DEFAULT_LOCALE;
  const selectedLanguage = selectedLocale?.language.toLowerCase();
  const { pathname, search } = useLocation();
  const pathWithoutLocale = `${pathname.replace(
    selectedLocale.pathPrefix,
    ""
  )}${search}`;

  const defaultLocale = countries?.["default"];
  const defaultLanguage = defaultLocale?.language.toLowerCase();

  const setLanguage = (newLocale: Locale) => {
    invariant(newLocale, "newLocale is required");
    const newLanguage = newLocale.language.toLowerCase();

    if (newLanguage !== selectedLanguage) {
      const languageUrlPath = getLanguageUrlPath({
        newLocale,
        defaultLanguage,
        pathWithoutLocale,
      });

      // Navigate to the new language URL
      fetcher.submit(
        {
          redirectTo: languageUrlPath,
        },
        { method: "post", action: "/locale?index" }
      );
    }
  };

  const languageGroups = getLanguageGroups();
  const currentLanguageLocale = languageGroups[selectedLanguage] || selectedLocale;

  return (
    <>
      <Listbox onChange={setLanguage} value={currentLanguageLocale}>
        {({ open }: { open: boolean }) => {
          setTimeout(() => setListboxOpen(open));
          return (
            <div className="relative inline-flex">
              <Listbox.Button
                className={clsx(
                  "flex h-[2.4rem] items-center rounded-sm bg-darkGray bg-opacity-0 px-3 py-2 text-sm font-bold duration-150",
                  "hover:bg-opacity-10"
                )}
              >
                <span className="mr-2">
                  {currentLanguageLocale.language}
                </span>
                <ChevronDownIcon className={clsx(open && "rotate-180")} />
              </Listbox.Button>

              <Listbox.Options
                className={clsx(
                  "absolute top-full z-10 mt-3 min-w-[150px] overflow-hidden rounded shadow",
                  align === "center" && "left-1/2 -translate-x-1/2",
                  align === "left" && "left-0",
                  align === "right" && "right-0"
                )}
              >
                <div className="max-h-64 overflow-y-auto bg-white">
                  {listboxOpen && (
                    <Languages
                      selectedLanguage={selectedLanguage}
                      getClassName={(active: boolean) => {
                        return clsx([
                          "p-3 flex justify-between items-center text-left font-bold text-sm cursor-pointer whitespace-nowrap",
                          active ? "bg-darkGray bg-opacity-5" : null,
                        ]);
                      }}
                    />
                  )}
                </div>
              </Listbox.Options>
            </div>
          );
        }}
      </Listbox>
    </>
  );
}

export function Languages({
  getClassName,
  selectedLanguage,
}: {
  getClassName: (active: boolean) => string;
  selectedLanguage: string;
}) {
  const languageGroups = getLanguageGroups();
  
  return (
    <>
      {Object.entries(languageGroups).map(([language, locale]) => {
        const isSelected = language === selectedLanguage;

        return (
          <Listbox.Option key={language} value={locale}>
            {({ active }: { active: boolean }) => (
              <div className={getClassName(active)}>
                <span className="mr-8">{locale.language}</span>
                <RadioIcon checked={isSelected} hovered={active} />
              </div>
            )}
          </Listbox.Option>
        );
      })}
    </>
  );
}

function getLanguageUrlPath({
  newLocale,
  defaultLanguage,
  pathWithoutLocale,
}: {
  newLocale: Locale;
  pathWithoutLocale: string;
  defaultLanguage: string;
}) {
  let languagePrefixPath = "";
  const language = newLocale.language.toLowerCase();
  const country = newLocale.country.toLowerCase();
  
  if (language !== defaultLanguage) {
    languagePrefixPath = `/${language}-${country}`;
  }
  
  return `${languagePrefixPath}${pathWithoutLocale}`;
}