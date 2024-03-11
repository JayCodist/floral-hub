import { Dayjs } from "dayjs";
import React from "react";
import { Option } from "../components/select/Select";
import { getPriceDisplay } from "./helpers/type-conversions";
import { BooleanFilter } from "./helpers/type-helpers";
import { AppCurrency, AppCurrencyName, AppLink } from "./types/Core";
import { DeliveryZone, PaymentMethod } from "./types/Order";
import { DesignOptionName, Gift } from "./types/Product";
import {
  Service,
  Occasion,
  UserReview,
  BlogPost,
  LocationName,
  LocationAddress
} from "./types/Regal";
import { Breadcrumb } from "./context/SettingsContext";
import { BlogMinimal } from "./types/Blog";

export const pickupLocations: Record<string, JSX.Element> = {
  Lagos: (
    <p>
      <strong>Lagos Pickup Address</strong> - 15, Ikeja Way, Dolphin Estate,
      Ikoyi, Lagos
    </p>
  ),
  Abuja: (
    <p>
      <strong>Abuja Pickup Address</strong> - 5, Nairobi Street, off Aminu Kano
      Crescent, Wuse 2, Abuja
    </p>
  )
};

export const FAQs = [
  {
    name: "How do I order flowers and gifts on FloralHub.com.ng?",
    acceptedAnswer: {
      text: (
        <div>
          There are several ways to order. Either online, or by Phone/Whatsapp
          on +234 907 777 7994.
          <br />
          <br />
          We can also customize a bouquet to fit your budget, preferred colors,
          flower types, etc. Do feel free to reach our line, or email us{" "}
          <a href="mailto:info@floralhub.com.ng">info@floralhub.com.ng</a>
        </div>
      )
    }
  },
  {
    name: "Is same day delivery possible?",
    acceptedAnswer: {
      text: (
        <div>
          Yes, we are able to deliver SAME DAY across Lagos, Nigeria as well as
          Abuja, Nigeria.
          <br /> <br /> We also offer deliveries to other states on a case by
          case basis.Kindly contact us Phone/ Whatsapp on + 234 907 777 7994 or
          email us info@floralhub.com.ng
        </div>
      )
    }
  },
  {
    name: "Are you open on weekends and public holidays?",
    acceptedAnswer: {
      text: (
        <div>
          Yes, Floralhub.com.ng is open 24hrs all day including weekends and
          public holidays including Christmas Day.
        </div>
      )
    }
  },
  {
    name: "Can I return an item?",
    acceptedAnswer: {
      text: (
        <div>
          Due to the perishable nature of the product, flowers cannot be
          returned.
        </div>
      )
    }
  },
  {
    name: "What time do you close?",
    acceptedAnswer: {
      text: (
        <div>
          We are open 24hrs, and are able to deliver same day across Lagos and
          Abuja
        </div>
      )
    }
  },
  {
    name: "How do I take care of the flowers?",
    acceptedAnswer: {
      text: (
        <div>
          Fresh flowers should be kept somewhere cool, water changed regularly
          and stems trimmed. To do this justice, pls read this article we wrote
          on{" "}
          <a
            href="https://www.floralhub.com.ng/how-to-care-for-fresh-flowers-after-receiving-them/"
            target="_blank"
            rel="noreferrer"
          >
            {" "}
            how to care for your flowers{" "}
          </a>
          . There might be some surprising facts there too
        </div>
      )
    }
  },
  {
    name: "Do you offer payment on delivery?",
    acceptedAnswer: {
      text: (
        <div>
          Unfortunately, due to the perishable nature of the product (it can’t
          be brought back to the office/resold, in the event the client isn’t at
          the destination), we do not offer payment on delivery. <br /> <br />{" "}
          This is also because we typically use Uber/ Bolt for delivery and they
          can’t receive payment on our behalf <br /> <br /> We however offer
          several payment options(see next question)
        </div>
      )
    }
  },
  {
    name: "How do I make payment?",
    acceptedAnswer: {
      text: (
        <div>
          There are various payment options available for your convenience.
          <br /> <br />
          <ol className="faq-ol">
            <li className="faq-li">
              Website Online payment through Flutterwave
            </li>
            <li className="faq-li">
              Naira Bank Transfer to our parent account:{" "}
              <b>GTB, Faajihub Ltd, 0168164823</b>
            </li>
            <li className="faq-li">
              Website Online through Paypal (you do not need to have an existing
              Paypal account). Please change site currency to USD or GBP to see
              Paypal option
            </li>
            <li className="faq-li">
              Transfer to our Paypal account:{" "}
              <b>paypalpayments@floralhub.com.ng</b>
            </li>
            <li className="faq-li">
              Bitcoin to our wallet: <b>1NQfzJGzXSn5B5xqT4mfw48KpaoA4Ajmwy</b>
            </li>
          </ol>
        </div>
      )
    }
  },
  {
    name: "What happens if the recipient is unavailable?",
    acceptedAnswer: {
      text: (
        <div>
          We typically use Bolt/Uber for deliveries and we encourage clients to
          ensure they give us accurate details for the recipient to avoid a
          failed delivery.
          <br />
          <br />
          We usually make every attempt to reach the recipient at the delivery
          point, but if despite our attempts, the recipient is unreachable (e.g.
          phone switched off, or ringing), we would usually drop off the items
          with a guard or colleague.
          <br />
          <br />
          If there is no one to drop the items with and the client is also
          unreachable or unresponsive, we would be forced to return the items to
          our Ikoyi, Lagos or Wuse 2, Abuja office for pickup by the client or
          recipient.
          <br />
          <br />
          We usually recommend the recipient/client picks up the flowers and
          other items from our office as soon as possible as they are perishable
          <br />
          <br />
          We are also able to redeliver the items upon payment of another
          delivery fee.
        </div>
      )
    }
  },
  {
    name: "What happens if the recipient changes the address?",
    acceptedAnswer: {
      text: (
        <div>
          This happens often, we would typically request the difference in
          delivery fee from the client as we typically use Bolt/Uber drivers.
          <br />
          <br />
          Please note that this is also the case if the recipient delays the
          driver as they are 3rd party drivers
        </div>
      )
    }
  }
];

export const breadcrumbItems: Breadcrumb[] = [
  {
    url: "anniversary-flowers",
    label: "Romance, Birthdays & Anniversary"
  },
  {
    url: "flowers-to-say-thanks-sorry-etc",
    label: "Just To Say Hi, Sorry, Thank You"
  },
  { url: "valentines-day-flowers", label: "Valentines Day" },
  { url: "get-well-soon", label: "Get Well Soon" },
  { url: "bridal-bouquets", label: "Bridal" },
  { url: "funeral-and-condolence", label: "Funeral & Condolence" },
  { url: "event-centerpiece", label: "Events & Centerpiece" },
  { url: "fathers-day-flowers", label: "Father's Day" },
  { url: "flowers-to-say-thanks-sorry-etc", label: "Mother's Day" },

  {
    url: "chocolates-and-biscuits",
    label: "Chocolate & Biscuits"
  },
  {
    url: "wine-and-champagne",
    label: "Wine & Champagne"
  },
  {
    url: "cakes-and-cupcakes",
    label: "Cakes & Cupcakes"
  },
  {
    url: "teddy-bears",
    label: "Teddy Bears"
  },
  {
    url: "gifts",
    label: "Gift Packs"
  },
  { url: "perfumes-eau-de-toilette-cologne-and-parfums", label: "Perfumes" },
  { url: "balloons", label: "Balloons" },
  {
    url: "scented-candles",
    label: "Scented Candles"
  },
  { url: "cascading-bridal-bouquets", label: "Cascading Bridal Bouquets" },
  {
    url: "accessories-boutonnieres-bridesmaids-flowers-corsages",
    label: "Accessories & Boutonnieress"
  },
  { label: "VIP", url: "vip" }
];

export const defaultBreadcrumb: Breadcrumb = {
  url: "/product-category/anniversary-flowers",
  label: "Romance, Birthdays & Anniversary"
};

export const allOccasionOptions: Option[] = [
  {
    slug: "flowers-to-say-thanks-sorry-etc",
    value: 0,
    label: "Christmas Flowers"
  },
  {
    slug: "birthday-flowers",
    value: 1,
    label: "Birthday Flowers"
  },
  { slug: "anniversary-flowers", value: 2, label: "Anniversary Flowers" },
  {
    slug: "flowers-to-say-thanks-sorry-etc",
    value: 3,
    label: "Romantic Flowers"
  },
  {
    slug: "flowers-to-say-thanks-sorry-etc",
    value: 4,
    label: "I Am Sorry Flowers"
  },
  {
    slug: "flowers-to-say-thanks-sorry-etc",
    value: 5,
    label: "Get Well Soon Flowers"
  },
  { slug: "bridal-bouquets", value: 6, label: "Bridal Flowers" },
  { slug: "funeral-condolence-flowers", value: 7, label: "Funeral Flowers" },
  {
    slug: "flowers-to-say-thanks-sorry-etc",
    value: 9,
    label: "Mother's Day Flowers"
  },
  { slug: "valentines-day-flowers", value: 8, label: "Valentine's Flowers" }
];

export const defaultCurrency: AppCurrency = {
  name: "NGN",
  conversionRate: 1,
  sign: "₦"
};

export const defaultRedirect = {
  title: "Love, Birthdays & Anniversary",
  url: "/product-category/anniversary-flowers"
};

export const currencyOptions: AppCurrency[] = [
  { ...defaultCurrency },
  { name: "USD", conversionRate: 700, sign: "$" },
  { name: "GBP", conversionRate: 890, sign: "£" }
];

interface FooterLinks {
  title: string;
  url: string;
}

interface FooterContent {
  aboutUs: string;
  socialIcons: { name: string; src: string; url: string }[];
  quickLinks: { title: string; url: string; phoneNumber?: string }[];
  phoneNumbers: string[];
  lagosBranch: LocationAddress;
  abujaBranch: LocationAddress;
  about: FooterLinks[];
  occassions: FooterLinks[];
  gifts: FooterLinks[];
  legals: FooterLinks[];
  accountNo: string;
  accountName: string;
  bitcoinAddress: string;
  bankName: string;
  contacts: {
    icon: string;
    url: string;
    title: string;
  }[];
}

export const footerContent: FooterContent = {
  contacts: [
    {
      title: "+234 907 7777994",
      icon: "/icons/footer/phone.svg",
      url: "tel:+2349077777994"
    },
    {
      title: "+234 907 777 7994",
      icon: "/icons/footer/whatsapp.svg",
      url: "https://wa.me/+2349077777994"
    },
    {
      title: "info@floralhub.com.ng",
      icon: "/icons/footer/message.svg",
      url: "mailto:info@floralhub.com.ng"
    }
  ],
  accountName: "Floral Services & Events Hub Ltd",
  accountNo: "0812257604",
  bitcoinAddress: "1NQfzJGzXSn5B5xqT4mfw48KpaoA4Ajmwy",
  bankName: "GTB",
  legals: [
    {
      title: "FAQ",
      url: "/faq-how-to-buy-fresh-flowers-and-gifts-in-lagos-and-abuja"
    },
    { title: "Legal Terms", url: "/legal-terms" },
    { title: "Privacy Statement", url: "/privacy-statement" }
  ],
  gifts: [
    {
      title: "Valentine’s Day Flowers",
      url: "/product-category/valentines-day-flowers"
    },
    {
      title: "Mother’s Day Flowers",
      url: "/product-category/flowers-to-say-thanks-sorry-etc"
    },
    {
      title: "Gifts to Include with Flowers",
      url: "/product-category/gifts"
    },
    {
      title: "VIP Flowers",
      url: "/vip-flowers"
    },
    {
      title: "Product Packages",
      url: "/product-category/product-packages "
    }
  ],
  about: [
    {
      title: "Contact Us",
      url: "/contact"
    },
    {
      title: "Our Blog",
      url: "/blog"
    },
    {
      title: "FAQ",
      url: "/faq"
    },
    {
      title: "Privacy Statement",
      url: "/privacy-statement"
    }
  ],
  occassions: [
    {
      title: "Birthday Flowers",
      url: "/product-category/birthday-flowers"
    },
    {
      title: "Anniversary Flowers",
      url: "/product-category/anniversary-flowers"
    },
    {
      title: "Flowers for Romance, Sorry, Get Well Soon etc",
      url: "/product-category/flowers-to-say-thanks-sorry-etc"
    },
    {
      title: "Bridal Flowers",
      url: "/product-category/bridal-bouquets"
    },
    {
      title: "Funeral Flowers",
      url: "/product-category/funeral-condolence-flowers"
    }
  ],

  lagosBranch: {
    name: "Lagos Head Office/Delivery Center",
    url: "https://maps.app.goo.gl/u4DbZLsmZRixJZqV8",
    workingTimes: "24/7",
    location: "15, Ikeja Way, Dolphin Estate, Ikoyi"
  },

  abujaBranch: {
    name: "Abuja Office",
    url: "https://maps.app.goo.gl/4BmrPnVoGQjNz8Mb6",
    workingTimes: "24/7",
    location: "5, Nairobi Street, Off Aminu Kano crescent, Wuse 2, Abuja."
  },
  aboutUs:
    "Nigeria's most loved online flower shop with same day delivery in Lagos and Abuja",
  socialIcons: [
    {
      name: "facebook",
      src: "/icons/footer/facebook.svg",
      url: "http://facebook.com/floralhub.com.ng"
    },
    {
      name: "instagram",
      src: "/icons/footer/instagram.svg",
      url: "https://instagram.com/floralhub.com.ng"
    },
    {
      name: "linkedIn",
      src: "/icons/footer/linkedin.svg",
      url: "https://www.linkedin.com/company/floralhub-com-ng"
    },
    {
      name: "whatsapp",
      src: "/icons/footer/whatsapp.svg",
      url: "https://wa.me/+2349077777994"
    }
  ],
  quickLinks: [
    {
      title: "Occasions",
      url: "/product-category/all"
    },
    { title: "VIP Section", url: "/vip-flowers" },
    { title: "Contact Us", url: "", phoneNumber: "+2349077777994" },
    { title: "Our Blog", url: "/" },
    {
      title: "FAQ",
      url: "/faq-how-to-buy-fresh-flowers-and-gifts-in-lagos-and-abuja"
    }
  ],
  phoneNumbers: ["2349077777994"]
};

