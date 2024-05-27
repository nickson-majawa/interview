import React, { useEffect, useState } from "react";
import { getRecords } from "../api";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Facilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [districts, setDistricts] = useState({});
  const [owners, setOwners] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facilitiesResponse, districtsResponse, ownersResponse] =
          await Promise.all([
            getRecords(),
            axios.get("https://zipatala.health.gov.mw/api/districts"),
            axios.get("https://zipatala.health.gov.mw/api/owners"),
          ]);

        const districtsData = districtsResponse.data.reduce((acc, district) => {
          acc[district.id] = district.district_name;
          return acc;
        }, {});

        const ownersData = ownersResponse.data.reduce((acc, owner) => {
          acc[owner.id] = owner.facility_owner;
          return acc;
        }, {});

        setFacilities(facilitiesResponse.data);
        setDistricts(districtsData);
        setOwners(ownersData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = facilities;
    if (selectedDistrict) {
      filtered = filtered.filter(
        (facility) => facility.district_id === parseInt(selectedDistrict)
      );
    }
    if (searchTerm) {
      filtered = filtered.filter((facility) =>
        facility.facility_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredFacilities(filtered);
  }, [facilities, selectedDistrict, searchTerm]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredFacilities.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container">
      <h2 className="my-4">List of Facilities</h2>
      <div className="mb-3">
        <Link to="/create">
          <button className="btn btn-primary">Add New Facility</button>
        </Link>
      </div>
      <div className="row mb-3">{/* Your filtering options */}</div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Facility Name</th>
            <th>District</th>
            <th>Facility Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((facility) => (
            <tr key={facility.id}>
              <td>{facility.facility_name}</td>
              <td>{districts[facility.district_id] || "Unknown"}</td>
              <td>{owners[facility.client_id] || "Unknown"}</td>
              <td>
                <Link to={`/view/${facility.id}`}>
                  <button className="btn btn-info">View</button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ul className="pagination">
        {Array.from({
          length: Math.ceil(filteredFacilities.length / itemsPerPage),
        }).map((_, index) => (
          <li
            key={index}
            className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
          >
            <button className="page-link" onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Facilities;
