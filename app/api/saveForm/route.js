import { NextResponse } from 'next/server';
import { 
  insertInspectionReport, 
  insertItemDetails, 
  insertAccessoriesDetails, 
} from '@/server/models/inspectionReportModel';

// POST handler to save form data
export async function POST(request) {
  try {
    // Get form data from the request body
    const { grNo, poNo, grDate, project, vendor, items, accessories } = await request.json();

    console.log('Form data received:', { grNo, poNo, grDate, project, vendor, items, accessories }); // Debugging the data

    // Step 1: Insert the inspection report into the database - inspection_reports table
    const report_id = await insertInspectionReport(grNo, poNo, grDate, project, vendor);
    console.log('Inspection report inserted, ID:', report_id); // Debugging insertion success

    // Step 2: Insert item details associated with the inspection report
    if (items && items.length > 0) {
      await insertItemDetails(report_id, items);
      console.log('Items inserted successfully'); // Debugging insertion success
    }

    // Step 3: Insert accessories details associated with the inspection report
    if (accessories && accessories.length > 0) {
      await insertAccessoriesDetails(report_id, accessories);
      console.log('Accessories inserted successfully'); // Debugging insertion success
    }

    // Send a successful response with the reportId
    return NextResponse.json({ message: 'Data saved successfully', reportId: report_id }, { status: 200 });
  } catch (err) {
    console.error('Error saving form data:', err);
    // Send an error response
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
