import dayjs, { Dayjs } from "dayjs";
import Link from "next/link";
import { usePaystackPayment } from "react-paystack";
import { PaystackProps } from "react-paystack/dist/types";
import { useRouter } from "next/router";
import {
  FormEvent,
  FunctionComponent,
  MutableRefObject,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import Button from "../components/button/Button";
import DatePicker from "../components/date-picker/DatePicker";
import Input, { TextArea } from "../components/input/Input";
import Radio from "../components/radio/Radio";
import Select, { Option } from "../components/select/Select";
import {
  allDeliveryLocationOptions,
  allDeliveryLocationZones,
  bitcoinAddress,
  deliveryStates,
  floralHubPaymentEmail,
  freeDeliveryThreshold,
  freeDeliveryThresholdVals,
  paymentMethods,
  pickupLocations,
  pickupStates,
  placeholderEmail,
  companyEmail,
  checkoutContent,
  valsDates,
  festiveDates,
  freeDeliveryThresholdFestive,
  deliveryZoneMap,
  PickUpLocation
} from "../utils/constants";
import SettingsContext from "../utils/context/SettingsContext";
import {
  getOrder,
  saveSenderInfo,
  updateCheckoutState,
  updatePaymentMethodDetails
} from "../utils/helpers/data/order";
import { InfoIcon, InfoRedIcon } from "../utils/resources";
import { Order, CheckoutFormData, PaymentName } from "../utils/types/Order";
import styles from "./checkout.module.scss";
import useDeviceType from "../utils/hooks/useDeviceType";
import { getPurposes } from "../utils/helpers/data/purposes";
import {
  manualTransferPayment,
  verifyMonnifyPayment,
  verifyPaypalPayment,
  verifyPaystackPayment
} from "../utils/helpers/data/payments";
import useMonnify from "../utils/hooks/useMonnify";
import Modal, { ModalProps } from "../components/modal/Modal";
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveData,
  OnApproveActions,
  PurchaseUnit
} from "@paypal/paypal-js";
import { AppCurrency } from "../utils/types/Core";
import {
  adaptCheckOutFomData,
  getNumber,
  getPriceDisplay,
  removeCountryCode
} from "../utils/helpers/type-conversions";
import { Recipient } from "../utils/types/User";
import PhoneInput from "../components/phone-input/PhoneInput";
import { emailValidator } from "../utils/helpers/validators";
import { getResidentTypes } from "../utils/helpers/data/residentTypes";
import { formatPhoneNumber } from "../utils/helpers/formatters";
import AppStorage, {
  AppStorageConstants
} from "../utils/helpers/storage-helpers";
import Breadcrumb from "../components/breadcrumb/Breadcrumb";
import { LocationName } from "../utils/types/Regal";

const initialData: CheckoutFormData = {
  senderName: "",
  senderEmail: "",
  senderPhoneNumber: "",
  senderPassword: "",
  freeAccount: false,
  coupon: "",
  deliveryMethod: "pick-up",
  state: "lagos",
  pickUpLocation: "",
  deliveryLocation: null,
  recipientName: "",
  deliveryDate: null,
  recipientPhoneNumber: "",
  recipientPhoneNumberAlt: "",
  shouldSaveAddress: false,
  residenceType: "",
  recipientHomeAddress: "",
  additionalInfo: "",
  message: "",
  purpose: "",
  cardName: "",
  cardExpiry: "",
  cardNumber: "",
  cardCVV: "",
  recipientCountryCode: "+234",
  senderCountryCode: "",
  recipientCountryCodeAlt: "+234",
  zone: "",
  currency: "NGN",
  deliveryInstruction: "",
  pickupState: "",
  deliveryZone: ""
};

type DeliverStage =
  | "sender-info"
  | "delivery-type"
  | "receiver"
  | "payment"
  | "customization-message";

type TransferName = "gtbTransfer" | "natwestTransfer" | "bitcoinAddress";

const transferList = ["gtbTransfer", "natwestTransfer", "bitcoinAddress"];

const breadcrumbItems = [{ label: "Home", link: "/" }, { label: "Checkout" }];

