import React from 'react';
import { Route, Switch } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import Home from './components/Home';
import Map from './components/Map';



const Routing = ()=> {
  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>

      <Route exact path="/map">
        <Map />
      </Route>

    </Switch>
  )
}

function App() {

  return (
    <div className="App">
      <BrowserRouter> 
        <Routing />
      </BrowserRouter>
    </div>
  );
}

export default App;
