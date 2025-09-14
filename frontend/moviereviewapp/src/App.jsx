import React from "react";
import {BrowserRouter as Router , Routes , Route} from "react-router-dom";
import Home from "./pages/Home";
import ListingPage from "./pages/ListingPage";
import MoviePage from "./pages/MoviePage";
import ProfilePage from "./pages/ProfilePage";
import PostAReview from "./pages/PostAReview";
import LoginPage from "./pages/Login";
const routes = (
   <Router>
      <Routes>
        <Route path="/Home" exact element={<Home/>}></Route>
        <Route path="/ListingPage" exact element={<ListingPage/>}></Route>
        <Route path="/MoviePage/:id" exact element={<MoviePage/>}></Route>
        <Route path="/Me" exact element={<ProfilePage/>}></Route>
        <Route path="/WriteAReview/:id" exact element={<PostAReview/>}></Route>
        <Route path="/login" exact element={<LoginPage/>}></Route>
      </Routes>
   </Router>
)
const App = () =>{
  return (
    <div>{routes}</div>
  )
}
export default App;