import {
  FormEvent,
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import styles from "./Layout.module.scss";
import SettingsContext from "../../utils/context/SettingsContext";
import { useRouter } from "next/router";
import Button from "../button/Button";
import { featuredSlugs } from "../../utils/constants";
import FlowerCard from "../flower-card/FlowerCard";
import { getProductsBySlugs } from "../../utils/helpers/data/products";
import Product from "../../utils/types/Product";

interface Props {
  visible: boolean;
  hasScrolled: boolean;
  cancel: () => void;
}

const SearchDropdown: FunctionComponent<Props> = props => {
  const { visible, hasScrolled, cancel } = props;

  const [bestSellingProducts, setBestSellingProducts] = useState<Product[]>([]);

  const { searchText, setSearchText } = useContext(SettingsContext);

  const { push } = useRouter();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();

    if (searchText) {
      push(`/filters?search=${searchText}`, undefined, { scroll: false });
      cancel();
    } else {
      push("/product-category/anniversary-flowers", undefined, {
        scroll: false
      });
    }
  };

  const fetchBestProducts = async () => {
    const { data, error, message } = await getProductsBySlugs(
      featuredSlugs["featured-birthday"]
    );
    if (error) {
      console.error("Unable to fetch products by slugs: ", message);
    } else {
      setBestSellingProducts(data || []);
    }
  };

  useEffect(() => {
    fetchBestProducts();
  }, []);

  return (
    <div
      className={[
        styles["search-dropdown"],
        visible && styles.active,
        hasScrolled && styles.minimize
      ].join(" ")}
    >
      <form className={styles["search-form"]} onSubmit={handleSearch}>
        <img
          alt="search"
          src="/icons/search.svg"
          className={`${styles["search-icon"]} generic-icon medium clickable`}
        />
        <input
          type="text"
          onChange={e => {
            setSearchText(e.target.value);
          }}
          placeholder="Search keyword or category"
          value={searchText}
          className={styles["search-input"]}
        />
        <img
          alt="search"
          src="/icons/search-cancel.svg"
          className={`${styles["search-icon"]} generic-icon medium clickable`}
          onClick={() => {
            setSearchText("");
          }}
        />
      </form>
      <div className="flex between center-align">
        <p className="text-regular">BEST SELLING PRODUCT</p>
        <Button
          url="/product-category/anniversary-flowers"
          className="flex spaced center-align primary-color"
          type="transparent"
        >
          See All
        </Button>
      </div>
      <div className={[styles["featured-product"]].join(" ")}>
        {bestSellingProducts.map(product => (
          <FlowerCard
            key={product.key}
            image={product.images[0]?.src || ""}
            name={product.name.split("–")[0]}
            subTitle={product.subtitle || product.name.split("–")[1]}
            price={product.price}
            url={`/product/${product.slug}`}
            buttonText="Add to Cart"
            cart={product.variants?.length ? false : true}
            product={product}
          />
        ))}
      </div>
    </div>
  );
};

export default SearchDropdown;
