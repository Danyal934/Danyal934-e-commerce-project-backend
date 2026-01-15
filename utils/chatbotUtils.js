const Product = require('../models/Product');

// Product categories from your footer
const PRODUCT_CATEGORIES = [
  'Honey & Sweets',
  'Dry Fruits',
  'Oils',
  'Olives',
  'Dairy Products'
];

// Detailed product information
const PRODUCT_KNOWLEDGE = {
  'yemeni sidr honey': {
    name: 'Yemeni Sidr Honey',
    origin: 'Yemen',
    price: 89.99,
    description: 'World-renowned mono-floral honey from the Sidr trees of Yemen. Known for its potent medicinal properties and rich, caramel-like taste.',
    benefits: 'Rich in antioxidants, antibacterial properties, supports immune system, aids digestion, natural energy booster',
    uses: 'Perfect for sweetening tea, drizzling over yogurt, or consuming directly for health benefits',
    category: 'Honey'
  },
  'saudi ajwa dates': {
    name: 'Saudi Ajwa Dates',
    origin: 'Medina, Saudi Arabia',
    price: 35.99,
    description: 'Premium Ajwa dates from the holy city of Medina. Soft, luscious, and rich in nutrients. Often referred to as the "Holy Date".',
    benefits: 'High in fiber, natural energy source, rich in minerals (potassium, magnesium), supports heart health, anti-inflammatory properties',
    uses: 'Excellent as a healthy snack, natural sweetener in smoothies, or paired with nuts and cheese',
    category: 'Dry Fruits'
  },
  'turkish smyrna figs': {
    name: 'Turkish Smyrna Figs',
    origin: 'Aegean region, Turkey',
    price: 18.99,
    description: 'Naturally sun-dried figs from the Aegean region. Sweet, chewy, and packed with seeds. A perfect healthy snack.',
    benefits: 'High in dietary fiber, rich in calcium and potassium, supports digestive health, natural sweetness without added sugar',
    uses: 'Great for snacking, baking, adding to salads, or pairing with cheese and wine',
    category: 'Dry Fruits'
  },
  'italian extra virgin olive oil': {
    name: 'Italian Extra Virgin Olive Oil',
    origin: 'Tuscany, Italy',
    price: 34.99,
    description: 'Gold-standard cold-pressed extra virgin olive oil from Tuscany. Fruity aroma with a peppery finish. Ideal for drizzling.',
    benefits: 'Rich in monounsaturated fats, high in antioxidants, anti-inflammatory, supports heart health, may reduce risk of chronic diseases',
    uses: 'Perfect for salad dressings, drizzling over pasta, bread dipping, or light sautéing',
    category: 'Oils'
  },
  'greek kalamata olives': {
    name: 'Greek Kalamata Olives',
    origin: 'Peloponnese peninsula, Greece',
    price: 16.99,
    description: 'Authentic Kalamata olives preserved in red wine vinegar brine. Dark, almond-shaped, and bursting with flavor.',
    benefits: 'Rich in healthy fats, antioxidants, vitamin E, supports heart health, anti-inflammatory properties',
    uses: 'Excellent in salads, on pizza, in pasta dishes, or as part of a Mediterranean mezze platter',
    category: 'Olives'
  },
  'french isigny butter': {
    name: 'French Isigny Butter',
    origin: 'Normandy, France',
    price: 12.99,
    description: 'PDO certified butter from Normandy. Made from cultured cream for a distinct hazelnut flavor and silky texture.',
    benefits: 'Rich in vitamins A and D, contains beneficial fatty acids, cultured for easier digestion, superior flavor for cooking',
    uses: 'Perfect for baking, spreading on fresh bread, making sauces, or finishing dishes',
    category: 'Dairy'
  }
};

// Shipping policy for Thor
const SHIPPING_POLICY = {
  standard: {
    name: 'Standard Shipping',
    time: '5-7 business days',
    cost: '$4.99',
    freeThreshold: 50
  },
  express: {
    name: 'Express Shipping',
    time: '2-3 business days',
    cost: '$9.99'
  },
  locations: 'We ship to all 50 US states. International shipping available for select countries.',
  processing: 'Orders are processed within 24 hours on business days.'
};

// Return policy for Thor
const RETURN_POLICY = {
  duration: '30 days from delivery date',
  condition: 'Items must be unused, in original packaging with all tags attached',
  freeReturns: 'Free returns for defective or damaged items',
  refundTime: '5-10 business days after we receive the return',
  exclusions: ['Final sale items', 'Personalized products', 'Perishable goods'],
  process: 'Contact our support team for a return authorization'
};

