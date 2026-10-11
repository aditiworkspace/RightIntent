import { RouteNav, RoutePage } from "@/components/store/route-page";
import { ProductTile } from "@/components/store/product-tile";
import { getCatalogProducts } from "@/lib/catalog";

export const metadata = {
  title: "Shop Journals, Planners & Thoughtful Tools",
  description: "Explore journals, planners and thoughtful everyday tools from Right Intent.",
};

export default async function ProductsPage() {
  const products = await getCatalogProducts();
  return <><RouteNav /><RoutePage eyebrow="The edit" title="Made for living" description="A considered collection of useful, beautiful things."><div className="[display:flex] [justify-content:space-between] [padding:15px_0] [margin-bottom:25px] [border-top:1px_solid_var(--line)] [border-bottom:1px_solid_var(--line)] [color:var(--muted)] [font:10px_var(--mono)] [&_button]:[margin-left:22px] [&_button]:[text-transform:uppercase]"><span>Showing {products.length} pieces</span><button>Sort: Featured</button><button>Filter</button></div><div className="[display:grid] [grid-template-columns:repeat(3,_1fr)] [gap:44px_18px] max-[960px]:[grid-template-columns:repeat(2,_1fr)] max-[960px]:[gap:30px_12px]">{products.map((product) => <ProductTile key={product.id} product={product} />)}</div></RoutePage></>;
}
