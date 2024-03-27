/* eslint-disable react-hooks/rules-of-hooks */
import {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
  useRef
} from "react";
import { GetStaticProps } from "next";
import { getAllProducts, getProduct } from "../../utils/helpers/data/products";
import Product, {
  DesignOptionName,
  ProductImage
} from "../../utils/types/Product";
import styles from "./products.module.scss";
import Button from "../../components/button/Button";
import FlowerCard from "../../components/flower-card/FlowerCard";
import SettingsContext from "../../utils/context/SettingsContext";
import { CartItem } from "../../utils/types/Core";
import { getPriceDisplay } from "../../utils/helpers/type-conversions";
import useDeviceType from "../../utils/hooks/useDeviceType";
import { DesignOption, websiteUrl, giftItems } from "../../utils/constants";
import Link from "next/dist/client/link";
import Meta from "../../components/meta/Meta";
import SchemaMarkup from "../../components/schema-mark-up/SchemaMarkUp";
import { DeliveryIcon, InfoIcon } from "../../utils/resources";
import useScrollCheck from "../../utils/hooks/useScrollCheck";
import { useRouter } from "next/router";

interface Size {
  name: string;
  price: number;
  designOptions?: DesignOption[];
  sku: string;
}

const schemaProperties = {
  "@type": "Product",
  brand: {
    "@type": "Brand",
    name: "Floral Hub"
  }
};