// Thor's personality - Formal assistant
const THOR_PERSONALITY = {
  name: 'Thor',
  title: 'Shopping Assistant',
  tone: 'formal',
  greetings: [
    "Greetings! I am Thor, your dedicated shopping assistant at WorldPantry. How may I assist you today?",
    "Welcome to WorldPantry. I am Thor, here to guide you through our premium natural products.",
    "Good day! I am Thor, your personal shopping consultant. How can I enhance your WorldPantry experience?"
  ],
  closings: [
    "Thank you for consulting with me. Should you require further assistance, I remain at your service.",
    "I trust our conversation has been helpful. Please return if you have additional inquiries.",
    "Your satisfaction is our priority. Do not hesitate to reach out again for assistance."
  ],
  apologies: [
    "I apologize for any inconvenience. Let me clarify that for you.",
    "My apologies if my previous response was unclear. Allow me to rephrase.",
    "I regret any confusion. Let me provide more precise information."
  ]
};

// Extract product name from message
const extractProductName = (message) => {
  const words = message.toLowerCase();
  const productKeywords = {
    'honey': 'yemeni sidr honey',
    'sidr': 'yemeni sidr honey',
    'yemeni': 'yemeni sidr honey',
    'date': 'saudi ajwa dates',
    'dates': 'saudi ajwa dates',
    'ajwa': 'saudi ajwa dates',
    'fig': 'turkish smyrna figs',
    'figs': 'turkish smyrna figs',
    'smyrna': 'turkish smyrna figs',
    'turkish': 'turkish smyrna figs',
    'olive oil': 'italian extra virgin olive oil',
    'oil': 'italian extra virgin olive oil',
    'italian': 'italian extra virgin olive oil',
    'evoo': 'italian extra virgin olive oil',
    'olive': 'greek kalamata olives',
    'olives': 'greek kalamata olives',
    'kalamata': 'greek kalamata olives',
    'greek': 'greek kalamata olives',
    'butter': 'french isigny butter',
    'isigny': 'french isigny butter',
    'french': 'french isigny butter'
  };

  for (const [keyword, productKey] of Object.entries(productKeywords)) {
    if (words.includes(keyword)) {
      return productKey;
    }
  }
  return null;
};

// Get detailed product information
const getProductDetails = (productKey) => {
  const product = PRODUCT_KNOWLEDGE[productKey];
  if (!product) return null;

  return `**${product.name}** (${product.origin})\n\n` +
    `💰 **Price**: $${product.price}\n\n` +
    `📝 **Description**: ${product.description}\n\n` +
    `✨ **Benefits**: ${product.benefits}\n\n` +
    `🍽️ **Uses**: ${product.uses}`;
};

// Get product origin information
const getProductOrigin = async (productKey) => {
  const product = PRODUCT_KNOWLEDGE[productKey];
  if (product) {
    return `The ${product.name} originates from ${product.origin}. ${product.description}`;
  }

  // Fallback to database
  try {
    const dbProduct = await Product.findOne({
      name: { $regex: productKey, $options: 'i' }
    }).select('name origin description');

    if (dbProduct) {
      if (dbProduct.origin) {
        return `The ${dbProduct.name} originates from ${dbProduct.origin}. It is ${dbProduct.description}`;
      } else {
        return `Our ${dbProduct.name} is sourced from trusted suppliers who maintain the highest quality standards. ${dbProduct.description}`;
      }
    }
    return null;
  } catch (error) {
    console.error('Error fetching product origin:', error);
    return null;
  }
};

// Get category products
const getCategoryProducts = async (category) => {
  try {
    const products = await Product.find({
      category: { $regex: category, $options: 'i' }
    }).select('name price image').limit(5);

    if (products.length > 0) {
      const productList = products.map(p => `${p.name} - $${p.price}`).join(', ');
      return `In ${category}, we offer: ${productList}. Would you like details on any specific item?`;
    }
    return `We currently have limited stock in ${category}. May I suggest exploring our ${PRODUCT_CATEGORIES[0]} collection?`;
  } catch (error) {
    console.error('Error fetching category products:', error);
    return null;
  }
};

// Get all products overview
const getAllProductsOverview = () => {
  const productList = Object.values(PRODUCT_KNOWLEDGE).map(p =>
    `• **${p.name}** - $${p.price} (${p.origin})`
  ).join('\n');

  return `Here are all our premium products:\n\n${productList}\n\nWould you like detailed information about any specific product?`;
};

// Generate quick replies based on context
const generateQuickReplies = (context) => {
  const baseReplies = [
    "Show all products",
    "Shipping policies",
    "Return process",
    "Product benefits"
  ];

  if (context.lastProductInquired) {
    baseReplies.push(`More about ${context.lastProductInquired}`);
  }

  if (context.categoryInterest) {
    baseReplies.push(`Show ${context.categoryInterest} products`);
  }

  return baseReplies.slice(0, 4); // Return max 4 quick replies
};

module.exports = {
  PRODUCT_CATEGORIES,
  PRODUCT_KNOWLEDGE,
  SHIPPING_POLICY,
  RETURN_POLICY,
  THOR_PERSONALITY,
  extractProductName,
  getProductDetails,
  getProductOrigin,
  getCategoryProducts,
  getAllProductsOverview,
  generateQuickReplies
};