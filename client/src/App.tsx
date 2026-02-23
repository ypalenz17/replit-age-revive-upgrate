import { Switch, Route, Redirect } from "wouter";
import Home from "./Home";
import Shop from "./Shop";
import ProductDetail from "./ProductDetail";
import Science from "./pages/Science";
import Quality from "./pages/Quality";
import FAQ from "./pages/FAQ";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
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
  );
}

export default App;
