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
      <div className="row mb-3">
        <div className="col-md-4">
          <select
            className="form-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
          >
            <option value="">Select District</option>
            {Object.entries(districts).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-2">
          <button
            className="btn btn-secondary"
            onClick={() => setSelectedDistrict(selectedDistrict)}
          >
            Filter by District
          </button>
        </div>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Facility Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
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
          {filteredFacilities.map((facility) => (
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
    </div>
  );
};

export default Facilities;
