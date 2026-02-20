import { Switch, Route } from "wouter";
import Home from "./Home";
import Shop from "./Shop";
import NotFound from "./pages/not-found";

function App() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