interface CheckoutContent {
  paymentIcons: { alt: string; src: string }[];
}

export const checkoutContent: CheckoutContent = {
  paymentIcons: [
    {
      alt: "visa",
      src: "/icons/visa.svg"
    },
    {
      alt: "master card",
      src: "/icons/master-card.svg"
    },
    {
      alt: "paypal",
      src: "/icons/paypal-blue.svg"
    },
    {
      alt: "bitcoin",
      src: "/icons/bitcoin-gold.svg"
    },

    {
      alt: "bank",
      src: "/icons/building-primary.svg"
    },
    {
      alt: "paystack",
      src: "/icons/paystack.png"
    }
  ]
};

export const aboutUsContent: {
  [key: string]: { title: string; content: string };
} = {
  howItBegan: {
    title: "How it Began",
    content:
      "Warning: This is not a typical About Us story, because you see, Floral Hub Flowers started in an unusual way. It was a Sunday morning, the year was 2016, in the vibrant city of Lagos, Nigeria, and our founder, reeling from the very recent heartbreak of his relationship (Hint: She left him) was determined to get his girlfriend back.  She was traveling to Abuja, Nigeria that afternoon, and he wanted to get beautiful flowers for her so he decided to check online for flower shops in Lagos or Abuja that could deliver a bouquet of red roses and chocolates to her the same day. He searched high and low, and while he found other online flower delivery shops in Lagos and Abuja, Nigeria, he couldn’t find one that ticked all the right boxes.  The flower shops he found either didn’t look reputable enough (after all he was already heartbroken, he couldn’t afford to lose his money too, and this is Nigeria, where you have to be vigilant), or were out of stock (even though they didn’t say so on their website until he called), or they didn’t have enough options for various budgets. He finally found one that claimed to be open 24 hours on their Google Maps, and when they didn’t pick up the phone, he drove down there, only to meet it closed. Ouch. No, he eventually didn’t get her back, and No, it wasn't because he couldn't send her the red roses and chocolates. Instead, it was, as the dictionary would say, irreconcilable differences, and they remain friends, but he instead gained the passion for flowers and gifts that would eventually see him open his own online and walk-in fresh flower shop in Lagos and Abuja An online flower shop that would precisely tick all the right boxes: "
  },

  openingHour: {
    content:
      "It would be open 24 hours not only for online orders but also for walk-ins. We once had a client take us up on the offer by walking in by 3 am. He was on his way to pick up his wife at the airport and wanted to buy red roses to welcome her. He was shocked we were actually open. Floral Hub Flowers and Gifts is also open every day of the year including weekends and public holidays (yes, Christmas, Easter, and New Year's Day too). We are badass like that ",
    title: "Always Open Online and Walk-in 24hours everyday"
  },
  reputation: {
    content:
      "The flower shop would be reputable. Once you place your order, you can completely relax. We have the highest rating  (4.97 stars on average) and the highest number of Google Reviews in Nigeria (over 1000 reviews from our 3 branches). Floral Hub Flowers has delivered to over 10,000 people including various celebrities and 2 Nigerian Presidents. We have probably delivered roses for and to someone you know. Furthermore, the flowers are always fresh and imported into Nigeria every week from rose farms across the world. You can definitely say Regal flowers is your plug for reputable and premium fresh flowers in Nigeria.",
    title: "Reputable and Premium Fresh Flowers in Nigeria"
  },
  deliveryTime: {
    content:
      "It would offer fast and same-day delivery of flower bouquets and gifts everywhere in Lagos and Abuja. Some locations we offer delivery of fresh flowers in Lagos include Ikoyi, Victoria Island, Ikeja, Lekki Phase 1, Chevron, Lekki, Ajah, Ikate, Sangotedo, Gbagada, Yaba, Surulere, Ilupeju, Magodo, Maryland, Opebi, Ogba, Ogudu, Allen Avenue, and delivery of fresh flowers in Abuja include Wuse 2, Maitama, Central Area, Garki, Jabi, Asokoro, Gwarinpa, Jahi, Lokogoma, Apo, Life Camp, Lugbe, Dawaki, Abuja Municipal Area Council etcetera.",
    title: "Same Day Flower Delivery in Lagos and Abuja"
  },
  budget: {
    title: "Fresh Flowers For All Occasions and Budgets",
    content:
      "We stock flowers for various occasions such as Birthday Flowers, Romantic Flowers, Anniversary Flowers, Mothers’ Day Flowers, Get Well Soon Flowers, Funeral Wreaths, Condolence Flowers, Bridal Bouquets, and of course, Valentine’s Day flowers available And finally, there are suitable options for all budgets, so when you see a design you like, you can simply pick the size that suits your budget. Want to go all out too? We got you, with our VIP Category of roses. "
  }
};

export const otherSampleProducts = {
  id: 1,
  name: "A Kiss of Rose",
  addonsGroups: [
    {
      name: "Perfumes",
      image: "/images/addons/Rectangle133.png",
      addons: [
        {
          name: "5 Peas in a pod",
          price: 32999,
          image: "/images/addons/Rectangle131.png"
        },
        {
          name: "5 Peas in a pod",
          price: 36000,
          image: "/images/addons/Rectangle13.png"
        }
      ]
    },
    {
      name: "Teady Bears",
      image: "/images/addons/Rectangle133.png",
      addons: [
        {
          name: "5 Peas in a pod",
          price: 32999,
          image: "/images/addons/Rectangle131.png"
        },
        {
          name: "5 Peas in a pod",
          price: 36000,
          image: "/images/addons/Rectangle13.png"
        }
      ]
    }
  ],
  featured: true,
  images: [
    { alt: "flower1", src: "/images/product-image/flower1.png", id: 1 },
    { alt: "flower2", src: "/images/addons/Rectangle131.png", id: 2 },
    { alt: "flower3", src: "/images/flower.png", id: 3 },
    { alt: "flower4", src: "/images/product-image/flower1.png", id: 4 }
  ],
  price: 70000,
  salePrice: 80000,
  sku: "u2i2093092",
  slug: "belleza-regal-two-colors-rose-red-yellow-white-pink-orange",
  type: "variable",
  variants: [
    { name: "Small (15 Roses)", price: 75000, class: "regular" },
    { name: "Medium (20 Roses)", price: 90000, class: "vip" }
  ],
  productDescription:
    "A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.",
  title: "A Kiss of Rose",
  sizes: [
    "Entry (5 roses)",
    "Extra Small (10 roses)",
    "Small (15 roses)",
    "Medium (20 roses)",
    "Standard (24cm box)",
    "Standard Plus (27cm box)",
    "Standard Premium (30cm box)",
    "VIP Entry",
    "VIP Medium",
    "VIP Standard",
    "VIP Standard Premium",
    "VIP Large"
  ],
  designOptions: ["wrappedBouquet", "invase", "inLargeVase", "box"],
  note:
    "Single stem rose only available for pickup, except as part of larger order.",
  description:
    "A kiss from a rose is daintily presented single full stemmed rose, available in various colors."
};

export const regalFeatures: Service[] = [
  {
    image: "/images/same-day.png",
    title: "Fast Same Day Delivery",
    subtitle:
      "Delivery to suit you. Fast delivery in Lagos and Abuja everyday including weekends",
    url: "/filters?shopBy=same+day+delivery",
    cta: "SHOP SAME DAY"
  },
  {
    image: "/images/care.png",
    title: "Delivered fresh with care and attention",
    subtitle:
      "Our florists treat each order with care, from packaging to delivery, together with your complimentary message",
    url: "/product-category/flowers-to-say-thanks-sorry-etc",
    cta: "SHOP FLOWERS"
  },
  {
    image: "/images/variety.png",
    title: "A flower (and gift) for everyone",
    subtitle:
      "We stock a variety of flowers and gifts to delight your loved one. Fresh roses, lilies and more, as well as cakes, chocolates, teddies etc",
    url: "/product-category/flowers-to-say-thanks-sorry-etc",
    cta: "START SHOPPING"
  }
];

export const regalOccasions: Occasion[] = [
  {
    title: "Flowers to say Hi, Sorry, Thank You etc",
    url: "/product-category/flowers-to-say-thanks-sorry-etc",
    image: "/images/occasions-sorry-thanks.png",
    subtitle:
      "Say it with flowers. They deserve a handcrafted bouquet of fresh flowers",
    cta: "SHOP FLOWERS",
    color: "#EE5D76"
  },
  {
    title: "Anniversary Flowers",
    url: "/product-category/anniversary-flowers",
    image: "/images/occasions-love-bday.png",
    subtitle:
      "Celebrate the milestone with fresh flowers delivered to your partner's home or office",
    cta: "SHOP ANNIVERSARY FLOWERS",
    color: "#15803D"
  },
  {
    title: "Condolence flowers",
    url: "/product-category/funeral-and-condolence",
    image: "/images/occasions-funeral-condolence.png",
    subtitle:
      "Say goodbye or how you feel with a thoughtful arrangement of flowers",
    cta: "SHOP FUNERAL FLOWERS",
    color: "#202020"
  }
];

export const regalReasons: Service[] = [
  {
    image: "/images/mixer.png",
    title: "Premium Fresh Flowers",
    subtitle:
      "We stock only the very best fresh flowers, and arrange them with care. Don't forget to add your free personalized message too."
  },
  {
    image: "/images/bulb.png",
    title: "Affordable Prices",
    subtitle:
      "Whether you want to go all out, or you want something affordable, we have flowers and gifts for you"
  },
  {
    image: "/images/rocket.png",
    title: "Swift Delivery",
    subtitle:
      "We are the most reliable flower shop in Lagos, Nigeria and provide same day delivery in Lagos,  Nigeria"
  }
];

export const giftItems: Gift[] = [
  {
    name: "Chocolates",
    description: "A guilty pleasure and always a winning gift for most people",
    image: "/images/sample-flowers/addon-group-1.png",
    slug: "/product-category/chocolates-and-biscuits"
  },
  {
    name: "Cakes and Cupcakes",
    description: "What's an occasion without a cake, or cupcakes, or both",
    image: "/images/sample-flowers/addon-group-2.png",
    slug: "/product-category/cakes-and-cupcakes"
  },

  {
    name: "Teddy Bears",
    description: "Soft, cuddly, lush and a gift loved by many ladies",
    image: "/images/sample-flowers/addon-group-3.png",
    slug: "/product-category/teddy-bears"
  },
  {
    name: "PERFUMES & FRAGRANCES",
    description: "Male, female and unisex perfumes to delight the senses",
    image: "/images/sample-flowers/addon-group-4.png",
    slug: "/product-category/perfumes"
  }
];

export const regalHowItWorks: Service[] = [
  {
    image: "/images/bulb.png",
    title: "See what you like? Contact us",
    subtitle:
      "Visit our Website, Call, Whatsapp, or Walk into any of our stores (The Ikoyi and Abuja stores are open 24 hours every day while the Silverbird Galleria, Victoria Island is open till 7 pm every day)"
  },
  {
    image: "/images/payment.png",
    title: "Make payment",
    subtitle:
      "Make payment for your flowers online via card, Bank Transfer, PayPal, or even Bitcoin (yes, we accept Bitcoin)"
  },
  {
    image: "/images/rocket.png",
    title: "Wait by the phone for that call",
    subtitle:
      "Relax and wait for the recipient to thank you with a smile once we deliver."
  }
];

export const regalAddresses: LocationAddress[] = [
  {
    name: "Lagos Head Office/Delivery Center",
    url: "https://goo.gl/maps/cNB9Jx9sidQhJgtD6",
    workingTimes: "24/7",
    location: "15, Ikeja Way, Dolphin Estate, Ikoyi, Lagos"
  },
  {
    name: "Lagos VI Branch",
    url: "https://goo.gl/maps/AsSEYaBUVV3NCRaa7",
    workingTimes: "8am-7pm (Everyday)",
    location:
      "133, Ahmadu Bello Way, Silverbird Galleria, Victoria Island, Lagos"
  },
  {
    name: "Lagos Ikeja MMA2 Airport Branch",
    url: "https://goo.gl/maps/5wQFMW5pR33n9k6G7",
    workingTimes: "6am-7pm (Everyday)",
    location: "Muritala Muhammed Airport2, Ikeja, Lagos"
  },
  {
    name: "Abuja Office",
    url: "https://maps.app.goo.gl/4BmrPnVoGQjNz8Mb6",
    workingTimes: "24/7",
    location: "5, Nairobi Street, off Aminu Kano Crescent, Wuse 2, Abuja"
  }
];

export const companyEmail = "info@floralhub.com.ng";
export const floralHubPaymentEmail = "payments@floralhub.com.ng";

export const blogPosts: BlogPost[] = [
  {
    title: "How to take care of flowers in hot weather",
    excerpt:
      "Most of us wonder if there is a God and if He really is the God of the Bible. In the Bible of a there is a God  the God of the Bible. In the Bible of a there is a God, then He must like flowers, because, what's there not to like?",
    date: "7 May, 2022",
    readDuration: "6 mins read",
    image: "/images/sample-flowers/blog-1.png"
  },
  {
    title: "5 Best Flowers to Gift A Lady",
    excerpt:
      "Most of us wonder if there is a God and if He really is the God of the Bible. In the Bible of a there is a God  the God of the Bible.",
    date: "25 Apr, 2022",
    readDuration: "10 mins read",
    image: "/images/sample-flowers/blog-2.png"
  },
  {
    title: "5 Ladies Talk About Their First Flower Bouquet",
    excerpt:
      "Most of us wonder if there is a God and if He really is the God of the Bible. In the Bible of a there is a God  the God of the Bible. In the Bible of a there is a God, then He must like flowers, because, what's there not to like?",
    date: "18 Mar, 2022",
    readDuration: "2 mins read",
    image: "/images/sample-flowers/blog-3.png"
  }
];

