export type Category =
  | "All"
  | "Square Shape"
  | "Zen Shape"
  | "Round Shape"
  | "Pyramid Shape"
  | "Peace Shape";

export const CATEGORIES: Category[] = [
  "All",
  "Square Shape",
  "Zen Shape",
  "Round Shape",
  "Pyramid Shape",
  "Peace Shape",
];

export type Product = {
  id: number;
  name: string;
  size: string;
  type: Category;
  height: string;
  img: string;
  pricePerBox: number;
};

export const PRODUCTS: Product[] = [
  { id: 1, name: "Square Shape", size: "350ML", type: "Square Shape", height: "h-80", img: "/images/s3.png", pricePerBox: 280 },
  { id: 2, name: "Square Shape", size: "500ML", type: "Square Shape", height: "h-80", img: "/images/s2.png", pricePerBox: 360 },
  { id: 3, name: "Square Shape", size: "1 Liter", type: "Square Shape", height: "h-80", img: "/images/s1.png", pricePerBox: 520 },

  { id: 4, name: "Zen Shape", size: "350ML", type: "Zen Shape", height: "h-80", img: "/images/z33.png", pricePerBox: 300 },
  { id: 5, name: "Zen Shape", size: "500ML", type: "Zen Shape", height: "h-80", img: "/images/z22.png", pricePerBox: 380 },
  { id: 6, name: "Zen Shape", size: "1 Liter", type: "Zen Shape", height: "h-80", img: "/images/z11.png", pricePerBox: 540 },

  { id: 7, name: "Round Shape", size: "300ML", type: "Round Shape", height: "h-80", img: "/images/r33.png", pricePerBox: 260 },
  { id: 8, name: "Round Shape", size: "500ML", type: "Round Shape", height: "h-80", img: "/images/r22.png", pricePerBox: 360 },
  { id: 9, name: "Round Shape", size: "1 Liter", type: "Round Shape", height: "h-80", img: "/images/r11.png", pricePerBox: 520 },

  { id: 10, name: "Peace Shape", size: "500ML", type: "Peace Shape", height: "h-80", img: "/images/p1.png", pricePerBox: 400 },
  { id: 11, name: "Peace Shape", size: "500ML", type: "Peace Shape", height: "h-80", img: "/images/p2.png", pricePerBox: 400 },

  { id: 12, name: "Pyramid Shape", size: "500ML", type: "Pyramid Shape", height: "h-80", img: "/images/py.png", pricePerBox: 420 },
];