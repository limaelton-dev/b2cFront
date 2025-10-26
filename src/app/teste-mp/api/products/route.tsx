import { NextResponse } from "next/server";

type Product = {
  id: string;
  title: string;
  price: number;
  stock: number;
  brand?: string;
};

const MOCK_PRODUCTS: Product[] = [
  { id: "1", title: "Notebook Gamer XZ", price: 450000, stock: 12, brand: "Asus" },
  { id: "2", title: "Notebook Profissional ProMax", price: 520000, stock: 5, brand: "Dell" },
  { id: "3", title: "Smartphone Ultra 15", price: 320000, stock: 40, brand: "Samsung" },
  { id: "4", title: "Smartphone Lite 8", price: 120000, stock: 20, brand: "Motorola" },
  { id: "5", title: "Headset Gamer RGB", price: 18000, stock: 100, brand: "Redragon" },
  { id: "6", title: "Mouse Wireless Silent", price: 9500, stock: 60, brand: "Logitech" },
  { id: "7", title: "Teclado Mecânico Switch Blue", price: 25000, stock: 35, brand: "HyperX" },
  { id: "8", title: "Monitor 27'' 144Hz", price: 130000, stock: 15, brand: "LG" },
  { id: "9", title: "Cadeira Gamer Confort Plus", price: 85000, stock: 8, brand: "ThunderX3" },
  { id: "10", title: "Impressora Multifuncional Laser", price: 60000, stock: 4, brand: "HP" },
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase() ?? "";

  // filtro simples pelo título
  const filtered = MOCK_PRODUCTS.filter((p) =>
    p.title.toLowerCase().includes(q)
  );

  return NextResponse.json({ items: filtered });
}
