import { useState, useEffect } from "react";
import axios from "axios";

function HomePage({ token }) {
  const [apiKeys, setApiKeys] = useState([]);
  const [selectedApiKey, setSelectedApiKey] = useState(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [countries, setCountries] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [countryName, setCountryName] = useState("");
  const [searchError, setSearchError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/api-keys`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setApiKeys(response.data);
      } catch (error) {
        console.error("Failed to fetch API keys", error);
      }
    };
    fetchApiKeys();
  }, [token]);

  const fetchCountryData = async () => {
    try {
      if (countryName) {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/countries/${countryName}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log(response);
        setCountries([response.data]);
        setSearchError("");
      } else {
        setSearchError("Please enter a country name");
      }
    } catch (err) {
      setSearchError("Invalid country name, please try again");
      console.error(err);
    }
  };

  const fetchAllCountries = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/countries`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAllCountries(response.data);
      setError("");
    } catch (err) {
      setError("Failed to fetch country data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }
  const generateApiKey = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/generate-api-key`,
        { name: newKeyName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      ).then((response) => {
        setApiKeys([...apiKeys, response.data]);
        setNewKeyName("");
      });
    } catch (err) {
      console.error("Failed to generate API key", err);
    }
  };

  const handleRowClick = (key) => {
    setSelectedApiKey(key);
    console.log("Selected API Key : ", key);
  };

  return (
    <div className="h-[100vh] bg-primary-100 overflow-auto">
      <section className="text-center py-20 align-center flex flex-col align-center justify-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-800 mb-6">
          Explore the World
        </h1>
        <p className="text-xl text-primary-600 max-w-2xl mx-auto mb-8">
          Get detailed information about any country with our secure API
        </p>

        {/* API Key Management */}
        <div className="mb-4 p-4 flex flex-col items-center">
          <div className="mb-4">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Enter API Key Name"
              className="p-3 border rounded-lg mr-5"
            />
            <button
              onClick={generateApiKey}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Generate Key
            </button>
          </div>

          {/* API Key Table */}
          <div className="flex justify-center items-center mb-2 max-w-[30%]">
            <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-4 py-2">API Key Name</th>
                  <th className="px-4 py-2">API Key</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {apiKeys.map((key) => (
                  <tr key={key.id} className="border-b hover:bg-primary-100 cursor-pointer" onClick={() => handleRowClick(key)}>
                    <td className="px-3 py-2">{key.name}</td>
                    <td className="px-3 py-2">{key.apiKey}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Display the selected API key details */}
      {selectedApiKey && (
        <div className="bg-primary-100 rounded-lg">
          <h3 className="text-lg font-semibold">Selected API Key Details</h3>
          <p>Name : {selectedApiKey.name}</p>
          <p>API Key : {selectedApiKey.apiKey}</p>
        </div>
      )}
        {/* Country Search */}
        <div className="mb-8 p-4 flex flex-col items-center">
          <div className="mb-4">
            <input
              type="text"
              value={countryName}
              onChange={(e) => setCountryName(e.target.value)}
              placeholder="Enter Country Name"
              className="p-3 border rounded-lg mr-5"
            />
            <button
              onClick={fetchCountryData}
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Search Country
            </button>
          </div>

          {searchError && <div className="text-red-600 mb-4">{searchError}</div>}

          {/* Display Country Data */}
          <div className="flex justify-center items-center mb-2 max-w-[30%]">
            {countries.length > 0 && (
              <div className="border rounded-lg p-4 shadow-md flex">
                <div className="text-left">
                <h3 className="text-xl font-bold">{countries[0].name}</h3>
                <p><strong>Capital : </strong> {countries[0].capital}</p>
                <p><strong>Currency : </strong>{countries[0].currency}</p>
                <p><strong>Languages : </strong>{countries[0].languages.join(", ")}</p>
                </div>
                <img
                  src={countries[0].flag}
                  alt={countries[0].name}
                  className="w-[150px] h-[100px] ml-4 flex items-center justify-center"
                />
              </div>
            )}
          </div>
        </div>
      {/* Display all Countries */}
      <div>
        <button onClick={fetchAllCountries} 
          className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 m-5 rounded-lg font-medium transition">
            Get All Countries
          </button>
          {loading && <p className="text-primary-600">Loading countries...</p>}
          {error && <p className="text-red-600">{error}</p>}
          <div className="mx-[10%]">
            <div className="space-x-4">
              {allCountries.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                  {allCountries.map((country, index) => (
                    <div key={index} className="border rounded-lg p-4 shadow-md flex justify-evenly">
                      <div className="text-left">
                      <h3 className="text-xl font-bold">{country.name}</h3>
                      <p>Region: {country.region}</p>
                      <p>Capital: {country.capital || "N/A"}</p>
                      </div>
                        <img
                          src={country.flag}
                          alt={country.name}
                          className="w-[150px] h-[100px] ml-4 flex"
                        />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;