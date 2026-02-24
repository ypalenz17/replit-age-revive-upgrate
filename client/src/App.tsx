import { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "wouter";
import Home from "./Home";
import CartDrawer from "./components/CartDrawer";

const Shop = lazy(() => import("./Shop"));
const ProductDetail = lazy(() => import("./ProductDetail"));
const Science = lazy(() => import("./pages/Science"));
const Quality = lazy(() => import("./pages/Quality"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Purchase = lazy(() => import("./pages/Purchase"));
const Checkout = lazy(() => import("./pages/Checkout"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#0b1120] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/product/:slug/purchase" component={Purchase} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/shop" component={Shop} />
          <Route path="/science" component={Science} />
          <Route path="/quality" component={Quality} />
          <Route path="/faq" component={FAQ} />
          <Route>
            <Redirect to="/" />
          </Route>
        </Switch>
      </Suspense>
      <CartDrawer />
    </>
  );
}

export default App;
