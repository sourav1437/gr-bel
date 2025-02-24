"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Remarks from "@/components/component/Remarks";

export default function InspectionPage() {
  const { reportId } = useParams();

  // State Management
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dimensionRows, setDimensionRows] = useState([]);
  const [remarks, setRemarks] = useState([]);

  // Fetch Items and Generate Dimension Rows
  useEffect(() => {
    const fetchItems = async () => {
      try {
        if (!reportId) {
          console.error("No report ID provided");
          return;
        }

        const response = await fetch(`/api/getItems?reportId=${reportId}`);
        const data = await response.json();

        if (data.error) {
          console.error(data.error);
          return;
        }

        setItems(data.items);
        generateDimensionRows(data.items);
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchItems();
    }
  }, [reportId]);

  // Generate Dimension Rows
  const generateDimensionRows = (items) => {
    let serialNumbers = {};
    const rows = [];

    items.forEach((item) => {
      const serialNumber =
        serialNumbers[item.part_no] ||
        (serialNumbers[item.part_no] = Object.keys(serialNumbers).length + 1);

      for (let i = 0; i < item.qty; i++) {
        rows.push({
          ...item,
          serialNumber,
          dimnToll1: "",
          measuredToll1: "",
          dimnToll2: "",
          measuredToll2: "",
          dimnToll3: "",
          measuredToll3: "",
        });
      }
    });

    setDimensionRows(rows);
  };

  // Handle Input Changes for Dimension Rows
  const handleDimensionInputChange = (index, field, value) => {
    const updatedRows = dimensionRows.map((row, idx) => {
      if (idx === index) {
        return { ...row, [field]: value };
      }
      return row;
    });
    setDimensionRows(updatedRows);
  };

  // Delete Dimension Row
  const deleteDimensionRow = (index) => {
    const updatedRows = dimensionRows.filter(
      (_, rowIndex) => rowIndex !== index
    );
    setDimensionRows(updatedRows);
  };

  // Handle Submit
  const handleSubmit = async () => {
    // Filter out empty remarks
    const filteredRemarks = remarks.filter(remark => remark.observation.trim() !== "");

    // Prepare form data
    const formData = {
      reportId: reportId,
      dimensionRows,
      remarks: filteredRemarks // Use filtered remarks
    };

    console.log("Form Submitted:", formData);

    try {
      const response = await fetch("/api/saveDynamic", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Form submitted successfully");

        // Clear the input fields by resetting the state variables
        setItems([]);
        setDimensionRows([]);
        setRemarks([]);
        // Optionally, you can also reset the loading state
        setLoading(false);
      } else {
        console.error("Failed to submit form:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <section className="mt-10">
        {/* Dimension Check Table */}
        <h1 className="text-2xl font-semibold text-center mb-6">
          DIMENSION CHECK: {reportId}
        </h1>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Serial No</th>
              <th className="border px-2 py-1">Part No</th>
              <th className="border px-2 py-1">Dimn Toll 1 (mm)</th>
              <th className="border px-2 py-1">Measured Toll 1 (mm)</th>
              <th className="border px-2 py-1">Dimn Toll 2 (mm)</th>
              <th className="border px-2 py-1">Measured mm 2</th>
              <th className="border px-2 py-1">Dimn Toll 3 (mm)</th>
              <th className="border px-2 py-1">Measured Toll 3 (mm)</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {dimensionRows.map((row, index) => (
              <tr key={index} className="text-center">
                <td>{row.serialNumber}</td>
                <td>{row.part_no}</td>
                <td>
                  <input
                    type="number"
                    placeholder="Dimn Toll 1"
                    className="w-40"
                    value={row.dimnToll1}
                    onChange={(e) =>
                      handleDimensionInputChange(
                        index,
                        "dimnToll1",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Measured Toll 1"
                    className="w-40"
                    value={row.measuredToll1}
                    onChange={(e) =>
                      handleDimensionInputChange(
                        index,
                        "measuredToll1",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Dimn Toll 2"
                    className="w-40"
                    value={row.dimnToll2}
                    onChange={(e) =>
                      handleDimensionInputChange(
                        index,
                        "dimnToll2",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Measured Toll 2"
                    className="w-40"
                    value={row.measuredToll2}
                    onChange={(e) =>
                      handleDimensionInputChange(
                        index,
                        "measuredToll2",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Dimn Toll 3"
                    className="w-40"
                    value={row.dimnToll3}
                    onChange={(e) =>
                      handleDimensionInputChange(
                        index,
                        "dimnToll3",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    placeholder="Measured Toll 3"
                    className="w-40"
                    value={row.measuredToll3}
                    onChange={(e) =>
                      handleDimensionInputChange(
                        index,
                        "measuredToll3",
                        e.target.value
                      )
                    }
                  />
                </td>
                <td>
                  <button onClick={() => deleteDimensionRow(index)}>Del</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Remarks Table */}
      <Remarks remarks={remarks} setRemarks={setRemarks} />

      {/* Submit Button */}
      <div className="text-center mt-8 mb-8">
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-md"
        >
          Submit
        </button>
      </div>
    </>
  );
}