import React, { useState } from "react";
import "./Search.css";
// import { useRedirect } from 'react-router';
import { useNavigate } from "react-router";

const Search = () => {
  const redirect = useNavigate();
  const [keyword, setKeyword] = useState("");

  const searchSubmitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      // setKeyword()
      let mySearch = keyword.trim().replaceAll(' ', '')
      console.log(mySearch)
      redirect(`/products/${mySearch}`);
    } else {
      redirect("/products");
    }
  };
  return (
    <>
      <form className="searchBox" onSubmit={searchSubmitHandler}>
        <input
          type="text"
          placeholder="Search a Product..."
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input type="submit" value="Search" />
      </form>
    </>
  );
};

export default Search;
