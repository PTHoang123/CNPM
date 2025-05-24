import React, { useState, useEffect } from "react";
import Helmet from "../components/Helmet";
import CommonSection from "../components/UI/CommonSection";
import { Container, Row, Col } from "reactstrap";
import ProductCard from "../components/UI/ProductCard";
import ReactPaginate from "react-paginate";

import "../styles/all-food.css";
import "../styles/pagination.css";

const AllFoods = () => {
  const [allProducts, setAllProducts] = useState([]); 
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);


useEffect(() => {
  fetch("http://localhost:8000/api/foods")
    .then(res => res.json())
    .then(data => setAllProducts(data))
    .catch(console.error);
}, []);

  const searchedProducts = allProducts.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const productPerPage = 12;
  const visitedPage = pageNumber * productPerPage;
  const displayPage = searchedProducts.slice(
    visitedPage,
    visitedPage + productPerPage
  );
  const pageCount = Math.ceil(searchedProducts.length / productPerPage);
  const changePage = ({ selected }) => setPageNumber(selected);

  return (
    <Helmet title="All-Foods">
      <CommonSection title="All Foods" />

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6" xs="12">
              <div className="search__widget d-flex align-items-center justify-content-between">
                <input
                  type="text"
                  placeholder="I'm looking for...."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPageNumber(0); 
                  }}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>

            <Col lg="6" md="6" sm="6" xs="12" className="mb-5">
              <div className="sorting__widget text-end">
                <select className="w-50">
                  <option>Default</option>
                  <option value="ascending">A–Z</option>
                  <option value="descending">Z–A</option>
                  <option value="high-price">High Price</option>
                  <option value="low-price">Low Price</option>
                </select>
              </div>
            </Col>

            {displayPage.map((item) => (
              <Col
                lg="3"
                md="4"
                sm="6"
                xs="6"
                key={item.product_code}
                className="mb-4"
              >
                <ProductCard item={item} />
              </Col>
            ))}

            <Col xs="12">
              <ReactPaginate
                pageCount={pageCount}
                onPageChange={changePage}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                containerClassName="paginationBttns"
              />
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default AllFoods;