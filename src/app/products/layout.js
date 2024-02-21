import Header from "../components/header";
export const metadata = {
  title: "Products",
  description: "Products page",
};
export default function ProductLayout({ children }) {
  return (
    <div className="">
      <Header />
      {children}
    </div>
  );
}