export const deliveryStates: Option[] = [
  {
    label: "Lagos",
    value: "lagos"
  },
  {
    label: "Abuja",
    value: "abuja"
  },
  {
    label: "Other states",
    value: "other-locations"
  }
];

export const pickupStates: Option[] = [
  {
    label: "Lagos",
    value: "lagos"
  },
  {
    label: "Abuja",
    value: "abuja"
  }
];

export const paymentMethods: PaymentMethod[] = [
  {
    title: "PayPal or Credit/Debit Cards",
    paymentName: "payPal",
    supportedCurrencies: ["USD", "GBP"],
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="31"
        height="19"
        viewBox="0 0 31 19"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.7084 16.4396C14.1433 17.7704 12.1131 18.5737 9.89462 18.5737C4.9445 18.5737 0.931641 14.5741 0.931641 9.64036C0.931641 4.70662 4.9445 0.707031 9.89462 0.707031C12.1131 0.707031 14.1433 1.51036 15.7084 2.84108C17.2736 1.51036 19.3038 0.707031 21.5222 0.707031C26.4724 0.707031 30.4852 4.70662 30.4852 9.64036C30.4852 14.5741 26.4724 18.5737 21.5222 18.5737C19.3038 18.5737 17.2736 17.7704 15.7084 16.4396Z"
          fill="#ED0006"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.708 16.4396C17.6352 14.8011 18.8572 12.363 18.8572 9.64036C18.8572 6.91775 17.6352 4.47961 15.708 2.84108C17.2731 1.51036 19.3034 0.707031 21.5218 0.707031C26.4719 0.707031 30.4848 4.70662 30.4848 9.64036C30.4848 14.5741 26.4719 18.5737 21.5218 18.5737C19.3034 18.5737 17.2731 17.7704 15.708 16.4396Z"
          fill="#F9A000"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.7078 16.4394C17.6349 14.8009 18.8569 12.3627 18.8569 9.64011C18.8569 6.9175 17.6349 4.47936 15.7078 2.84082C13.7806 4.47936 12.5586 6.9175 12.5586 9.64011C12.5586 12.3627 13.7806 14.8009 15.7078 16.4394Z"
          fill="#FF5E00"
        />
      </svg>
    ),
    info: "You don't need to own a Paypal account.",
    other: [
      {
        icon: (
          <svg
            width="74"
            height="32"
            viewBox="0 0 74 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="generic-icon small"
          >
            <g clipPath="url(#clip0_1186_55307)">
              <path
                d="M33.2411 26.0464H28.1136L31.3182 6.35191H36.4463L33.2411 26.0464ZM23.8001 6.35191L18.9117 19.8979L18.3333 16.9809L18.3338 16.982L16.6085 8.12518C16.6085 8.12518 16.3999 6.35191 14.1762 6.35191H6.09483L6 6.68539C6 6.68539 8.47129 7.19956 11.3635 8.93647L15.8183 26.0469H21.1607L29.3185 6.35191H23.8001ZM64.1304 26.0464H68.8386L64.7337 6.35139H60.6118C58.7085 6.35139 58.2449 7.81909 58.2449 7.81909L50.5976 26.0464H55.9427L57.0116 23.121H63.5299L64.1304 26.0464ZM58.4883 19.0798L61.1824 11.7096L62.698 19.0798H58.4883ZM50.9985 11.088L51.7303 6.85871C51.7303 6.85871 49.4723 6 47.1185 6C44.574 6 38.5314 7.11211 38.5314 12.5199C38.5314 17.6079 45.6234 17.6711 45.6234 20.3436C45.6234 23.0162 39.2621 22.5373 37.1627 20.852L36.4004 25.2741C36.4004 25.2741 38.69 26.3862 42.188 26.3862C45.6871 26.3862 50.9658 24.5745 50.9658 19.6435C50.9658 14.5228 43.8101 14.0461 43.8101 11.8197C43.8106 9.59288 48.8043 9.87894 50.9985 11.088Z"
                fill="#2566AF"
              />
              <path
                d="M17.9158 16.5141L16.1905 7.65729C16.1905 7.65729 15.9819 5.88403 13.7582 5.88403H5.67686L5.58203 6.21751C5.58203 6.21751 9.46624 7.02248 13.1919 10.0385C16.7542 12.9212 17.9158 16.5141 17.9158 16.5141Z"
                fill="#E6A540"
              />
            </g>
            <defs>
              <clipPath id="clip0_1186_55307">
                <rect width="74" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )
      },
      {
        icon: (
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="generic-icon large"
          >
            <path
              d="M26.0726 12.6507C26.234 13.4014 26.214 14.312 26.0193 15.3854C25.2433 19.356 22.7166 21.34 18.442 21.34H17.8526C17.6286 21.34 17.434 21.4147 17.2606 21.5614C17.0926 21.708 16.9833 21.8987 16.942 22.1307L16.8873 22.3827L16.15 27.0214L16.122 27.2227C16.078 27.456 15.9686 27.644 15.7926 27.7907C15.6193 27.9387 15.422 28.012 15.1966 28.012H11.8326C11.6433 28.012 11.4966 27.9467 11.3913 27.812C11.2846 27.676 11.2446 27.5174 11.2713 27.328C11.3526 26.8307 11.4686 26.0774 11.6273 25.076C11.7833 24.076 11.902 23.324 11.9833 22.824C12.0646 22.324 12.1833 21.5734 12.346 20.5774C12.5073 19.58 12.6286 18.8307 12.7073 18.3307C12.7513 18 12.946 17.836 13.2846 17.836H15.0393C16.23 17.8534 17.282 17.76 18.206 17.5547C19.7686 17.2054 21.0513 16.5627 22.054 15.6227C22.9673 14.7734 23.658 13.6734 24.134 12.3254C24.35 11.6987 24.5033 11.1027 24.6033 10.5414C24.6113 10.4867 24.622 10.4534 24.6366 10.4427C24.6473 10.428 24.666 10.424 24.6833 10.428C24.6993 10.4334 24.726 10.4494 24.766 10.4747C25.4646 11.0054 25.9046 11.7294 26.0726 12.6507ZM23.7686 8.86937C23.7686 9.82537 23.5633 10.88 23.1486 12.0347C22.4326 14.1174 21.086 15.5254 19.0993 16.2587C18.0886 16.6174 16.9633 16.8027 15.7193 16.8254C15.7193 16.8334 15.318 16.8347 14.514 16.8347L13.31 16.8254C12.414 16.8254 11.8873 17.252 11.7273 18.1107C11.71 18.1814 11.33 20.5507 10.5873 25.216C10.5766 25.304 10.5233 25.352 10.426 25.352H6.47264C6.2753 25.352 6.1113 25.2787 5.98064 25.132C5.84997 24.9827 5.80063 24.8107 5.8273 24.612L8.93663 4.88537C8.9793 4.62537 9.1033 4.41337 9.30463 4.24137C9.50597 4.07204 9.73797 3.98804 9.99663 3.98804H18.0153C18.3193 3.98804 18.7553 4.0467 19.3206 4.1627C19.8913 4.2747 20.3886 4.42137 20.818 4.5907C21.7753 4.95604 22.506 5.50804 23.0113 6.24004C23.5166 6.97604 23.7686 7.84937 23.7686 8.86937Z"
              fill="#1C6DD0"
            />
          </svg>
        )
      }
    ]
  },
  {
    title: "Pay with Paystack",
    paymentName: "paystack",
    supportedCurrencies: ["NGN", "USD"],
    icon: (
      <svg
        width="13"
        height="19"
        viewBox="0 0 13 19"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="generic-icon large"
      >
        <path
          d="M11.1835 0H0.654771C0.301195 0 0 0.447668 0 0.992655V2.76386C0 3.30884 0.301195 3.75651 0.654771 3.75651H11.1835C11.5502 3.75651 11.8383 3.30884 11.8514 2.76386V1.01212C11.8514 0.447667 11.5502 0 11.1835 0ZM11.1835 9.82922H0.654771C0.484531 9.82922 0.31429 9.92654 0.196431 10.1212C0.0654771 10.3158 0 10.5494 0 10.8219V12.5931C0 13.1381 0.301195 13.5857 0.654771 13.5857H11.1835C11.5502 13.5857 11.8383 13.1575 11.8514 12.5931V10.8219C11.8383 10.2574 11.5502 9.82922 11.1835 9.82922ZM6.587 14.7341H0.654771C0.484531 14.7341 0.31429 14.8314 0.196431 15.026C0.0785726 15.2207 0 15.4543 0 15.7267V17.498C0 18.0429 0.301195 18.4906 0.654771 18.4906H6.5739C6.94058 18.4906 7.22867 18.0429 7.22867 17.5174V15.7462C7.24177 15.1623 6.95367 14.7146 6.587 14.7341ZM11.8514 4.90488H0.654771C0.484531 4.90488 0.31429 5.00219 0.196431 5.19683C0.0785726 5.39147 0 5.62504 0 5.89753V7.66874C0 8.21372 0.301195 8.66139 0.654771 8.66139H11.8383C12.2049 8.66139 12.493 8.21372 12.493 7.66874V5.89753C12.5061 5.35254 12.2049 4.92434 11.8514 4.90488Z"
          fill="#00C3F7"
        />
      </svg>
    ),
    info: "Credit/Debit Cards",
    other: [
      {
        icon: (
          <svg
            width="74"
            height="32"
            viewBox="0 0 74 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="generic-icon small"
          >
            <g clipPath="url(#clip0_1186_55307)">
              <path
                d="M33.2411 26.0464H28.1136L31.3182 6.35191H36.4463L33.2411 26.0464ZM23.8001 6.35191L18.9117 19.8979L18.3333 16.9809L18.3338 16.982L16.6085 8.12518C16.6085 8.12518 16.3999 6.35191 14.1762 6.35191H6.09483L6 6.68539C6 6.68539 8.47129 7.19956 11.3635 8.93647L15.8183 26.0469H21.1607L29.3185 6.35191H23.8001ZM64.1304 26.0464H68.8386L64.7337 6.35139H60.6118C58.7085 6.35139 58.2449 7.81909 58.2449 7.81909L50.5976 26.0464H55.9427L57.0116 23.121H63.5299L64.1304 26.0464ZM58.4883 19.0798L61.1824 11.7096L62.698 19.0798H58.4883ZM50.9985 11.088L51.7303 6.85871C51.7303 6.85871 49.4723 6 47.1185 6C44.574 6 38.5314 7.11211 38.5314 12.5199C38.5314 17.6079 45.6234 17.6711 45.6234 20.3436C45.6234 23.0162 39.2621 22.5373 37.1627 20.852L36.4004 25.2741C36.4004 25.2741 38.69 26.3862 42.188 26.3862C45.6871 26.3862 50.9658 24.5745 50.9658 19.6435C50.9658 14.5228 43.8101 14.0461 43.8101 11.8197C43.8106 9.59288 48.8043 9.87894 50.9985 11.088Z"
                fill="#2566AF"
              />
              <path
                d="M17.9158 16.5141L16.1905 7.65729C16.1905 7.65729 15.9819 5.88403 13.7582 5.88403H5.67686L5.58203 6.21751C5.58203 6.21751 9.46624 7.02248 13.1919 10.0385C16.7542 12.9212 17.9158 16.5141 17.9158 16.5141Z"
                fill="#E6A540"
              />
            </g>
            <defs>
              <clipPath id="clip0_1186_55307">
                <rect width="74" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )
      },
      {
        icon: (
          <svg
            width="42"
            height="32"
            viewBox="0 0 42 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="generic-icon small"
          >
            <g clipPath="url(#clip0_1186_55308)">
              <path
                d="M41.1734 30.8948V30.9788H41.2517C41.2664 30.9791 41.2809 30.9754 41.2937 30.9681C41.2988 30.9645 41.303 30.9597 41.3057 30.9541C41.3085 30.9485 41.3098 30.9423 41.3095 30.936C41.3098 30.9299 41.3084 30.9238 41.3057 30.9183C41.3029 30.9128 41.2988 30.9082 41.2937 30.9047C41.2811 30.8971 41.2665 30.8934 41.2517 30.894H41.1734V30.8948ZM41.2526 30.8354C41.2862 30.8334 41.3194 30.843 41.3467 30.8627C41.3576 30.8717 41.3663 30.8831 41.372 30.896C41.3777 30.9089 41.3803 30.9229 41.3796 30.9371C41.3801 30.9492 41.378 30.9613 41.3735 30.9726C41.3689 30.9838 41.362 30.994 41.3532 31.0024C41.3321 31.0206 41.3058 31.0316 41.278 31.0337L41.383 31.1534H41.3021L41.2055 31.0345H41.1743V31.1534H41.1066V30.8356H41.2536L41.2526 30.8354ZM41.2316 31.263C41.267 31.2633 41.3022 31.2562 41.3347 31.242C41.366 31.2285 41.3945 31.2092 41.4187 31.1851C41.4429 31.161 41.4622 31.1325 41.4756 31.1011C41.5032 31.0345 41.5032 30.9597 41.4756 30.8932C41.462 30.8619 41.4427 30.8334 41.4187 30.8092C41.3945 30.7851 41.366 30.7658 41.3347 30.7523C41.302 30.7388 41.2669 30.7321 41.2316 30.7325C41.1956 30.7322 41.16 30.7389 41.1266 30.7523C41.0945 30.7655 41.0654 30.7848 41.0407 30.8092C41.0035 30.8473 40.9784 30.8955 40.9685 30.9477C40.9585 31 40.9641 31.0541 40.9846 31.1032C40.9974 31.1347 41.0165 31.1633 41.0407 31.1872C41.0654 31.2115 41.0946 31.2308 41.1266 31.2441C41.1598 31.2582 41.1955 31.2654 41.2316 31.2651V31.263ZM41.2316 30.6561C41.3239 30.656 41.4125 30.6922 41.4783 30.7569C41.5101 30.7879 41.5353 30.825 41.5527 30.8659C41.5706 30.9078 41.5799 30.953 41.5799 30.9987C41.5799 31.0443 41.5706 31.0895 41.5527 31.1315C41.5349 31.1722 41.5097 31.2091 41.4783 31.2405C41.4461 31.2714 41.4086 31.2963 41.3677 31.314C41.3246 31.3323 41.2783 31.3416 41.2316 31.3413C41.1843 31.3416 41.1374 31.3324 41.0938 31.314C41.0524 31.2967 41.0145 31.2718 40.9823 31.2405C40.9509 31.208 40.9261 31.1698 40.909 31.1279C40.8911 31.086 40.8818 31.0408 40.8818 30.9951C40.8818 30.9495 40.8911 30.9043 40.909 30.8623C40.9264 30.8214 40.9516 30.7844 40.9834 30.7533C41.0152 30.7215 41.0531 30.6965 41.0949 30.6798C41.1385 30.6615 41.1853 30.6522 41.2326 30.6525L41.2316 30.6561ZM9.07638 29.429C9.07638 28.8232 9.47328 28.3255 10.122 28.3255C10.7419 28.3255 11.1602 28.8018 11.1602 29.429C11.1602 30.0563 10.7419 30.5326 10.122 30.5326C9.47328 30.5326 9.07638 30.0349 9.07638 29.429ZM11.8669 29.429V27.7049H11.1174V28.1249C10.8797 27.8146 10.5191 27.6199 10.0287 27.6199C9.06273 27.6199 8.30463 28.3776 8.30463 29.4299C8.30463 30.4822 9.06231 31.2399 10.0287 31.2399C10.5189 31.2399 10.8797 31.045 11.1174 30.7348V31.1534H11.866V29.429H11.8669ZM37.1912 29.429C37.1912 28.8232 37.5881 28.3255 38.237 28.3255C38.8575 28.3255 39.2752 28.8018 39.2752 29.429C39.2752 30.0563 38.8575 30.5326 38.237 30.5326C37.5883 30.5326 37.1912 30.0349 37.1912 29.429ZM39.9825 29.429V26.321H39.2324V28.1249C38.9947 27.8146 38.6341 27.6199 38.1437 27.6199C37.1777 27.6199 36.4196 28.3776 36.4196 29.4299C36.4196 30.4822 37.1773 31.2399 38.1437 31.2399C38.6341 31.2399 38.9947 31.045 39.2324 30.7348V31.1534H39.9825V29.429ZM21.169 28.29C21.652 28.29 21.9622 28.5928 22.0414 29.126H20.253C20.333 28.6283 20.6352 28.29 21.1692 28.29H21.169ZM21.1841 27.618C20.174 27.618 19.4674 28.353 19.4674 29.428C19.4674 30.524 20.2024 31.238 21.2343 31.238C21.7535 31.238 22.2289 31.1084 22.6472 30.755L22.2799 30.1995C21.991 30.4305 21.623 30.5601 21.2772 30.5601C20.7942 30.5601 20.3544 30.3365 20.2463 29.7159H22.8056C22.8129 29.6227 22.8205 29.5286 22.8205 29.4278C22.8129 28.3532 22.1485 27.6178 21.1837 27.6178L21.1841 27.618ZM30.2326 29.4278C30.2326 28.8219 30.6295 28.3242 31.2782 28.3242C31.8981 28.3242 32.3165 28.8005 32.3165 29.4278C32.3165 30.0551 31.8981 30.5313 31.2782 30.5313C30.6295 30.5313 30.2324 30.0336 30.2324 29.4278H30.2326ZM33.0229 29.4278V27.7049H32.2738V28.1249C32.0353 27.8146 31.6755 27.6199 31.1852 27.6199C30.2192 27.6199 29.4611 28.3776 29.4611 29.4299C29.4611 30.4822 30.2188 31.2399 31.1852 31.2399C31.6755 31.2399 32.0353 31.045 32.2738 30.7348V31.1534H33.0231V29.429L33.0229 29.4278ZM26.0001 29.4278C26.0001 30.4734 26.7279 31.2378 27.8388 31.2378C28.358 31.2378 28.7038 31.1223 29.0778 30.8268L28.7179 30.221C28.4365 30.4232 28.141 30.5313 27.8149 30.5313C27.2166 30.524 26.7766 30.0914 26.7766 29.4278C26.7766 28.7642 27.2166 28.3318 27.8149 28.3242C28.1402 28.3242 28.4356 28.4324 28.7179 28.6346L29.0778 28.0288C28.7032 27.7333 28.3573 27.6178 27.8388 27.6178C26.7279 27.6178 26.0001 28.382 26.0001 29.4278ZM35.6622 27.6178C35.2298 27.6178 34.9482 27.82 34.7535 28.1228V27.7049H34.0107V31.1515H34.7611V29.2195C34.7611 28.6491 35.0061 28.3322 35.4961 28.3322C35.6565 28.3299 35.8158 28.3594 35.9648 28.4189L36.1958 27.7125C36.0299 27.6472 35.8136 27.6184 35.6618 27.6184L35.6622 27.6178ZM15.5723 27.979C15.2117 27.7413 14.7149 27.6184 14.1668 27.6184C13.2936 27.6184 12.7314 28.037 12.7314 28.7218C12.7314 29.2837 13.15 29.6304 13.9207 29.7386L14.2747 29.789C14.6857 29.8467 14.8797 29.9549 14.8797 30.1496C14.8797 30.416 14.6067 30.5681 14.0941 30.5681C13.575 30.5681 13.2004 30.4022 12.9477 30.2075L12.5956 30.7919C13.0065 31.0948 13.5257 31.2392 14.0878 31.2392C15.0832 31.2392 15.6601 30.7705 15.6601 30.1143C15.6601 29.5084 15.2061 29.1915 14.456 29.0834L14.1027 29.0321C13.7783 28.9901 13.5183 28.9248 13.5183 28.6938C13.5183 28.4418 13.7634 28.2902 14.1746 28.2902C14.6145 28.2902 15.0404 28.4561 15.2491 28.5857L15.5736 27.9798L15.5723 27.979ZM25.243 27.6191C24.8106 27.6191 24.529 27.8213 24.3352 28.1241V27.7049H23.5924V31.1515H24.3419V29.2195C24.3419 28.6491 24.587 28.3322 25.0769 28.3322C25.2373 28.3299 25.3967 28.3594 25.5456 28.4189L25.7766 27.7125C25.6107 27.6472 25.3944 27.6184 25.2426 27.6184L25.243 27.6191ZM18.8473 27.7049H17.6217V26.6594H16.864V27.7049H16.1649V28.39H16.864V29.9622C16.864 30.7619 17.1744 31.2382 18.061 31.2382C18.3863 31.2382 18.761 31.1374 18.9987 30.9717L18.7822 30.3299C18.5585 30.4595 18.3134 30.5248 18.1186 30.5248C17.7439 30.5248 17.6217 30.2938 17.6217 29.948V28.3906H18.8473V27.7049ZM7.64187 31.1523V28.9893C7.64187 28.1747 7.12275 27.6266 6.2859 27.6193C5.84595 27.6119 5.39214 27.7488 5.07441 28.2325C4.83669 27.8503 4.46205 27.6193 3.93537 27.6193C3.56724 27.6193 3.20751 27.7274 2.9259 28.131V27.7049H2.17578V31.1515H2.93178V29.2405C2.93178 28.6422 3.26358 28.3242 3.77598 28.3242C4.27368 28.3242 4.52547 28.6487 4.52547 29.2329V31.151H5.28315V29.24C5.28315 28.6418 5.62902 28.3238 6.12651 28.3238C6.63828 28.3238 6.88251 28.6483 6.88251 29.2325V31.1506L7.64187 31.1523Z"
                fill="#231F20"
              />
              <path
                d="M41.5997 20.6876V20.1836H41.4685L41.3167 20.5295L41.1657 20.1836H41.034V20.6876H41.1272V20.3079L41.2692 20.6355H41.3658L41.5078 20.3071V20.6876H41.6002H41.5997ZM40.7671 20.6876V20.2699H40.9351V20.1849H40.5059V20.2699H40.6739V20.6876H40.7663H40.7671Z"
                fill="#F79410"
              />
              <path
                d="M26.6823 22.849H15.3242V2.43701H26.6825L26.6823 22.849Z"
                fill="#FF5F00"
              />
              <path
                d="M16.044 12.6434C16.044 8.50288 17.9827 4.81444 21.0017 2.43745C18.7165 0.635538 15.89 -0.342421 12.9799 -0.338121C5.81112 -0.338121 0 5.47384 0 12.6434C0 19.8131 5.81112 25.625 12.9799 25.625C15.8901 25.6294 18.7166 24.6514 21.0019 22.8495C17.9831 20.4729 16.044 16.7842 16.044 12.6434Z"
                fill="#EB001B"
              />
              <path
                d="M42.0049 12.6434C42.0049 19.8131 36.1938 25.625 29.025 25.625C26.1145 25.6293 23.2876 24.6514 21.002 22.8495C24.0218 20.4725 25.9605 16.7842 25.9605 12.6434C25.9605 8.50267 24.0218 4.81444 21.002 2.43745C23.2876 0.635592 26.1143 -0.342345 29.0248 -0.338121C36.1936 -0.338121 42.0047 5.47384 42.0047 12.6434"
                fill="#F79E1B"
              />
            </g>
            <defs>
              <clipPath id="clip0_1186_55308">
                <rect width="42" height="32" fill="white" />
              </clipPath>
            </defs>
          </svg>
        )
      }
    ]
  },

  {
    title: "Manual Transfer",
    paymentName: "gtbTransfer",
    supportedCurrencies: ["NGN"],
    icon: (
      <img src="/icons/gtbank.svg" className="generic-icon large" alt="gtb" />
    ),
    info: "Transfer Naira to GTB Bank"
  },
  {
    title: "Manual Transfer",
    paymentName: "bitcoinAddress",
    supportedCurrencies: ["USD"],
    icon: (
      <img
        src="/icons/bitcoin-gold.svg"
        className="generic-icon large"
        alt="bitcoin"
      />
    ),
    info: "Transfer Bitcoins (USD)"
  },
  {
    title: "Manual Transfer",
    paymentName: "natwestTransfer",
    supportedCurrencies: ["GBP"],
    icon: (
      <img
        src="/icons/natwest.svg"
        className="generic-icon large"
        alt="natwest"
      />
    ),
    info: "Transfer Pounds to Natwest Bank"
  }
];

