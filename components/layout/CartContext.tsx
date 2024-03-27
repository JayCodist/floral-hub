import React, {
  FunctionComponent,
  MouseEvent as ReactMouseEvent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import styles from "./Layout.module.scss";
import SettingsContext from "../../utils/context/SettingsContext";
import { useRouter } from "next/router";
import Button from "../button/Button";
import {
  createOrder,
  getOrder,
  updateOrder
} from "../../utils/helpers/data/order";
import dayjs from "dayjs";
import { getPriceDisplay } from "../../utils/helpers/type-conversions";
import { CartItem, Design } from "../../utils/types/Core";
import DatePicker from "../date-picker/DatePicker";
import { ProductImage } from "../../utils/types/Product";
import AppStorage, {
  AppStorageConstants
} from "../../utils/helpers/storage-helpers";
import useScrollCheck from "../../utils/hooks/useScrollCheck";

interface CartContextProps {
  visible: boolean;
  cancel: () => void;
  header?: "checkout" | "main";
  cartItems?: CartItem[];
}

const CartContext: FunctionComponent<CartContextProps> = props => {
  const { visible, cancel, header = "main" } = props;

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
    currentStage,
    setOrderLoading,
    setCurrentStage
  } = useContext(SettingsContext);
  const [loading, setLoading] = useState(false);

  const hasScrolled = useScrollCheck();

  const totalCartItems = useMemo(() => {
    if (!cartItems.length) return 0;
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const cartRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const { push } = router;

  const handleCloseCart = (e: MouseEvent) => {
    const cartBody = cartRef.current;
    const backdrop = backdropRef.current;
    if (!cartBody || !cartBody.contains(e.target as Node)) {
      if (backdrop?.contains(e.target as Node)) cancel();
    }
  };

  const fetchOrder = async (orderId: string) => {
    setOrderLoading(true);
    const { error, data, status } = await getOrder(orderId);

    if (error) {
      if (status === 404) {
        setOrderId("");
        setOrder(null);
        setCartItems([]);
        setDeliveryDate(null);
        push("/");
      }
    } else {
      const _isPaid =
        /go\s*ahead/i.test(data?.paymentStatus || "") ||
        /^paid/i.test(data?.paymentStatus || "");

      const savedCartItems = AppStorage.get(AppStorageConstants.CART_ITEMS);
      const shouldUpdateSavedCartItems =
        !_isPaid && (!savedCartItems || header === "checkout");

      if (shouldUpdateSavedCartItems) {
        const _cartItems: CartItem[] =
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
        setCartItems(_cartItems);
      } else {
        setCartItems(savedCartItems || []);
      }

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

  useEffect(() => {
    if (visible && header !== "checkout") {
      document.addEventListener("mousedown", handleCloseCart);
    }
    return () => {
      document.removeEventListener("mousedown", handleCloseCart);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

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

  const handleUpdateOrder = async (clearCartItems: boolean) => {
    setLoading(true);

    const { data, error, message } = await updateOrder({
      cartItems: clearCartItems ? null : cartItems,
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

      if (header === "main" && !clearCartItems) {
        router.push(`/checkout?orderId=${data.id}`);
      }

      if (clearCartItems && header === "checkout") {
        router.push(`/`);
      }

      setShouldShowCart(false);
      setCurrentStage(1);
    }
  };

  const handleRemoveItem = (key: string) => {
    if (cartItems.length === 1) {
      setCartItems([]);
      if (orderId) {
        handleUpdateOrder(true);
      }
      return;
    }
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
    } else {
      const savedCartItems = AppStorage.get(AppStorageConstants.CART_ITEMS);
      if (savedCartItems) {
        setCartItems(savedCartItems || []);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, currentStage]);

  return (
    <div
      className={[
        styles.backdrop,
        visible && styles.active,
        visible && "scrollable"
      ].join(" ")}
      ref={backdropRef}
    >
      <div
        ref={cartRef}
        className={[
          styles["cart-context"],
          visible && styles.active,
          visible && "scrollable",
          (hasScrolled || header === "checkout") && styles["has-scrolled"]
        ].join(" ")}
      >
        <div className={styles["cart-header"]}>
          <h3 className="sub-heading bold">My Cart ({totalCartItems})</h3>
          <img
            src="/icons/cancel-cart.svg"
            className="generic-icon medium clickable"
            alt="cancel"
            onClick={cancel}
          />
        </div>
        <div className={styles["body"]}>
          {cartItems.length ? (
            <div className={styles["delivery-status"]}>
              <span>Pickup/Delivery date</span>
              <span>{deliveryDate?.format("D MMM YYYY") || "Not set yet"}</span>
              {/* <span className="underline primary-color">Edit</span> */}
              {!deliveryDate && (
                <DatePicker
                  value={deliveryDate}
                  onChange={setDeliveryDate}
                  format="D MMM YYYY"
                  className={styles["delivery-date"]}
                  placeholder="Edit"
                  iconAtLeft
                  content={<p className="underline primary-color">Edit</p>}
                  dropdownAlignment="right"
                  disablePastDays
                />
              )}
            </div>
          ) : (
            ""
          )}
          {cartItems.length ? (
            cartItems?.map((item, i) => (
              <div className={styles["cart-item"]} key={i}>
                <img
                  src="/icons/delete-cart.svg"
                  alt="delete"
                  className="generic-icon medium margin-top spaced clickable"
                  onClick={() => handleRemoveItem(item?.SKU)}
                />
                <div className="flex spaced align-center block">
                  <img
                    src={item.image.src}
                    alt="product"
                    className={styles["product-image"]}
                  />
                  <div className="flex-one">
                    <p>{item.name}</p>
                    <p>{item.description}</p>
                    <div className="flex between center-align vertical-margin">
                      <p className="primary-color normal-text bold">
                        {getPriceDisplay(item.price, currency)}
                      </p>
                      <div className="flex center-align spaced-lg">
                        <div
                          className={styles.minus}
                          onClick={() => handleRemoveItemQuantity(item.SKU)}
                        ></div>
                        <span className="small-text">{item.quantity}</span>
                        <div
                          className={styles.plus}
                          onClick={() => handleAddItemQuantity(item.SKU)}
                        ></div>
                      </div>
                    </div>
                    {item.size && (
                      <p className="capitalize">Size: {item.size}</p>
                    )}
                    {item.design && (
                      <p className="vertical-margin capitalize">
                        Design: {`${item.design.title}`} {"  "}
                        {item.design.price ? (
                          <span>
                            {`+ ${getPriceDisplay(
                              item.design.price,
                              currency
                            )} x ${item.design.quantity}`}
                          </span>
                        ) : (
                          ""
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles["empty-cart"]}>Empty Cart</div>
          )}
          {cartItems.length ? (
            <>
              <div className="flex between center-align vertical-margin spaced">
                <span className="normal-text">Subtotal</span>
                <strong className="normal-text">
                  {getPriceDisplay(total, currency)}
                </strong>
              </div>

              <div className="flex between center-align margin-bottom spaced">
                <span className="normal-text">Total</span>
                <strong className="normal-text">
                  {getPriceDisplay(total + designCharges, currency)}
                </strong>
              </div>
            </>
          ) : (
            ""
          )}
          <Button
            responsive
            className="margin-top spaced capitalize"
            onClick={() =>
              orderId ? handleUpdateOrder(false) : handleCreateOrder()
            }
            loading={loading}
            disabled={!cartItems.length}
          >
            {header === "main" ? "Proceed to checkout" : "Update Cart"} (
            {getPriceDisplay(total + designCharges, currency)})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartContext;
