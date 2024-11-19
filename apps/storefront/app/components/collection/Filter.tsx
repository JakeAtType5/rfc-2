import { faAngleDown, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Await } from "@remix-run/react";
import clsx from "clsx";
import { Suspense } from "react";

import type { SanityFilter } from "~/lib/sanity";

type Props = {
  activeItems?: string[];
  className: string;
  items?: SanityFilter[];
  isExpanded?: boolean;
  onClickHeading?: () => void;
  onClickFilter?: () => void;
  title: string;
};

export default function Filter({
  activeItems,
  className,
  items,
  isExpanded,
  onClickHeading,
  onClickFilter,
  title,
}: Props) {
  const renderItem = (item) => {
    const isSelected =
      activeItems?.length > 0 &&
      item.slug &&
      activeItems.some((activeItem) => activeItem == item.slug);

    return (
      <div
        key={item._id}
        className={clsx(
          item.count == 0 ? "--is-disabled" : "",
          isSelected ? "--is-selected" : ""
        )}
        onClick={(event) => onClickFilter({ event, slug: item.slug })}
      >
        <div className="checkbox-container">
          {isSelected && <FontAwesomeIcon icon={faCheck} />}
        </div>
        <p className="semi-bold-16">
          {item.title} {item.count && `(${item.count})`}
        </p>
      </div>
    );
  };

  return (
    <Suspense>
      <Await resolve={items}>
        {(items) => (
          <div
            className={clsx("filter", isExpanded && "--is-expanded", className)}
           >
            <button
              className="filter-heading"
              onClick={(e) => onClickHeading(e)}
            >
              {title} <FontAwesomeIcon icon={faAngleDown} />
            </button>

            {items && (
              <div className="filter-dropdown">
                {items.map((item) => {
                  return item.count == undefined || item?.count >= 1
                    ? renderItem(item)
                    : "";
                })}
              </div>
            )}
          </div>
        )}
      </Await>
    </Suspense>
  );
}