export const gtbTransfer = {
  bankName: "Guaranty Trust Bank (or GTBank)",
  accountNumber: "0812257604",
  accountName: "FLORAL SERVICES & EVENTS HUB LTD"
};

export const bitcoinAddress = "1NQfzJGzXSn5B5xqT4mfw48KpaoA4Ajmwy";

export const countryCodes = [
  {
    value: "+234",
    label: "Nigeria"
  },
  {
    value: "+44",
    label: "United Kingdom"
  },
  {
    value: "+1",
    label: "United States"
  },
  {
    value: "+1",
    label: "Canada"
  },
  {
    value: "+7 840",
    label: "Abkhazia"
  },
  {
    value: "+93",
    label: "Afghanistan"
  },
  {
    value: "+355",
    label: "Albania"
  },
  {
    value: "+213",
    label: "Algeria"
  },
  {
    value: "+1 684",
    label: "American Samoa"
  },
  {
    value: "+376",
    label: "Andorra"
  },
  {
    value: "+244",
    label: "Angola"
  },
  {
    value: "+1 264",
    label: "Anguilla"
  },
  {
    value: "+1 268",
    label: "Antigua and Barbuda"
  },
  {
    value: "+54",
    label: "Argentina"
  },
  {
    value: "+374",
    label: "Armenia"
  },
  {
    value: "+297",
    label: "Aruba"
  },
  {
    value: "+247",
    label: "Ascension"
  },
  {
    value: "+61",
    label: "Australia"
  },
  {
    value: "+672",
    label: "Australian External Territories"
  },
  {
    value: "+43",
    label: "Austria"
  },
  {
    value: "+994",
    label: "Azerbaijan"
  },
  {
    value: "+1 242",
    label: "Bahamas"
  },
  {
    value: "+973",
    label: "Bahrain"
  },
  {
    value: "+880",
    label: "Bangladesh"
  },
  {
    value: "+1 246",
    label: "Barbados"
  },
  {
    value: "+1 268",
    label: "Barbuda"
  },
  {
    value: "+375",
    label: "Belarus"
  },
  {
    value: "+32",
    label: "Belgium"
  },
  {
    value: "+501",
    label: "Belize"
  },
  {
    value: "+229",
    label: "Benin"
  },
  {
    value: "+1 441",
    label: "Bermuda"
  },
  {
    value: "+975",
    label: "Bhutan"
  },
  {
    value: "+591",
    label: "Bolivia"
  },
  {
    value: "+387",
    label: "Bosnia and Herzegovina"
  },
  {
    value: "+267",
    label: "Botswana"
  },
  {
    value: "+55",
    label: "Brazil"
  },
  {
    value: "+246",
    label: "British Indian Ocean Territory"
  },
  {
    value: "+1 284",
    label: "British Virgin Islands"
  },
  {
    value: "+673",
    label: "Brunei"
  },
  {
    value: "+359",
    label: "Bulgaria"
  },
  {
    value: "+226",
    label: "Burkina Faso"
  },
  {
    value: "+257",
    label: "Burundi"
  },
  {
    value: "+855",
    label: "Cambodia"
  },
  {
    value: "+237",
    label: "Cameroon"
  },

  {
    value: "+238",
    label: "Cape Verde"
  },
  {
    value: "+ 345",
    label: "Cayman Islands"
  },
  {
    value: "+236",
    label: "Central African Republic"
  },
  {
    value: "+235",
    label: "Chad"
  },
  {
    value: "+56",
    label: "Chile"
  },
  {
    value: "+86",
    label: "China"
  },
  {
    value: "+61",
    label: "Christmas Island"
  },
  {
    value: "+61",
    label: "Cocos-Keeling Islands"
  },
  {
    value: "+57",
    label: "Colombia"
  },
  {
    value: "+269",
    label: "Comoros"
  },
  {
    value: "+242",
    label: "Congo"
  },
  {
    value: "+243",
    label: "Congo, Dem. Rep. of (Zaire)"
  },
  {
    value: "+682",
    label: "Cook Islands"
  },
  {
    value: "+506",
    label: "Costa Rica"
  },
  {
    value: "+385",
    label: "Croatia"
  },
  {
    value: "+53",
    label: "Cuba"
  },
  {
    value: "+599",
    label: "Curacao"
  },
  {
    value: "+537",
    label: "Cyprus"
  },
  {
    value: "+420",
    label: "Czech Republic"
  },
  {
    value: "+45",
    label: "Denmark"
  },
  {
    value: "+246",
    label: "Diego Garcia"
  },
  {
    value: "+253",
    label: "Djibouti"
  },
  {
    value: "+1 767",
    label: "Dominica"
  },
  {
    value: "+1 809",
    label: "Dominican Republic"
  },
  {
    value: "+670",
    label: "East Timor"
  },
  {
    value: "+56",
    label: "Easter Island"
  },
  {
    value: "+593",
    label: "Ecuador"
  },
  {
    value: "+20",
    label: "Egypt"
  },
  {
    value: "+503",
    label: "El Salvador"
  },
  {
    value: "+240",
    label: "Equatorial Guinea"
  },
  {
    value: "+291",
    label: "Eritrea"
  },
  {
    value: "+372",
    label: "Estonia"
  },
  {
    value: "+251",
    label: "Ethiopia"
  },
  {
    value: "+500",
    label: "Falkland Islands"
  },
  {
    value: "+298",
    label: "Faroe Islands"
  },
  {
    value: "+679",
    label: "Fiji"
  },
  {
    value: "+358",
    label: "Finland"
  },
  {
    value: "+33",
    label: "France"
  },
  {
    value: "+596",
    label: "French Antilles"
  },
  {
    value: "+594",
    label: "French Guiana"
  },
  {
    value: "+689",
    label: "French Polynesia"
  },
  {
    value: "+241",
    label: "Gabon"
  },
  {
    value: "+220",
    label: "Gambia"
  },
  {
    value: "+995",
    label: "Georgia"
  },
  {
    value: "+49",
    label: "Germany"
  },
  {
    value: "+233",
    label: "Ghana"
  },
  {
    value: "+350",
    label: "Gibraltar"
  },
  {
    value: "+30",
    label: "Greece"
  },
  {
    value: "+299",
    label: "Greenland"
  },
  {
    value: "+1 473",
    label: "Grenada"
  },
  {
    value: "+590",
    label: "Guadeloupe"
  },
  {
    value: "+1 671",
    label: "Guam"
  },
  {
    value: "+502",
    label: "Guatemala"
  },
  {
    value: "+224",
    label: "Guinea"
  },
  {
    value: "+245",
    label: "Guinea-Bissau"
  },
  {
    value: "+595",
    label: "Guyana"
  },
  {
    value: "+509",
    label: "Haiti"
  },
  {
    value: "+504",
    label: "Honduras"
  },
  {
    value: "+852",
    label: "Hong Kong SAR China"
  },
  {
    value: "+36",
    label: "Hungary"
  },
  {
    value: "+354",
    label: "Iceland"
  },
  {
    value: "+91",
    label: "India"
  },
  {
    value: "+62",
    label: "Indonesia"
  },
  {
    value: "+98",
    label: "Iran"
  },
  {
    value: "+964",
    label: "Iraq"
  },
  {
    value: "+353",
    label: "Ireland"
  },
  {
    value: "+972",
    label: "Israel"
  },
  {
    value: "+39",
    label: "Italy"
  },
  {
    value: "+225",
    label: "Ivory Coast"
  },
  {
    value: "+1 876",
    label: "Jamaica"
  },
  {
    value: "+81",
    label: "Japan"
  },
  {
    value: "+962",
    label: "Jordan"
  },
  {
    value: "+7 7",
    label: "Kazakhstan"
  },
  {
    value: "+254",
    label: "Kenya"
  },
  {
    value: "+686",
    label: "Kiribati"
  },
  {
    value: "+965",
    label: "Kuwait"
  },
  {
    value: "+996",
    label: "Kyrgyzstan"
  },
  {
    value: "+856",
    label: "Laos"
  },
  {
    value: "+371",
    label: "Latvia"
  },
  {
    value: "+961",
    label: "Lebanon"
  },
  {
    value: "+266",
    label: "Lesotho"
  },
  {
    value: "+231",
    label: "Liberia"
  },
  {
    value: "+218",
    label: "Libya"
  },
  {
    value: "+423",
    label: "Liechtenstein"
  },
  {
    value: "+370",
    label: "Lithuania"
  },
  {
    value: "+352",
    label: "Luxembourg"
  },
  {
    value: "+853",
    label: "Macau SAR China"
  },
  {
    value: "+389",
    label: "Macedonia"
  },
  {
    value: "+261",
    label: "Madagascar"
  },
  {
    value: "+265",
    label: "Malawi"
  },
  {
    value: "+60",
    label: "Malaysia"
  },
  {
    value: "+960",
    label: "Maldives"
  },
  {
    value: "+223",
    label: "Mali"
  },
  {
    value: "+356",
    label: "Malta"
  },
  {
    value: "+692",
    label: "Marshall Islands"
  },
  {
    value: "+596",
    label: "Martinique"
  },
  {
    value: "+222",
    label: "Mauritania"
  },
  {
    value: "+230",
    label: "Mauritius"
  },
  {
    value: "+262",
    label: "Mayotte"
  },
  {
    value: "+52",
    label: "Mexico"
  },
  {
    value: "+691",
    label: "Micronesia"
  },
  {
    value: "+1 808",
    label: "Midway Island"
  },
  {
    value: "+373",
    label: "Moldova"
  },
  {
    value: "+377",
    label: "Monaco"
  },
  {
    value: "+976",
    label: "Mongolia"
  },
  {
    value: "+382",
    label: "Montenegro"
  },
  {
    value: "+1664",
    label: "Montserrat"
  },
  {
    value: "+212",
    label: "Morocco"
  },
  {
    value: "+95",
    label: "Myanmar"
  },
  {
    value: "+264",
    label: "Namibia"
  },
  {
    value: "+674",
    label: "Nauru"
  },
  {
    value: "+977",
    label: "Nepal"
  },
  {
    value: "+31",
    label: "Netherlands"
  },
  {
    value: "+599",
    label: "Netherlands Antilles"
  },
  {
    value: "+1 869",
    label: "Nevis"
  },
  {
    value: "+687",
    label: "New Caledonia"
  },
  {
    value: "+64",
    label: "New Zealand"
  },
  {
    value: "+505",
    label: "Nicaragua"
  },
  {
    value: "+227",
    label: "Niger"
  },

  {
    value: "+683",
    label: "Niue"
  },
  {
    value: "+672",
    label: "Norfolk Island"
  },
  {
    value: "+850",
    label: "North Korea"
  },
  {
    value: "+1 670",
    label: "Northern Mariana Islands"
  },
  {
    value: "+47",
    label: "Norway"
  },
  {
    value: "+968",
    label: "Oman"
  },
  {
    value: "+92",
    label: "Pakistan"
  },
  {
    value: "+680",
    label: "Palau"
  },
  {
    value: "+970",
    label: "Palestinian Territory"
  },
  {
    value: "+507",
    label: "Panama"
  },
  {
    value: "+675",
    label: "Papua New Guinea"
  },
  {
    value: "+595",
    label: "Paraguay"
  },
  {
    value: "+51",
    label: "Peru"
  },
  {
    value: "+63",
    label: "Philippines"
  },
  {
    value: "+48",
    label: "Poland"
  },
  {
    value: "+351",
    label: "Portugal"
  },
  {
    value: "+1 787",
    label: "Puerto Rico"
  },
  {
    value: "+974",
    label: "Qatar"
  },
  {
    value: "+262",
    label: "Reunion"
  },
  {
    value: "+40",
    label: "Romania"
  },
  {
    value: "+7",
    label: "Russia"
  },
  {
    value: "+250",
    label: "Rwanda"
  },
  {
    value: "+685",
    label: "Samoa"
  },
  {
    value: "+378",
    label: "San Marino"
  },
  {
    value: "+966",
    label: "Saudi Arabia"
  },
  {
    value: "+221",
    label: "Senegal"
  },
  {
    value: "+381",
    label: "Serbia"
  },
  {
    value: "+248",
    label: "Seychelles"
  },
  {
    value: "+232",
    label: "Sierra Leone"
  },
  {
    value: "+65",
    label: "Singapore"
  },
  {
    value: "+421",
    label: "Slovakia"
  },
  {
    value: "+386",
    label: "Slovenia"
  },
  {
    value: "+677",
    label: "Solomon Islands"
  },
  {
    value: "+27",
    label: "South Africa"
  },
  {
    value: "+500",
    label: "South Georgia and the South Sandwich Islands"
  },
  {
    value: "+82",
    label: "South Korea"
  },
  {
    value: "+34",
    label: "Spain"
  },
  {
    value: "+94",
    label: "Sri Lanka"
  },
  {
    value: "+249",
    label: "Sudan"
  },
  {
    value: "+597",
    label: "Suriname"
  },
  {
    value: "+268",
    label: "Swaziland"
  },
  {
    value: "+46",
    label: "Sweden"
  },
  {
    value: "+41",
    label: "Switzerland"
  },
  {
    value: "+963",
    label: "Syria"
  },
  {
    value: "+886",
    label: "Taiwan"
  },
  {
    value: "+992",
    label: "Tajikistan"
  },
  {
    value: "+255",
    label: "Tanzania"
  },
  {
    value: "+66",
    label: "Thailand"
  },
  {
    value: "+670",
    label: "Timor Leste"
  },
  {
    value: "+228",
    label: "Togo"
  },
  {
    value: "+690",
    label: "Tokelau"
  },
  {
    value: "+676",
    label: "Tonga"
  },
  {
    value: "+1 868",
    label: "Trinidad and Tobago"
  },
  {
    value: "+216",
    label: "Tunisia"
  },
  {
    value: "+90",
    label: "Turkey"
  },
  {
    value: "+993",
    label: "Turkmenistan"
  },
  {
    value: "+1 649",
    label: "Turks and Caicos Islands"
  },
  {
    value: "+688",
    label: "Tuvalu"
  },
  {
    value: "+1 340",
    label: "U.S. Virgin Islands"
  },
  {
    value: "+256",
    label: "Uganda"
  },
  {
    value: "+380",
    label: "Ukraine"
  },
  {
    value: "+971",
    label: "United Arab Emirates"
  },

  {
    value: "+598",
    label: "Uruguay"
  },
  {
    value: "+998",
    label: "Uzbekistan"
  },
  {
    value: "+678",
    label: "Vanuatu"
  },
  {
    value: "+58",
    label: "Venezuela"
  },
  {
    value: "+84",
    label: "Vietnam"
  },
  {
    value: "+1 808",
    label: "Wake Island"
  },
  {
    value: "+681",
    label: "Wallis and Futuna"
  },
  {
    value: "+967",
    label: "Yemen"
  },
  {
    value: "+260",
    label: "Zambia"
  },
  {
    value: "+255",
    label: "Zanzibar"
  },
  {
    value: "+263",
    label: "Zimbabwe"
  }
];

