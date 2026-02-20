import { Switch, Route, Redirect } from "wouter";
import Home from "./Home";
import Shop from "./Shop";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products/:slug" component={Shop} />
      <Route path="/shop" component={Shop} />
      <Route>
        <Redirect to="/" />
      </Route>
    </Switch>
  );
}

export default App;
