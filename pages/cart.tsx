import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { CartItem, Design } from "../utils/types/Core";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import styles from "./cart.module.scss";
import Button from "../components/button/Button";
import SettingsContext from "../utils/context/SettingsContext";
import { useRouter } from "next/router";
import {
  getOrder,
  createOrder,
  updateOrder
} from "../utils/helpers/data/order";
import { ProductImage } from "../utils/types/Product";
import dayjs from "dayjs";
import { getPriceDisplay } from "../utils/helpers/type-conversions";
import useDeviceType from "../utils/hooks/useDeviceType";

interface CartContextProps {
  header?: "checkout" | "main";
  cartItems?: CartItem[];
}
const breadcrumbItems = [{ label: "Home", link: "/" }, { label: "Cart" }];
const Cart: FunctionComponent<CartContextProps> = props => {
  const deviceType = useDeviceType();
  const { header = "main" } = props;

  const {
    cartItems,
    setCartItems,
    deliveryDate,
    setDeliveryDate,
    currency,
    notify,
    orderId,
    setOrderId,
    setOrder,
    setShouldShowCart,
    setOrderLoading,
    setCurrentStage,
    deliveryFee
  } = useContext(SettingsContext);
  const [loading, setLoading] = useState(false);

  const totalCartItems = useMemo(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const router = useRouter();
  const { push } = router;

  const fetchOrder = async (orderId: string) => {
    setOrderLoading(true);
    const { error, data, status } = await getOrder(orderId);
    if (error) {
      if (status === 404) {
        if (cartItems.length) {
          const { data } = await createOrder({
            cartItems,
            deliveryDate: deliveryDate?.format("YYYY-MM-DD") || "",
            currency: currency.name
          });
          setOrderId(data?.id || "");
        } else {
          setOrderId("");
          setOrder(null);
          setCartItems([]);
          setDeliveryDate(null);
          push("/");
        }
      }
    } else {
      const alreadyAddedItems = new Set<string>();
      const cartItemsOnOrder: CartItem[] =
        data?.orderProducts?.map(item => ({
          image: item.image as ProductImage,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          key: item.key,
          // design: item.design,  //add design later
          size: item.size,
          description: item.description,
          SKU: item.SKU || ""
        })) || [];

      const newCartItems: CartItem[] = [];
      [...cartItemsOnOrder, ...cartItems].forEach(item => {
        if (!alreadyAddedItems.has(item.SKU)) {
          newCartItems.push(item);
          alreadyAddedItems.add(item.SKU);
        }
      });
      setCartItems(newCartItems);

      setOrder(data);
      setDeliveryDate(data?.deliveryDate ? dayjs(data?.deliveryDate) : null);
    }
    setOrderLoading(false);
  };

  const handleRemoveItemQuantity = (key: string) => {
    const item = cartItems.find(item => item.SKU === key);
    if (item) {
      if (item.quantity > 1) {
        setCartItems(
          cartItems.map(item => {
            if (item.SKU === key) {
              return {
                ...item,
                quantity: item.quantity - 1,
                design: item.design && {
                  ...item.design,
                  quantity: (item.design?.quantity as number) - 1
                }
              };
            }
            return item;
          })
        );
      }
    }
  };

  const handleAddItemQuantity = (key: string) => {
    const item = cartItems.find(item => item.SKU === key);
    if (item) {
      setCartItems(
        cartItems.map(item => {
          if (item.SKU === key) {
            return {
              ...item,
              quantity: item.quantity + 1,
              design:
                item.design &&
                ({
                  ...item.design,
                  quantity: (item.design?.quantity as number) + 1
                } as Design)
            };
          }
          return item;
        })
      );
    }
  };

  const total = cartItems?.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCreateOrder = async () => {
    setLoading(true);

    const { data, error, message } = await createOrder({
      cartItems,
      deliveryDate: deliveryDate?.format("YYYY-MM-DD") || "",
      currency: currency.name
    });

    setLoading(false);
    if (error) {
      notify("error", `Unable to create order: ${message}`);
    } else if (data) {
      setDeliveryDate(data.deliveryDate ? dayjs(data?.deliveryDate) : null);
      setOrderId(data.id);
      router.push(`/checkout?orderId=${data.id}`);
      setShouldShowCart(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!cartItems.length) {
      return;
    }
    setLoading(true);

    const { data, error, message } = await updateOrder({
      cartItems,
      deliveryDate: deliveryDate?.format("YYYY-MM-DD") || "",
      id: orderId as string,
      currency: currency.name
    });

    setLoading(false);
    if (error) {
      notify("error", `Unable to update order: ${message}`);
    } else if (data) {
      setOrder(data);
      setDeliveryDate(data.deliveryDate ? dayjs(data?.deliveryDate) : null);

      if (header === "main") {
        router.push(`/checkout?orderId=${data.id}`);
      }

      setShouldShowCart(false);
      setCurrentStage(1);
    }
  };

  const handleRemoveItem = (key: string) => {
    setCartItems(cartItems.filter(item => item.SKU !== key));
  };

  const designCharges = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const designTotal =
        item.design && item?.design.price * item.design.quantity;
      return total + (designTotal || 0);
    }, 0);
  }, [cartItems]);

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={styles["wrapper"]}>
      <div className="">
        <Breadcrumb items={breadcrumbItems} />
        <p className="text-large vertical-margin compact margin-bottom spaced normal">
          {" "}
          CART{" "}
        </p>
      </div>

      <div className={` ${styles["content"]}`}>
        {cartItems.length ? (
          <div className={`${styles.summary} normal text-regular `}>
            <p className={``}>
              ORDER SUMMARY (
              {totalCartItems > 1 ? totalCartItems + " ITEMS" : totalCartItems})
            </p>
            {deviceType === "mobile" && <hr />}
            <div className="flex between">
              {" "}
              <p className="faint-text">Order Subtotal</p>
              <p className="semibold">{getPriceDisplay(total, currency)}</p>
            </div>
            <div className="flex between">
              <p className="faint-text">Delivery</p>
              <p className="semibold">
                {getPriceDisplay(deliveryFee, currency)}
              </p>
            </div>
            <hr className={styles.divider} />
            <div className="flex between">
              <p className="semibold">Order Total</p>
              <p className="semibold">
                {getPriceDisplay(total + designCharges + deliveryFee, currency)}
              </p>
            </div>
            <div>
              <Button
                responsive
                onClick={() =>
                  orderId ? handleUpdateOrder() : handleCreateOrder()
                }
                loading={loading}
                disabled={!cartItems.length}
              >
                {header === "main" ? "PROCEED TO CHECKOUT" : "UPDATE CART"}
              </Button>
            </div>
          </div>
        ) : (
          " "
        )}
        {deviceType === "mobile" && (
          <p className={` semi-bold ${styles.mobletitle} vertical-margin xl`}>
            YOUR ORDER LIST
          </p>
        )}

        {cartItems.length ? (
          cartItems.map((item, i) => (
            <div className={` ${styles.cartitems}`} key={i}>
              {deviceType === "desktop" && (
                <>
                  <div className={`flex ${styles.item} normal`}>
                    <img src={item.image.src} alt="" />
                    <div className={` ${styles.itemcard}`}>
                      <p className="text-mmedium semi-bold">
                        {item.name}{" "}
                        {/* {item.quantity > 1 ? (
                          // <span className="text-medium margin-left">
                          //   ({item.quantity})
                          // </span>
                        ) : (
                          ""
                        )} */}
                      </p>
                      <p className="text-medium faint-text">
                        {item.description}{" "}
                      </p>
                      <p className="semibold flex between">
                        {getPriceDisplay(item.price, currency)}
                        <div className="flex center-align spaced-lg">
                          <div
                            className={styles.minus}
                            onClick={() => handleRemoveItemQuantity(item.SKU)}
                          ></div>
                          <span className="text-regular">{item.quantity}</span>
                          <div
                            className={styles.plus}
                            onClick={() => handleAddItemQuantity(item.SKU)}
                          ></div>
                        </div>
                      </p>

                      {/* 

-----------------------------------------------------------------------------------------------------------------------------------------------------------
                                    PLEASE DO NOT DELETED ANY COMMENTED OUT CODE. THEY WLL STILL BE ADDED LATER ON !!!!!!!
-----------------------------------------------------------------------------------------------------------------------------------------------------------

*/}
                      {/* <div className={` flex center-align ${styles.gifts}`}>
                        <p>Gifts Included:</p>
                        <p><img src="/images/flower.png" alt="" height={30} width={30} className="margin" /></p>
                      </div> */}
                      <div
                        className={`flex between ${styles.btns} center-align normal`}
                      >
                        <p
                          className="text-small"
                          onClick={() => handleRemoveItem(item.SKU)}
                        >
                          Remove
                        </p>

                        {/* <button className="flex center-align">
                          <label className={`bold ${openItem[i] ? ["primary-color", styles.hide].join(" ") : ""}`} htmlFor={`open${i}`} onClick={() => toggleAnswer(i)}>{openItem[i] ? "Hide Details" : "View/Edit Details"}</label>
                          {openItem[i] ? (<img src="/icons/down-arrow-color.svg" alt="" className="" />) : (<img src="/icons/down-arrow.svg" alt="" className="" />)}
                        </button> */}
                      </div>
                    </div>
                  </div>

                  {/* <input id={`open${i}`} className="open-detail" type="checkbox" /> */}
                  <div className={styles.details}>
                    {/* <div>
                      <p className="bold text-medium">Your  selections</p>
                      <p className="primary-color bold">Edit</p>
                    </div> */}
                    {/* <div>
                      <p>Budgets:</p>
                      <p>Regular size</p>
                      <p>12000</p>
                    </div> */}
                    {/* <div>
                      <p>Design</p>
                      <p>Wrapped Bouquet</p>
                      <p>12000</p>
                    </div> */}
                    {/* <div>
                      <p>Gifts Included:</p>
                      <p><img src="/images/flower.png" alt="" height={30} width={30} className="margin" /></p>
                      <p> 5000 </p>
                    </div> */}
                  </div>
                </>
              )}
              {deviceType === "mobile" && (
                <>
                  <div className={`flex ${styles.item}`}>
                    <img src={item.image.src} alt="" />
                    <div className={` wrap ${styles.itemcard} normal`}>
                      <p className="text-medium">
                        {item.name}{" "}
                        {/* {item.quantity > 1 ? (
                          <span className="text-medium margin-left">
                            ({item.quantity})
                          </span>
                        ) : (
                          ""
                        )} */}
                      </p>
                      <div className="vertical-margin">
                        {item.description}
                        <div className="flex center-align spaced-lg vertical-margin">
                          <div
                            className={styles.minus}
                            onClick={() => handleRemoveItemQuantity(item.SKU)}
                          ></div>
                          <span className="text-regular">{item.quantity}</span>
                          <div
                            className={styles.plus}
                            onClick={() => handleAddItemQuantity(item.SKU)}
                          ></div>
                        </div>
                      </div>
                      {/* <div className={` flex center-align ${styles.gifts}`}>
                          <p>Gifts Included:</p>
                          <p><img src="/images/flower.png" alt="" height={30} width={30} className="margin" /></p>
                        </div> */}
                    </div>
                  </div>
                  <div
                    className={`flex between ${styles.btns} center-align normal`}
                  >
                    <p
                      onClick={() => handleRemoveItem(item.SKU)}
                      className="text-small"
                    >
                      Remove
                    </p>

                    <p className="semibold text-medium">
                      {getPriceDisplay(item.price, currency)}
                    </p>

                    {/* <button className="flex center-align">
                        <label className={`bold ${openItem[i] ? ["primary-color", styles.hide].join(" ") : ""}`} htmlFor={`open${i}`} onClick={() => toggleAnswer(i)}>{openItem[i] ? "Hide Details" : "View/Edit Details"}</label>
                        {openItem[i] ? (<img src="/icons/down-arrow-color.svg" alt="" className="" />) : (<img src="/icons/down-arrow.svg" alt="" className="" />)}
                      </button> */}
                  </div>

                  {/* <input id={`open${i}`} className="open-detail" type="checkbox" />
                    <div className={styles.details}>
                      <div>
                        <p className="bold text-medium">Your  selections</p>
                        <p className="primary-color bold">Edit</p>
                      </div>
                      <div>
                        <p>Budgets:</p>
                        <p>Regular size</p>
                        <p>12000</p>
                      </div>
                      <div>
                        <p>Design</p>
                        <p>Wrapped Bouquet</p>
                        <p>12000</p>
                      </div>
                      <div>
                        <p>Gifts Included:</p>
                        <p><img src="/images/flower.png" alt="" height={30} width={30} className="margin" /></p>
                        <p> 5000 </p>
                      </div>
                    </div> */}
                </>
              )}
            </div>
          ))
        ) : (
          <div className={`text-regular text-center ${styles.empty}`}>
            {" "}
            Empty Cart...
            <Button url="/product-category/flowers-to-say-thanks-sorry-etc ">
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Cart;
