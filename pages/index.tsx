import {
  FunctionComponent,
  useContext,
  useState,
  useEffect,
  FormEvent,
  useRef
} from "react";
import Button from "../components/button/Button";
import FlowerCard from "../components/flower-card/FlowerCard";
import styles from "./index.module.scss";
import {
  regalFeatures,
  regalOccasions,
  reviews,
  blogPosts,
  featuredSlugs,
  allOccasionOptions,
  giftItems,
  defaultBreadcrumb,
  websiteUrl,
  schemaProperties
} from "../utils/constants";
import ServiceCard from "../components/service-card/ServiceCard";
import OccasionCard from "../components/occasion-card/OccasionCard";
import BlogCard from "../components/blog-card/BlogCard";
import SettingsContext from "../utils/context/SettingsContext";
import Select, { PaginatedOptionsWrapper } from "../components/select/Select";
import DatePicker from "../components/date-picker/DatePicker";
import { getCategories } from "../utils/helpers/data/category";
import { FetchResourceParams } from "../utils/types/FetchResourceParams";
import { getProductsBySlugs } from "../utils/helpers/data/products";
import Product from "../utils/types/Product";
import { LocationName, UserReview } from "../utils/types/Regal";
import { GetStaticProps } from "next";
import useDeviceType from "../utils/hooks/useDeviceType";
import Link from "next/link";
import SchemaMarkup from "../components/schema-mark-up/SchemaMarkUp";
import Meta from "../components/meta/Meta";
import Input from "../components/input/Input";
import { subscribeToNewsletter } from "../utils/helpers/data/core";

const getReviewRender = (review: UserReview, i: number) => (
  <div key={i} className={styles.review}>
    <div className={styles.rating}>
      <div>
        {Array(review.rating)
          .fill("")
          .map((_, index) => (
            <img
              key={index}
              className="generic-icon"
              alt="star"
              src="/icons/star.svg"
            />
          ))}
        {Array(5 - review.rating)
          .fill("")
          .map((_, index) => (
            <img
              key={index}
              className="generic-icon"
              alt="star"
              src="/icons/star-white.svg"
            />
          ))}
      </div>
      <strong className={styles["review-date"]}>{review.date}</strong>
    </div>
    <strong className="vertical-margin compact">{review.user.name}</strong>
    <span className={styles.text}>“{review.text}”</span>
  </div>
);

let reviewScrollTimer: NodeJS.Timeout;

export const metadata = {
  title:
    "Floral Hub | 24/7 Online & Walk-in Fresh Flowers & Gifts Shop in Lagos and Abuja, Nigeria that offers Same Day Delivery in Lagos, and Abuja, Nigeria",
  description:
    "Order flowers and gifts online for same-day delivery or walk in 24/7. Send flowers to celebrate someone special from the top flower shop in Lagos & Abuja, Nigeria.",
  metadataBase: "https://www.floralhub.com.ng/"
};