export const gifts: { title: string; url: string; category?: string }[] = [
  {
    title: "Chocolates and Biscuits",
    url: "/product-category/chocolates-and-biscuits",
    category: "Chocolates and Biscuits"
  },
  {
    title: "Cakes and Cupcakes",
    url: "/product-category/cakes-and-cupcakes",
    category: "Cakes and Cupcakes"
  },
  {
    title: "Teddy Bears",
    url: "/product-category/teddy-bears",
    category: "Teddy Bears"
  },
  {
    title: "Balloons",
    url: "/product-category/balloons",
    category: "Balloons"
  },
  {
    title: "Wine and Champagne",
    url: "/product-category/wine-and-champagne",
    category: "Wine and Champagne"
  },
  {
    title: "Perfumes",
    url: "/product-category/perfumes-eau-de-toilette-cologne-and-parfums",
    category: "perfumes"
  },
  {
    title: "Giftsets",
    url: "/product-category/gift-packs ",
    category: "Giftsets"
  },
  {
    title: "Scented Candles",
    url: "/product-category/scented-candles",
    category: "Scented Candles"
  }
];

export const occasionsPageTitle: Record<string, string> = {
  "anniversary-flowers": "Love, Birthdays & Anniversary Flowers",
  "flowers-to-say-thanks-sorry-etc": "Just to Say Flowers",
  "bridal-bouquets": "Bridal Bouquets & Accessories Flowers",
  "funeral-and-condolence": "Funeral & Condolence Flowers",
  all: "All Occasions Flowers",
  "cascading-bridal-bouquets": "Cascading Bouquets & Accessories Flowers",
  "accessories-boutonnieres-bridesmaids-flowers-amp-corsages":
    "Accessories & Boutonnieres Flowers",
  "indoor-plants-and-cactus": "Plants",
  vip: "VIP Flower Arrangements",
  "chocolates-and-biscuits": "Chocolates and Biscuits",
  "cakes-and-cupcakes": "Cakes and Cupcakes",
  "teddy-bears": "Teddy Bears",
  balloons: "Balloons",
  "wine-and-champagne": "Wine and Champagne",
  "perfumes-eau-de-toilette-cologne-and-parfums": "Perfumes",
  "gift-packs": "Giftsets",
  "scented-candles": "Scented Candles",
  roses: "Roses",
  chrysanthemums: "Chrysanthemums",
  lilies: "Lilies",
  "million-stars": "Million Stars",
  "forever-roses-preserved-roses": "Forever Roses"
};

