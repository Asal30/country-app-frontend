// import { useState, useEffect } from "react";
// import axios from "axios";

// function HomePage({ token }) {
//   const [apiKeys, setApiKeys] = useState([]);
//   const [selectedApiKey, setSelectedApiKey] = useState(null);
//   const [newKeyName, setNewKeyName] = useState("");
//   const [countries, setCountries] = useState([]);
//   const [allCountries, setAllCountries] = useState([]);
//   const [countryName, setCountryName] = useState("");
//   const [searchError, setSearchError] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchApiKeys = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/auth/api-keys`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         setApiKeys(response.data);
//       } catch (error) {
//         console.error("Failed to fetch API keys", error);
//       }
//     };
//     fetchApiKeys();
//   }, [token]);

//   const fetchCountryData = async () => {
//     try {
//       if (countryName) {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/countries/${countryName}`,
//           {
//             headers: { Authorization: `Bearer ${token}` },
//           }
//         );
//         console.log(response);
//         setCountries([response.data]);
//         setSearchError("");
//       } else {
//         setSearchError("Please enter a country name");
//       }
//     } catch (err) {
//       setSearchError("Invalid country name, please try again");
//       console.error(err);
//     }
//   };

//   const fetchAllCountries = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/countries`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setAllCountries(response.data);
//       setError("");
//     } catch (err) {
//       setError("Failed to fetch country data");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }
//   const generateApiKey = async () => {
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/auth/generate-api-key`,
//         { name: newKeyName },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       ).then((response) => {
//         setApiKeys([...apiKeys, response.data]);
//         setNewKeyName("");
//       });
//     } catch (err) {
//       console.error("Failed to generate API key", err);
//     }
//   };

//   const handleRowClick = (key) => {
//     setSelectedApiKey(key);
//     console.log("Selected API Key : ", key);
//   };

//   return (
//     <div className="h-[100vh] bg-primary-100 overflow-auto">
//       <section className="text-center py-20 align-center flex flex-col align-center justify-center">
//         <h1 className="text-4xl md:text-6xl font-bold text-primary-800 mb-6">
//           Explore the World
//         </h1>
//         <p className="text-xl text-primary-600 max-w-2xl mx-auto mb-8">
//           Get detailed information about any country with our secure API
//         </p>

//         {/* API Key Management */}
//         <div className="mb-4 p-4 flex flex-col items-center">
//           <div className="mb-4">
//             <input
//               type="text"
//               value={newKeyName}
//               onChange={(e) => setNewKeyName(e.target.value)}
//               placeholder="Enter API Key Name"
//               className="p-3 border rounded-lg mr-5"
//             />
//             <button
//               onClick={generateApiKey}
//               className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition"
//             >
//               Generate Key
//             </button>
//           </div>

//           {/* API Key Table */}
//           <div className="flex justify-center items-center mb-2 max-w-[30%]">
//             <table className="table-auto w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
//               <thead className="bg-primary-600 text-white">
//                 <tr>
//                   <th className="px-4 py-2">API Key Name</th>
//                   <th className="px-4 py-2">API Key</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white">
//                 {apiKeys.map((key) => (
//                   <tr key={key.id} className="border-b hover:bg-primary-100 cursor-pointer" onClick={() => handleRowClick(key)}>
//                     <td className="px-3 py-2">{key.name}</td>
//                     <td className="px-3 py-2">{key.apiKey}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//         {/* Display the selected API key details */}
//       {selectedApiKey && (
//         <div className="bg-primary-100 rounded-lg">
//           <h3 className="text-lg font-semibold">Selected API Key Details</h3>
//           <p>Name : {selectedApiKey.name}</p>
//           <p>API Key : {selectedApiKey.apiKey}</p>
//         </div>
//       )}
//         {/* Country Search */}
//         <div className="mb-8 p-4 flex flex-col items-center">
//           <div className="mb-4">
//             <input
//               type="text"
//               value={countryName}
//               onChange={(e) => setCountryName(e.target.value)}
//               placeholder="Enter Country Name"
//               className="p-3 border rounded-lg mr-5"
//             />
//             <button
//               onClick={fetchCountryData}
//               className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition"
//             >
//               Search Country
//             </button>
//           </div>

//           {searchError && <div className="text-red-600 mb-4">{searchError}</div>}

//           {/* Display Country Data */}
//           <div className="flex justify-center items-center mb-2 max-w-[30%]">
//             {countries.length > 0 && (
//               <div className="border rounded-lg p-4 shadow-md flex">
//                 <div className="text-left">
//                 <h3 className="text-xl font-bold">{countries[0].name}</h3>
//                 <p><strong>Capital : </strong> {countries[0].capital}</p>
//                 <p><strong>Currency : </strong>{countries[0].currency}</p>
//                 <p><strong>Languages : </strong>{countries[0].languages.join(", ")}</p>
//                 </div>
//                 <img
//                   src={countries[0].flag}
//                   alt={countries[0].name}
//                   className="w-[150px] h-[100px] ml-4 flex items-center justify-center"
//                 />
//               </div>
//             )}
//           </div>
//         </div>
//       {/* Display all Countries */}
//       <div>
//         <button onClick={fetchAllCountries} 
//           className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 m-5 rounded-lg font-medium transition">
//             Get All Countries
//           </button>
//           {loading && <p className="text-primary-600">Loading countries...</p>}
//           {error && <p className="text-red-600">{error}</p>}
//           <div className="mx-[10%]">
//             <div className="space-x-4">
//               {allCountries.length > 0 && (
//                 <div className="grid grid-cols-3 gap-4">
//                   {allCountries.map((country, index) => (
//                     <div key={index} className="border rounded-lg p-4 shadow-md flex justify-evenly">
//                       <div className="text-left">
//                       <h3 className="text-xl font-bold">{country.name}</h3>
//                       <p>Region: {country.region}</p>
//                       <p>Capital: {country.capital || "N/A"}</p>
//                       </div>
//                         <img
//                           src={country.flag}
//                           alt={country.name}
//                           className="w-[150px] h-[100px] ml-4 flex"
//                         />
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default HomePage;

import { useState, useEffect } from "react";
import axios from "axios";

export default function HomePage({ token }) {
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    content: "",
    country: "",
    dateOfVisit: "",
    photos: [], // New field for photos
  });
  const [isEditing, setIsEditing] = useState(false);
  const [photoPreviews, setPhotoPreviews] = useState([]); // For previewing uploaded photos

  // Fetch blog posts from the backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
    };
    fetchPosts();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle photo uploads
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, photos: files });

    // Generate previews for the uploaded photos
    const previews = files.map((file) => URL.createObjectURL(file));
    setPhotoPreviews(previews);
  };

  // Handle form submission for creating or editing a post
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("content", formData.content);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("dateOfVisit", formData.dateOfVisit);

      // Append photos to the form data
      formData.photos.forEach((photo) => {
        formDataToSend.append("photos", photo);
      });

      if (isEditing) {
        // Update an existing post
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/posts/${formData.id}`,
          formDataToSend,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
      } else {
        // Create a new post
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/posts`, formDataToSend, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
        });
      }
      setFormData({ id: null, title: "", content: "", country: "", dateOfVisit: "", photos: [] });
      setPhotoPreviews([]);
      setIsEditing(false);
      setIsModalOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("Failed to save post", error);
    }
  };

  // Handle deleting a post
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Failed to delete post", error);
    }
  };

  // Handle editing a post
  const handleEdit = (post) => {
    setFormData(post);
    setPhotoPreviews(post.photos || []);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-primary-100 min-h-screen p-6">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary-800">Welcome to the Country Blog</h1>
        <p className="text-primary-600 text-lg mt-2">
          Explore recent and popular blog posts about countries around the world.
        </p>
      </header>

      {/* Add Blog Button */}
      {token && (
        <div className="text-center mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Add New Blog
          </button>
        </div>
      )}

      {/* Blog Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h2 className="text-xl font-bold text-primary-800">{post.title}</h2>
              <p className="text-primary-600 text-sm mt-2">{post.content}</p>
              <p className="text-primary-600 text-sm mt-2">
                <strong>Country:</strong> {post.country}
              </p>
              <p className="text-primary-600 text-sm mt-2">
                <strong>Date of Visit:</strong> {new Date(post.dateOfVisit).toLocaleDateString()}
              </p>
              {post.photos && post.photos.length > 0 && (
                <div className="mt-4">
                  {post.photos.length === 1 ? (
                    <img
                      src={post.photos[0]}
                      alt="Blog Photo"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="relative">
                      <img
                        src={post.photos[0]}
                        alt="Blog Photo"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2 flex space-x-2">
                        {post.photos.map((photo, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              const reorderedPhotos = [...post.photos];
                              const [selectedPhoto] = reorderedPhotos.splice(index, 1);
                              reorderedPhotos.unshift(selectedPhoto);
                              post.photos = reorderedPhotos;
                              setPosts([...posts]);
                            }}
                            className="bg-primary-600 text-white px-2 py-1 rounded-full text-xs"
                          >
                            {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {token && (
                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => handleEdit(post)}
                    className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Blog Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Edit Blog Post" : "Add New Blog Post"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">Date of Visit</label>
                <input
                  type="date"
                  name="dateOfVisit"
                  value={formData.dateOfVisit}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-primary-800 font-medium mb-2">Photos</label>
                <input
                  type="file"
                  name="photos"
                  multiple
                  onChange={handlePhotoChange}
                  className="w-full p-2 border rounded-lg"
                />
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {photoPreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"
                >
                  {isEditing ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}