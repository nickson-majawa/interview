import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateFacilities = () => {
  const [facilityName, setFacilityName] = useState("");
  const [commonName, setCommonName] = useState("");
  const [districts, setDistricts] = useState([]);
  const [clients, setClients] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [districtsResponse, clientsResponse] = await Promise.all([
          axios.get("https://zipatala.health.gov.mw/api/districts"),
          axios.get("https://zipatala.health.gov.mw/api/owners"),
        ]);

        setDistricts(districtsResponse.data);
        setClients(clientsResponse.data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newFacility = {
      facility_name: facilityName,
      common_name: commonName,
      district_id: selectedDistrict,
      client_id: selectedClient,
    };

    try {
      const response = await axios.post(
        "https://zipatala.health.gov.mw/api/facilities",
        newFacility
      );
      if (response.status === 201) {
        setSuccessMessage("Facility added successfully!");
        setFacilityName(""); // Reset form fields
        setCommonName(""); // Reset form fields
        setSelectedDistrict(""); // Reset form fields
        setSelectedClient(""); // Reset form fields
      }
    } catch (error) {
      setErrorMessage("Failed to add facility. Please try again.");
      console.error("Error adding facility: ", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Create a New Facility</h1>
      {successMessage && (
        <div className="alert alert-success">{successMessage}</div>
      )}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Facility Name:</label>
          <input
            type="text"
            className="form-control"
            value={facilityName}
            onChange={(e) => setFacilityName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Common Name:</label>
          <input
            type="text"
            className="form-control"
            value={commonName}
            onChange={(e) => setCommonName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">District:</label>
          <select
            className="form-select"
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            required
          >
            <option value="">Select a District</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.district_name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Client:</label>
          <select
            className="form-select"
            value={selectedClient}
            onChange={(e) => setSelectedClient(e.target.value)}
            required
          >
            <option value="">Select a Client</option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.facility_owner}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Facility
        </button>
      </form>
    </div>
  );
};

export default CreateFacilities;
