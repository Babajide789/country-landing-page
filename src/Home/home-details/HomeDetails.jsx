// src/pages/CountryDetail.jsx
import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { CountryContext } from "../../context/CountryContext";
import "./HomeDetails.css";
import { HiArrowNarrowLeft } from "react-icons/hi";


const slugify = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const CountryDetail = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const allCountries = useContext(CountryContext);
  const [country, setCountry] = useState(undefined);

  useEffect(() => {
    if (allCountries.length === 0) return;

    const match = allCountries.find((c) => slugify(c.name) === name);
    setCountry(match || null);
  }, [name, allCountries]);

  if (country === undefined) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (country === null) {
    return (
      <div className="country-detail not-found">
        <h2>❌ Country Not Found</h2>
        <p>The country you are looking for does not exist or was not found in the dataset.</p>
        <button className="back-btn" onClick={() => navigate("/")}>← Back to Home</button>
      </div>
    );
  }

  const {
    name: countryName,
    flags,
    population,
    region,
    subregion,
    capital,
    tld,
    currencies,
    languages,
    borders
  } = country;

  const currencyNames = currencies
    ? Object.values(currencies).map((c) => c.name).join(", ")
    : "N/A";

  const languageNames = languages
    ? Object.values(languages).join(", ")
    : "N/A";

  const getBorderName = (code) => {
    const match = allCountries.find((c) => c.cca3 === code);
    return match?.name || code;
  };

  return (
    <div className="country-detail fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <HiArrowNarrowLeft style={{ marginRight: "8px" }} />
        Back
      </button>
      <div className="detail-content">
        <img src={flags?.png} alt={`${countryName} flag`} />
        <div className="detail-text">
          <h2>{countryName}</h2>
          <div className="infos">
            <div className="info1">
              <p><strong>Population:</strong> {population?.toLocaleString() || "N/A"}</p>
              <p><strong>Region:</strong> {region || "N/A"}</p>
               <p><strong>Sub Region:</strong> {subregion || "N/A"}</p>
              <p><strong>Capital:</strong> {Array.isArray(capital) ? capital[0] : capital || "N/A"}</p>
            </div>

            <div className="info2">
              <p><strong>Top Level Domain:</strong> {Array.isArray(tld) ? tld[0] : tld || "N/A"}</p>
              <p><strong>Currencies:</strong> {currencyNames}</p>
              <p><strong>Languages:</strong> {languageNames}</p>
            </div>
          </div>
         

          {borders && (
            <div className="borders">
              <strong>Border Countries:</strong>
              <div className="border-tags">
                {borders.map((code) => {
                  const name = getBorderName(code);
                  return (
                    <Link key={code} to={`/country/${slugify(name)}`} className="border-link">
                      {name}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