export const occasions: { title: string; url: string; category?: string }[] = [
  {
    title: "Love, Birthdays & Anniversary",
    url: "/product-category/anniversary-flowers",
    category: "Anniversary Flowers"
  },
  {
    title: "Just to Say",
    url: "/product-category/flowers-to-say-thanks-sorry-etc",
    category: "Just to Say Bouquets"
  },
  {
    title: "Bridal Bouquets & Accessories",
    url: "/product-category/bridal-bouquets",
    category:
      "Birthday Flowers, Anniversary Flowers, Love %26amp; Romance flowers, Valentine Flowers, Mother's Day Flowers"
  },
  {
    title: "Funeral & Condolence",
    url: "/product-category/funeral-and-condolence",
    category: "Funeral %26amp; Condolence"
  },
  {
    title: "All Occasions",
    url: "/product-category/all"
  }
];

export const placeholderEmail = "placeholder@floralhub.com";

export interface Filter {
  name: string;
  options: FilterOption[];
  limit: number;
  viewMore?: boolean;
}

export interface FilterOption {
  name: string;
  category?: string;
  tag?: string;
  link?: string;
}

export const bridalOccasionFilters: Filter[] = [
  {
    name: "Bridal Section",
    options: [
      {
        name: "Bridal Bouquets",
        tag: "bridal bouquets",
        link: "/product-category/bridal-bouquets"
      },
      {
        name: "Cascading Bridal Bouquets",
        tag: "cascading bridal bouquets",
        link: "/product-category/cascading-bridal-bouquets"
      },
      {
        name: "Accessories & Boutonnieres",
        tag: "bridal accessories",
        link:
          "/product-category/accessories-boutonnieres-bridesmaids-flowers-corsages"
      }
    ],
    limit: 3
  }
];

export const funeralOccasion: Filter[] = [
  {
    name: "Funeral & Condolence",
    options: [
      {
        name: "Wreaths & Flowers",
        tag: "",
        link: "/product-category/funeral-and-condolence"
      },
      {
        name: "VIP Section",
        tag: "",
        link: "/vip-flowers"
      }
    ],
    limit: 3
  }
];

export const filtersCatgories: Filter[] = [
  {
    name: "Budget",
    options: [
      {
        name: "Regular",
        tag: "regular"
      }
    ],
    limit: 2,
    viewMore: false
  },
  {
    name: "Flower Type",
    options: [
      {
        name: "Fresh Flowers",
        tag: "fresh flowers"
      },
      {
        name: "Forever Roses",
        tag: "forever roses"
      }
    ],
    limit: 3,
    viewMore: false
  },
  {
    name: "Design",
    options: [
      {
        name: "Wrapped Bouquets",
        tag: "wrapped bouquet"
      },
      {
        name: "Box Arrangements",
        tag: "box arrangements"
      },
      {
        name: "Others",
        tag: "others"
      }
    ],
    limit: 3
  },
  {
    name: "Packages",
    options: [
      {
        name: "Bundled Products",
        tag: "bundled products"
      }
    ],
    limit: 3,
    viewMore: true
  },
  {
    name: "Delivery",
    options: [
      {
        name: "Same Day Delivery",
        tag: "same day delivery"
      }
    ],
    limit: 3,
    viewMore: false
  },
  {
    name: "Flower Name",
    options: [
      {
        name: "Roses",
        tag: "roses"
      },
      {
        name: "Chrysanthemums",
        tag: "chrysanthemums"
      },
      {
        name: "Lilies",
        tag: "lilies"
      },
      {
        name: "Million Stars",
        tag: "million stars"
      }
    ],
    limit: 3,
    viewMore: false
  }
];

export const productSampleData = {
  id: 1,
  name: "A Kiss of Rose",
  addonsGroups: [
    {
      name: "Perfumes",
      image: "/images/addons/Rectangle133.png",
      description: "",
      slug: "#",
      addons: [
        {
          name: "5 Peas in a pod",
          price: 32999,
          image: "/images/addons/Rectangle131.png"
        },
        {
          name: "5 Peas in a pod",
          price: 36000,
          image: "/images/addons/Rectangle13.png"
        }
      ]
    },
    {
      name: "Teady Bears",
      image: "/images/addons/Rectangle133.png",
      description: "",
      slug: "#",
      addons: [
        {
          name: "5 Peas in a pod",
          price: 32999,
          image: "/images/addons/Rectangle131.png"
        },
        {
          name: "5 Peas in a pod",
          price: 36000,
          image: "/images/addons/Rectangle13.png"
        }
      ]
    }
  ],
  featured: true,
  images: [
    {
      alt: "flower1",
      src: "/images/sample-flowers/single-product.png",
      id: 1
    },
    {
      alt: "flower2",
      src: "/images/sample-flowers/single-product.png",
      id: 2
    },
    {
      alt: "flower3",
      src: "/images/sample-flowers/single-product.png",
      id: 3
    },
    {
      alt: "flower4",
      src: "/images/sample-flowers/single-product.png",
      id: 4
    }
  ],
  price: 70000,
  salePrice: 80000,
  sku: "u2i2093092",
  slug: "ejodei-iejeo-ooeoei",
  type: "variable",
  variants: [
    { name: "Small (15 Roses)", price: 75000, class: "regular" },
    { name: "Medium (20 Roses)", price: 90000, class: "vip" }
  ],
  productDescription:
    "A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors. A kiss from a rose is daintily presented single full stemmed rose, available in various colors.",
  title: "A Kiss of Rose",
  sizes: [
    "Entry (5 roses)",
    "Extra Small (10 roses)",
    "Small (15 roses)",
    "Medium (20 roses)",
    "Standard (24cm box)",
    "Standard Plus (27cm box)",
    "Standard Premium (30cm box)",
    "VIP Entry",
    "VIP Medium",
    "VIP Standard",
    "VIP Standard Premium",
    "VIP Large"
  ],
  designOptions: ["wrappedBouquet", "inVase", "inLargeVase", "box"],
  note:
    "Single stem rose only available for pickup, except as part of larger order.",
  description:
    "A kiss from a rose is daintily presented single full stemmed rose, available in various colors.",
  details: "5 Peas in a pod"
};

export const links: AppLink[] = [
  {
    url: "",
    title: "Occasions",
    subtitle: "Select Occasion",
    children: [
      {
        title: "Birthday Flowers",
        url: "",
        children: [
          {
            title: "Flowers",
            url: "/product-category/birthday-flowers",
            children: []
          },
          {
            title: "VIP Flowers",
            url: "/vip-flowers",
            children: []
          },
          {
            title: "Gifts",
            url: "/product-category/gifts",
            children: []
          }
        ]
      },

      {
        title: "Flowers for Romance, Sorry, Thanks, Get Well Soon etc",
        url: "",
        children: [
          {
            title: "Flowers",
            url: "/product-category/flowers-to-say-thanks-sorry-etc",
            children: []
          },
          {
            title: "VIP Flowers",
            url: "/vip-flowers",
            children: []
          },
          {
            title: "Gifts",
            url: "/product-category/gifts",
            children: []
          }
        ]
      },
      {
        title: "Anniversary Flowers",
        url: "",
        children: [
          {
            title: "Flowers",
            url: "/product-category/anniversary-flowers",
            children: []
          },
          {
            title: "VIP Flowers",
            url: "/vip-flowers",
            children: []
          },
          {
            title: "Gifts",
            url: "/product-category/gifts",
            children: []
          }
        ]
      },
      {
        title: "Bridal",
        url: "",
        children: [
          {
            title: "Bridal Bouquets",
            url: "/product-category/bridal-bouquets",
            children: []
          },
          {
            title: "Cascading Bridal Bouquets",
            url: "/product-category/cascading-bridal-bouquets",
            children: []
          },
          {
            title: "Accessories & Boutonnieres",
            url:
              "/product-category/accessories-boutonnieres-bridesmaids-flowers-amp-corsages",
            children: []
          }
        ]
      },
      {
        title: "Funeral & Condolence",
        url: "",
        children: [
          {
            title: "Wreaths & Flowers",
            url: "/product-category/funeral-condolence-flowers",
            children: []
          },
          {
            title: "VIP Flowers",
            url: "/vip-flowers",
            children: []
          }
        ]
      },

      {
        title: "Others",
        url: "",
        children: [
          {
            title: "Events & Centerpiece",
            url: "/product-category/event-centerpiece",
            children: []
          },
          {
            url: "/product-category/indoor-plants-and-cactus",
            title: "Plants",
            children: []
          },
          {
            title: "Father's Day",
            url: "/product-category/flowers-to-say-thanks-sorry-etc",
            children: []
          },
          {
            title: "Mother's Day",
            url: "/product-category/flowers-to-say-thanks-sorry-etc",
            children: []
          },
          {
            title: "Valentine's Day",
            url: "/product-category/valentines-day-flowers",
            children: []
          }
        ]
      }
    ],
    featuredSlugs: ["allure-bouquet-of-red-roses"]
  },
  {
    url: "",
    title: "Shop By",
    children: [
      {
        title: "Design",
        url: "",
        children: [
          {
            title: "Wrapped Bouquets",
            url: "/filters?shopBy=wrapped bouquet",
            children: []
          },
          {
            title: "Box Arrangements",
            url: "/filters?shopBy=box+arrangements",
            children: []
          },
          {
            title: "Others",
            url: "/filters?shopBy=others",
            children: []
          }
        ]
      },
      {
        title: "Flower Types",
        url: "",
        children: [
          {
            title: "Fresh Flowers",
            url: "/filters?shopBy=fresh+flowers",
            children: []
          },
          {
            title: "Forever Roses",
            url: "/product-category/forever-roses-preserved-roses",
            children: []
          }
        ]
      },
      {
        title: "Packages",
        url: "",
        children: [
          {
            title: "View Bundled Products",
            url: "/product-category/product-packages",
            children: []
          }
        ]
      },
      {
        title: "Delivery",
        url: "",
        children: [
          {
            title: "Same Day Delivery",
            url: "/filters?shopBy=same+day+delivery",
            children: []
          }
        ]
      },
      {
        title: "Flower Name",
        url: "",
        children: [
          {
            title: "Roses",
            url: "/product-category/roses",
            children: []
          },
          {
            title: "Chrysanthemums",
            url: "/product-category/chrysanthemums",
            children: []
          },
          {
            title: "Lilies",
            url: "/product-category/lilies",
            children: []
          },
          {
            title: "Million Stars",
            url: "/product-category/million-stars",
            children: []
          },
          {
            title: "Gerbera",
            url: "/product-category/gerbera-flowers",
            children: []
          },
          {
            title: "Carnations",
            url: "/product-category/carnations",
            children: []
          },
          {
            title: "See All",
            url: "/product-category/all",
            children: []
          }
        ]
      }
    ],
    featuredSlugs: [
      "purity-classy-mix-of-white-roses-with-million-stars",
      "classic-red-roses-luxurious-bouquet-of-red-roses"
    ]
  },
  {
    url: "/vip-flowers",
    title: "VIP Flowers",
    children: []
  },

  {
    url: "",
    title: "Gifts",
    children: [
      {
        url: "/product-category/chocolates-and-biscuits",
        title: "Chocolates and Biscuits",
        children: []
      },
      {
        url: "/product-category/cakes-and-cupcakes",
        title: "Cakes and Cupcakes",
        children: []
      },
      {
        url: "/product-category/teddy-bears",
        title: "Teddy Bears",
        children: []
      },
      {
        url: "/product-category/balloons",
        title: "Balloons",
        children: []
      },
      {
        url: "/product-category/wine-and-champagne",
        title: "Wine and Champagne",
        children: []
      },
      {
        url: "/product-category/perfumes",
        title: "Perfumes",
        children: []
      },
      {
        url: "/product-category/gift-sets",
        title: "Giftsets",
        children: []
      },
      {
        url: "/product-category/scented-candles",
        title: "Scented Candles",
        children: []
      }
    ],
    featuredSlugs: [
      "balloons",
      "caravaggio-assorted-italian-unisex-gift-set-more"
    ]
  },
  {
    url: "/product-category/indoor-plants-and-cactus",
    title: "Plants",
    children: []
  },
  {
    title: "FAQ",
    url: "/faq-how-to-buy-fresh-flowers-and-gifts-in-lagos-and-abuja",
    children: []
  },
  {
    title: "Contact",
    url: "/contact",
    children: []
  }
];

export const paypalEmail = "payments@floralhub.com.ng";

export const tagsMap: Record<string, string[]> = {
  budget: ["vip", "regular"],
  flowerType: ["forever roses", "fresh flowers"],
  design: ["box arrangements", "bouquets", "others", "wrapped bouquet"],
  packages: ["bundled products"],
  delivery: ["same day delivery"],
  flowerName: ["roses", "chrysanthemums", "lilies", "million stars"]
};

type RegalContent<T = string> = Record<LocationName, T>;

export const locationHeadlines: RegalContent = {
  general:
    "They Deserve Floral Hub Flowers. Premium Same Day Flower Delivery in Lagos & Abuja, Nigeria",
  lagos:
    "Make it Regal. Premium Online and Walk-in Flower Shop in Lagos and Abuja, Nigeria",
  abuja:
    "Make Their Day. Send Flowers and Gifts to Someone in Abuja or Lagos, Nigeria Today",
  "other-locations":
    "Send Floral Hub Flowers and Gifts to Other Selected Locations in Nigeria"
};

export const bestSellers: RegalContent = {
  general: "Bestselling Birthday & Anniversary Flowers in Lagos & Abuja",
  lagos: "Bestselling Flowers in Lagos",
  abuja: "Bestselling Flowers in Abuja",
  "other-locations": "Bestselling Flowers in Ibadan, Port Harcourt etc"
};

export const bestSellersValentine = "Bestselling Valentine's Day Flowers";

export const bestSellersOccasion = "Bestselling Mother's Day Flowers";

export const bestSellersRomance: RegalContent = {
  general: "Bestselling Romance or Just to Say Flowers in Lagos & Abuja",
  lagos: "Bestselling Flowers in Lagos",
  abuja: "Bestselling Flowers in Abuja",
  "other-locations": "Bestselling Flowers in Ibadan, Port Harcourt etc"
};

