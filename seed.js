const mongoose = require('mongoose');
const Product = require('./models/Product');
const dotenv = require('dotenv');

dotenv.config();

const products = [
  {
    name: 'Yemeni Sidr Honey',
    description: 'World-renowned mono-floral honey from the Sidr trees of Yemen. Known for its potent medicinal properties and rich, caramel-like taste.',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&auto=format&fit=crop&q=80',
    category: 'Honey',
    countInStock: 20,
    rating: 5.0,
    numReviews: 42,
    featured: true,
    origin: 'Yemen'
  },
  {
    name: 'Saudi Ajwa Dates',
    description: 'Premium Ajwa dates from the holy city of Medina, Saudi Arabia. Soft, luscious, and rich in nutrients. Often referred to as the "Holy Date".',
    price: 35.99,
    image: 'https://images.unsplash.com/photo-1627914605934-8b43f9a76d3e?w=800&auto=format&fit=crop&q=80',
    category: 'Dry Fruits',
    countInStock: 100,
    rating: 4.9,
    numReviews: 85,
    featured: true,
    origin: 'Saudi Arabia'
  },
  {
    name: 'Turkish Smyrna Figs',
    description: 'Naturally sun-dried figs from the Aegean region of Turkey. Sweet, chewy, and packed with seeds. A perfect healthy snack.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1615485500170-5ff1c0f5c6b4?w=800&auto=format&fit=crop&q=80',
    category: 'Dry Fruits',
    countInStock: 60,
    rating: 4.8,
    numReviews: 30,
    featured: false,
    origin: 'Turkey'
  },
  {
    name: 'Italian Extra Virgin Olive Oil',
    description: 'Gold-standard cold-pressed extra virgin olive oil from Tuscany. Fruity aroma with a peppery finish. Ideal for drizzling.',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
    category: 'Oils',
    countInStock: 45,
    rating: 4.9,
    numReviews: 55,
    featured: true,
    origin: 'Italy'
  },
  {
    name: 'Greek Kalamata Olives',
    description: 'Authentic Kalamata olives from the Peloponnese peninsula in Greece. Dark, almond-shaped, and preserved in red wine vinegar brine.',
    price: 16.99,
    image: 'https://images.unsplash.com/photo-1563539860-639ef1a95fe3?w=800&auto=format&fit=crop&q=80',
    category: 'Olives',
    countInStock: 75,
    rating: 4.7,
    numReviews: 28,
    featured: false,
    origin: 'Greece'
  },
  {
    name: 'French Isigny Butter',
    description: 'PDO certified butter from Normandy, France. Made from cultured cream for a distinct hazelnut flavor and silky texture.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1589985272396-7b003362a220?w=800&auto=format&fit=crop&q=80',
    category: 'Dairy',
    countInStock: 30,
    rating: 5.0,
    numReviews: 15,
    featured: true,
    origin: 'France'
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');

    try {
      // Clear existing products
      await Product.deleteMany({});
      console.log('Cleared existing products');

      // Insert new products
      await Product.insertMany(products);
      console.log('Products seeded successfully');

      process.exit();
    } catch (error) {
      console.error('Error seeding data:', error);
      process.exit(1);
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });