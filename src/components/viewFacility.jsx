// src/components/ViewFacility.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecord } from "../api";
import axios from "axios";

const ViewFacility = () => {
  const { id } = useParams < { id: string } > facility.facility_id;
  const [facility, setFacility] = useState < any > null;
  const [districtName, setDistrictName] = useState("");
  const [facilityOwner, setFacilityOwner] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFacilityDetails = async () => {
      try {
        const facilityResponse = await getRecord(id);
        setFacility(facilityResponse.data);

        const districtResponse = await axios.get(
          `https://zipatala.health.gov.mw/api/districts/${facilityResponse.data.district_id}`
        );
        setDistrictName(districtResponse.data.district_name);

        const ownerResponse = await axios.get(
          `https://zipatala.health.gov.mw/api/owners/${facilityResponse.data.client_id}`
        );
        setFacilityOwner(ownerResponse.data.facility_owner);

        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchFacilityDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Facility Details</h2>
      <table>
        <tbody>
          <tr>
            <td>
              <strong>Facility Name:</strong>
            </td>
            <td>{facility.facility_name}</td>
          </tr>
          <tr>
            <td>
              <strong>District:</strong>
            </td>
            <td>{districtName}</td>
          </tr>
          <tr>
            <td>
              <strong>Facility Owner:</strong>
            </td>
            <td>{facilityOwner}</td>
          </tr>
          <tr>
            <td>
              <strong>Facility Code:</strong>
            </td>
            <td>{facility.facility_code}</td>
          </tr>
          {/* Add more details as needed */}
        </tbody>
      </table>
    </div>
  );
};

export default ViewFacility;
