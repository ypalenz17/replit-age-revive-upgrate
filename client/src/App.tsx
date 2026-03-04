import { lazy, Suspense } from "react";
import { Switch, Route, Redirect } from "wouter";
import Home from "./Home";
import CartDrawer from "./components/CartDrawer";
import { PrerenderReadySignal } from "./components/PrerenderReadySignal";

const Shop = lazy(() => import("./Shop"));
const ProductDetail = lazy(() => import("./ProductDetail"));
const Science = lazy(() => import("./pages/Science"));
const Quality = lazy(() => import("./pages/Quality"));
const FAQ = lazy(() => import("./pages/FAQ"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const TermsPage = lazy(() => import("./pages/TermsPage"));
const ShippingPage = lazy(() => import("./pages/ShippingPage"));
const Purchase = lazy(() => import("./pages/Purchase"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmed = lazy(() => import("./pages/OrderConfirmed"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Account = lazy(() => import("./pages/Account"));

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-[#131d2e] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-teal-400/30 border-t-teal-400 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <>
      <PrerenderReadySignal />
      <Suspense fallback={<LoadingFallback />}>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/order-confirmed" component={OrderConfirmed} />
          <Route path="/product/:slug/purchase" component={Purchase} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/products/:slug" component={ProductDetail} />
          <Route path="/shop" component={Shop} />
          <Route path="/science" component={Science} />
          <Route path="/quality" component={Quality} />
          <Route path="/faq" component={FAQ} />
          <Route path="/privacy" component={PrivacyPage} />
          <Route path="/terms" component={TermsPage} />
          <Route path="/shipping" component={ShippingPage} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/account" component={Account} />
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