const ProductPage: FunctionComponent<{ product: Product }> = props => {
  const { product } = props;

  if (!product?.name && !product?.key) {
    console.log("attempting reload product");
    window.location.reload();
    return null;
  }

  const outOfStock = product && !product.sku && !product.variants.length;
  const hasVariants = product.variants.length > 1;
  const [activeSlide, setActiveSlide] = useState<number>(0);
  const [descriptionTab, setDescriptionTab] = useState<
    "product-description" | "reviews"
  >("product-description");
  const [sizeType, setsizeType] = useState("regular");
  const [selectedSize, setSelectedSize] = useState<Size | null>(null);
  const [addonGroup, setAddonGroup] = useState("");
  const [showMobileCart, setShowMobileCart] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<DesignOption | null>(
    null
  );
  const [productPrice, setProductPrice] = useState<number>(product.price);
  const [total, setTotal] = useState<number>(product.price);
  const [quantity, setQuantity] = useState<number>(1);
  const [isInView, setIsInView] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);

  const mobileCartRef = useRef(null);

  const router = useRouter();

  const {
    setCartItems,
    cartItems,
    notify,
    currency,
    shouldShowCart,
    setShouldShowCart,
    breadcrumb
  } = useContext(SettingsContext);
  const deviceType = useDeviceType();

  const shouldShowRegularSizes = product.variants?.some(
    variant => variant.class === "regular"
  );
  const Platform = {
    TWITTER: "twitter",
    WHATSAPP: "whatsapp",
    FACEBOOK: "facebook"
  };
  const handleShare = (platform: string) => {
    const currentURL = encodeURIComponent(
      `https://www.floralhub.com.ng/product/${product.slug}`
    );
    if (platform === Platform.TWITTER) {
      const twitterShareLink = `https://twitter.com/intent/tweet?url=${currentURL}`;
      window.open(twitterShareLink, "_blank");
    } else if (platform === Platform.FACEBOOK) {
      const facebookShareLink = `https://www.facebook.com/sharer/sharer.php?u=${currentURL}`;
      window.open(facebookShareLink, "_blank");
    } else {
      const whatsappShareLink = `whatsapp://send?text=${currentURL}`;
      window.open(whatsappShareLink, "_blank");
    }
  };

  const shouldShowVipSizes = product.variants?.some(
    variant => variant.class === "vip"
  );

  const checkInView = () => {
    const element = mobileCartRef.current as HTMLElement | null;

    if (element) {
      const rect = element.getBoundingClientRect();
      setIsInView(rect.top < window.innerHeight && rect.bottom >= 0);
    }
  };

  useEffect(() => {
    const longDescription = document.getElementById("long-description");
    const description = document.getElementById("description");
    if (longDescription) {
      longDescription.innerHTML = product.longDescription.replace(
        "<p>&nbsp;</p>",
        ""
      );
    }

    if (description) {
      description.innerHTML = product.description.replace("<p>&nbsp;</p>", "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, descriptionTab, deviceType]);

  useEffect(() => {
    if (!shouldShowRegularSizes) {
      setsizeType("vip");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    checkInView();
  }, []);

  useEffect(() => {
    document.addEventListener("scroll", checkInView);
    return () => {
      document.removeEventListener("scroll", checkInView);
    };
  }, []);

  const handleAddToCart = () => {
    if (cannotBuy) {
      setShowHighlight(true);
      notify("error", "Please select a size", 1000);
      router.push(
        "/product/[productSlug]/#sizes",
        `/product/${product.slug}/#sizes`
      );
      setTimeout(() => {
        setShowHighlight(false);
      }, 2000);
      return;
    }
    const cartItem: CartItem = {
      key: product.key,
      name: product.name,
      price: productPrice,
      size: selectedSize?.name,
      design: selectedDesign
        ? {
            quantity: 1,
            name: selectedDesign?.name as DesignOptionName,
            price: selectedDesign?.price as number,
            title: selectedDesign?.title as string
          }
        : null,
      quantity,
      image: {
        src: product.images[0].src,
        alt: product.images[0].alt
      },
      SKU: selectedSize?.sku as string,
      description: product.subtitle
    };

    const existingCartItem = cartItems.find(
      item => item.SKU === selectedSize?.sku
    );
    // const existingDesign = existingCartItem?.design;

    if (!existingCartItem) {
      setCartItems([...cartItems, cartItem]);
      notify(
        "success",
        <button>
          Item Added To Cart{" "}
          <span
            className="view-cart"
            onClick={() => setShouldShowCart(!shouldShowCart)}
          >
            View Cart
          </span>
        </button>
      );
    } else {
      if (existingCartItem.SKU !== selectedSize?.sku) {
        setCartItems([...cartItems, cartItem]);
        notify(
          "success",
          <button>
            Item Added To Cart{" "}
            <span
              className="view-cart"
              onClick={() => setShouldShowCart(!shouldShowCart)}
            >
              View Cart
            </span>
          </button>
        );
      } else if (existingCartItem.SKU === selectedSize?.sku) {
        const newCartItem = cartItems.map(item => {
          if (item.SKU === existingCartItem?.SKU) {
            return {
              ...item,
              quantity: item.quantity + 1
            };
          } else {
            return item;
          }
        }) as CartItem[];

        setCartItems(newCartItem);
        notify(
          "success",
          <button>
            Item Added To Cart{" "}
            <span
              className="view-cart"
              onClick={() => setShouldShowCart(!shouldShowCart)}
            >
              View Cart
            </span>
          </button>
        );
      }
      // else if (existingDesign?.name === selectedDesign?.name) {
      //   console.log("new item 3");
      //   const newCartItem = cartItems.map(item => {
      //     if (item.SKU === existingCartItem?.SKU) {
      //       return {
      //         ...item,
      //         quantity: item.quantity + 1,
      //         design: {
      //           ...item.design,
      //           quantity: (item.design?.quantity as number) + 1
      //         }
      //       };
      //     } else {
      //       return item;
      //     }
      //   }) as CartItem[];
      //   setCartItems(newCartItem);
      //   notify(
      //     "success",
      //     <p>
      //       Item Added To Cart{" "}
      //       <span
      //         className="view-cart"
      //         onClick={() => setShouldShowCart(!shouldShowCart)}
      //       >
      //         View Cart
      //       </span>
      //     </p>
      //   );
      // }

      // else if (
      //   existingDesign?.name !== selectedDesign?.name &&
      //   selectedDesign
      // ) {
      //   console.log("new item 4");
      //   setCartItems([...cartItems, cartItem]);

      //   notify(
      //     "success",
      //     <p>
      //       Item Added To Cart{" "}
      //       <span
      //         className="view-cart"
      //         onClick={() => setShouldShowCart(!shouldShowCart)}
      //       >
      //         View Cart
      //       </span>
      //     </p>
      //   );
      // }
    }
    setSelectedSize(null);
    setSelectedDesign(null);
  };

  const handleActiveSlide = (id: number) => {
    setActiveSlide(id);
  };

  const pickDefaultDesign = () => {
    if (selectedSize?.designOptions) {
      const defaultDesign = selectedSize.designOptions.find(
        design => design.default
      );
      setSelectedDesign(defaultDesign || null);
    }
  };

  useEffect(() => {
    pickDefaultDesign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSize]);

  useEffect(() => {
    setActiveSlide(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  useEffect(() => {
    setTotal((selectedDesign?.price || 0) + (selectedSize?.price || 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDesign, selectedSize]);
  useEffect(() => {
    if (!hasVariants) {
      setShowMobileCart(true);
      setProductPrice(product.price);
    } else if (hasVariants && isInView) {
      setShowMobileCart(true);
    } else {
      setShowMobileCart(false);
    }
  }, [product, isInView, hasVariants]);

  const cannotBuy =
    (product.type === "variable" && !selectedSize?.name) ||
    (selectedSize?.designOptions && !selectedDesign);

  const hasScrolled = useScrollCheck();

  return (
    <>
      <Meta
        title={`${product.name} - ${product.subtitle} | Floral Hub`}
        description={product.description}
        image={product.images[0].src}
        imageAlt={product.images[0].alt}
        canonicalUrl={`${websiteUrl}/product/${product.slug}/`}
      >
        <SchemaMarkup
          properties={{
            ...schemaProperties,
            name: product.name,
            description: product.description,
            image: product.images[0].src,
            url: `${websiteUrl}/${product.slug}`,
            offers: {
              "@type": "Offer",
              price: String(total || productPrice),
              priceCurrency: currency.name,
              availability: outOfStock
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock"
            }
          }}
        />
      </Meta>
      <section
        className={`${styles.product} ${hasScrolled && styles["has-scrolled"]}`}
      >
        <div className={`${styles.padding} text-medium flex spaced wrap`}>
          <div className="margin-right align-icon underline">
            <Link href="/">
              <a>Home</a>
            </Link>
            <img
              src="/icons/chevron-right.svg"
              alt="right"
              className="generic-icon small margin-left"
            />
          </div>
          <div className="margin-right align-icon underline">
            <Link href={breadcrumb.url}>
              <a>{breadcrumb.label}</a>
            </Link>

            <img
              src="/icons/chevron-right.svg"
              alt="right"
              className="generic-icon small margin-left"
            />
          </div>
          <strong className="generic-icon small">
            {product.name.split("–")[0]}
          </strong>
        </div>
        <div
          className={`${
            styles["product-content"]
          } flex spaced-xl between ${deviceType === "mobile" && "column"}`}
        >
          <div className={styles["left-content"]}>
            <div className={styles["slider-container"]}>
              {deviceType === "desktop" && (
                <VerticalImageCarousel
                  images={product.images}
                  selectActiveSlide={handleActiveSlide}
                  activeSlide={activeSlide}
                />
              )}

              <div className={styles.slider}>
                {product.images.map((image, index) => (
                  <div
                    key={index}
                    className={[
                      styles["slide"],
                      activeSlide === index && styles["active-slide"]
                    ].join(" ")}
                  >
                    <img src={image.src} alt={image.alt} />
                  </div>
                ))}
              </div>
              {deviceType === "mobile" && (
                <div className={styles.images}>
                  {product.images.map((image, index) => (
                    <div key={index} className={styles["image-container"]}>
                      <img
                        src={image.src}
                        alt={image.alt}
                        className={[
                          activeSlide === index && styles.active
                        ].join(" ")}
                        onClick={() => setActiveSlide(index)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {deviceType === "desktop" && (
              <div>
                <div className={styles.tabs}>
                  <button
                    className={[
                      styles.tab,
                      descriptionTab === "product-description"
                        ? styles.active
                        : styles["in-active"]
                    ].join(" ")}
                    onClick={() => setDescriptionTab("product-description")}
                  >
                    Description
                  </button>
                  <button
                    className={[
                      styles.tab,
                      descriptionTab === "reviews"
                        ? styles.active
                        : styles["in-active"]
                    ].join(" ")}
                    onClick={() => setDescriptionTab("reviews")}
                  >
                    Reviews
                  </button>
                </div>
                <div className={styles["tab-content"]}>
                  {descriptionTab === "product-description" && (
                    <p
                      id="long-description"
                      className="description normal-text"
                    ></p>
                  )}

                  {descriptionTab === "reviews" && <p>Coming Soon</p>}
                </div>
              </div>
            )}

            {deviceType === "desktop" && (
              <div
                className={`${styles["social-icons"]} flex spaced center-align`}
              >
                <span className="text-regular">Share: </span>
                <button
                  className={`${styles["social-icon"]}`}
                  onClick={() => handleShare(Platform.TWITTER)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    className={styles.icon}
                  >
                    <path
                      d="M22.1621 6.15605C21.3986 6.49374 20.589 6.71552 19.7601 6.81405C20.6338 6.29148 21.2878 5.46906 21.6001 4.50005C20.7801 4.98805 19.8811 5.33005 18.9441 5.51505C18.3147 4.84163 17.4804 4.39501 16.571 4.24463C15.6616 4.09425 14.728 4.24854 13.9153 4.6835C13.1026 5.11846 12.4564 5.80973 12.0772 6.64984C11.6979 7.48995 11.6068 8.43183 11.8181 9.32905C10.1552 9.2457 8.52838 8.81357 7.04334 8.06071C5.55829 7.30785 4.24818 6.2511 3.19805 4.95905C2.82634 5.5975 2.63101 6.32328 2.63205 7.06205C2.63205 8.51205 3.37005 9.79305 4.49205 10.543C3.82806 10.5221 3.17869 10.3428 2.59805 10.02V10.072C2.59825 11.0377 2.93242 11.9737 3.5439 12.7211C4.15538 13.4686 5.00653 13.9815 5.95305 14.173C5.33667 14.3401 4.69036 14.3647 4.06305 14.245C4.32992 15.0763 4.85006 15.8032 5.55064 16.3242C6.25123 16.8451 7.09718 17.1338 7.97005 17.15C7.10253 17.8314 6.10923 18.335 5.04693 18.6322C3.98464 18.9294 2.87418 19.0143 1.77905 18.882C3.69075 20.1115 5.91615 20.7642 8.18905 20.762C15.8821 20.762 20.0891 14.389 20.0891 8.86205C20.0891 8.68205 20.0841 8.50005 20.0761 8.32205C20.8949 7.73022 21.6017 6.99707 22.1631 6.15705L22.1621 6.15605Z"
                      fill="#F9FAFB"
                    />
                  </svg>
                </button>
                <button
                  className={`${styles["social-icon"]} ${styles["whatsapp"]}`}
                  onClick={() => handleShare(Platform.WHATSAPP)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    className={styles.icon}
                  >
                    <path
                      d="M2.00401 22.5L3.35601 17.532C2.46515 16.0049 1.99711 14.268 2.00001 12.5C2.00001 6.977 6.47701 2.5 12 2.5C17.523 2.5 22 6.977 22 12.5C22 18.023 17.523 22.5 12 22.5C10.2328 22.5029 8.49667 22.0352 6.97001 21.145L2.00401 22.5ZM8.39101 7.808C8.26188 7.81602 8.13569 7.85003 8.02001 7.908C7.91153 7.96943 7.81251 8.04622 7.72601 8.136C7.60601 8.249 7.53801 8.347 7.46501 8.442C7.09542 8.923 6.89662 9.51342 6.90001 10.12C6.90201 10.61 7.03001 11.087 7.23001 11.533C7.63901 12.435 8.31201 13.39 9.20101 14.275C9.41501 14.488 9.62401 14.702 9.84901 14.901C10.9524 15.8725 12.2673 16.573 13.689 16.947L14.258 17.034C14.443 17.044 14.628 17.03 14.814 17.021C15.1053 17.006 15.3896 16.9271 15.647 16.79C15.813 16.702 15.891 16.658 16.03 16.57C16.03 16.57 16.073 16.542 16.155 16.48C16.29 16.38 16.373 16.309 16.485 16.192C16.568 16.106 16.64 16.005 16.695 15.89C16.773 15.727 16.851 15.416 16.883 15.157C16.907 14.959 16.9 14.851 16.897 14.784C16.893 14.677 16.804 14.566 16.707 14.519L16.125 14.258C16.125 14.258 15.255 13.879 14.724 13.637C14.668 13.6126 14.608 13.5987 14.547 13.596C14.4786 13.589 14.4095 13.5967 14.3443 13.6186C14.2791 13.6405 14.2193 13.6761 14.169 13.723V13.721C14.164 13.721 14.097 13.778 13.374 14.654C13.3325 14.7098 13.2754 14.7519 13.2098 14.7751C13.1443 14.7982 13.0733 14.8013 13.006 14.784C12.9409 14.7666 12.877 14.7445 12.815 14.718C12.691 14.666 12.648 14.646 12.563 14.609L12.558 14.607C11.9859 14.3572 11.4562 14.0198 10.988 13.607C10.862 13.497 10.745 13.377 10.625 13.261C10.2316 12.8842 9.88873 12.458 9.60501 11.993L9.54601 11.898C9.50364 11.8342 9.46937 11.7653 9.44401 11.693C9.40601 11.546 9.50501 11.428 9.50501 11.428C9.50501 11.428 9.74801 11.162 9.86101 11.018C9.9551 10.8983 10.0429 10.7738 10.124 10.645C10.242 10.455 10.279 10.26 10.217 10.109C9.93701 9.425 9.64701 8.744 9.34901 8.068C9.29001 7.934 9.11501 7.838 8.95601 7.819C8.90201 7.813 8.84801 7.807 8.79401 7.803C8.65972 7.79633 8.52515 7.79766 8.39101 7.807V7.808Z"
                      fill="#F9FAFB"
                    />
                  </svg>
                </button>
                <button
                  className={`${styles["social-icon"]}`}
                  onClick={() => handleShare(Platform.FACEBOOK)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    className={styles.icon}
                  >
                    <path
                      d="M12.001 2.50195C6.47895 2.50195 2.00195 6.97895 2.00195 12.501C2.00195 17.491 5.65795 21.627 10.439 22.38V15.392H7.89895V12.501H10.439V10.298C10.439 7.78995 11.932 6.40695 14.215 6.40695C15.309 6.40695 16.455 6.60195 16.455 6.60195V9.06095H15.191C13.951 9.06095 13.563 9.83295 13.563 10.624V12.499H16.334L15.891 15.39H13.563V22.378C18.344 21.629 22 17.492 22 12.501C22 6.97895 17.523 2.50195 12.001 2.50195Z"
                      fill="#F9FAFB"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className={styles.padding}>
            <div
              className={`flex ${
                deviceType === "mobile" ? "column" : "center-align between"
              }`}
            >
              <div className="margin-right spaced">
                <p className="title margin-bottom spaced bold">
                  {product.name.split("–")[0]}
                </p>
                <h1 className={`${styles.subTitle}`}>
                  {product.subtitle || product.name.split("–")[1]}
                </h1>
              </div>
            </div>
            <br />
            {product.info1 && (
              <>
                <div
                  className={`flex spaced center-align text-medium ${styles["delivery-info"]}`}
                >
                  <InfoIcon fill="#B240DA" />
                  <span>{product.info1}</span>
                </div>
                <div className="vertical-margin compact"></div>
              </>
            )}
            {product.info2 && (
              <>
                <div
                  className={`flex spaced center-align text-medium ${styles["delivery-info"]}`}
                >
                  <DeliveryIcon />
                  <span>{product.info2}</span>
                </div>
                <br />
              </>
            )}

            {product.temporaryNotes && (
              <div className={styles["temporary-notes"]}>
                {product.temporaryNotes &&
                  product.temporaryNotes?.length > 0 &&
                  product.temporaryNotes.map((note, index) => (
                    <p
                      className={`${styles["product-info"]} center-align flex spaced`}
                      key={index}
                    >
                      <img
                        src="/icons/info.svg"
                        alt="information"
                        className="generic-icon"
                      />

                      <span key={index}>{note}</span>
                    </p>
                  ))}
              </div>
            )}
            {product.description && (
              <>
                <h3 className="title small bold">Description</h3>
                <p id="description" className={`normal-text description`}></p>
              </>
            )}
            {deviceType === "mobile" && (
              <div
                className={`${styles["social-icons"]} flex spaced center-align`}
                id="sizes"
              >
                <span className="text-regular">Share: </span>
                <button
                  className={`${styles["social-icon"]}`}
                  onClick={() => handleShare(Platform.TWITTER)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    className={styles.icon}
                  >
                    <path
                      d="M22.1621 6.15605C21.3986 6.49374 20.589 6.71552 19.7601 6.81405C20.6338 6.29148 21.2878 5.46906 21.6001 4.50005C20.7801 4.98805 19.8811 5.33005 18.9441 5.51505C18.3147 4.84163 17.4804 4.39501 16.571 4.24463C15.6616 4.09425 14.728 4.24854 13.9153 4.6835C13.1026 5.11846 12.4564 5.80973 12.0772 6.64984C11.6979 7.48995 11.6068 8.43183 11.8181 9.32905C10.1552 9.2457 8.52838 8.81357 7.04334 8.06071C5.55829 7.30785 4.24818 6.2511 3.19805 4.95905C2.82634 5.5975 2.63101 6.32328 2.63205 7.06205C2.63205 8.51205 3.37005 9.79305 4.49205 10.543C3.82806 10.5221 3.17869 10.3428 2.59805 10.02V10.072C2.59825 11.0377 2.93242 11.9737 3.5439 12.7211C4.15538 13.4686 5.00653 13.9815 5.95305 14.173C5.33667 14.3401 4.69036 14.3647 4.06305 14.245C4.32992 15.0763 4.85006 15.8032 5.55064 16.3242C6.25123 16.8451 7.09718 17.1338 7.97005 17.15C7.10253 17.8314 6.10923 18.335 5.04693 18.6322C3.98464 18.9294 2.87418 19.0143 1.77905 18.882C3.69075 20.1115 5.91615 20.7642 8.18905 20.762C15.8821 20.762 20.0891 14.389 20.0891 8.86205C20.0891 8.68205 20.0841 8.50005 20.0761 8.32205C20.8949 7.73022 21.6017 6.99707 22.1631 6.15705L22.1621 6.15605Z"
                      fill="#F9FAFB"
                    />
                  </svg>
                </button>
                <button
                  className={`${styles["social-icon"]} ${styles["whatsapp"]}`}
                  onClick={() => handleShare(Platform.WHATSAPP)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    className={styles.icon}
                  >
                    <path
                      d="M2.00401 22.5L3.35601 17.532C2.46515 16.0049 1.99711 14.268 2.00001 12.5C2.00001 6.977 6.47701 2.5 12 2.5C17.523 2.5 22 6.977 22 12.5C22 18.023 17.523 22.5 12 22.5C10.2328 22.5029 8.49667 22.0352 6.97001 21.145L2.00401 22.5ZM8.39101 7.808C8.26188 7.81602 8.13569 7.85003 8.02001 7.908C7.91153 7.96943 7.81251 8.04622 7.72601 8.136C7.60601 8.249 7.53801 8.347 7.46501 8.442C7.09542 8.923 6.89662 9.51342 6.90001 10.12C6.90201 10.61 7.03001 11.087 7.23001 11.533C7.63901 12.435 8.31201 13.39 9.20101 14.275C9.41501 14.488 9.62401 14.702 9.84901 14.901C10.9524 15.8725 12.2673 16.573 13.689 16.947L14.258 17.034C14.443 17.044 14.628 17.03 14.814 17.021C15.1053 17.006 15.3896 16.9271 15.647 16.79C15.813 16.702 15.891 16.658 16.03 16.57C16.03 16.57 16.073 16.542 16.155 16.48C16.29 16.38 16.373 16.309 16.485 16.192C16.568 16.106 16.64 16.005 16.695 15.89C16.773 15.727 16.851 15.416 16.883 15.157C16.907 14.959 16.9 14.851 16.897 14.784C16.893 14.677 16.804 14.566 16.707 14.519L16.125 14.258C16.125 14.258 15.255 13.879 14.724 13.637C14.668 13.6126 14.608 13.5987 14.547 13.596C14.4786 13.589 14.4095 13.5967 14.3443 13.6186C14.2791 13.6405 14.2193 13.6761 14.169 13.723V13.721C14.164 13.721 14.097 13.778 13.374 14.654C13.3325 14.7098 13.2754 14.7519 13.2098 14.7751C13.1443 14.7982 13.0733 14.8013 13.006 14.784C12.9409 14.7666 12.877 14.7445 12.815 14.718C12.691 14.666 12.648 14.646 12.563 14.609L12.558 14.607C11.9859 14.3572 11.4562 14.0198 10.988 13.607C10.862 13.497 10.745 13.377 10.625 13.261C10.2316 12.8842 9.88873 12.458 9.60501 11.993L9.54601 11.898C9.50364 11.8342 9.46937 11.7653 9.44401 11.693C9.40601 11.546 9.50501 11.428 9.50501 11.428C9.50501 11.428 9.74801 11.162 9.86101 11.018C9.9551 10.8983 10.0429 10.7738 10.124 10.645C10.242 10.455 10.279 10.26 10.217 10.109C9.93701 9.425 9.64701 8.744 9.34901 8.068C9.29001 7.934 9.11501 7.838 8.95601 7.819C8.90201 7.813 8.84801 7.807 8.79401 7.803C8.65972 7.79633 8.52515 7.79766 8.39101 7.807V7.808Z"
                      fill="#F9FAFB"
                    />
                  </svg>
                </button>
                <button
                  className={`${styles["social-icon"]}`}
                  onClick={() => handleShare(Platform.FACEBOOK)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="25"
                    viewBox="0 0 24 25"
                    fill="none"
                    className={styles.icon}
                  >
                    <path
                      d="M12.001 2.50195C6.47895 2.50195 2.00195 6.97895 2.00195 12.501C2.00195 17.491 5.65795 21.627 10.439 22.38V15.392H7.89895V12.501H10.439V10.298C10.439 7.78995 11.932 6.40695 14.215 6.40695C15.309 6.40695 16.455 6.60195 16.455 6.60195V9.06095H15.191C13.951 9.06095 13.563 9.83295 13.563 10.624V12.499H16.334L15.891 15.39H13.563V22.378C18.344 21.629 22 17.492 22 12.501C22 6.97895 17.523 2.50195 12.001 2.50195Z"
                      fill="#F9FAFB"
                    />
                  </svg>
                </button>
              </div>
            )}
            {product.type === "variable" && (
              <div>
                <br />
                {shouldShowRegularSizes && (
                  <>
                    <button
                      onClick={() => setsizeType("regular")}
                      className={`${styles["size-title"]}`}
                    >
                      {!shouldShowVipSizes ? "Sizes" : "Regular Sizes"}
                    </button>
                    <div
                      className={[
                        styles["size-wrapper"],
                        showHighlight && styles.highlight
                      ].join(" ")}
                      ref={mobileCartRef}
                    >
                      {product.variants
                        ?.filter(variant => variant.class === "regular")
                        .map((variant, index) => (
                          <span
                            key={index}
                            className={[
                              styles.size,
                              selectedSize?.name === variant.name &&
                                styles["selected-size"]
                            ].join(" ")}
                            onClick={() => {
                              setSelectedSize({
                                name: variant.name,
                                price: variant.price,
                                designOptions: variant.design,
                                sku: variant.sku
                              });
                              setProductPrice(variant.price);
                            }}
                          >
                            {variant.name} |{" "}
                            {getPriceDisplay(variant.price, currency)}
                          </span>
                        ))}
                    </div>
                  </>
                )}
                {shouldShowVipSizes && (
                  <>
                    <button
                      onClick={() => setsizeType("vip")}
                      className={`${styles["size-title"]} ${
                        sizeType === "vip" ? styles.active : null
                      }`}
                    >
                      VIP Sizes
                    </button>

                    <div className={styles["size-wrapper"]} ref={mobileCartRef}>
                      {product.variants
                        ?.filter(variant => variant.class === "vip")
                        .map((variant, index) => {
                          return (
                            <span
                              key={index}
                              className={[
                                styles.size,
                                selectedSize?.name === variant.name &&
                                  styles["selected-size"]
                              ].join(" ")}
                              onClick={() => {
                                setSelectedSize({
                                  name: variant.name,
                                  price: variant.price,
                                  designOptions: variant.design,
                                  sku: variant.sku
                                });
                                setProductPrice(variant.price);
                              }}
                            >
                              {variant.name.replace(/Vip/i, "VIP")} |{" "}
                              {getPriceDisplay(variant.price, currency)}
                            </span>
                          );
                        })}
                    </div>
                    <br />
                  </>
                )}
                {selectedSize?.designOptions && (
                  <>
                    {product.designOptions && (
                      <div className="align-icon vertical-margin tooltip">
                        <h3 className="bold margin-right">Select Design</h3>
                        <img
                          src="/icons/info.svg"
                          alt="information"
                          className="generic-icon"
                        />{" "}
                        {product.designNote && (
                          <span className="tooltiptext">
                            {product.designNote}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex spaced margin-bottom">
                      {selectedSize.designOptions.map(designOption => (
                        <div
                          key={designOption.name}
                          className={[
                            styles.design,
                            selectedDesign?.name === designOption.name &&
                              styles["selected-design"]
                          ].join(" ")}
                          onClick={() => setSelectedDesign(designOption)}
                        >
                          <img
                            src={`/icons/${designOption.name}.svg`}
                            alt="box"
                            className={`generic-icon xxl margin-bottom spaced ${designOption.name ===
                              "inLargeVase" && styles["inLargeVase"]}`}
                          />
                          <p className="vertical-margin bold">
                            {designOption.title}
                          </p>
                          {designOption.default ? (
                            <p>Default</p>
                          ) : designOption.price ? (
                            <p>
                              + {getPriceDisplay(designOption.price, currency)}
                            </p>
                          ) : (
                            <p>Complimentary</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {deviceType === "mobile" && (
              <>
                <h3 className="title small bold">Description</h3>
                <p
                  id="long-description"
                  className="description normal-text"
                ></p>
              </>
            )}

            <div className={styles["menu-wrapper"]}>
              {product.addonsGroups.length > 0 && (
                <h3 className="bold vertical-margin spaced">
                  Awesome Gifts to Include
                </h3>
              )}
              {product.addonsGroups.map((group, index) => (
                <div key={index}>
                  <div
                    className={`${styles["menu-btn"]} flex`}
                    onClick={() =>
                      setAddonGroup(group.name === addonGroup ? "" : group.name)
                    }
                  >
                    <img
                      className="generic-icon xl"
                      src={group.image}
                      alt={group.name}
                    />
                    <div
                      className={`${styles.group} ${group.name === addonGroup &&
                        styles.active} flex between center-align`}
                    >
                      <p className="bold">{group.name}</p>
                      <svg
                        className={`${
                          group.name === addonGroup ? styles.arrow : null
                        }`}
                        width="8"
                        height="12"
                        viewBox="0 0 8 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M2.00009 0L0.590088 1.41L5.17009 6L0.590088 10.59L2.00009 12L8.00009 6L2.00009 0Z"
                          fill="#4B5563"
                        />
                      </svg>
                    </div>
                  </div>
                  <div
                    className={[
                      styles["menu-dropdown"],
                      group.name === addonGroup && styles.opened
                    ].join(" ")}
                  >
                    {group.addons.map((addon, index) => (
                      <div key={index} className={styles["menu-child"]}>
                        <img src={addon.image} alt={addon.name} />
                        <div className="vertical-margin">
                          <p className="bold margin-bottom">{addon.name}</p>
                          <p>{getPriceDisplay(addon.price, currency)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {deviceType === "desktop" && (
              <div
                className={`flex spaced  block ${deviceType == "desktop" &&
                  "vertical-margin"}`}
              >
                <Button
                  disabled={cannotBuy || outOfStock}
                  className={` spaced ${deviceType == "desktop" &&
                    "vertical-margin"}`}
                  responsive
                  onClick={() => handleAddToCart()}
                  tooltip={
                    cannotBuy
                      ? `You must select a budget${
                          product.designOptions ? " and design" : ""
                        } first`
                      : ""
                  }
                >
                  {outOfStock
                    ? "OUT OF STOCK"
                    : `ADD TO CART ( ${getPriceDisplay(
                        total || productPrice,
                        currency
                      )})`}
                </Button>
              </div>
            )}
          </div>
        </div>
        {deviceType === "mobile" && showMobileCart && (
          <div className={styles["mobile-cart"]}>
            <div className="flex between center-align">
              <strong className="text-medium">Subtotal</strong>
              <strong className="text-regular">
                {getPriceDisplay(total || productPrice, currency)}
              </strong>
            </div>
            <br />
            <div className="flex between center-align">
              <div className="flex center-align spaced-lg">
                <button
                  disabled={quantity === 1}
                  onClick={() => setQuantity(quantity - 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_861_64114)">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H7V11H17V13Z"
                        fill={quantity === 1 ? "#D1D5DB" : "#B240DA"}
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_861_64114">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
                <span className="small-text">{quantity}</span>
                <button
                  // className={styles.plus}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_861_64116)">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM17 13H13V17H11V13H7V11H11V7H13V11H17V13Z"
                        fill="#B240DA"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_861_64116">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </button>
              </div>
              <Button
                onClick={() => handleAddToCart()}
                tooltip={
                  cannotBuy
                    ? `You must select a budget${
                        product.designOptions ? " and design" : ""
                      } first`
                    : ""
                }
                className={[
                  styles["add-to-cart"],
                  (cannotBuy || outOfStock) && styles.inactive
                ].join(" ")}
              >
                {outOfStock ? "OUT OF STOCK" : `ADD TO CART`}
              </Button>
            </div>
          </div>
        )}
        <div className={styles.padding}>
          <div className={styles.gifts}>
            <>
              <div className="flex between margin-bottom spaced normal">
                <span className={styles.title}>
                  GIFTS TO INCLUDE WITH FLOWERS
                </span>
                {deviceType === "desktop" && (
                  <Button
                    url="/product-category/gifts"
                    className="flex spaced center center-align"
                    type="transparent"
                  >
                    <h3 className="red margin-right normal text-semilarge">
                      See All
                    </h3>
                  </Button>
                )}
              </div>
              <div className="flex between vertical-margin spaced wrap">
                {giftItems.map((gift, index) => (
                  <FlowerCard
                    key={index}
                    name={gift.name}
                    image={gift.image}
                    subTitle={gift.description}
                    buttonText="VIEW GIFTS"
                    url={gift.slug}
                  />
                ))}
              </div>
              {deviceType === "mobile" && (
                <Button
                  url="/product-category/gifts"
                  type="transparent"
                  minWidth
                  className={`${styles["see-all"]}`}
                >
                  <h3 className="normal text-small">Browse All Gifts</h3>
                  <img
                    alt="arrow"
                    className="generic-icon xsmall"
                    src="/icons/arrow-right.svg"
                  />
                </Button>
              )}{" "}
            </>
          </div>
          <p className="title bold margin-top spaced">OTHERS ALSO BOUGHT</p>
          <div className="flex between vertical-margin spaced wrap">
            {product.relatedProducts?.slice(0, 4)?.map((item, index) => (
              <FlowerCard
                key={index}
                name={item.name.split("–")[0]}
                image={item.images.src}
                price={item.price}
                subTitle={item.subtitle || item.name.split("–")[1]}
                product={(item as unknown) as Product}
                className={styles["extras-cards"]}
                url={`/product/${item.slug}`}
                buttonText="Add to Cart"
              />
            ))}
          </div>
          <br />
          <br />
          <p className="title bold margin-top spaced">YOU MAY ALSO LIKE</p>
          <div className="flex between vertical-margin spaced wrap">
            {product.relatedProducts?.slice(4)?.map((item, index) => (
              <FlowerCard
                key={index}
                name={item.name.split("–")[0]}
                image={item.images.src}
                price={item.price}
                className={styles["extras-cards"]}
                subTitle={item.subtitle || item.name.split("–")[1]}
                product={(item as unknown) as Product}
                url={`/product/${item.slug}`}
                buttonText="Add to Cart"
              />
            ))}
          </div>
          <br />
        </div>
      </section>
    </>
  );
};

const itemsPerPage = 4;

const VerticalImageCarousel: React.FC<{
  images: ProductImage[];
  selectActiveSlide: (slide: number) => void;
  activeSlide: number;
}> = ({ images, selectActiveSlide, activeSlide }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(images.length / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const goToPrevPage = () => {
    goToPage(currentPage - 1);
  };

  const goToNextPage = () => {
    goToPage(currentPage + 1);
  };

  const translateY = -currentPage * (100 / totalPages);

  return (
    <div className={styles["carousel-wrapper"]}>
      <div className={styles["carousel-container"]}>
        <div
          className={styles["carousel-images"]}
          style={{ transform: `translateY(${translateY}%)` }}
        >
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              onClick={() => selectActiveSlide(index)}
              className={[
                styles["carousel-image"],
                activeSlide === index && styles.active
              ].join(" ")}
            />
          ))}
        </div>
      </div>
      <button className={styles["prev-button"]} onClick={goToPrevPage}>
        <img
          src="/icons/chevron-left.svg"
          alt="left"
          className={"generic-icon"}
        />
      </button>
      <button className={styles["next-button"]} onClick={goToNextPage}>
        <img
          src="/icons/chevron-left.svg"
          alt="left"
          className={"generic-icon"}
        />
      </button>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { productSlug } = params || {};
  const { data, error, message } = await getProduct(String(productSlug), 8);
  if (error || !data) {
    console.error(`Unable to fetch product "${productSlug}": ${message}`);
    return {
      props: {
        product: {
          name: "",
          variants: []
        }
      },
      revalidate: 1800
    };
  }
  return {
    props: { product: data },
    revalidate: 1800
  };
};

export const getStaticPaths = async () => {
  const { data, error } = await getAllProducts();
  const slugs = data?.map(product => ({
    params: { productSlug: product.slug }
  }));

  if (error) {
    console.error(`Unable to fetch products: ${error}`);
    return {
      paths: [],
      fallback: false
    };
  } else {
    return {
      paths: slugs,
      fallback: false // true or 'blocking'
    };
  }
};

export default ProductPage;