const Checkout: FunctionComponent = () => {
  const [formData, setFormData] = useState<CheckoutFormData>(initialData);
  // const [selectedMethod, setSelectedMethod] = useState<number | null>();
  const [pageLoading, setPageLoading] = useState(false);
  // const [expandedOrderSummary, setExpandedOrderSummary] = useState<{
  //   order?: boolean;
  //   payment?: boolean;
  // }>({ order: true, payment: false });
  const [isPaid, setIsPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingSenderInfo, setSavingSenderInfo] = useState(false);
  const [showPaypal, setShowPaypal] = useState(false);
  const [isSenderInfoCompleted, setIsSenderInfoCompleted] = useState(false);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [transferName, settransferName] = useState<TransferName | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  const [, setDeliveryStage] = useState<DeliverStage>("sender-info");
  const [allPurposes, setAllPurposes] = useState<Option[]>([]);
  const [allresidentTypes, setAllResidentTypes] = useState<Option[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );

  const {
    user,
    currentStage,
    setCurrentStage,
    currency,
    setCurrency,
    allCurrencies,
    notify,
    deliveryDate,
    setDeliveryDate,
    setShouldShowAuthDropdown,
    order,
    confirm,
    setCartItems,
    setOrderId,
    orderLoading,
    setDeliveryFee,
    setOrderLoading,
    setOrder,
    cartItems
  } = useContext(SettingsContext);

  const deviceType = useDeviceType();

  const isBankTransfer = /but not seen yet/i.test(order?.paymentStatus || "");
  const isValsDate = valsDates.includes(deliveryDate?.format("DD-MM") || "");

  const total = useMemo(() => {
    const total =
      order?.orderProducts.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) || 0;

    return total + (formData.deliveryLocation?.amount || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.orderProducts, formData.deliveryLocation]);

  const subTotal = useMemo(() => {
    return (
      order?.orderProducts.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ) || 0
    );
  }, [order]);

  const deliveryZoneOptions = useMemo(() => {
    return formData.state
      ? allDeliveryLocationZones[formData.state as LocationName](
          subTotal / currency.conversionRate,
          currency,
          deliveryDate || dayjs()
        )
      : [];
  }, [subTotal, currency, deliveryDate, formData.state]);

  const markAsPaid = () => {
    setIsPaid(true);
    setCartItems([]);
    setCurrentStage(3);
    setOrderId("");
    setDeliveryDate(null);
    setDeliveryFee(0);
    AppStorage.remove(AppStorageConstants.ORDER_ID);
    AppStorage.remove(AppStorageConstants.CART_ITEMS);
    AppStorage.remove(AppStorageConstants.DELIVERY_DATE);
  };

  const refNumber = new Date().getTime().toString();

  const payStackConfig: PaystackProps = {
    reference: `${order?.fullOrderId}-${order?.id}-${refNumber}` as string,
    email: formData.senderEmail || placeholderEmail,
    amount: Math.round((total || 0) / currency.conversionRate) * 100,
    currency: currency.name === "GBP" ? undefined : currency.name, // Does not support GBP
    publicKey: "pk_live_21eb936506c47d587082d5362939421736884434",
    // publicKey: "pk_test_cd20e6c09cdb5ba2395a7c0f4acd63145e3c8aff",
    channels: ["card", "bank", "ussd", "qr", "mobile_money"]
  };

  const initializePayment = usePaystackPayment(payStackConfig);

  const router = useRouter();
  const {
    query: { orderId },
    isReady,
    push
  } = router;

  const handleChange = (key: keyof CheckoutFormData, value: unknown) => {
    if (key === "state") {
      const deliveryZone = value === "abuja" ? "WBA" : "WBL";
      if (subTotal >= freeDeliveryThresholdVals.NGN && isValsDate) {
        setFormData({
          ...formData,
          [key as string]: value,
          deliveryLocation: {
            label: "₦0 - Valentine (13th-15th Feb) Orders above ₦165,000",
            name:
              value === "lagos"
                ? "freeLagosVals"
                : value === "abuja"
                ? "freeAbujaVals"
                : "",
            amount: 0
          },
          zone:
            value === "lagos" ? "freeLagosVals-zone1" : "freeAbujaVals-zone1",
          deliveryZone
        });
        return;
      } else if (subTotal <= freeDeliveryThresholdVals.NGN && isValsDate) {
        setFormData({
          ...formData,
          [key as string]: value,
          deliveryLocation: {
            label: "₦29,900 - Valentine (13th-15th Feb) Orders below ₦165,000",
            name:
              value === "lagos"
                ? "highLagosVals"
                : value === "abuja"
                ? "highAbujaVals"
                : "",
            amount: 29900
          },
          zone:
            value === "lagos" ? "highLagosVals-zone1" : "highAbujaVals-zone1",
          deliveryZone
        });
        return;
      } else {
        setFormData({
          ...formData,
          [key as string]: value,
          zone: value === "other-locations" ? value : "",
          pickUpLocation: "",
          deliveryLocation: null,
          deliveryZone
        });
        return;
      }
    }
    if (key === "pickupState") {
      if (value === "abuja") {
        setFormData({
          ...formData,
          [key as string]: value,
          pickUpLocation: "Abuja",
          deliveryLocation: null,
          deliveryZone: "APA"
        });
        return;
      } else {
        setFormData({
          ...formData,
          [key as string]: value,
          pickUpLocation: ""
        });
        return;
      }
    }
    if (key === "pickUpLocation") {
      setFormData({
        ...formData,
        [key as string]: value,
        deliveryZone: deliveryZoneMap[value as PickUpLocation]
      });
      return;
    }
    if (key === "zone") {
      setFormData({
        ...formData,
        [key as string]: value,
        deliveryLocation:
          deliveryLocationOptions.find(
            (option: any) => option.name === (value as string).split("-")[0]
          ) || null
      });
      return;
    }
    if (key === "deliveryMethod") {
      if (value === "pick-up") {
        setFormData({
          ...formData,
          [key as string]: value,
          deliveryLocation: null,
          state: "",
          zone: ""
        });
        return;
      } else {
        setFormData({
          ...formData,
          [key as string]: value,
          pickUpLocation: "",
          shouldSaveAddress: true,
          pickupState: ""
        });
        return;
      }
    }
    if (
      key === "senderPhoneNumber" ||
      key === "recipientPhoneNumber" ||
      key === "recipientPhoneNumberAlt"
    ) {
      const phoneNumber = formatPhoneNumber(value as string);
      setFormData({
        ...formData,
        [key as string]: phoneNumber
      });
      return;
    }

    setFormData({
      ...formData,
      [key]: value
    });
  };

  const { initializeMonnify, isMonnifyReady } = useMonnify();

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
      setOrder(data);
      setDeliveryDate(data?.deliveryDate ? dayjs(data?.deliveryDate) : null);
    }
    setOrderLoading(false);
  };

  useEffect(() => {
    if (orderId && isReady) {
      fetchOrder(orderId as string);
    } else {
      const savedCartItems = AppStorage.get(AppStorageConstants.CART_ITEMS);
      if (savedCartItems) {
        setCartItems(savedCartItems || []);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, currentStage, isReady]);

  useEffect(() => {
    if (selectedRecipient) {
      setFormData({
        ...formData,
        recipientName: selectedRecipient.name,
        recipientPhoneNumber: removeCountryCode(
          selectedRecipient.phone,
          selectedRecipient.phoneCountryCode
        ),
        recipientPhoneNumberAlt: removeCountryCode(
          selectedRecipient.phoneAlt,
          selectedRecipient.altPhoneCountryCode
        ),
        recipientHomeAddress: selectedRecipient.address,
        deliveryMethod: selectedRecipient.method,
        residenceType: selectedRecipient.residenceType,
        state: selectedRecipient.state,
        recipientCountryCode: selectedRecipient.phoneCountryCode,
        recipientCountryCodeAlt: selectedRecipient.altPhoneCountryCode
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRecipient]);

  const fetchPurposes = async () => {
    const { error, message, data } = await getPurposes();
    if (error) {
      notify("error", `Unable to fetch purposes: ${message}`);
    } else {
      setAllPurposes(
        data?.map(item => ({
          label: item,
          value: item
        })) || []
      );
    }
  };

  const fetchResidentTypes = async () => {
    const { error, message, data } = await getResidentTypes();
    if (error) {
      notify("error", `Unable to fetch purposes: ${message}`);
    } else {
      setAllResidentTypes(
        data?.map(item => ({
          label: item,
          value: item
        })) || []
      );
    }
  };

  const {
    pickUpLocation,
    state,
    zone,
    deliveryLocation,
    recipientName,
    recipientPhoneNumber,
    recipientHomeAddress,
    residenceType
  } = formData;

  const completedDeliveryLocation = Boolean(
    deliveryLocation && state && (zone || isValsDate)
  );

  const completedPickUpLocation = Boolean(pickUpLocation);

  const completedReceiverInfo = Boolean(
    recipientName &&
      recipientPhoneNumber &&
      residenceType &&
      recipientHomeAddress
  );

  useEffect(() => {
    if (isReady && !user) {
      setShouldShowAuthDropdown(true);
    }
    fetchPurposes();
    fetchResidentTypes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isReady) {
      setOrderId(orderId as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId, isReady]);

  useEffect(() => {
    const _isPaid =
      /go\s*ahead/i.test(order?.paymentStatus || "") ||
      /^paid/i.test(order?.paymentStatus || "");

    setIsPaid(_isPaid);
    if (_isPaid) {
      markAsPaid();
    }
    if (order?.orderStatus === "processing") {
      const isZoneValid = Boolean(
        deliveryZoneOptions.find(
          option => option.value === order.deliveryDetails.zone
        )
      );

      setFormData({
        ...formData,
        ...adaptCheckOutFomData(order),
        freeAccount: false,
        state: isZoneValid ? order.deliveryDetails.state : "",
        zone: isZoneValid ? order.deliveryDetails.zone : "",
        deliveryLocation:
          allDeliveryLocationOptions[
            order.deliveryDetails.state as LocationName
          ]?.(currency, dayjs(order.deliveryDate) || dayjs()).find(
            option => option.name === order.deliveryDetails.zone.split("-")[0]
          ) || null
      });
      setDeliveryDate(dayjs(order?.deliveryDate));
      setIsSenderInfoCompleted(true);
      !isZoneValid
        ? setDeliveryStage("delivery-type")
        : setDeliveryStage("customization-message");
    } else if (
      order?.client.name &&
      order?.client.phone &&
      order.client.email &&
      order.deliveryDate
    ) {
      setFormData({
        ...formData,
        senderName: order?.client.name,
        senderPhoneNumber: order?.client.phone,
        deliveryDate: dayjs(order.deliveryDate),
        senderEmail: order.client.email,
        senderCountryCode: order.client.phoneCountryCode || "+234"
      });
      setDeliveryDate(dayjs(order?.deliveryDate));
      setIsSenderInfoCompleted(true);
      setDeliveryStage("delivery-type");
    } else {
      setFormData({
        ...formData
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  useEffect(() => {
    if (user && !formData.senderName && !formData.senderEmail) {
      setFormData({
        ...formData,
        senderName: user.name,
        senderEmail: user.email,
        senderPhoneNumber: user.phone,
        senderCountryCode: user.phoneCountryCode
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isReady]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStage]);

  useEffect(() => {
    setDeliveryFee(formData.deliveryLocation?.amount || 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.deliveryLocation?.amount]);

  const validateDeliveryMethod = () => {
    if (formData.deliveryMethod === "pick-up" && !formData.pickUpLocation) {
      notify("error", "Please complete the delivery location");
      return false;
    } else if (
      formData.deliveryMethod === "delivery" &&
      (!formData.state || !formData.zone || !formData.deliveryLocation)
    ) {
      notify("error", "Please complete the delivery location");
      return false;
    }

    return true;
  };

  const validateReceiverInfo = () => {
    if (
      formData.deliveryMethod === "delivery" &&
      (!formData.recipientPhoneNumber ||
        !formData.recipientName ||
        !formData.residenceType ||
        !formData.recipientHomeAddress)
    ) {
      notify("error", "Please complete the receiver's information");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isDeliveryMethodComplete = validateDeliveryMethod();
    const isReceiverInfoComplete = validateReceiverInfo();

    if (!deliveryDate) {
      notify("error", "Please select a delivery date");
      return;
    }

    if (!isDeliveryMethodComplete || !isReceiverInfoComplete) {
      return;
    }

    setLoading(true);
    const { error, message } = await updateCheckoutState(orderId as string, {
      ...formData,
      deliveryDate,
      currency: currency.name
    });
    setLoading(false);

    if (error) {
      if (message === "User already exists") {
        confirm({
          title: "Create Account",
          body:
            "We couldn't create an account for you, as the user already exists",
          onOk() {
            setShouldShowAuthDropdown(true);
          },
          cancelText: "Continue as Guest",
          okText: "Login",
          onCancel: async () => {
            const { error, message } = await updateCheckoutState(
              orderId as string,
              {
                ...formData,
                deliveryDate,
                freeAccount: false,
                currency: currency.name
              }
            );
            if (error) {
              notify("error", `Unable to save order: ${message}`);
              return;
            }
            setCurrentStage(2);
            setDeliveryStage("payment");
          }
        });
        return;
      }
      notify("error", `Unable to save order: ${message}`);
    } else {
      setCurrentStage(2);
      setDeliveryStage("payment");
    }
  };

  const handleSaveSenderInfo = async () => {
    if (emailValidator(formData.senderEmail)) {
      notify("error", "Please enter a valid email address");
      return;
    } else if (!deliveryDate) {
      notify("error", "Please select a delivery date");
      return;
    } else if (!formData.senderName) {
      notify("error", "Please enter a sender name");
      return;
    } else if (formData.freeAccount && !formData.senderPassword && !user) {
      notify(
        "error",
        "Please enter a password or uncheck the free account box"
      );
      return;
    } else if (!formData.senderPhoneNumber) {
      notify("error", "Please enter a sender phone number");
      return;
    } else if (!formData.senderCountryCode) {
      notify(
        "error",
        "Please select a country code in the phone number section"
      );
      return;
    }
    setSavingSenderInfo(true);
    const { error, message } = await saveSenderInfo(orderId as string, {
      userData: {
        email: formData.senderEmail,
        name: formData.senderName,
        phone: formData.senderCountryCode + formData.senderPhoneNumber,
        phoneCountryCode: formData.senderCountryCode
      },
      deliveryDate: deliveryDate?.format("YYYY-MM-DD") || ""
    });

    if (error) {
      notify("error", `Unable to save sender Info: ${message}`);
    } else {
      notify("success", "Saved successfully");
      setDeliveryStage("delivery-type");
      setIsSenderInfoCompleted(true);
    }
    setSavingSenderInfo(false);
  };

  const handleDateChange = (date: Dayjs | null) => {
    setDeliveryDate(date);
    setFormData({
      ...formData,
      zone: "",
      deliveryLocation: null,
      state: ""
    });
  };

  const isDelivered = (deliveryStatus = "") => {
    return /delivered/i.test(deliveryStatus);
  };

  const pastRecipients = useMemo(
    () =>
      user?.recipients
        .map(
          recipient =>
            recipient.name && {
              label: `${recipient.name} | ${recipient.phone} | ${recipient.phoneAlt} | ${recipient.address}`,
              value: recipient._id
            }
        )
        .filter(Boolean) || [],
    [user]
  ) as Option[];

  const deliveryLocationOptions = useMemo(() => {
    return (
      allDeliveryLocationOptions[formData.state as LocationName]?.(
        currency,
        deliveryDate || dayjs()
      ) || []
    );
  }, [currency, deliveryDate, formData.state]);

  const selectedZone = useMemo(() => {
    const amount = Math.round(subTotal / currency.conversionRate);
    return (
      allDeliveryLocationZones[formData.state as LocationName]?.(
        amount,
        currency,
        deliveryDate || dayjs()
      )?.find(zone => zone.value === formData.zone) || null
    );
  }, [currency, deliveryDate, formData.state, formData.zone, subTotal]);

  if (pageLoading || orderLoading) {
    return (
      <div className={styles.loader}>
        <img src="/images/spinner.svg" alt="loader" className={styles.icon} />
        <span className={styles["load-intro"]}>
          {currentStage === 1 ? "Preparing your order. . ." : "Loading. . ."}
        </span>
      </div>
    );
  }

  const paymentHandlerMap: Record<PaymentName, () => void> = {
    paystack: () => {
      interface PaystackSuccessResponse {
        reference: string;
        trans: string;
        status: "success" | "error";
        message: "Approved" | "Declined";
        transaction: string;
        trxref: string;
        redirecturl: string;
      }
      const successHandler: (
        response?: PaystackSuccessResponse
      ) => Promise<void> = async response => {
        setPageLoading(true);
        const { error, message, status } = await verifyPaystackPayment(
          response?.reference as string
        );
        setPageLoading(false);
        if (error) {
          notify("error", `Unable to make payment: ${message}`);
        } else if (status === 214 && message) {
          notify("info", `Order is successful, but not that: ${message}`);
          markAsPaid();
        } else {
          notify("success", `Order paid successfully`);
          markAsPaid();
        }
      };
      initializePayment(successHandler, async () => {
        await updatePaymentMethodDetails({
          orderId: orderId as string,
          currency: currency.name,
          paymentMethod: "paystack"
        });
      });
    },
    monnify: () => {
      if (isMonnifyReady) {
        initializeMonnify({
          amount: order?.amount || 0,
          customerEmail: formData.senderEmail || placeholderEmail,
          customerFullName: formData.senderName || "N/A",
          apiKey: "MK_PROD_Z0NZF5VHDS",
          contractCode: "252548871448",
          currency: "NGN",
          reference: order?.id as string, // Problematic for repeat/cancelled payments
          paymentDescription: "Floral Hub Order",
          onComplete: async response => {
            setPageLoading(true);
            const { error, message, status } = await verifyMonnifyPayment(
              response.paymentReference as string
            );
            setPageLoading(false);
            if (error) {
              notify("error", `Unable to make payment: ${message}`);
            } else if (status === 214 && message) {
              notify("info", `Order is successful, but not that: ${message}`);
              markAsPaid();
            } else {
              notify("success", `Order paid successfully`);
              markAsPaid();
            }
          },
          onClose: () => {}
        });
      }
    },
    payPal: () => {
      setShowPaypal(true);
    },
    manualTransfer: () => {
      setShowBankDetails(true);
    },
    googlePay: () => {},
    bitcoinAddress: () => {
      settransferName("bitcoinAddress");
      setShowBankDetails(true);
    },
    gtbTransfer: () => {
      settransferName("gtbTransfer");
      setShowBankDetails(true);
    },
    natwestTransfer: () => {
      settransferName("natwestTransfer");
      setShowBankDetails(true);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <section className={styles["checkout-page"]}>
          <Breadcrumb items={breadcrumbItems} />
          <h1 className={[styles.title, styles["margin-bottom"]].join(" ")}>
            CHECKOUT
          </h1>
          {currentStage <= 2 && (
            <div className={styles["checkout-wrapper"]}>
              <div className={`${styles.left}`}>
                {currentStage === 1 && (
                  <>
                    <div
                      className={`${styles.section} ${styles["margin-bottom"]} margin-top`}
                    >
                      <p className={[styles["section-title"]].join(" ")}>
                        Who is sending this order?
                      </p>
                      {!user && (
                        <p
                          className={[
                            "text-center text-medium",
                            styles["margin-bottom"]
                          ].join(" ")}
                        >
                          {" "}
                          <button
                            onClick={() => setShouldShowAuthDropdown(true)}
                            className="primary-color underline"
                            type="button"
                          >
                            Login
                          </button>{" "}
                          to quickly complete checkout
                        </p>
                      )}

                      <div
                        className={[
                          "flex center-align spaced",
                          styles["margin-bottom"]
                        ].join(" ")}
                      >
                        <span className={styles["line-through"]}></span>
                        <strong>Or</strong>
                        <span className={styles["line-through"]}></span>
                      </div>

                      <div
                        className={`flex  ${
                          deviceType === "mobile" ? "column" : "spaced-xl"
                        }`}
                      >
                        <div
                          className={`input-group ${
                            deviceType === "desktop" ? "half-width" : ""
                          }`}
                        >
                          <span className="question">Name</span>
                          <Input
                            name="name"
                            placeholder="John Doe"
                            value={formData.senderName}
                            onChange={value =>
                              handleChange("senderName", value)
                            }
                            dimmed
                            required
                            responsive
                          />
                        </div>
                        <div
                          className={`input-group ${
                            deviceType === "desktop" ? "half-width" : ""
                          }`}
                        >
                          <span className="question">Email Address</span>
                          <Input
                            name="email"
                            placeholder="johndoe@gmail,com"
                            value={formData.senderEmail}
                            onChange={value =>
                              handleChange("senderEmail", value)
                            }
                            dimmed
                            responsive
                            required={formData.freeAccount}
                            onBlurValidation={emailValidator}
                          />
                        </div>
                      </div>
                      <div
                        className={`flex  ${
                          deviceType === "mobile" ? "column" : "spaced-xl"
                        }`}
                      >
                        <PhoneInput
                          phoneNumber={formData.senderPhoneNumber}
                          countryCode={formData.senderCountryCode}
                          onChangePhoneNumber={value =>
                            handleChange("senderPhoneNumber", value)
                          }
                          onChangeCountryCode={value =>
                            handleChange("senderCountryCode", value)
                          }
                          className={`input-group ${
                            deviceType === "desktop" ? "half-width" : ""
                          }`}
                          countryCodePlaceholder="Code"
                        />

                        <div
                          className={`input-group ${
                            deviceType === "desktop" ? "half-width" : ""
                          }`}
                        >
                          <span className="question">Pickup/Delivery Date</span>
                          <DatePicker
                            value={deliveryDate}
                            onChange={date => handleDateChange(date)}
                            format="D MMMM YYYY"
                            responsive
                            disablePastDays
                          />
                        </div>
                      </div>
                      {/* {!user && (
                        <div
                          className={`input-group spaced-xl ${
                            deviceType === "desktop" ? "compact" : ""
                          } ${styles["password"]}`}
                        >
                          <span className="question">Create Password</span>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Password"
                            value={formData.senderPassword}
                            onChange={value =>
                              handleChange("senderPassword", value)
                            }
                            dimmed
                            autoComplete="new-password"
                            required={formData.freeAccount}
                            showPasswordIcon
                            disabled={!formData.freeAccount}
                          />
                        </div>
                      )} */}

                      {/* {!user && (
                        <div className="flex between center-align">
                          <Checkbox
                            checked={formData.freeAccount}
                            onChange={value =>
                              handleChange("freeAccount", value)
                            }
                            text="Create a Free Account"
                          />
                          <div className="flex center">
                            {deviceType === "desktop" && (
                              <span className="margin-right">
                                Already a user?
                              </span>
                            )}
                            <button
                              onClick={() => setShouldShowAuthDropdown(true)}
                              className="primary-color bold underline margin-left"
                              type="button"
                            >
                              Login
                            </button>
                          </div>
                        </div>
                      )} */}
                    </div>
                    {!isSenderInfoCompleted && (
                      <Button
                        loading={savingSenderInfo}
                        onClick={handleSaveSenderInfo}
                      >
                        Continue
                      </Button>
                    )}

                    {isSenderInfoCompleted && (
                      <div
                        className={[
                          styles.section,
                          styles["delivey-method"]
                        ].join(" ")}
                      >
                        <p className={styles["section-title"]}>
                          Delivery Method
                        </p>
                        <div className="flex between">
                          <div
                            className={[
                              styles.method,
                              formData.deliveryMethod === "pick-up" &&
                                styles.active
                            ].join(" ")}
                            onClick={() =>
                              handleChange("deliveryMethod", "pick-up")
                            }
                          >
                            <p className={`${styles["method-title"]}`}>
                              Pick Up
                            </p>
                            <p>Pick up from our stores</p>
                          </div>
                          <div
                            className={[
                              styles.method,
                              formData.deliveryMethod === "delivery" &&
                                styles.active,
                              (order?.amount as number) < 20000 && "disabled"
                            ].join(" ")}
                            onClick={() =>
                              handleChange("deliveryMethod", "delivery")
                            }
                          >
                            <p className={`${styles["method-title"]}`}>
                              Delivery
                            </p>
                            <p>Get it delivered to the recipient's location</p>
                          </div>
                        </div>
                        <div className="margin-top primary-color">
                          {formData.deliveryMethod === "delivery" && (
                            <em>
                              {festiveDates.includes(
                                deliveryDate?.format("DD-MM") || ""
                              )
                                ? `Free Xmas (25th,26th Dec) and New Year (Jan 1st) Delivery in selected zones across Lagos and Abuja on orders above ${
                                    currency.sign
                                  }${freeDeliveryThresholdFestive[
                                    currency.name
                                  ].toLocaleString()}`
                                : isValsDate
                                ? `Free Valentine (Feb 13th, 14th, 15th) Delivery in selected zones across Lagos and Abuja on orders above ${
                                    currency.sign
                                  }${freeDeliveryThresholdVals[
                                    currency.name
                                  ].toLocaleString()}`
                                : `Free Delivery in selected zones across Lagos and Abuja on orders above ${
                                    currency.sign
                                  }${freeDeliveryThreshold[
                                    currency.name
                                  ].toLocaleString()}`}
                              {(order?.amount as number) < 20000 &&
                                `(Please note that orders below ${getPriceDisplay(
                                  20000,
                                  currency
                                )}  have to be picked up)`}
                            </em>
                          )}
                        </div>

                        {formData.deliveryMethod === "delivery" && (
                          <div className="flex spaced-xl">
                            <div className="input-group">
                              <span className="question">Delivery State</span>
                              <Select
                                onSelect={value => {
                                  handleChange("state", value);
                                }}
                                value={formData.state}
                                options={deliveryStates}
                                placeholder="Select a state"
                                responsive
                                dimmed
                              />
                            </div>
                            {!isValsDate &&
                              formData.state &&
                              formData.state !== "other-locations" && (
                                <div className="input-group">
                                  <span className="question">
                                    Delivery Zones
                                  </span>
                                  <Select
                                    onSelect={value =>
                                      handleChange("zone", value)
                                    }
                                    value={formData.zone}
                                    options={deliveryZoneOptions}
                                    placeholder="Select a zone"
                                    responsive
                                    dimmed
                                    dropdownOnTop
                                    optionColor="gray-white"
                                  />
                                </div>
                              )}
                          </div>
                        )}

                        {formData.deliveryMethod === "delivery" &&
                          (formData.zone || isValsDate) && (
                            <div className={styles["pickup-locations"]}>
                              {deliveryLocationOptions.length > 0 && (
                                <p className="primary-color align-icon normal-text bold margin-bottom">
                                  <InfoRedIcon />
                                  <span className="margin-left">
                                    Delivery Locations
                                  </span>
                                </p>
                              )}

                              {deliveryLocationOptions.length === 0 &&
                                formData.state === "other-locations" && (
                                  <div className="flex center-align primary-color normal-text margin-bottom spaced">
                                    <InfoRedIcon className="generic-icon xl" />
                                    <span>
                                      At the moment, we only deliver VIP Orders
                                      to other states on request, by either
                                      chartering a vehicle or by flight. Kindly
                                      contact us on Phone/WhatsApp:
                                      <br />
                                      <a
                                        href="tel:+2349077777994"
                                        className="clickable neutral underline"
                                      >
                                        +234907 777 7994
                                      </a>
                                    </span>
                                  </div>
                                )}

                              {deliveryLocationOptions.map(locationOption => {
                                return (
                                  <div
                                    className="vertical-margin spaced"
                                    key={locationOption.name}
                                  >
                                    <Radio
                                      label={locationOption.label}
                                      onChange={() =>
                                        handleChange(
                                          "deliveryLocation",
                                          locationOption
                                        )
                                      }
                                      disabled={
                                        locationOption.name !==
                                        (
                                          (selectedZone?.value as string) || ""
                                        )?.split("-")[0]
                                      }
                                      checked={
                                        formData.deliveryLocation?.name ===
                                        locationOption.name
                                      }
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          )}

                        {formData.deliveryMethod === "pick-up" && (
                          <div className={styles["pickup-locations"]}>
                            <p className="primary-color align-icon normal-text bold  flex spaced">
                              <span>Pick Up Locations</span>
                              <InfoRedIcon />
                            </p>
                            <div className="input-group">
                              <span className="question">Pick Up State</span>
                              <Select
                                onSelect={value => {
                                  handleChange("pickupState", value);
                                }}
                                value={formData.pickupState}
                                options={pickupStates}
                                placeholder="Select a state"
                                responsive
                                dimmed
                              />
                            </div>
                            <div className="margin-top spaced">
                              {formData.pickupState === "lagos" && (
                                <>
                                  <div>
                                    <Radio
                                      label="Ikoyi - 15, Ikeja Way, Dolphin Estate, Ikoyi, Lagos"
                                      onChange={() =>
                                        handleChange("pickUpLocation", "Ikoyi")
                                      }
                                      checked={
                                        formData.pickUpLocation === "Ikoyi"
                                      }
                                    />
                                  </div>
                                  <div className="vertical-margin">
                                    <Radio
                                      label="Lekki - 2C, Seed Education Center Road, off Kusenla Road, Ikate, Lekki"
                                      onChange={() =>
                                        handleChange("pickUpLocation", "Lekki")
                                      }
                                      checked={
                                        formData.pickUpLocation === "Lekki"
                                      }
                                    />
                                  </div>
                                </>
                              )}
                              {formData.pickUpLocation === "Abuja" &&
                                formData.pickupState === "abuja" && (
                                  <div className="vertical-margin">
                                    <Radio
                                      label="Abuja Pickup - 5, Nairobi Street, off Aminu Kano Crescent, Wuse 2, Abuja"
                                      onChange={() => {}}
                                      checked={
                                        formData.pickUpLocation === "Abuja"
                                      }
                                    />
                                  </div>
                                )}

                              {formData.pickupState === "other-locations" && (
                                <div className="flex center-align primary-color normal-text margin-bottom spaced">
                                  <InfoRedIcon className="generic-icon xl" />
                                  <span>
                                    At the moment, You can only pick up at our
                                    Abuja or Lagos stores. Kindly contact us on
                                    Phone/WhatsApp:
                                    <br />
                                    <a
                                      href="tel:+2349077777994"
                                      className="clickable neutral underline"
                                    >
                                      +234 9077 777994
                                    </a>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {formData.deliveryMethod === "delivery" &&
                      completedDeliveryLocation && (
                        <div className={styles.section}>
                          <p className={styles["section-title"]}>
                            Who is this order for?
                          </p>
                          <p
                            className={[
                              "text-center text-medium",
                              styles["margin-bottom"]
                            ].join(" ")}
                          >
                            <span>Select A Past Recipient </span>
                            {user ? (
                              <em className="normal">(if available)</em>
                            ) : (
                              <>
                                {" "}
                                <span>
                                  <button
                                    onClick={() =>
                                      setShouldShowAuthDropdown(true)
                                    }
                                    className="primary-color underline"
                                    type="button"
                                  >
                                    Login
                                  </button>{" "}
                                  to select a past recipient
                                </span>
                              </>
                            )}
                          </p>
                          <div className="input-group">
                            <Select
                              onSelect={value => {
                                setSelectedRecipient(
                                  user?.recipients.find(
                                    recipient => recipient._id === value
                                  ) || null
                                );
                              }}
                              value={
                                selectedRecipient ? selectedRecipient._id : ""
                              }
                              options={pastRecipients}
                              placeholder="Select Past Recipient"
                              responsive
                              dimmed
                            />
                          </div>
                          <div
                            className={[
                              "flex center-align spaced",
                              styles["margin-bottom"]
                            ].join(" ")}
                          >
                            <span className={styles["line-through"]}></span>
                            <strong>Or</strong>
                            <span className={styles["line-through"]}></span>
                          </div>

                          <div
                            className={`flex  ${
                              deviceType === "mobile" ? "column" : "spaced-xl"
                            }`}
                          >
                            <div
                              className={`input-group ${
                                deviceType === "desktop" ? "half-width" : ""
                              }`}
                            >
                              <span className="question">Full Name</span>
                              <Input
                                name="name"
                                placeholder="Enter recipient name"
                                value={formData.recipientName}
                                onChange={value =>
                                  handleChange("recipientName", value)
                                }
                                dimmed
                              />
                            </div>

                            <PhoneInput
                              phoneNumber={formData.recipientPhoneNumber}
                              countryCode={formData.recipientCountryCode}
                              onChangePhoneNumber={value =>
                                handleChange("recipientPhoneNumber", value)
                              }
                              onChangeCountryCode={value =>
                                handleChange("recipientCountryCode", value)
                              }
                              className="input-group"
                              question="Receiver Phone number"
                              countryCodePlaceholder="Code"
                            />
                          </div>

                          <div
                            className={`flex  ${
                              deviceType === "mobile" ? "column" : "spaced-xl"
                            }`}
                          >
                            <PhoneInput
                              phoneNumber={formData.recipientPhoneNumberAlt}
                              countryCode={formData.recipientCountryCodeAlt}
                              onChangePhoneNumber={value =>
                                handleChange("recipientPhoneNumberAlt", value)
                              }
                              onChangeCountryCode={value =>
                                handleChange("recipientCountryCodeAlt", value)
                              }
                              className="input-group"
                              question="Enter alternative phone (if available)"
                              countryCodePlaceholder="Code"
                            />
                            <div className="input-group">
                              <span className="question">Residence Type</span>

                              <Select
                                onSelect={value =>
                                  handleChange("residenceType", value)
                                }
                                value={formData.residenceType}
                                options={allresidentTypes}
                                placeholder="Select a residence type"
                                responsive
                                dimmed
                              />
                            </div>
                          </div>
                          <div className="input-group">
                            <span className="question">Detailed Address</span>

                            <TextArea
                              value={formData.recipientHomeAddress}
                              placeholder="To help us deliver better, please be detailed as possible"
                              onChange={value =>
                                handleChange("recipientHomeAddress", value)
                              }
                              dimmed
                              rows={3}
                            />
                          </div>
                          <div className="input-group">
                            <span className="question">
                              Optional Delivery Instructions
                            </span>

                            <TextArea
                              value={formData.deliveryInstruction}
                              placeholder="e.g. Ask for security guard called Segun"
                              onChange={value =>
                                handleChange("deliveryInstruction", value)
                              }
                              dimmed
                              rows={3}
                            />
                          </div>
                        </div>
                      )}
                    {(formData.deliveryMethod === "delivery"
                      ? completedReceiverInfo
                      : completedPickUpLocation) && (
                      <div className={styles.section}>
                        <p className={styles["section-title"]}>
                          Customize Message
                        </p>
                        <div className="input-group">
                          <span className="question">Message to include</span>

                          <TextArea
                            value={formData.message}
                            placeholder="Eg: I love you"
                            onChange={value => handleChange("message", value)}
                            dimmed
                            rows={3}
                          />
                        </div>

                        <div className="input-group half-width">
                          <span className="question">Occasion</span>

                          <Select
                            onSelect={value => handleChange("purpose", value)}
                            value={formData.purpose}
                            options={allPurposes}
                            placeholder="Select Occasion"
                            responsive
                            dropdownOnTop
                            dimmed
                          />
                        </div>
                      </div>
                    )}

                    {isSenderInfoCompleted && (
                      <Button
                        className={[
                          deviceType === "desktop" && "half-width"
                        ].join(" ")}
                        loading={loading}
                        buttonType="submit"
                      >
                        PROCEED TO PAYMENT
                      </Button>
                    )}
                  </>
                )}
                {currentStage === 2 && (
                  <>
                    <button
                      onClick={() => setCurrentStage(1)}
                      className="margin-bottom"
                    >
                      {"<< Back To Checkout"}
                    </button>
                    <div className={styles.section}>
                      <p className={styles["section-title"]}>Secured Payment</p>
                      <div
                        className={[
                          "flex center-align spaced-lg vertical-margin spaced",
                          styles["currency-wrapper"]
                        ].join(" ")}
                      >
                        <p className="normal-text bold ">Preferred Currency:</p>
                        <div className="flex spaced-lg">
                          {allCurrencies.map((_currency, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrency(_currency)}
                              className={[
                                styles.currency,
                                currency.name === _currency.name &&
                                  styles.active
                              ].join(" ")}
                              type="button"
                            >
                              {_currency.sign}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className={`${styles.info} flex center-align spaced`}>
                        <InfoIcon fill="#1C6DD0" />{" "}
                        <span>
                          Kindly select $ or £ for international payment options
                        </span>{" "}
                      </p>
                      <div className={styles["payment-methods"]}>
                        <p
                          className={`${styles.info} flex center-align spaced margin-bottom`}
                        >
                          <InfoIcon fill="#1C6DD0" />{" "}
                          <span>
                            Payment issues? Simply email{" "}
                            <a
                              href={`mailto:${floralHubPaymentEmail}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {floralHubPaymentEmail}
                            </a>{" "}
                            or{" "}
                            <a
                              href={`https://wa.me/+2349077777994`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Call/Whatsapp +2349077777994
                            </a>{" "}
                          </span>{" "}
                        </p>
                        {paymentMethods.map((method, index) => (
                          <div key={index}>
                            <div
                              className={[
                                styles.method,
                                !method.supportedCurrencies.includes(
                                  currency.name
                                ) && styles.inactive,
                                transferList.includes(method.paymentName) &&
                                  !method.supportedCurrencies.includes(
                                    currency.name
                                  ) &&
                                  styles.remove
                              ].join(" ")}
                              onClick={
                                method.supportedCurrencies.includes(
                                  currency.name
                                )
                                  ? () =>
                                      paymentHandlerMap[method.paymentName]()
                                  : undefined
                              }
                              title={
                                !method.supportedCurrencies.includes(
                                  currency.name
                                )
                                  ? `This payment method does not support ${currency.name}`
                                  : ""
                              }
                            >
                              <div className="flex spaced-lg center-align">
                                <div className={styles["method-icon"]}>
                                  {method.icon}
                                </div>

                                <div>
                                  <p className="normal-text bold">
                                    {method.title}
                                  </p>
                                  <p>{method.info}</p>
                                </div>
                              </div>
                              <div className="flex spaced center-align">
                                {method.other?.map((other, index) => (
                                  <div key={index}>{other.icon}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {currentStage <= 2 && (
                <div className={styles.right}>
                  <div className={` ${styles.section}`}>
                    <div className="flex between margin-bottom spaced">
                      <p className="text-medium">
                        Order Summary ({cartItems.length} items)
                      </p>
                      <Link href="/cart">
                        <a
                          className="text-medium underline"
                          style={{
                            color: "#b240da"
                          }}
                        >
                          View Cart
                        </a>
                      </Link>
                    </div>
                    <div className="flex between margin-bottom">
                      <span className="normal-text">Subtotal</span>
                      <span className="normal-text bold">
                        {getPriceDisplay(subTotal || 0, currency)}
                      </span>
                    </div>

                    {formData.deliveryMethod === "delivery" && (
                      <div className="flex between margin-bottom">
                        <span className="normal-text">Delivery</span>
                        <span className="normal-text bold">
                          {getPriceDisplay(
                            formData.deliveryLocation?.amount || 0,
                            currency
                          )}
                        </span>
                      </div>
                    )}
                    <div
                      className={[
                        "flex center-align",
                        styles["cupon-input-wrapper"]
                      ].join(" ")}
                    >
                      <Input
                        placeholder="Enter Coupon Code"
                        value={formData.coupon}
                        onChange={value => handleChange("coupon", value)}
                        dimmed
                        responsive
                        className={styles["cupon-input"]}
                      />
                      <Button
                        rounded
                        type="accent"
                        className={styles["apply-btn"]}
                      >
                        Apply
                      </Button>
                    </div>
                    <hr className={`${styles.hr} hr`} />
                    <div className="flex between margin-bottom">
                      <span className="normal-text bold">Order Total</span>
                      <span className="normal-text bold">
                        {getPriceDisplay(total, currency)}
                      </span>
                    </div>
                    {currentStage === 1 &&
                      deviceType === "desktop" &&
                      isSenderInfoCompleted && (
                        <Button
                          responsive
                          buttonType="submit"
                          loading={loading}
                        >
                          PROCEED TO PAYMENT
                        </Button>
                      )}
                  </div>
                  <div>
                    <div>
                      <p className="margin-bottom spaced">Accepted Payments</p>
                      <div
                        className={`${styles["accepted-payments"]} flex between`}
                      >
                        {checkoutContent.paymentIcons.map((method, index) => (
                          <img
                            src={method.src}
                            alt={method.alt}
                            className="generic-icon medium"
                            key={index}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {currentStage === 3 && isPaid && (
            <div
              className={[
                `flex between ${deviceType === "mobile" ? "column" : ""}`,
                styles["completed-checkout-wrapper"]
              ].join(" ")}
            >
              <div className={styles["complete-checkout"]}>
                <div className="text-center white-bg">
                  <img
                    src="/icons/checkout-complete.svg"
                    alt="completed"
                    className={`text-center ${styles["complete-image"]}`}
                  />
                  {isBankTransfer ? (
                    <p className={styles["order-received"]}>
                      Order Received Pending Payment Confirmation
                    </p>
                  ) : (
                    <p className={styles["order-received"]}>
                      Order Received Successfully
                    </p>
                  )}
                  <p className={styles["order-number"]}>
                    Order No:{" "}
                    <span className={styles.bold}>
                      {order?.fullOrderId || ""}
                    </span>
                  </p>

                  <div
                    className={`flex column center-align spaced normal-text ${styles["order-info"]}`}
                  >
                    <p>
                      Your order was received, please note your order number in
                      every correspondence with us.
                    </p>
                    <div className="flex spaced">
                      <img
                        src="/icons/info.svg"
                        alt="information"
                        className={["generic-icon", styles.icon].join(" ")}
                      />
                      <p>
                        If your order is a pickup, please mention your order
                        number on arrival.
                      </p>
                    </div>
                    {formData.deliveryMethod === "pick-up" &&
                      pickupLocations[formData.pickUpLocation as string]}
                  </div>

                  <Button
                    className={styles["shopping-btn"]}
                    onClick={() =>
                      router.push("/product-category/anniversary-flowers")
                    }
                  >
                    Continue Shopping
                  </Button>
                  {isDelivered(order?.deliveryStatus) && (
                    <Link href="/#">
                      <a className={styles.track}>Track Order</a>
                    </Link>
                  )}
                </div>
              </div>
              <div className={styles["order-summary"]}>
                <p
                  className={[
                    "sub-heading bold",
                    deviceType === "mobile" && "text-center"
                  ].join(" ")}
                >
                  Order Summary
                </p>
                {isBankTransfer ? (
                  <p
                    className={[
                      deviceType === "mobile" && "text-center",
                      "normal-text"
                    ].join(" ")}
                  >
                    For any issues/enquiries, please email us at{" "}
                    <a
                      href={`mailto:${companyEmail}`}
                      className="underline blue"
                    >
                      {companyEmail}
                    </a>{" "}
                    or call/text/whatsapp{" "}
                    <a href="tel: +2349077777994">+234 907 7777994</a>
                  </p>
                ) : (
                  <p className="normal-text">
                    Payment successful. A copy has been sent to your mail for
                    reference.
                  </p>
                )}
                <div className="vertical-margin spaced center-align">
                  <p className={[styles.detail].join(" ")}>
                    Sender's Information
                  </p>
                  <hr className="hr vertical-margin" />
                  <div className={[styles["order-detail"]].join(" ")}>
                    <div className="flex column spaced">
                      <div className={styles["order-detail"]}>
                        <span className="flex between">
                          <strong>Name</strong>
                          <span className={styles["detail-value"]}>
                            {formData.senderName}
                          </span>
                        </span>
                        <span className="flex between">
                          <strong>Phone Number</strong>
                          <span className={styles["detail-value"]}>
                            {formData.senderPhoneNumber}
                          </span>
                        </span>
                        <span className="flex between">
                          <strong>Email</strong>
                          <span className={styles["detail-value"]}>
                            {formData.senderEmail}
                          </span>
                        </span>
                        <span className="flex between">
                          <strong>Delivery Date</strong>
                          <span className={styles["detail-value"]}>
                            {deliveryDate?.format("DD MMMM, YYYY")}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                {formData.deliveryMethod === "pick-up" && (
                  <div className="vertical-margin spaced center-align">
                    <p className={[styles.detail].join(" ")}>
                      Pick Up Location
                    </p>
                    <hr className="hr vertical-margin" />
                    <div className={[styles["order-detail"]].join(" ")}>
                      {pickupLocations[formData.pickUpLocation as string]}
                    </div>
                  </div>
                )}
                {formData.deliveryMethod === "delivery" && (
                  <div className="vertical-margin spaced center-align">
                    <p className={[styles.detail].join(" ")}>
                      Who is this order for?
                    </p>
                    <hr className="hr vertical-margin" />
                    <div
                      className={[
                        styles["order-detail"],
                        "flex column spaced"
                      ].join(" ")}
                    >
                      <div className={styles["order-detail"]}>
                        <span className="flex between">
                          <strong>Name</strong>
                          <span className={styles["detail-value"]}>
                            {formData.recipientName}
                          </span>
                        </span>
                        <span className="flex between">
                          <strong>Phone Number</strong>
                          <span className={styles["detail-value"]}>
                            {formData.recipientPhoneNumber}
                          </span>
                        </span>
                        <span className="flex between">
                          <strong>Address</strong>
                          <span className={styles["detail-value"]}>
                            {formData.recipientHomeAddress}
                          </span>
                        </span>
                        <span className="flex between">
                          <strong>Residence Type</strong>
                          <span className={styles["detail-value"]}>
                            {formData.residenceType}
                          </span>
                        </span>
                        <span className="flex between">
                          <strong>Delivery Instructions</strong>
                          <span className={styles["detail-value"]}>
                            {formData.deliveryInstruction}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="vertical-margin spaced center-align">
                  <p className={[styles.detail].join(" ")}>Customize Message</p>
                  <hr className="hr vertical-margin" />
                  <div className={[styles["order-detail"]].join(" ")}>
                    <div className="flex column spaced">
                      <div className={styles["order-detail"]}>
                        {formData.message && (
                          <span className="flex between">
                            <strong>Message</strong>
                            <span className={styles["detail-value"]}>
                              {formData.message}
                            </span>
                          </span>
                        )}
                        {formData.additionalInfo && (
                          <span className="flex between">
                            <strong>Additional Info</strong>
                            <span className={styles["detail-value"]}>
                              {formData.additionalInfo}
                            </span>
                          </span>
                        )}
                        {formData.purpose && (
                          <span className="flex between">
                            <strong>Occasion</strong>
                            <span className={styles["detail-value"]}>
                              {formData.purpose}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="vertical-margin spaced center-align">
                  <p className={[styles.detail].join(" ")}>Order Details</p>

                  <hr className="hr vertical-margin" />

                  <div className={[styles["order-details"]].join(" ")}>
                    {order?.orderProducts?.map((item, index) => (
                      <div key={index} className="flex column spaced">
                        <div className={styles["order-detail"]}>
                          <span className="flex between">
                            <strong>Name</strong>
                            <span className={styles["detail-value"]}>
                              {item.name}
                            </span>
                          </span>
                          <span className="flex between">
                            <strong>Qty</strong>
                            <span className={styles["detail-value"]}>
                              {item.quantity}
                            </span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <p className={[styles.detail, "margin-bottom"].join(" ")}>
                  Payment Details
                </p>
                <hr className="hr margin-bottom spaced" />
                <div className={[styles["order-detail"]].join(" ")}>
                  <div className="flex between  margin-bottom spaced">
                    <strong>Subtotal</strong>
                    <span>{getPriceDisplay(subTotal || 0, currency)}</span>
                  </div>

                  <div className="flex between  margin-bottom spaced">
                    <div>
                      <strong>Delivery</strong>
                    </div>
                    <span>
                      {getPriceDisplay(
                        formData.deliveryLocation?.amount || 0,
                        currency
                      )}
                    </span>
                  </div>
                  <div className="flex between  margin-bottom spaced">
                    <div>
                      <strong>Payment Method</strong>
                    </div>
                    <span>
                      {order?.paymentStatus
                        ?.match(/\(.+\)/)?.[0]
                        ?.replace(/[()]/g, "")}
                    </span>
                  </div>
                  <hr className="hr margin-bottom spaced" />
                  <div className="flex between sub-heading margin-bottom spaced">
                    <span>Total</span>
                    <span className="bold primary-color">
                      {getPriceDisplay(total, currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        <PaypalModal
          visible={showPaypal}
          cancel={() => setShowPaypal(false)}
          order={order}
          onComplete={markAsPaid}
        />
        <BankDetailsModal
          visible={showBankDetails}
          cancel={() => setShowBankDetails(false)}
          transferName={transferName}
          setShowPaymentDetails={() => setShowPaymentDetails(true)}
        />
      </form>
      <PaymentDetailsModal
        visible={showPaymentDetails}
        cancel={() => setShowPaymentDetails(false)}
        onCompleted={markAsPaid}
        transferName={transferName}
      />
    </>
  );
};

const PaypalModal: FunctionComponent<ModalProps & {
  order: Order | null;
  onComplete: () => void;
}> = ({ visible, cancel, order, onComplete }) => {
  const { currency, notify, orderId } = useContext(SettingsContext);
  const currencyRef: MutableRefObject<AppCurrency> = useRef(currency);

  currencyRef.current = currency;

  const recipientPhone = order?.recipient.phone?.replace(/[^\d\+]/g, "");
  const isTestAccount = order?.client.email === "oeoladitan@hotmail.com";
  const purchaseUnitTestProps = {
    reference_id: `${order?.fullOrderId}-${order?.id}`,
    payee: {
      email_address: order?.client.email
    },
    shipping: {
      name: {
        full_name: `${order?.recipient.firstname || "NA"} ${order?.recipient
          .lastname || "-"}`
      },
      email_address: order?.recipient.email || undefined,
      phone_number: recipientPhone
        ? { national_number: recipientPhone }
        : undefined,
      options: [
        {
          amount: {
            value: String(
              Math.round((order?.deliveryAmount || 0) / currency.conversionRate)
            ),
            currency_code: currency.name
          },
          id: order?.deliveryDetails.zone || "default",
          label: order?.recipientAddress || "Address",
          selected: true
        }
      ]
    },
    items:
      order?.orderProducts.map(product => ({
        name: product.name,
        sku: product.SKU,
        quantity: String(product.quantity),
        unit_amount: {
          value: String(Math.round(product.price / currency.conversionRate)),
          currency_code: currency.name
        },
        description: product.size || undefined,
        category: "PHYSICAL_GOODS"
      })) || [],
    soft_descriptor: order?.fullOrderId,
    custom_id: order?.fullOrderId
  };
  const amountTestProps = {
    breakdown: {
      item_total: {
        currency_code: currency.name,
        value: String(
          Math.round((order?.amount || 0) / currency.conversionRate) -
            Math.round((order?.deliveryAmount || 0) / currency.conversionRate)
        )
      },
      shipping: {
        currency_code: currency.name,
        value: String(
          Math.round((order?.deliveryAmount || 0) / currency.conversionRate)
        )
      }
    }
  };
  const purchase_units = [
    {
      amount: {
        value: String(
          Math.round(
            (order?.amount || 0) / (currency.conversionRate || 1)
          ).toFixed(2)
        ),

        ...(isTestAccount ? amountTestProps : {})
      },
      ...(isTestAccount ? purchaseUnitTestProps : {})
    }
  ] as PurchaseUnit[];

  const handleSessionCreate = (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => {
    // const currency = currencyRef.current;
    return actions.order.create({
      purchase_units
    });
  };

  const handleApprove = async (
    data: OnApproveData,
    actions: OnApproveActions
  ) => {
    const response = await actions.order?.capture();

    if (response?.status !== "COMPLETED") {
    }

    if (response?.status === "COMPLETED") {
      const { error, message, status } = await verifyPaypalPayment(
        data.orderID,
        orderId
      );
      if (error) {
        notify("error", `Unable to verify paypal payment: ${message}`);
      } else if (status === 214 && message) {
        notify("info", `Order is successful, but not that: ${message}`);
        onComplete();
        cancel?.();
      } else {
        notify("success", "Successfully paid for order");
        onComplete();
        cancel?.();
      }
    }
  };

  const canInitialize = useMemo(() => {
    return paymentMethods
      .find(method => method.paymentName === "payPal")
      ?.supportedCurrencies.includes(currency.name);
  }, [currency]);

  const updatePaypalPaymentDetails = async () => {
    await updatePaymentMethodDetails({
      orderId: order?.id as string,
      currency: currency.name,
      paymentMethod: "payPal"
    });
  };

  return (
    <Modal
      visible={visible}
      cancel={() => {
        updatePaypalPaymentDetails();
        cancel?.();
      }}
      className="scrollable"
    >
      <h1 className="title thin margin-bottom spaced">
        Complete Paypal Payment
      </h1>
      {canInitialize && (
        <PayPalScriptProvider
          options={{
            "client-id":
              "AfayzGAExwH0KkBgYAjLtrn8vXndZJdpmYS0x3VbUbWDmw6DoqPkOkZ2Fx2MDTcZKjTdJ6riKd1JupMZ",
            // "client-id":
            //   "AYiEmK9_A6XE9_ExJu8nB7ftFPqI2lMEeQeIzFQS8UwRfwGgVt3wUreFHtMmgoX2OR-UNwgT3J0koK0t",
            currency: currencyRef.current?.name
            // "buyer-country": currencyRef.current?.name === "USD" ? "US" : "GB"
          }}
        >
          <PaypalButtonsWrapper
            handleApprove={handleApprove}
            handleSessionCreate={handleSessionCreate}
          />
        </PayPalScriptProvider>
      )}
    </Modal>
  );
};

interface PaypalButtonsWrapperProps {
  handleSessionCreate: (
    data: CreateOrderData,
    actions: CreateOrderActions
  ) => Promise<string>;
  handleApprove: (
    data: OnApproveData,
    actions: OnApproveActions
  ) => Promise<void>;
}

const PaypalButtonsWrapper = (props: PaypalButtonsWrapperProps) => {
  const { handleApprove, handleSessionCreate } = props;
  const [{ options }, dispatch] = usePayPalScriptReducer();
  const { currency } = useContext(SettingsContext);

  useEffect(() => {
    dispatch({
      type: "resetOptions",
      value: {
        ...options,
        currency: currency.name
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        shape: "pill",
        label: "pay"
      }}
      className="vertical-margin spaced"
      createOrder={handleSessionCreate}
      onApprove={handleApprove}
    />
  );
};

const BankDetailsModal: FunctionComponent<ModalProps & {
  transferName: TransferName | null;
  setShowPaymentDetails: () => void;
}> = ({ visible, cancel = () => {}, transferName, setShowPaymentDetails }) => {
  const [textCopied, setTextCopied] = useState("");
  const { currency, order } = useContext(SettingsContext);

  const router = useRouter();
  const {
    query: { orderId }
  } = router;

  const handlePaymentMethodDetailsUpdate = async () => {
    await updatePaymentMethodDetails({
      orderId: orderId as string,
      currency: currency.name,
      paymentMethod: transferName as TransferName
    });
  };

  useEffect(() => {
    if (visible) {
      handlePaymentMethodDetailsUpdate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setTextCopied(text);
    } catch (err) {}
  };

  const copyButton = (text: string) => {
    return (
      <button
        onClick={() => handleCopy(text)}
        className={`flex spaced margin-bottom-medium ${
          textCopied === text ? "copied" : ""
        }`}
      >
        <svg
          width="27"
          height="27"
          viewBox="0 0 27 27"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`generic-icon copy-icon ${
            textCopied === text ? "active" : ""
          }`}
        >
          <path
            d="M27 25.4118V6.88235C27 6.46113 26.8327 6.05715 26.5348 5.7593C26.237 5.46145 25.833 5.29412 25.4118 5.29412C24.9905 5.29412 24.5866 5.46145 24.2887 5.7593C23.9909 6.05715 23.8235 6.46113 23.8235 6.88235V23.8235H6.88235C6.46113 23.8235 6.05715 23.9909 5.7593 24.2887C5.46145 24.5866 5.29412 24.9905 5.29412 25.4118C5.29412 25.833 5.46145 26.237 5.7593 26.5348C6.05715 26.8327 6.46113 27 6.88235 27H25.4118C25.833 27 26.237 26.8327 26.5348 26.5348C26.8327 26.237 27 25.833 27 25.4118ZM21.7059 20.1176V1.58823C21.7059 1.16701 21.5386 0.763035 21.2407 0.465183C20.9428 0.167332 20.5389 -1.90735e-06 20.1176 -1.90735e-06H1.58824C1.16701 -1.90735e-06 0.763035 0.167332 0.465183 0.465183C0.167332 0.763035 0 1.16701 0 1.58823V20.1176C0 20.5389 0.167332 20.9428 0.465183 21.2407C0.763035 21.5386 1.16701 21.7059 1.58824 21.7059H20.1176C20.5389 21.7059 20.9428 21.5386 21.2407 21.2407C21.5386 20.9428 21.7059 20.5389 21.7059 20.1176ZM18.5294 18.5294H3.17647V3.17647H18.5294V18.5294Z"
            fill="currentColor"
          />
        </svg>
      </button>
    );
  };

  return (
    <Modal
      visible={visible}
      cancel={cancel}
      className={["scrollable", styles["details-wrapper"]].join(" ")}
      allowClickOutside={false}
    >
      <h1 className="title margin-bottom spaced">Transfer Details</h1>
      <p className="margin-bottom spaced normal-text">
        Please include your{" "}
        <strong className="checkout_order-number__6tLEv">
          Order No:{" "}
          <strong className="primary-color">{order?.fullOrderId}</strong>{" "}
        </strong>{" "}
        as the payment reference/remark where possible.
      </p>
      <div className="vertical-margin spaced normal-text">
        {transferName === "gtbTransfer" && (
          <>
            <p className={styles.details}>
              <strong className="primary-color">Bank Name:</strong>
              <span>Guaranty Trust Bank (or GTBank)</span>
            </p>
            <p className={[styles.details, "vertical-margin spaced"].join(" ")}>
              <strong className="primary-color">Account Name:</strong>
              <span>FLORAL SERVICES & EVENTS HUB LTD</span>
            </p>
            <div className={styles.details}>
              <strong className="primary-color">Account Number:</strong>
              <div className="flex spaced center-align">
                <span>0812257604</span>
                {copyButton("0812257604")}
              </div>
            </div>
          </>
        )}
        {transferName === "bitcoinAddress" && (
          <>
            <div className={[styles.details, styles.bitcoinAddress].join(" ")}>
              <strong className="primary-color">Bitcoins Wallet ID:</strong>
              <div className="flex spaced center-align">
                <span>{bitcoinAddress}</span>
                {copyButton(bitcoinAddress)}
              </div>
            </div>
          </>
        )}
        {transferName === "natwestTransfer" && (
          <>
            <p className={styles.details}>
              <strong className="primary-color">Bank:</strong>
              <span>Natwest Bank</span>
            </p>
            <div
              className={[styles.details, "vertical-margin spaced"].join(" ")}
            >
              <strong className="primary-color">Account Number:</strong>
              <div className="flex spaced center-align">
                <span>24323462</span>
                {copyButton("24323462")}
              </div>
            </div>
            <p className={styles.details}>
              <strong className="primary-color">Account Name:</strong>
              <span>Olaotan Oladitan</span>
            </p>
            <p className={[styles.details, "vertical-margin spaced"].join(" ")}>
              <strong className="primary-color">SORT CODE:</strong>
              <span>601907</span>
            </p>
            <p className={styles.details}>
              <strong className="primary-color">IBAN:</strong>
              <span>GB75NWBK60190724323470</span>
            </p>
            <p className={[styles.details, "vertical-margin spaced"].join(" ")}>
              <strong className="primary-color">BIC:</strong>
              <span>NWBKGB2L</span>
            </p>
            <p className={styles.details}>
              <strong className="primary-color">Bank Address:</strong>
              <span className="normal-text">
                Natwest Sheffield University, 243, Glossop Road, Sheffield,
                South Yorkshire. Post Code: S10 2GZ
              </span>
            </p>
          </>
        )}
      </div>
      <Button
        onClick={() => {
          cancel();
          setShowPaymentDetails();
        }}
        className="half-width center"
      >
        I have made the transfer
      </Button>
      <p className="margin-top spaced text-center">
        For any issues/enquiries, please email{" "}
        <a href={`mailto:${companyEmail}`} className="underline blue">
          {companyEmail}
        </a>{" "}
        or <br />
        call/text/whatsapp <a href="tel: +2349077777994">+234 907 7777994</a>
      </p>
    </Modal>
  );
};

const paymentDetailsInitialData = {
  amount: 0,
  accountName: "",
  referenceNumber: ""
};

const PaymentDetailsModal: FunctionComponent<ModalProps & {
  onCompleted: () => void;
  transferName: TransferName | null;
}> = ({ visible, cancel = () => {}, onCompleted, transferName }) => {
  const [formData, setFormData] = useState(paymentDetailsInitialData);
  const [loading, setLoading] = useState(false);
  const { currency, notify } = useContext(SettingsContext);

  const router = useRouter();
  const {
    query: { orderId: orderId }
  } = router;

  const handleChange = (key: string, value: unknown) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (formData.amount === 0) {
      return notify("error", `Amount Sent is required`);
    }
    setLoading(true);
    const { error, message, status } = await manualTransferPayment({
      ...formData,
      currency: currency.name,
      orderId: orderId as string,
      amount: getNumber(formData.amount)
    });
    setLoading(false);
    if (error) {
      notify("error", `Unable to send Transfer Details: ${message}`);
    } else if (status === 214 && message) {
      notify("info", `Order is successful, but not that: ${message}`);
      onCompleted();
      cancel();
    } else {
      notify("success", `Transfer Details sent successfully`);
      onCompleted();
      cancel();
    }
  };

  return (
    <Modal
      visible={visible}
      cancel={cancel}
      className={["scrollable", styles["details-wrapper"]].join(" ")}
      allowClickOutside={false}
    >
      <h1 className="title margin-bottom spaced">
        Details used to make payment
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <span className="question">Amount Sent</span>
          <Input
            placeholder="Amount Sent"
            value={formData.amount}
            onChange={value => handleChange("amount", value)}
            dimmed
            required
            responsive
            number
          />
        </div>
        {transferName !== "bitcoinAddress" && (
          <div className="input-group vertical-margin spaced">
            <span className="question">Account Name</span>
            <Input
              placeholder="Account Name"
              value={formData.accountName}
              onChange={value => handleChange("accountName", value)}
              dimmed
              required
              responsive
            />
          </div>
        )}
        <div className="input-group">
          <span className="question">30digit Reference (if available)</span>
          <Input
            placeholder="30digit Reference"
            value={formData.referenceNumber}
            onChange={value => handleChange("referenceNumber", value)}
            dimmed
            responsive
          />
        </div>
        <Button
          buttonType="submit"
          className="half-width center"
          loading={loading}
        >
          Submit
        </Button>
      </form>
    </Modal>
  );
};

export default Checkout;