export const featuredSlugs: Record<string, string[]> = {
  "featured-birthday": [
    "allure-bouquet-of-red-roses",
    "numero-uno-mix-of-different-colors-of-roses-with-a-different-shade-in-the-middle-and-million-stars-or-lepidium",
    "debonair-lilies-with-red-roses-and-million-star",
    "purity-classy-mix-of-white-roses-with-million-stars"
  ],
  "featured-gift": [
    "classic-roses-and-chocolate",
    "balloons",
    "pergale-assorted-luxury-chocolates-114g",
    "teddy-bear"
  ],
  "featured-product": [
    "chrysant-delight-mixture-of-bright-and-vibrant-chrysanthemums-with-million-stars-gypsophila",
    "cupcakes-004-pack-of-6-12-or-24-strawberry-red-velvet-cupcake-select-size",
    "ted-baker-eau-de-toilette-spray-for-female-75ml",
    "loxarre-bouquet-a-bouquet-of-arrangement-of-red-roses-and-purple-roses-with-million-stars"
  ],
  "featured-romance": [
    "euphoria-roses-and-million-stars-or-statice-select-size",
    "my-heart-concentric-mix-of-two-or-three-colours-of-roses-to-form-a-heart-shape-select-size",
    "numero-uno-mix-of-different-colors-of-roses-with-a-different-shade-in-the-middle-and-million-stars-or-lepidium",
    "dune-beautiful-arrangement-of-roses-with-mixed-chrysanthemums-and-million-stars"
  ],
  "featured-occasion": [
    "arabiati-bouquet-red-roses-mixed-with-million-stars",
    "casablanca-bouquet-a-bouquet-arrangement-of-red-and-purple-roses-with-million-stars",
    "donatello-box-arrangement-box-of-red-roses-and-one-contrasting-color-with-million-stars",
    "flirtare-bouquet-arrangement-a-bouquet-of-mixed-roses"
  ]
};

export const popularSections: Occasion[] = [
  {
    title: "Fresh Flowers",
    url: `/filters?shopBy=${encodeURIComponent("fresh flowers")}`,
    image: "/images/popular-fresh.jpg"
  },
  {
    title: "Forever Roses",
    url: `/product-category/forever-roses-preserved-roses`,
    image: "/images/popular-forever.jpg"
  },
  {
    title: "VIP Section",
    url: "/vip-flowers",
    image: "/images/popular-vip.jpg"
  },
  {
    title: "Bundled Products",
    url: "/product-category/packages-and-bundled-products",
    image: "/images/popular-bundled.jpg"
  }
  // {
  //   title: "Lagos Delivery",
  //   url: "/locations/lagos",
  //   image: "/images/popular-lagos.png"
  // },
  // {
  //   title: "Abuja Delivery",
  //   url: "/locations/abuja",
  //   image: "/images/popular-abuja.png"
  // }
];

export const mostLoved: RegalContent = {
  general:
    "We are the most loved flower delivery service in Abuja and Lagos, Nigeria",
  lagos: "We're the most loved online flower shop in Lagos & Abuja, Nigeria",
  abuja: "We're Lagos and Abuja, Nigeria's most-loved online florist",
  "other-locations": "Did You Know? We are Nigeria's most reviewed flower store"
};

export const reviews: RegalContent<UserReview[]> = {
  general: [
    {
      text:
        "I am glad I ordered from them. To say they surpassed my expectations would be an understatement (I buy for my office reception weekly). This is my 9th order since offices opened back after the lockdown, and I am consistently impressed with their level of service and flowers. Would recommend them in a heartbeat",
      date: "7 Dec 2021",
      rating: 5,
      user: {
        name: "Marianne Kyari",
        avatar: ""
      }
    },
    {
      text:
        "It was a delight buying flowers from Floral Hub. Their attention to detail and customer service was quite impressive. She loved the flowers too. I look forward to doing business with them again",
      date: "26 Jun 2023",
      rating: 5,
      user: {
        name: "Tunde Quadri",
        avatar: ""
      }
    },
    {
      text:
        "I have bought Flowers and chocolates from Floralhub twice now to my fiance in Lagos, Nigeria, and I must say, they are not just another Nigerian business. Keep it up guys. Providing PayPal made it so easy for me also.",
      date: "5 Jul 2022",
      rating: 5,
      user: {
        name: "Tom Cullens",
        avatar: ""
      }
    },
    {
      text:
        "If it were possible to give 6 stars, I would definitely have done so. They were amazing, from customer service, to delivery time, to product quality. Quite impressed with Floral Hub",
      date: "11 Apr 2023",
      rating: 5,
      user: {
        name: "Lara Suleiman",
        avatar: ""
      }
    },
    {
      text:
        "I rarely write reviews but it is only fair I give credit where it is due. Their attention to detail and customer service is phenomenal. Keep it up guys",
      date: "15 Apr 2021",
      rating: 5,
      user: {
        name: "Tunde Ikimi",
        avatar: ""
      }
    },
    {
      text:
        "They delivered as they said they would. I was a bit hesitant due to the negative media about Nigeria I guess. Quite impressed and would definitely be back",
      date: "19 Nov 2023",
      rating: 5,
      user: {
        name: "Ryan Seawworth",
        avatar: ""
      }
    }
  ],
  abuja: [],
  lagos: [],
  "other-locations": []
};

export const sortOptions: Option[] = [
  {
    label: `Alphabetically Z-A`,
    value: "name-desc"
  },
  {
    label: `Alphabetically A-Z`,
    value: "name-asc"
  },
  {
    label: "Lowest Prices First",
    value: "price-asc"
  },
  {
    label: "Highest Prices First",
    value: "price-desc"
  }
];

export const freeDeliveryThreshold: Record<AppCurrencyName, number> = {
  USD: 185,
  GBP: 150,
  NGN: 165000
};

export const freeDeliveryThresholdVals: Record<AppCurrencyName, number> = {
  USD: 255,
  GBP: 210,
  NGN: 165000
};

export const freeDeliveryThresholdFestive: Record<AppCurrencyName, number> = {
  USD: 255,
  GBP: 210,
  NGN: 120000
};

export interface DeliveryLocationOption {
  name: string;
  label: string;
  amount: number;
}

export const valsDates = ["13-02", "14-02", "15-02"];

export const festiveDates = ["25-12", "26-12", "01-01"];

export const specialDates = [...valsDates, ...festiveDates];

export type SpecialDate = "vals" | "festive";

export const allDeliveryLocationZones: Record<
  LocationName,
  (
    amount: number,
    currency: AppCurrency,
    deliveryDate: Dayjs,
    specialDate?: SpecialDate
  ) => Option[]
> = {
  lagos: (amount = 0, currency, deliveryDate) => {
    return [
      {
        label: (
          <p>
            <strong>ZONE 1</strong>
            <br /> Not sure or need us to reach the recipient to confirm address
          </p>
        ),
        value: !specialDates.includes(deliveryDate?.format("DD-MM") || "")
          ? "highLagos-zone1"
          : festiveDates.includes(deliveryDate?.format("DD-MM") || "")
          ? "highLagosFestive-zone1"
          : (amount || 0) >= freeDeliveryThresholdVals[currency?.name || "NGN"]
          ? "freeLagosVals-zone1"
          : "highLagosVals-zone1"
      },
      {
        label: (
          <p>
            <strong>ZONE 2</strong>
            <br />
            <strong>Island</strong> (Ibeju Lekki, Badore, Free Trade Zone, Epe)
            <br />
            <br />
            <strong>Mainland</strong> (Idimu, Badagry, Ikorodu, Alaba/Ojo,
            Ikotun, Festac, Ikotun, Iyana-Ipaja, Egbeda, Apapa, Badagry, Abule
            Egba, and similar environs)
          </p>
        ),
        value: !specialDates.includes(deliveryDate?.format("DD-MM") || "")
          ? "highLagos-zone2"
          : festiveDates.includes(deliveryDate?.format("DD-MM") || "")
          ? "highLagosFestive-zone2"
          : (amount || 0) >= freeDeliveryThresholdVals[currency?.name || "NGN"]
          ? "freeLagosVals-zone2"
          : "highLagosVals-zone2"
      },
      {
        label: (
          <p>
            <strong>ZONE 3</strong>
            <br />
            <strong>Island</strong>(Ikoyi, Victoria Island, Lagos Island, Lekki
            Phase 1 up to Ajah)
            <br />
            <br />
            <strong>Mainland</strong>(Yaba, Surulere, Mushin, Anthony, Ogudu,
            Magodo, Omole, Gbagada, Ilupeju, Maryland, Maryland, Ikeja, Opebi,
            Ogba)
          </p>
        ),
        value:
          (amount || 0) >=
          (valsDates.includes(deliveryDate?.format("DD-MM") || "")
            ? freeDeliveryThresholdVals
            : festiveDates.includes(deliveryDate?.format("DD-MM") || "")
            ? freeDeliveryThresholdFestive
            : freeDeliveryThreshold)[currency?.name || "NGN"]
            ? `freeLagos${
                valsDates.includes(deliveryDate?.format("DD-MM") || "")
                  ? "Vals"
                  : festiveDates.includes(deliveryDate?.format("DD-MM") || "")
                  ? "Festive"
                  : ""
              }-zone3`
            : valsDates.includes(deliveryDate?.format("DD-MM") || "")
            ? "highLagosVals-zone1"
            : `mediumLagos${
                // valsDates.includes(deliveryDate?.format("DD-MM") || "")
                //   ? "Vals"
                //   :
                festiveDates.includes(deliveryDate?.format("DD-MM") || "")
                  ? "Festive"
                  : ""
              }-zone3`
      }
    ];
  },
  abuja: (amount, currency, deliveryDate) => [
    {
      label: (
        <p>
          <strong>ZONE 1</strong>
          <br /> Not sure or need us to reach the recipient to confirm address
        </p>
      ),
      value: !specialDates.includes(deliveryDate?.format("DD-MM") || "")
        ? "highAbuja-zone1"
        : festiveDates.includes(deliveryDate?.format("DD-MM") || "")
        ? "highAbujaFestive-zone1"
        : (amount || 0) >= freeDeliveryThresholdVals[currency?.name || "NGN"]
        ? "freeAbujaVals-zone1"
        : "highAbujaVals-zone1"
    },
    {
      label: (
        <p>
          <strong>ZONE 2</strong>
          <br />
          Mandala, Bwari, Suleja, Airport, Jikwoyi, Gwagwalada, Kuje, Lugbe,
          Kagini, Dawaki and similar environs
        </p>
      ),
      value: !specialDates.includes(deliveryDate?.format("DD-MM") || "")
        ? "highAbuja-zone2"
        : festiveDates.includes(deliveryDate?.format("DD-MM") || "")
        ? "highAbujaFestive-zone2"
        : (amount || 0) >= freeDeliveryThresholdVals[currency?.name || "NGN"]
        ? "freeAbujaVals-zone2"
        : "highAbujaVals-zone2"
    },
    {
      label: (
        <p>
          <strong>ZONE 3</strong>
          <br />
          Wuse, Maitama, Jabi, Asokoro, Garki, Dutse, Gwarimpa, Lokogoma, Kubwa,
          Durumi and similar environs
        </p>
      ),
      value:
        (amount || 0) >=
        (valsDates.includes(deliveryDate?.format("DD-MM") || "")
          ? freeDeliveryThresholdVals
          : festiveDates.includes(deliveryDate?.format("DD-MM") || "")
          ? freeDeliveryThresholdFestive
          : freeDeliveryThreshold)[currency?.name || "NGN"]
          ? `freeAbuja${
              valsDates.includes(deliveryDate?.format("DD-MM") || "")
                ? "Vals"
                : festiveDates.includes(deliveryDate?.format("DD-MM") || "")
                ? "Festive"
                : ""
            }-zone3`
          : valsDates.includes(deliveryDate?.format("DD-MM") || "")
          ? "highAbujaVals-zone1"
          : `mediumAbuja${
              festiveDates.includes(deliveryDate?.format("DD-MM") || "")
                ? "Festive"
                : ""
            }-zone3`
    }
  ],
  general: () => [],
  "other-locations": () => []
};

export const allDeliveryLocationOptions: Record<
  LocationName,
  (currency: AppCurrency, deliveryDate: Dayjs) => DeliveryLocationOption[]
