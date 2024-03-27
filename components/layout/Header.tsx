import {
  FunctionComponent,
  useContext,
  useState,
  MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo
} from "react";
import Link from "next/link";
import SettingsContext from "../../utils/context/SettingsContext";
import { useRouter } from "next/router";
import useDeviceType from "../../utils/hooks/useDeviceType";
import AppStorage from "../../utils/helpers/storage-helpers";
import Button from "../button/Button";
import styles from "./Layout.module.scss";
import { links } from "../../utils/constants";
import ContextWrapper from "../context-wrapper/ContextWrapper";
import FlowerCard from "../flower-card/FlowerCard";
import { AppLink } from "../../utils/types/Core";
import { getProductsBySlugs } from "../../utils/helpers/data/products";
import useOutsideClick from "../../utils/hooks/useOutsideClick";
import SearchDropdown from "./SearchDropdown";
import useScrollCheck from "../../utils/hooks/useScrollCheck";
import Product from "../../utils/types/Product";

const Header: FunctionComponent = () => {
  const [activeNavLink, setActiveNavLink] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeSublinkNav, setActiveSublinkNav] = useState("");

  const [linksWithFeaturedProducts, setLinksWithFeaturedProducts] = useState<
    AppLink[]
  >([...links]);
  const [displaySearchDropdown, setDisplaySearchDropdown] = useState(false);

  const deviceType = useDeviceType();

  const { pathname: _pathname, query, asPath } = useRouter();
  const pathname = _pathname.split("/").pop();

  const {
    cartItems,
    user,
    setOrder,
    setCurrentStage,
    orderId,
    setDeliveryDate,
    setSearchText,
    setUser,
    notify,
    setShouldShowAuthDropdown,
    shouldShowCart,
    setShouldShowCart
  } = useContext(SettingsContext);

  const searchDropdownRef = useOutsideClick<HTMLDivElement>(() => {
    setDisplaySearchDropdown(false);
  });

  const handleActiveNav = (title: string, e: ReactMouseEvent) => {
    setActiveNavLink(title);
    e.stopPropagation();
  };

  const hasScrolled = useScrollCheck();

  useEffect(() => {
    setActiveNavLink("");
    setActiveSublinkNav("");
    if (!orderId && pathname !== "checkout") {
      setOrder(null);
      setCurrentStage(1);
      setDeliveryDate(null);
    }

    if (!query.search) {
      setSearchText("");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, query]);

  useEffect(() => {
    setDisplaySearchDropdown(false);
  }, [asPath]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      const { error, message, data } = await getProductsBySlugs(
        links
          .map(link => link.featuredSlugs)
          .flat()
          .filter(Boolean) as string[]
      );
      if (error) {
        notify("error", `Unable to fetch featured products: ${message}`);
        return;
      }
      setLinksWithFeaturedProducts(
        links.map(link => ({
          ...link,
          featuredProducts: link.featuredSlugs
            ?.map(slug => data?.find(product => product.slug === slug))
            .filter(Boolean) as Product[]
        }))
      );
    };

    fetchFeaturedProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisplayAuthModal = () => {
    if (!user) setShouldShowAuthDropdown(true);
  };

  const handleLogout = async () => {
    AppStorage.remove("userData");
    setUser(null);
  };

  const accountAnchor = (
    <Button onClick={handleDisplayAuthModal} type="plain">
      {user ? (
        <span className={[styles.initial, styles["control-icon"]].join(" ")}>
          {(user.name || user.email)[0]}
        </span>
      ) : (
        <span className="flex spaced center-align">
          <span>Login/Register</span>
          <img
            alt="user"
            src="/icons/user.svg"
            className={styles["control-icon"]}
          />
        </span>
      )}
    </Button>
  );

  const isTouchScreen = useMemo(() => {
    return typeof window !== "undefined"
      ? matchMedia("(hover: none)").matches
      : false;
  }, []);

  return (
    <>
      <header className={styles.header} id="top">
        <img
          alt="menu"
          src={`${
            showSidebar ? "/icons/cancel-menu.svg" : "/icons/hamburger-menu.svg"
          }`}
          className={styles["hamburger-menu"]}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        {deviceType === "mobile" && (
          <nav
            className={[
              styles["mobile-sidebar"],
              showSidebar && styles.active
            ].join(" ")}
          >
            <div>
              {links.map((link, index) => (
                <div className={styles.link} key={index}>
                  {link.url ? (
                    <Link href={link.url} key={link.title}>
                      <a
                        className={`flex center-align spaced ${styles.title}`}
                        onClick={() => {
                          setActiveNavLink(link.title);
                          !link.children.length && setShowSidebar(false);
                        }}
                      >
                        <span>{link.title}</span>
                        {link.children.length > 0 && (
                          <div className={[styles.arrow].join(" ")}></div>
                        )}
                      </a>
                    </Link>
                  ) : (
                    <div
                      className={`flex center-align spaced ${styles.title}`}
                      onClick={() => {
                        setActiveNavLink(
                          activeNavLink === link.title ? "" : link.title
                        );
                        !link.children.length && setShowSidebar(false);
                      }}
                      key={link.title}
                    >
                      <span>{link.title}</span>
                      {link.children.length > 0 && (
                        <div
                          className={[
                            styles.arrow,
                            activeNavLink === link.title && styles.active
                          ].join(" ")}
                        ></div>
                      )}
                    </div>
                  )}

                  {link.children.length > 0 && (
                    <div
                      className={[
                        styles["sub-link"],
                        activeNavLink === link.title && styles.active
                      ].join(" ")}
                    >
                      {link.children.map((child, index) => (
                        <div key={index}>
                          {child.url ? (
                            <Link href={child.url} key={index}>
                              <a
                                className={styles["sub-link-title"]}
                                onClick={() => {
                                  setActiveNavLink("");
                                  setShowSidebar(false);
                                  setActiveSublinkNav("");
                                }}
                              >
                                {child.title && <p>{child.title}</p>}
                              </a>
                            </Link>
                          ) : (
                            <div
                              className={styles["sub-link-title"]}
                              onClick={() => {
                                setActiveSublinkNav(
                                  activeSublinkNav === child.title
                                    ? ""
                                    : child.title
                                );
                              }}
                              key={index}
                            >
                              <span>{child.title}</span>
                              {child.children.length > 0 && (
                                <div
                                  className={[
                                    styles.arrow,
                                    activeSublinkNav === child.title &&
                                      styles.active
                                  ].join(" ")}
                                ></div>
                              )}
                            </div>
                          )}
                          <div
                            className={[
                              styles["sub-child"],
                              activeSublinkNav === child.title && styles.active
                            ].join(" ")}
                          >
                            {child.children.map((subChild, index) => (
                              <Link href={subChild.url} key={index}>
                                <a
                                  className={styles["sub-link-title"]}
                                  onClick={() => {
                                    setActiveNavLink("");
                                    setShowSidebar(false);
                                    setActiveSublinkNav("");
                                  }}
                                >
                                  {subChild.title && (
                                    <span>{subChild.title}</span>
                                  )}
                                </a>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className={styles["mobile-user-area"]}>
              {user ? (
                <div className="flex column center-align">
                  <em className="margin-bottom spaced text-center">
                    Logged in as {user.email}
                  </em>
                  <Button onClick={handleLogout} size="small">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleDisplayAuthModal}
                  size="large"
                  responsive
                >
                  LOGIN / REGISTER
                </Button>
              )}
            </div>
          </nav>
        )}
        <div
          className={[styles["logo-flex"], hasScrolled && styles.minimize].join(
            " "
          )}
        >
          <span
            className={[
              "flex spaced center-align larger",
              styles.packaged
            ].join(" ")}
          >
            <img
              alt="love"
              src="/icons/hearts.svg"
              className="generic-icon medium"
            />
            <span>Packaged and hand delivered with love.</span>
          </span>
          <Link href="/">
            <a>
              <img
                alt="floral hub logo"
                src="/icons/logo.svg"
                className={styles.logo}
                onClick={() => setShowSidebar(false)}
              />
            </a>
          </Link>
          <nav className={styles.nav}>
            {linksWithFeaturedProducts.map((link, index) => (
              <div
                className={styles.link}
                key={index}
                onMouseEnter={
                  isTouchScreen
                    ? undefined
                    : e => handleActiveNav(link.title, e)
                }
                onClick={
                  isTouchScreen
                    ? e => handleActiveNav(link.title, e)
                    : undefined
                }
                onMouseLeave={() => setActiveNavLink("")}
              >
                <Button
                  className={`flex center-align spaced ${
                    styles.title
                  } ${activeNavLink === link.title && styles.active}`}
                  key={link.title}
                  type="plain"
                  url={link.url}
                >
                  {link.title}
                </Button>
                {link.children.length > 0 && (
                  <div
                    className={[
                      styles.dropdown,
                      activeNavLink === link.title && styles.active,
                      hasScrolled && styles.minimize,
                      index === 0 && styles["valentine-dropdown"]
                    ].join(" ")}
                  >
                    <div className="flex between">
                      <div
                        className={[
                          styles["sub-link"],
                          link.children.some(child => child.children.length) &&
                            styles.grid,
                          index === 3 && styles["gifts-dropdown"]
                        ].join(" ")}
                      >
                        {link.children.map((child, index) => (
                          <div
                            key={index}
                            className={styles["links-group-wrapper"]}
                          >
                            {child.url ? (
                              <Link href={child.url}>
                                <a
                                  onClick={() => {
                                    setActiveNavLink("");
                                  }}
                                >
                                  {child.title && (
                                    <strong
                                      className={[
                                        child.children.length && styles.title,
                                        "uppercase"
                                      ].join(" ")}
                                    >
                                      {child.title}
                                    </strong>
                                  )}
                                </a>
                              </Link>
                            ) : (
                              <>
                                {child.title && (
                                  <span
                                    className={[
                                      child.children.length && styles.title
                                    ].join(" ")}
                                  >
                                    {child.title}
                                  </span>
                                )}
                              </>
                            )}
                            <div className={styles["grand-children"]}>
                              {child.children.map((grandChild, index) => (
                                <Link href={grandChild.url} key={index}>
                                  <a
                                    className={styles["grand-title"]}
                                    onClick={() => {
                                      setActiveNavLink("");
                                    }}
                                  >
                                    {grandChild.title}
                                  </a>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div
                        className={styles["card-wrapper"]}
                        style={{
                          width: `${(link.featuredProducts?.length || 0 + 1) *
                            17.5}rem`
                        }}
                      >
                        <h3 className="thin margin-bottom">
                          FEATURED PRODUCT
                          {link.featuredProducts?.length !== 1 ? "S" : ""}
                        </h3>
                        <div className="flex spaced full-width">
                          {link.featuredProducts?.map((product, i) => (
                            <FlowerCard
                              name={product.name}
                              key={i}
                              subTitle={product.subtitle}
                              image={product.images[0]?.src}
                              url={`/product/${product.slug}`}
                              price={product.price}
                              product={product}
                              style={{ width: "17rem" }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className={styles["controls-area"]}>
          <div className="flex spaced-lg center-align">
            <div ref={searchDropdownRef}>
              <Button
                className="flex column center-align"
                type="plain"
                onClick={() => setDisplaySearchDropdown(!displaySearchDropdown)}
              >
                <img
                  alt="search"
                  src={
                    displaySearchDropdown
                      ? "/icons/search-cancel.svg"
                      : "/icons/search.svg"
                  }
                  className={styles["control-icon"]}
                />
              </Button>

              <SearchDropdown
                visible={displaySearchDropdown}
                cancel={() => setDisplaySearchDropdown(false)}
                hasScrolled={hasScrolled}
              />
            </div>
            <Button
              className={[styles["cart-button"]].join(" ")}
              type="plain"
              onClick={() => {
                setShouldShowCart(!shouldShowCart);
              }}
            >
              <img
                alt="cart"
                src="/icons/cart.svg"
                className={styles["control-icon"]}
              />
              {cartItems.length > 0 && (
                <span className={styles["items-count"]}>
                  {cartItems.length > 9 ? "9+" : cartItems.length}
                </span>
              )}
            </Button>
            {deviceType === "desktop" && (
              <ContextWrapper
                anchor={accountAnchor}
                className={styles["auth-wrapper"]}
              >
                {user ? (
                  <div className={styles["user-area"]}>
                    <div className="flex column center-align padded">
                      <em className="margin-bottom spaced text-center">
                        Logged in as {user.email}
                      </em>
                      <Button onClick={handleLogout} size="small" responsive>
                        Logout
                      </Button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </ContextWrapper>
            )}
          </div>
        </div>
      </header>
      {/* <AuthModal
        visible={showAuthModal}
        cancel={() => setShowAuthModal(false)}
      /> */}
    </>
  );
};

export default Header;
