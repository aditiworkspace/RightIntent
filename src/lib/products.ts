export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAt?: number;
  description: string;
  image: string;
  accent: string;
  badge?: string;
  stock?: number;
  slug?: string;
  subcategory?: string;
};

export const products: Product[] = [
  {
    id: "01",
    name: "Sienna Stoneware Set",
    category: "Tableware",
    price: 1890,
    compareAt: 2490,
    description: "Hand-finished forms for everyday rituals.",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85",
    accent: "#d8b6a1",
    badge: "New arrival",
  },
  {
    id: "02",
    name: "Mitti Linen Throw",
    category: "Textiles",
    price: 2650,
    description: "Washed linen with a quietly generous drape.",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
    accent: "#c7b59e",
  },
  {
    id: "03",
    name: "Dhoop Brass Candle",
    category: "Objects",
    price: 1290,
    description: "Warm sandalwood, smoke, and a slow evening.",
    image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85",
    accent: "#d3a45c",
    badge: "Best seller",
  },
  {
    id: "04",
    name: "Neel Everyday Tote",
    category: "Carry",
    price: 2290,
    description: "A considered canvas carryall for full days out.",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
    accent: "#9ca6a0",
  },
  {
    id: "05",
    name: "Aabha Ceramic Vase",
    category: "Objects",
    price: 1490,
    compareAt: 1790,
    description: "A softly shaped vessel for one stem or many.",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=85",
    accent: "#c7b9aa",
    badge: "New arrival",
  },
  {
    id: "06",
    name: "Kora Cushion Pair",
    category: "Textiles",
    price: 1790,
    description: "Textured cotton layers for an easier room.",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=85",
    accent: "#d5cabb",
  },
  {
    id: "07",
    name: "Aangan Serving Tray",
    category: "Tableware",
    price: 2190,
    description: "A warm wooden base for tea, fruit, and slow afternoons.",
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?auto=format&fit=crop&w=900&q=85",
    accent: "#b8875d",
  },
  {
    id: "08",
    name: "Reva Market Basket",
    category: "Carry",
    price: 1590,
    description: "A roomy woven carryall for market mornings and weekends away.",
    image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=85",
    accent: "#c6ad8c",
  },
];

export const categories = [
  { name: "Objects", count: "12 pieces", image: products[2].image },
  { name: "Textiles", count: "08 pieces", image: products[1].image },
  { name: "Tableware", count: "16 pieces", image: products[0].image },
];