> = {
  lagos: (currency, deliveryDate) =>
    [
      !specialDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(4500, currency)} - Orders BELOW ${
          currency.sign
        }${freeDeliveryThreshold[
          currency.name
        ].toLocaleString()} to Lekki, VI, Ikoyi, Ikeja, Gbagada, Yaba and similar environs (or please pickup instead)`,
        name: "mediumLagos",
        amount: 4500
      },

      !specialDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(0, currency)} - Orders ABOVE ${
          currency.sign
        }${freeDeliveryThreshold[
          currency.name
        ].toLocaleString()} to Lekki, VI, Ikoyi, Ikeja, Gbagada, Yaba and similar environs`,
        name: "freeLagos",
        amount: 0
      },

      !specialDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(
          10000,
          currency
        )} - All Orders to Ibeju Lekki, Ikorodu, Ikotun, Epe, Iyana-Ipaja, Egbeda, Badore, Apapa, Badagry, Abule Egba and similar environs (or please pickup instead)`,
        name: "highLagos",
        amount: 10000
      },

      // valsDates.includes(deliveryDate?.format("DD-MM") || "") && {
      //   label: `${getPriceDisplay(20000, currency)} - Orders BELOW ${
      //     currency.sign
      //   }${freeDeliveryThresholdVals[
      //     currency.name
      //   ].toLocaleString()} to Lekki, VI, Ikoyi, Ikeja, Gbagada, Yaba and similar environs (or please pickup instead)`,
      //   name: "mediumLagosVals",
      //   amount: 20000
      // },

      valsDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(
          29900,
          currency
        )} - Valentine (13th-15th Feb) Orders below ${getPriceDisplay(
          165000,
          currency
        )}`,
        name: "highLagosVals",
        amount: 29900
      },

      valsDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(
          0,
          currency
        )} - Valentine (13th-15th Feb) Orders above ${getPriceDisplay(
          165000,
          currency
        )}`,
        name: "freeLagosVals",
        amount: 0
      },
      festiveDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(7000, currency)} - Orders BELOW ${
          currency.sign
        }${freeDeliveryThresholdFestive[
          currency.name
        ].toLocaleString()} to Lekki, VI, Ikoyi, Ikeja, Gbagada, Yaba and similar environs (or please pickup instead)`,
        name: "mediumLagosFestive",
        amount: 7000
      },

      festiveDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(
          15000,
          currency
        )} - All Orders to Ibeju Lekki, Ikorodu, Ikotun, Epe, Iyana-Ipaja, Egbeda, Badore, Apapa, Badagry, Abule Egba and similar environs (or please pickup instead)`,
        name: "highLagosFestive",
        amount: 15000
      },

      festiveDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(0, currency)} - Orders ABOVE ${
          currency.sign
        }${freeDeliveryThresholdFestive[
          currency.name
        ].toLocaleString()}  to Lekki, VI, Ikoyi, Ikeja, Gbagada, Yaba and similar environs`,
        name: "freeLagosFestive",
        amount: 0
      }
    ].filter(BooleanFilter) as DeliveryLocationOption[],

  abuja: (currency, deliveryDate) =>
    [
      !specialDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(3500, currency)} - Orders BELOW ${
          currency.sign
        }${freeDeliveryThreshold[
          currency.name
        ].toLocaleString()} to Wuse, Maitama, Jabi, Asokoro, Garki, Dutse, Gwarimpa, Lokogoma, Kubwa, Durumi and similar environs (or please pickup instead)`,
        name: "mediumAbuja",
        amount: 3500
      },
      !specialDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(0, currency)} - Orders ABOVE ${
          currency.sign
        }${freeDeliveryThreshold[
          currency.name
        ].toLocaleString()} to Wuse, Maitama, Jabi, Asokoro, Garki, Dutse, Gwarimpa, Lokogoma, Kubwa, Durumi and similar environs`,
        name: "freeAbuja",
        amount: 0
      },

      !specialDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(
          6000,
          currency
        )} - All Orders to Mandala, Bwari, Suleja, Airport, Jikwoyi, Gwagwalada, Kuje, Lugbe, Kagini and similar environs (or please pickup instead)`,
        name: "highAbuja",
        amount: 6000
      },

      valsDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(
          29900,
          currency
        )} - Valentine (13th-15th Feb) Orders below ${getPriceDisplay(
          165000,
          currency
        )}`,
        name: "highAbujaVals",
        amount: 29900
      },

      valsDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(
          0,
          currency
        )} - Valentine (13th-15th Feb) Orders above ${getPriceDisplay(
          165000,
          currency
        )}`,
        name: "freeAbujaVals",
        amount: 0
      },

      festiveDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(7000, currency)} - Orders BELOW ${
          currency.sign
        }${freeDeliveryThresholdFestive[
          currency.name
        ].toLocaleString()} to Lekki, VI, Ikoyi, Ikeja, Gbagada, Yaba and similar environs (or please pickup instead)`,
        name: "mediumAbujaFestive",
        amount: 7000
      },

      festiveDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(
          15000,
          currency
        )} - All Orders to Ibeju Lekki, Ikorodu, Ikotun, Epe, Iyana-Ipaja, Egbeda, Badore, Apapa, Badagry, Abule Egba and similar environs (or please pickup instead)`,
        name: "highAbujaFestive",
        amount: 15000
      },

      festiveDates.includes(deliveryDate?.format("DD-MM") || "") && {
        label: `${getPriceDisplay(0, currency)} - Orders ABOVE ${
          currency.sign
        }${freeDeliveryThresholdFestive[
          currency.name
        ].toLocaleString()}  to Lekki, VI, Ikoyi, Ikeja, Gbagada, Yaba and similar environs`,
        name: "freeAbujaFestive",
        amount: 0
      }
    ].filter(BooleanFilter) as DeliveryLocationOption[],
  "other-locations": () => [],
  general: () => []
};

export interface DesignOption {
  name: DesignOptionName;
  price: number;
  title: string;
  default?: boolean;
}

export const allDesignOptions: DesignOption[] = [
  {
    name: "wrappedBouquet",
    title: "Wrapped Bouquet",
    price: 0
  },
  {
    name: "inVase",
    title: "In Vase",
    price: 15000
  },
  {
    name: "inLargeVase",
    title: "In Large Vase",
    price: 30000
  },
  {
    name: "box",
    title: "Box",
    price: 0
  }
];

export const websiteUrl = "https://www.floralhub.com.ng";

export const occasionsPageMetaData: Record<
  string,
  { title: string; description: string }
> = {
  "anniversary-flowers": {
    title:
      "Flowers for Romance, Birthday, Anniversary etc | Floral Hub Flowers",
    description:
      "Choose from our delightful assortment of Birthday, Anniversary, Romantic Flowers, Valentine’s Flowers, or Mother’s Day Flowers…and don’t forget to add a gift too"
  },
  "flowers-to-say-thanks-sorry-etc": {
    title: "Flowers to Say Sorry, Thank You, Congrats, Happy Mothers Day etc",
    description:
      "Say it with flowers. Various flowers to say, Thank You, I am Sorry, Congratulations and more"
  },
  "bridal-bouquets": {
    title:
      "Bridal Bouquets For The Bride and Bridal train | Floral Hub Flowers",
    description: ""
  },
  "funeral-and-condolence": {
    title:
      "Funeral Wreaths And Condolence Flowers To Say Goodbye | Floral Hub Flowers",
    description: ""
  },
  all: {
    title: "",
    description: ""
  },
  "cascading-bridal-bouquets": {
    title:
      "Cascading Bridal Bouquets With Fresh Flowers Or Roses | Floral Hub Flowers",
    description: ""
  },
  "accessories-boutonnieres-bridesmaids-flowers-corsages": {
    title:
      "Fresh flower bridal train and groomsmen accessories | Floral Hub Flowers",
    description: ""
  },
  "indoor-plants-and-cactus": {
    title: "",
    description:
      "Indoor Plants ranging from cactus plants, lucky bamboo and more are always a great addition to aid the ambience of a place. They make a great gift for friends, family and loved ones."
  },
  vip: {
    title: "",
    description: ""
  },
  "chocolates-and-biscuits": {
    title: "",
    description: ""
  },
  "cakes-and-cupcakes": {
    title: "",
    description: ""
  },
  "teddy-bears": {
    title: "",
    description: ""
  },
  balloons: {
    title: "",
    description: ""
  },
  "wine-and-champagne": {
    title: "",
    description: ""
  },
  "perfumes-eau-de-toilette-cologne-and-parfums": {
    title: "",
    description: ""
  },
  "gift-packs": {
    title: "",
    description: ""
  },
  "scented-candles": {
    title: "",
    description: ""
  },
  roses: {
    title: "",
    description: ""
  },
  chrysanthemums: {
    title: "",
    description: ""
  },
  lilies: {
    title: "",
    description: ""
  },
  "million-stars": {
    title: "",
    description: ""
  },
  "forever-roses-preserved-roses": {
    title: "",
    description: ""
  }
};

export const contactUsPageContent: Partial<Record<
  LocationName,
  LocationAddress
>> = {
  lagos: {
    name: "Lagos Head Office/Delivery Center",
    location: "15, Ikeja Way, Dolphin Estate, Ikoyi",
    phoneNo: "+234 907 777 7994",
    whatsappNo: "+234 907 777 7994",
    url: "https://maps.app.goo.gl/u4DbZLsmZRixJZqV8",
    coord: {
      lat: 6.458329,
      lng: 3.413628
    }
  },
  abuja: {
    name: "Abuja",
    location: "5, Nairobi Street, off Aminu Kano Crescent, Wuse 2, Abuja.",
    phoneNo: "+234 907 777 7994",
    whatsappNo: "+234 907 777 7994",
    url: "https://maps.app.goo.gl/4BmrPnVoGQjNz8Mb6",
    coord: {
      lat: 9.077785485443458,
      lng: 7.464068439137416
    }
  }
};

export const schemaProperties = {
  "@type": "LocalBusiness",
  name: "Floral Hub",
  url: "https://www.floralhub.com.ng",
  description:
    "Floral Hub | 24/7 Online & Walk-in Fresh Flowers & Gifts Shop in Lagos and Abuja, Nigeria that offers Same Day Delivery in Lagos, and Abuja, Nigeria",
  image: [
    "https://firebasestorage.googleapis.com/v0/b/floralhub-cdn/o/flroal-homepage-opengragh-image.jpg.jpg?alt=media&token=ccaf55e8-cc14-4ccb-a92d-9ba8b280c212"
  ],
  telephone: ["+234 907 7777994"],
  email: "info@floralhub.com.ng",
  openingHours: "24/7",
  paymentAccepted: ["Credit/Debit Cards", "Paypal", "Bitcoin", "Bank Transfer"],
  priceRange: "₦",
  hasMap: [
    "https://maps.app.goo.gl/u4DbZLsmZRixJZqV8", // Ikoyi, Lagos
    "https://maps.app.goo.gl/4BmrPnVoGQjNz8Mb6" // Abuja
  ],
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "15, Ikeja Way, Dolphin Estate, Ikoyi, Lagos",
      addressLocality: "Ikoyi",
      addressRegion: "Lagos"
    },
    {
      "@type": "PostalAddress",
      streetAddress: "5, Nairobi Way, off Aminu Kano Crescent, Abuja",
      addressLocality: "Abuja",
      addressRegion: "Nigeria"
    }
  ],
  geo: [
    {
      "@type": "GeoCoordinates",
      latitude: "6.460616185620579",
      longitude: "3.4171805985817842"
    },
    {
      "@type": "GeoCoordinates",
      latitude: "9.077990953737423",
      longitude: "7.464239959050253"
    }
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+2349077777994",
      contactType: "customer service",
      url: "https://wa.me/+2349077777994"
    }
  ],
  sameAs: [
    "https://www.instagram.com/floralhub.com.ng/",
    "https://www.facebook.com/floralhub.com.ng/",
    "https://www.linkedin.com/company/floralhub-com-ng/"
  ],
  potentialAction: [
    {
      "@type": "ViewAction",
      target: "https://floralhub.com.ng/product-category/birthday-flowers/",
      name: "Birthday Flowers"
    },
    {
      "@type": "ViewAction",
      target:
        "https://floralhub.com.ng/product-category/flowers-to-say-thanks-sorry-etc/",
      name: "Flowers for Romance, Sorry, Thanks, etc"
    },
    {
      "@type": "ViewAction",
      target: "https://floralhub.com.ng/product-category/anniversary-flowers/",
      name: "Anniversary Flowers"
    },
    {
      "@type": "ViewAction",
      target: "https://floralhub.com.ng/product-category/gifts/",
      name: "Gifts for Her or Him"
    },
    {
      "@type": "ViewAction",
      target: "https://floralhub.com.ng/product-category/roses/",
      name: "Roses"
    },
    {
      "@type": "ViewAction",
      target:
        "https://floralhub.com.ng/product-category/valentines-day-flowers/",
      name: "Valentine Flowers"
    }
  ],
  logo:
    "https://firebasestorage.googleapis.com/v0/b/floralhub-cdn/o/flroal-homepage-opengragh-image.jpg.jpg?alt=media&token=ccaf55e8-cc14-4ccb-a92d-9ba8b280c212"
};

export const business = "floralHub";

export const blogCategories = [
  {
    title: "Dear Lara, Relationship and Lifestyle Advice ",
    url: "",
    bulletColor: ""
  },
  {
    title: "Everything Flowers and Gifts",
    url: "",
    bulletColor: "red"
  },
  {
    title: "General Posts, Fun and Love Tips",
    url: "",
    bulletColor: "green"
  }
];

export const trendingPosts = [
  {
    imageUrl: "/icons/trending-imge.png",
    tag: "Everything Flowers and Gifts",
    title: "5 awesome methods of receiving payment in your store. "
  },
  {
    imageUrl: "/icons/trending-imge.png",
    tag: "Everything Flowers and Gifts",
    title: "5 awesome methods of receiving payment in your store. "
  },
  {
    imageUrl: "/icons/trending-imge.png",
    tag: "Everything Flowers and Gifts",
    title: "5 awesome methods of receiving payment in your store. "
  }
];

export const blogMinimals: BlogMinimal[] = [
  {
    id: "1",
    title: "5 Reasons Why Guys Give Girls Flowers",
    featuredImage: "/images/blog-image.png",
    excerpt:
      "Chivalry isn’t dead, and men are typically known to give women flowers, while women are typically known to receive flowers. Or so the saying goes. But why exactly do men send women flowers? Chivalry isn’t dead, and men are typically known to give women flowers, while women are typically known to receive flowers. Or so the saying goes. But why exactly do men send women flowers Or so the saying goes. But why exactly do men send women flowers? ",
    category: "Everything Flowers and Gifts",
    readMinutes: 3,
    slug: "how-to-make-your-flowers-last-longer"
  },
  {
    id: "1",
    title: "5 Reasons Why Guys Give Girls Flowers",
    featuredImage: "/images/blog-image.png",
    excerpt:
      "Chivalry isn’t dead, and men are typically known to give women flowers, while women are typically known to receive flowers. Or so the saying goes. But why exactly do men send women flowers? ",
    category: "Everything Flowers and Gifts",
    readMinutes: 3,
    slug: "how-to-make-your-flowers-last-longer"
  },
  {
    id: "1",
    title: "5 Reasons Why Guys Give Girls Flowers",
    featuredImage: "/images/blog-image.png",
    excerpt:
      "Chivalry isn’t dead, and men are typically known to give women flowers, while women are typically known to receive flowers. Or so the saying goes. But why exactly do men send women flowers?",
    category: "Everything Flowers and Gifts",
    readMinutes: 3,
    slug: "how-to-make-your-flowers-last-longer"
  }
];

export type PickUpLocation = "Ikoyi" | "Abuja" | "Lekki";

export const deliveryZoneMap: Record<string, DeliveryZone> = {
  Ikoyi: "LPI",
  Abuja: "APA",
  Lekki: "LPL"
};
