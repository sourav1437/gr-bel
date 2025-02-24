"use client";  // Make sure this is at the top

import { useState } from 'react'; 
import { Button } from '@/components/ui/button'; 
import ItemTable from '@/components/component/ItemTable';
import { useRouter } from 'next/navigation';  // Importing useRouter
import Accessories from '@/components/component/Accessories';

export default function Page() {
  const [grNo, setGrNo] = useState('');
  const [grDate, setGrDate] = useState('');
  const [poNo, setPoNo] = useState('');
  const [poDate, setPoDate] = useState(''); // Added PO Date state
  const [project, setProject] = useState('');
  const [vendor, setVendor] = useState('');
  const [items, setItems] = useState([{
    partNo: '',
    description: '',
    qty: '',
    itemSlNo: '',
    make: '',
    mpnSAP: '',
    mpnItemLabel: '',
    ds: false,
    coc: false,
    tmr: false,
    inv: false,
    boe: false,
    awb: false,
    po: false,
    beCoc: false,
  }]);
  const [accessories, setAccessories] = useState([{
    description: '',
    partNo: '',
    qty: '',
  }]);

  const router = useRouter();  // Router for navigation

  const isFormComplete = grNo && poNo && grDate && project && vendor && items.length > 0;

  // Collecting form values from input fields
  const mirrorInput = (e) => {
    const { name, value } = e.target;
    if (name === 'gr_no') {
      setGrNo(value);
    } else if (name === 'gr_date') {
      setGrDate(value);
    } else if (name === 'po_no') {
      setPoNo(value);
    } else if (name === 'po_date') {
      setPoDate(value); // Handle PO Date input
    } else if (name === 'project') {
      setProject(value);
    } else if (name === 'vendor') {
      setVendor(value);
    }
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    const formData = {
      grNo,
      grDate,
      poNo,
      poDate,  // Include PO Date in the form data
      project,
      vendor,
      items,
      accessories,
    };

    try {
      const response = await fetch('/api/saveForm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        const reportId = data.reportId;  // Assuming the API returns this

        alert('Data saved successfully!');
        resetForm();  // Reset form data

        // Redirect to the dynamic page based on the reportId
        router.push(`/inspection/${reportId}`);  // Redirect to the inspection page
      } else {
        alert('Failed to save data');
      }
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data');
    }
  };

  const resetForm = () => {
    setGrNo('');
    setGrDate('');
    setPoNo('');
    setPoDate('');  // Reset PO Date as well
    setProject('');
    setVendor('');
    setItems([{
      partNo: '',
      description: '',
      qty: '',
      itemSlNo: '',
      make: '',
      mpnSAP: '',
      mpnItemLabel: '',
      ds: false,
      coc: false,
      tmr: false,
      inv: false,
      boe: false,
      awb: false,
      po: false,
      beCoc: false,
    }]);
    setAccessories([{
      description: '',
      partNo: '',
      qty: '',
    }])
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <>
      <div className="mx-auto mt-5 p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">
          MATERIAL INSPECTION REPORT (PP & MI/SS & CS/NS)
        </h1>
        <div>
          <form id="inspection-form" className="space-y-6">
            <div className="flex flex-wrap justify-between gap-6">
              <div className="form-group flex-grow">
                <label htmlFor="gr-no" className="block text-lg font-medium">GR No.</label>
                <input
                  type="text"
                  id="gr-no"
                  className="form-input block w-full p-2 border border-gray-300 rounded-md"
                  name="gr_no"
                  placeholder="Enter GR No."
                  value={grNo}
                  onChange={mirrorInput}
                  required
                />
              </div>
              <div className="form-group flex-grow">
                <label htmlFor="gr-date" className="block text-lg font-medium">GR Date</label>
                <input
                  type="date"
                  id="gr-date"
                  className="form-input block w-full p-2 border border-gray-300 rounded-md"
                  name="gr_date"
                  value={grDate}
                  onChange={mirrorInput}
                  required
                />
              </div>
              <div className="form-group flex-grow">
                <label htmlFor="po-no" className="block text-lg font-medium">PO No.</label>
                <input
                  type="text"
                  id="po-no"
                  className="form-input block w-full p-2 border border-gray-300 rounded-md"
                  name="po_no"
                  placeholder="Enter PO No."
                  value={poNo}
                  onChange={mirrorInput}
                  required
                />
              </div>
             
              <div className="form-group flex-grow">
                <label htmlFor="po-date" className="block text-lg font-medium">PO Date</label>
                <input
                  type="date"
                  id="po-date"
                  className="form-input block w-full p-2 border border-gray-300 rounded-md"
                  name="po_date"
                  value={poDate}
                  onChange={mirrorInput}
                  required
                />
              </div>
              <div className="form-group flex-grow">
                <label htmlFor="project" className="block text-lg font-medium">Project</label>
                <input
                  type="text"
                  id="project"
                  className="form-input block w-full p-2 border border-gray-300 rounded-md"
                  name="project"
                  placeholder="Enter Project Name"
                  value={project}
                  onChange={mirrorInput}
                  required
                />
              </div>
              <div className="form-group flex-grow">
                <label htmlFor="vendor" className="block text-lg font-medium">Vendor</label>
                <input
                  type="text"
                  id="vendor"
                  className="form-input block w-full p-2 border border-gray-300 rounded-md"
                  name="vendor"
                  placeholder="Enter Vendor Name"
                  value={vendor}
                  onChange={mirrorInput}
                  required
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Insert your ItemTable Component */}
      <ItemTable items={items} setItems={setItems} />

      <Accessories accessories={accessories} setAccessories={setAccessories} />

      <div className="flex justify-center gap-10 mt-20 mb-10">
        <Button className="bg-green-500 hover:bg-green-600" onClick={handleSubmit} disabled={!isFormComplete}>Create</Button>
        <Button className="bg-red-500 hover:bg-red-600" onClick={handleCancel}>Cancel</Button>
      </div>
    </>
  );
}