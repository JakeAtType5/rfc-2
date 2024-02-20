import {
  faAngleRight,
  faCheck,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Money, ShopifyAnalyticsPayload } from "@shopify/hydrogen";
import type { Product } from "@shopify/hydrogen/storefront-api-types";

import SanityImage from "~/components/media/SanityImage";
import type { SanityProductPage } from "~/lib/sanity";
import { formatDate, scrollToElement } from "~/lib/utils";
import { useRootLoaderData } from "~/root";

type Props = {
  sanityProduct: SanityProductPage;
  storefrontProduct: Product;
  analytics: ShopifyAnalyticsPayload;
  anchorLinkID: string;
  isInStock: boolean;
  isFutureRelease: boolean;
  onCustomiseClick?: () => void;
  shipping?: {
    price?: number;
    city?: string;
    date?: string;
    /* todo: extract into ShippingObject for reuse*/
  };
};

export default function ProductHero({
  sanityProduct,
  storefrontProduct,
  // storefrontVariants,
  // selectedVariant,
  analytics,
  anchorLinkID,
  isFutureRelease,
  isInStock,
  shipping,
  onCustomiseClick,
}: Props) {
  const { sanityDataset, sanityProjectID } = useRootLoaderData();

  const formattedReleaseDate = formatDate({
    value: sanityProduct?.drop.releaseDate,
    format: "w do m @ h:00",
  });

  return (
    <section className="product-hero" id={anchorLinkID}>
      <div className="background-effect" />
      <div className="product-preview">
        <div className="image-container">
          <SanityImage
            // crop={image?.crop}
            dataset={sanityDataset}
            layout="responsive"
            projectId={sanityProjectID}
            sizes={["30vw, 100vw"]}
            src={sanityProduct.printImage?.asset?._ref}
          />
        </div>
      </div>

      <div className="product-details">
        {/* Title */}
        {storefrontProduct?.title && (
          <h1 className="bold-56 product-title">{storefrontProduct.title}</h1>
        )}

        {/* Artist */}
        {storefrontProduct?.vendor && (
          <p className="semi-bold-24 product-artist">
            by {storefrontProduct.vendor}
          </p>
        )}

        {/* Description */}
        {sanityProduct?.description && (
          <p className="semi-bold-16 product-description">
            {sanityProduct.description}
          </p>
        )}

        {/* Badges & buttons */}
        {!isInStock && !isFutureRelease && (
          <span className="semi-bold-16 badge button--large badge--is-sold-out">
            Sold out
          </span>
        )}
        {isFutureRelease && (
          <span className="semi-bold-16 badge button--large badge--is-coming-soon">
            Dropping on {formattedReleaseDate}
          </span>
        )}

        {isInStock && !isFutureRelease && (
          <button
            className="button--large semi-bold-16"
            onClick={(e) => onCustomiseClick()}
          >
            Customise
            <FontAwesomeIcon icon={faAngleRight} />
          </button>
        )}

        {/* Messages */}
        {isInStock && (
          <div className="semi-bold-14 product-messages">
            <div className="product-message">
              <FontAwesomeIcon icon={faCheck} />
              <p>Starts from £160.00</p>
            </div>
            <div className="product-message">
              <FontAwesomeIcon icon={faCheck} />
              <p>1 of only {sanityProduct.maxUnits} editions printed</p>
            </div>
            <div className="product-message">
              {shipping?.city ? (
                <>
                  <FontAwesomeIcon icon={faCheck} />
                  <p>
                    {shipping.price == 0
                      ? "Free delivery "
                      : `£${shipping.price} delivery `}
                    to {shipping.city} by {shipping.date}
                  </p>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCircle} beat />
                  <p>Calculating delivery time...</p>
                </>
              )}
            </div>
            <div className="product-message">
              <FontAwesomeIcon icon={faCheck} />
              <p>14 days free return</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// import clsx from "clsx";
// import ProductForm from "~/components/product/Form";
// import { Label } from "../global/Label";

// export default function ProductWidget({
//   sanityProduct,
//   storefrontProduct,
//   storefrontVariants,
//   selectedVariant,
//   analytics,
// }: Props) {

//   return (
//   );
// }

// //   return (

// //       {/* Sold out */}
// //       {!availableForSale && (
// //         <div className="mb-3 text-xs font-bold uppercase text-darkGray">
// //           <Label _key="product.soldOut" />
// //         </div>
// //       )}

// //       {/* Prices */}
// //       <ProductPrices
// //         storefrontProduct={storefrontProduct}
// //         selectedVariant={selectedVariant}
// //       />