const LandingPage: FunctionComponent<{
  locationName: LocationName;
  featuredBirthday?: Product[];
  featuredRomance?: Product[];
  featuredFlowers?: Product[];
  featuredGifts?: Product[];
  featuredProduct?: Product[];
  featuredOccasion?: Product[];
}> = ({ featuredBirthday, locationName, featuredGifts, featuredProduct }) => {
  const [currentReviewPageIndex, setCurrentReviewPageIndex] = useState(0);
  const [subscriptionEmail, setSubscriptionEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [minimizedStory] = useState(false);

  const { setBreadcrumb, notify } = useContext(SettingsContext);

  const deviceType = useDeviceType();

  const handleEmailSubscription = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    const { error, message } = await subscribeToNewsletter(subscriptionEmail);
    setIsSubscribing(false);
    if (error) {
      notify("error", `Unable to subscribe email: ${message}`);
      return;
    }
    notify("success", "Successfully subscribed to newsletter");
  };

  const reviewsPerPage = deviceType === "desktop" ? 3 : 1;
  const reviewsPageCount = Math.ceil(reviews.general.length / reviewsPerPage);

  useEffect(() => {
    setBreadcrumb(defaultBreadcrumb);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reviewDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (deviceType === "mobile") {
      reviewDivRef.current?.scroll({
        left: currentReviewPageIndex * (window.screen.availWidth - 40),
        behavior: "smooth"
      });
    }
  }, [currentReviewPageIndex, deviceType]);

  const handleReviewScroll = () => {
    const newPageIndex = Math.round(
      (reviewDivRef.current?.scrollLeft || 1) / (window.screen.availWidth - 40)
    );
    setCurrentReviewPageIndex(newPageIndex);
  };

  return (
    <>
      <Meta
        title="Floral Hub | 24/7 Online & Walk-in Fresh Flowers & Gifts Shop in Lagos and Abuja, Nigeria that offers Same Day Delivery in Lagos, and Abuja, Nigeria"
        description="Order flowers and gifts online for same-day delivery or walk in 24/7. Send flowers to celebrate someone special from the top flower shop in Lagos & Abuja, Nigeria."
        image="https://firebasestorage.googleapis.com/v0/b/floralhub-cdn/o/flroal-homepage-opengragh-image.jpg.jpg?alt=media&token=ccaf55e8-cc14-4ccb-a92d-9ba8b280c212"
        imageAlt="Floral Hub"
        canonicalUrl={websiteUrl}
      >
        <SchemaMarkup properties={schemaProperties} />
      </Meta>

      <section className="page-content">
        <div
          className={[styles["hero-bg"], styles[locationName], "hero-bg"].join(
            " "
          )}
        >
          <div
            className={[
              "hero-content flex column center",
              styles["hero-content"]
            ].join(" ")}
          >
            <h1 className={styles.title}>
              Send Fresh Flowers {deviceType === "desktop" && <br />}
              to Lagos and Abuja, {deviceType === "desktop" && (
                <br />
              )} Nigeria {deviceType === "desktop" && <br />}
            </h1>
            <p className={styles.subtitle}>
              Your Favorite Online Fresh Flowers and Gifts Shop.
            </p>
            <a href="https://google.com" target="_blank" rel="noreferrer">
              <div className="flex spaced center-align">
                <span className={styles.stats}>
                  <img
                    className="generic-icon small"
                    src="/icons/star.svg"
                    alt="google"
                  />
                  <span>4.99 </span>{" "}
                  <span className="underline">1,000+ reviews</span>
                </span>
              </div>
            </a>
          </div>
        </div>

        <section className="featured-section-wrapper">
          <div className={styles["hero-input"]}>
            <FlowerDeliveryInput />
          </div>
          <div className="featured-content">
            <h2 className="featured-title text-center vertical-margin xl">
              Same Day Flower Delivery For All Occasions
            </h2>
            <div className={styles["featured-occasion"]}>
              <img
                alt="featured occasion"
                src="/images/occassions-birthday.png"
                className={styles["featured-occasion-image"]}
              />
              <Link href="/product-category/birthday-flowers">
                <a className={styles["featured-occasion-details"]}>
                  <h3 className={styles.title}>BIRTHDAY FLOWERS</h3>
                  <span className={styles.subtitle}>
                    Celebrate them with beautiful handpicked fresh flowers
                    delivered right to their doorstep
                  </span>
                  <Button className={styles.button}>
                    SHOP BIRTHDAY FLOWERS
                  </Button>
                </a>
              </Link>
            </div>

            <div className={[styles.section, styles.wrap].join(" ")}>
              {regalOccasions.map(
                occasion =>
                  (deviceType === "desktop" ||
                    occasion.title !== "Condolence flowers") && (
                    <OccasionCard
                      key={occasion.title}
                      name={occasion.title}
                      url={occasion.url}
                      image={occasion.image}
                      subTitle={occasion.subtitle}
                      mode={
                        deviceType === "mobile" ? "two-x-grid" : "three-x-grid"
                      }
                      buttonText={
                        deviceType === "desktop" ? occasion.cta : "SHOP FLOWERS"
                      }
                      color={occasion.color}
                    />
                  )
              )}
            </div>

            <div className="flex between">
              <h2 className="featured-title">BEST SELLING FLOWERS AND GIFTS</h2>
              {deviceType === "desktop" && (
                <Button
                  url="/product-category/flowers-to-say-thanks-sorry-etc"
                  className="flex spaced center-align"
                  type="plain"
                >
                  <h3 className="red margin-right">See All</h3>
                </Button>
              )}
            </div>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {featuredBirthday?.map(flower => (
                <FlowerCard
                  key={flower.key}
                  image={flower.images[0]?.src || ""}
                  name={flower.name.split("–")[0]}
                  subTitle={flower.subtitle || flower.name.split("–")[1]}
                  price={flower.price}
                  url={`/product/${flower.slug}`}
                  buttonText={
                    flower.variants?.length ? "Select Size" : "Add to Cart"
                  }
                  cart={flower.variants?.length ? false : true}
                  product={flower}
                />
              ))}
            </div>

            <div className={[styles.section, styles.wrap].join(" ")}>
              {featuredGifts?.map(flower => (
                <FlowerCard
                  key={flower.key}
                  image={flower.images[0]?.src || ""}
                  name={flower.name.split("–")[0]}
                  subTitle={flower.subtitle || flower.name.split("–")[1]}
                  price={flower.price}
                  url={`/product/${flower.slug}`}
                  buttonText={
                    flower.variants?.length ? "Select Size" : "Add to Cart"
                  }
                  cart={flower.variants?.length ? false : true}
                  product={flower}
                />
              ))}
            </div>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {featuredProduct?.map(flower => (
                <FlowerCard
                  key={flower.key}
                  image={flower.images[0]?.src || ""}
                  name={flower.name.split("–")[0]}
                  subTitle={flower.subtitle || flower.name.split("–")[1]}
                  price={flower.price}
                  url={`/product/${flower.slug}`}
                  buttonText={
                    flower.variants?.length ? "Select Size" : "Add to Cart"
                  }
                  cart={flower.variants?.length ? false : true}
                  product={flower}
                  mode="four-x-grid"
                />
              ))}
            </div>

            {deviceType === "mobile" && (
              <Button
                url="/product-category/flowers-to-say-thanks-sorry-etc"
                type="plain"
                minWidth
                className={styles["see-all"]}
              >
                <h3 className="red margin-right">Browse All Flowers</h3>
                <img alt="see all" src="/icons/arrow-right.svg" />
              </Button>
            )}

            <div className="vertical-margin xl">
              <h2 className="featured-title text-center full-width">
                What Makes <span className="primary-color">FloralHub</span> So
                Special?
              </h2>
              <div className={[styles["quote-flex"], styles.section].join(" ")}>
                <img
                  alt="quote"
                  src="/images/quote-1.png"
                  className={styles["quote-img"]}
                />
                <div className={styles.quote}>
                  "We don't just deliver flowers and gifts. Every flower and
                  gift delivery is a special experience between you and the
                  receiver, and we are happy to help create it.”
                </div>
                <img
                  alt="quote"
                  src="/images/quote-2.png"
                  className={styles["quote-img"]}
                />
              </div>
            </div>

            <div className="vertical-margin xl">
              <div className="flex between">
                <h2 className="featured-title">
                  Gifts to Include with Flowers
                </h2>
                {deviceType === "desktop" && (
                  <Button
                    url="/product-category/gifts"
                    className="flex spaced center-align"
                    type="plain"
                  >
                    <h3 className="red margin-right">See All</h3>
                  </Button>
                )}
              </div>
              <div className={[styles.section, styles.wrap].join(" ")}>
                {giftItems.map(gift => (
                  <FlowerCard
                    key={gift.name}
                    image={gift.image}
                    name={gift.name}
                    subTitle={gift.description}
                    url={gift.slug}
                    buttonText="VIEW GIFTS"
                    mode="four-x-grid"
                  />
                ))}
              </div>
            </div>

            {deviceType === "mobile" && (
              <Button
                url="/product-category/gifts"
                type="plain"
                minWidth
                className={styles["see-all"]}
              >
                <h3 className="red margin-right">Browse All Gifts</h3>
                <img alt="see all" src="/icons/arrow-right.svg" />
              </Button>
            )}
            <div className="vertical-margin xl">
              <h2 className="featured-title full-width text-center">
                Why shop with us
              </h2>
              <div className={[styles.section, styles.wrap].join(" ")}>
                {regalFeatures.map(feature => (
                  <ServiceCard
                    title={feature.title}
                    key={feature.title}
                    subtitle={feature.subtitle}
                    image={feature.image}
                    buttonText={feature.cta}
                    url={feature.url}
                  />
                ))}
              </div>
            </div>
          </div>

          <h2 className="featured-title full-width text-center">
            Customer reviews
          </h2>
          <div className={styles["reviews-subtitle"]}>
            We pride ourselves on delivering a first class experience and always
            welcome feedback. This is key to helping us improve our service in
            every aspect of our business.
          </div>
          <div className={styles["reviews-wrapper"]}>
            <div className="flex column center spaced center-align full-width">
              {deviceType === "desktop" && <h2>Excellent</h2>}
              <a
                href="https://google.com"
                target="_blank"
                className={styles["google-review"]}
                rel="noreferrer"
              >
                <img
                  alt="stars"
                  src="/icons/stars.png"
                  className="generic-icon medium margin-bottom"
                />
                <div className="flex spaced center-align">
                  <img
                    className="generic-icon large"
                    src="/icons/google.svg"
                    alt="google"
                  />
                  <span className={styles.stats}>
                    Over <strong>4.99 </strong> <span> average review</span>
                  </span>
                </div>
              </a>
            </div>
            {deviceType === "desktop" && (
              <img
                className={[
                  styles["review-arrow"],
                  styles["left-arrow"],
                  currentReviewPageIndex > 0 && styles.active
                ].join(" ")}
                alt="previous"
                role="button"
                aria-label={`Go to page ${currentReviewPageIndex - 1}`}
                onClick={() =>
                  setCurrentReviewPageIndex(currentReviewPageIndex - 1)
                }
                src="/icons/caret-right.svg"
              />
            )}
            <div
              className={styles.reviews}
              ref={reviewDivRef}
              onScroll={() => {
                if (deviceType === "mobile") {
                  clearTimeout(reviewScrollTimer);
                  reviewScrollTimer = setTimeout(handleReviewScroll, 100);
                }
              }}
            >
              {Array(reviewsPageCount)
                .fill("")
                .map((_, index) => (
                  <div
                    key={index}
                    className={[
                      styles["review-page"],
                      index === currentReviewPageIndex && styles.active
                    ].join(" ")}
                  >
                    {reviews[locationName]
                      ?.slice(
                        currentReviewPageIndex * reviewsPerPage,
                        currentReviewPageIndex * reviewsPerPage + reviewsPerPage
                      )
                      .map(getReviewRender)}
                  </div>
                ))}
            </div>
            {deviceType === "desktop" && (
              <img
                className={[
                  styles["review-arrow"],
                  currentReviewPageIndex < reviewsPageCount - 1 && styles.active
                ].join(" ")}
                alt="next"
                src="/icons/caret-right.svg"
                role="button"
                aria-label={`Go to page ${currentReviewPageIndex + 1}`}
                onClick={() =>
                  setCurrentReviewPageIndex(currentReviewPageIndex + 1)
                }
              />
            )}
            <div className={styles["review-dots"]}>
              {Array(reviewsPageCount)
                .fill("")
                .map((_, index) => (
                  <span
                    key={index}
                    role="button"
                    aria-label={`Go to page ${index + 1}`}
                    onClick={() => setCurrentReviewPageIndex(index)}
                    className={[
                      styles.dot,
                      index === currentReviewPageIndex && styles.active
                    ].join(" ")}
                  ></span>
                ))}
            </div>
          </div>

          <div className={[styles["full-width-section"]].join(" ")}>
            <img
              className={styles.left}
              src="/images/landing-summary.png"
              alt="review"
            />
            <div className={styles.right}>
              <h2 className="featured-title">FINISHING TOUCHES</h2>
              <span className={styles.subtitle}>
                We know how important it is to make someone feel special. That's
                why we've hand-picked a range of lovely little extras you can
                add to your gift.
              </span>
              <Button
                padded
                url="/product-category/anniversary-flowers"
                className="margin-top"
                size="large"
                responsive
              >
                SHOP GIFTS
              </Button>
            </div>
          </div>

          <div className="featured-content">
            <div className="flex between center-align">
              <h2 className="featured-title text-center margin-bottom spaced">
                Our Blog
              </h2>
              <Button
                url="/product-category/gifts"
                className="flex spaced center-align"
                type="plain"
              >
                <h3 className="red margin-right">See All</h3>
              </Button>
            </div>
            <div className={[styles.section, styles.wrap].join(" ")}>
              {blogPosts.map(post => (
                <BlogCard
                  key={post.title}
                  title={post.title}
                  readDuration={post.readDuration}
                  date={post.date}
                  image={post.image}
                  excerpt={post.excerpt}
                  url="#"
                />
              ))}
            </div>
          </div>

          <div className={styles["subscribe-section"]}>
            <div className="flex column between">
              <div className="flex column spaced">
                <h2 className="featured-title unspaced">
                  Stay Updated With Our Newsletter
                </h2>
                <div className="grayed">
                  Get blog updates and special deals direct to your inbox
                </div>
              </div>
              <div className={styles["subscribe-form-wrapper"]}>
                <span className="grayed semibold">Subscribe to updates</span>
                <form
                  className={`flex spaced responsive`}
                  onSubmit={handleEmailSubscription}
                >
                  <Input
                    value={subscriptionEmail}
                    onChange={setSubscriptionEmail}
                    className="full-width"
                    placeholder="Enter email address"
                    icon="/icons/envelope.svg"
                    required
                    type="email"
                    name="email"
                  />
                  <Button buttonType="submit" loading={isSubscribing}>
                    SUBSCRIBE
                  </Button>
                </form>
              </div>
            </div>
            <img
              className={styles["subscribe-img"]}
              alt="subscribe"
              src="/images/subscribe-img.png"
            />
          </div>

          {/* <InstagramFeed
            accessToken={
              process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN as string
            }
          /> */}

          <div className={styles["story-section"]}>
            <div className={styles["story-wrapper"]}>
              <div
                className={[
                  styles.story,
                  minimizedStory && styles.minimized
                ].join(" ")}
              >
                <div className="flex column spaced">
                  <h2 className={styles["story-topic"]}>
                    FLORALHUB - The top flower shop in Lagos and Abuja
                  </h2>
                  <div className="flex column spaced">
                    <p className={styles.para}>
                      Deciding on where to buy fresh flowers in Lagos or where
                      to buy fresh flowers in Abuja? Floralhub.com.ng is the top
                      online fresh Flower Shop in Lagos, Nigeria and flower shop
                      in Abuja, Nigeria for same day delivery of all your fresh
                      flowers and gifts in Lagos, Nigeria and in Abuja, Nigeria.
                    </p>
                    <p className={styles.para}>
                      Whatever the occassion: Valentine’s Day flowers, Birthday
                      flowers, Anniversary flowers, Romance flowers, I am sorry
                      flowers, Bridal Bouquets, Mother’s Day flowers, Get Well
                      Soon flowers, Funeral Wreaths, or more, FloralHub.com.ng
                      is the place to buy flowers online and get them delivered
                      the same day or in the future.
                    </p>
                    <h2 className={styles["story-topic"]}>WHY FLORALHUB?</h2>
                    <p className={styles.para}>
                      At Floralhub.com.ng , our trained florists bring that
                      special touch to every arrangement, and with our
                      unparalleled customer service and beautiful flower and
                      gift options, we help you remind your loved ones in Lagos,
                      Nigeria just how much they mean to you, now and everyday.
                    </p>
                    <p className={styles.para}>
                      Floral Hub is Nigeria’s top online fresh flower shop in
                      Lagos, Nigeria. We are the one stop online shop for your
                      flowers and gifts, and we deliver same day in Lagos,
                      Nigeria. Buy flowers online today for same day delivery in
                      Lagos, Nigeria – Shop Fresh Flower & Rose Bouquets.
                    </p>
                    <p className={styles.para}>
                      Choose your desired flower bouquets and gifts, and select
                      delivery information. Order and make payment online (Card
                      or PayPal), Nigeria or UK Bank Transfer, PayPal to email,
                      Bitcoins etc.
                    </p>

                    <h2 className={styles["story-topic"]}>
                      WHAT TYPES OF FLOWERS AND GIFTS CAN I BUY?
                    </h2>
                    <p className={styles.para}>
                      You can buy various fresh flowers ranging from red roses,
                      white roses, pink roses, lilies, chrysanthemums,
                      hydrangeas, million stars, tulips, lily and more and well
                      as various types of gifts such as cakes and cupcakes,
                      chocolates (such as Ferrero Rocher, Lindt chocolate etc),
                      wine and champagne (Moet Champagne, Veuve Clicquot, etc),
                      and red, white, pink or cream Teddy Bears in various sizes
                    </p>
                    <h2 className={styles["story-topic"]}>
                      WHERE DO WE DELIVER FLOWERS TO IN LAGOS & ABUJA?
                    </h2>
                    <p className={styles.para}>
                      We deliver everywhere in Lagos and Abuja and same day too.
                    </p>
                    <p className={styles.para}>
                      When considering flower shops in Lagos, Nigeria or Flower
                      shops in Abuja, Nigeria, Floral Hub is the top flower shop
                      that offers same day delivery of luxurious fresh flowers,
                      gifts, bridal bouquets, gifts, wreaths and other
                      arrangements to Victoria Island, Ikoyi Ikeja, Lekki Phase
                      1, Chevron, Lekki, Ajah, Gbagada, Yaba, Surulere, Ilupeju,
                      Magodo, Maryland, Opebi, Ogba, Ogudu, Allen Avenue, Festac
                      and all other parts of Lagos, Nigeria and flowers shops in
                      Abuja, Nigeria covering areas such as Wuse 2, Maitama,
                      Garki, Jabi, Asokoro, and all other areas of Abuja. To Buy
                      flowers in Lagos & Abuja, Nigeria, Floralhub is the
                      one-stop solution. Buy flowers and gifts in Lagos & Abuja,
                      Nigeria. Same Day Delivery
                    </p>
                  </div>
                </div>
                <div className="flex column spaced">
                  <h2 className={styles["story-topic"]}>
                    HOW TO BUY FLOWERS IN LAGOS & ABUJA
                  </h2>
                  <div className="flex column spaced">
                    <p className={styles.para}>
                      To buy flowers and gifts in Lagos, Nigeria or to buy
                      flowers and gifts in Abuja, Nigeria, for delivery to your
                      loved ones, simply order online, or call us on phone or
                      Whatsapp to make your orders. There are various purchase
                      methods and you can make a bank transfer, or make payment
                      online. At FloralHub, we are not just one of the best
                      Fresh Flower Shops in Lagos, Nigeria, or Fresh Flower
                      Shops in Abuja, Nigeria, we are the one-stop location as
                      we are the fresh flowers and gifts shop in Lagos, Nigeria
                      and fresh flowers and gifts shop in Abuja, Nigeria that
                      offers a one-stop experience for buying fresh flowers and
                      gifts for your wife, girlfriend, husband, boyfriend,
                      friends, and loved ones. Buy flowers and gifts in Lagos &
                      Abuja, Nigeria. Same Day Delivery
                    </p>
                    <p className={styles.para}>
                      Order now, to buy & send flowers online or phone today for
                      fast, reliable same day delivery in Lagos, Nigeria.
                    </p>
                    <p className={styles.para}>
                      Buy online or Call/WhatsApp: +234 907 777 7994 for
                      assistance with your order. Buy flowers and gifts in Lagos
                      & Abuja, Nigeria. Open 24hrs. Same Day Delivery
                    </p>

                    <h2 className={styles["story-topic"]}>
                      HOW MUCH ARE FRESH FLOWERS IN LAGOS & ABUJA
                    </h2>
                    <p className={styles.para}>
                      At FloralHub, you can either order flowers online or we
                      can also work to suit your budget. Reach us at +234 907
                      777 7994 today to make your order from one of the best
                      flower shops in Lagos, Nigeria.
                    </p>
                    <p className={styles.para}>
                      Buy flowers in Lagos, Nigeria online, or by phone today –
                      Shop for your Fresh Flower & Rose Bouquets today from
                      Nigeria’s best rated fresh flowers, roses & gifts store.
                      We offer fast, reliable delivery. Buy flowers in Lagos,
                      Nigeria online for all occasions, Birthdays, Weddings,
                      Romantic, Vals gestures and more from the top Flower shop
                      in Lagos, Nigeria.
                    </p>
                    <p className={styles.para}>
                      Buy flowers and gifts in Lagos & Abuja, Nigeria. Same Day
                      Delivery
                    </p>
                    <p className={styles.para}>Terms & Conditions apply.</p>
                    <p className={styles.para}>
                      On another note, be sure to read this post on how to care
                      for flowers. It’s a great read.
                    </p>

                    <h2 className={styles["story-topic"]}>
                      HOW TO PAY FOR FRESH FLOWERS DELIVERY IN LAGOS AND ABUJA
                    </h2>
                    <p className={styles.para}>
                      There are various payment methods you can use on our
                      website to pay for delivery of fresh flowers and gifts in
                      Lagos and Abuja.
                    </p>
                    <p className={styles.para}>
                      Most people choose to pay online when placing their order.
                      Other methods available to clients include: bank transfer
                      method, Bitcoin and Western Union by request.
                    </p>
                  </div>
                </div>
              </div>
              {/* <Button
                className={styles.continue}
                type="plain"
                onClick={() => setMinimizedStory(!minimizedStory)}
              >
                {minimizedStory ? "Continue reading" : "See less"}
              </Button> */}
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

const FlowerDeliveryInput: FunctionComponent = () => {
  const [occasion, setOccasion] = useState<{ value: number; slug: string }>({
    value: -1,
    slug: ""
  });
  const { deliveryDate, setDeliveryDate } = useContext(SettingsContext);
  const [occassionOptions, setOccassionOptions] = useState<
    PaginatedOptionsWrapper
  >({
    options: []
  });

  const deviceType = useDeviceType();

  const fetchCategories = async (props?: FetchResourceParams) => {
    const { pageNumber = 1, pageSize = 10, mergeRecords } = props || {};
    const response = await getCategories({ pageNumber, pageSize });
    const { data, error } = response;

    if (error) {
      return;
    } else if (data) {
      const category = data.map(category => ({
        value: category.id,
        label: category.name
      }));

      const options = [
        ...(mergeRecords ? occassionOptions.options : []),
        ...category
      ];

      setOccassionOptions({ options, hasNext: data.length > 0 });
    }
  };

  const handleOnselect = (value: number) => {
    const selectedOccasion = allOccasionOptions.find(
      _occasion => _occasion.value === value
    );

    setOccasion({
      value: selectedOccasion?.value as number,
      slug: selectedOccasion?.slug as string
    });
  };

  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles["flower-input-wrapper"]}>
      <div className="full-width flex">
        <Select
          options={allOccasionOptions}
          value={occasion.value}
          onSelect={value => handleOnselect(value as number)}
          className={styles["occasion-select"]}
          placeholder={
            deviceType === "desktop" ? "Select Occasion" : "Occasion"
          }
          startIcon="/icons/bullet-points.svg"
          hideCaret
        />
        <span className={styles.vr} />
        <DatePicker
          value={deliveryDate}
          onChange={setDeliveryDate}
          format="D MMM YYYY"
          className={styles["delivery-date"]}
          placeholder="Delivery Date"
          dropdownAlignment={deviceType === "mobile" ? "right" : "left"}
          iconAtLeft
          disablePastDays
        />
      </div>
      <Button
        padded
        url={`/product-category/${occasion?.slug || "anniversary-flowers"}`}
        className={styles["input-submit"]}
      >
        Send Flowers
      </Button>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const { data, error, message } = await getProductsBySlugs(
    featuredSlugs["featured-birthday"]
  );

  const featuredOccasion = await getProductsBySlugs(
    featuredSlugs["featured-occasion"]
  );

  const featuredGifts = await getProductsBySlugs(
    featuredSlugs["featured-gift"]
  );

  const featuredProduct = await getProductsBySlugs(
    featuredSlugs["featured-product"]
  );

  if (error) {
    console.error("Unable to fetch products by slugs: ", message);
  }

  return {
    props: {
      locationName: "general",
      featuredBirthday: data || [],
      featuredGifts: featuredGifts.data || [],
      featuredProduct: featuredProduct.data || [],
      featuredOccasion: featuredOccasion.data || []
    },
    revalidate: 1800
  };
};

export default LandingPage;
