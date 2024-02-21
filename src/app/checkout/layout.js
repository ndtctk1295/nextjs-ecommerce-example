import Header from "../components/header";
export const metadata = {
  title: "Checkout",
  description: "Checkout page",
};
export default function CheckoutLayout({ children }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
