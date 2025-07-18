import React, { useEffect, useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";



const CountryList = () => {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [loading, setLoading] = useState(true); // 🔄 added loading state

  const slugify = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
};

  // Fetch countries
  useEffect(() => {
    fetch("/data.json")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading countries:", err);
        setLoading(false);
      });
  }, []);

  // Filtered countries
  const filtered = countries.filter((country) => {
    const nameMatch = country.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const regionMatch = regionFilter === "" || country.region === regionFilter;
    return nameMatch && regionMatch;
  });

  const visibleCountries = filtered.slice(0, visibleCount);

  // Lazy load on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
        visibleCount < filtered.length
      ) {
        setIsLoadingMore(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 6);
          setIsLoadingMore(false);
        }, 600); // simulate loading
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filtered.length]);

  return (
    <>
      {loading ? (
        <div className="spinner-container">
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div className="filters">
            <input
              type="text"
              placeholder="Search by country"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select value={regionFilter} onChange={(e) => setRegionFilter(e.target.value)}>
              <option value="">All Regions</option>
              <option value="Africa">Africa</option>
              <option value="Americas">Americas</option>
              <option value="Asia">Asia</option>
              <option value="Europe">Europe</option>
              <option value="Oceania">Oceania</option>
            </select>
          </div>

          <div className="country-grid">
            {visibleCountries.map((country, i) => (
              <Link to={`/country/${slugify(country.name)}`} key={i} className="country-card">
                <img src={country.flags?.png || country.image} alt={`${country.name} flag`} />
                <h2>{country.name}</h2>
                <p><strong>Population:</strong> {country.population?.toLocaleString()}</p>
                <p><strong>Region:</strong> {country.region}</p>
                <p><strong>Capital:</strong> {Array.isArray(country.capital) ? country.capital[0] : country.capital}</p>
              </Link>
            ))}
          </div>

          {visibleCountries.length === 0 && !loading && (
            <div className="no-results">
              <p>No countries found matching your search/filter.</p>
            </div>
          )}

          {isLoadingMore && (
            <div className="spinner-container">
              <div className="spinner"></div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CountryList;
