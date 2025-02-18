import React from 'react';
import { jsPDF } from "jspdf";
import "jspdf-autotable";  // Optional, for table formatting

const DownloadPDF = ({ projects, users }) => {
    const handleDownloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Project Data", 14, 16);

        // Define table columns
        const tableColumns = ["ID", "Title", "Description", "Start Date", "End Date", "Due Date", "Assigned Users"];
        
        // Map projects to rows
        const tableRows = projects.map(project => [
            project._id,
            project.title,
            project.description,
            new Date(project.startDate).toLocaleDateString(),
            new Date(project.endDate).toLocaleDateString(),
            new Date(project.dueDate).toLocaleDateString(),
            project.assignedTeam.map(userId => users.find(user => user._id === userId)?.name).join(", ") || "No users assigned"
        ]);

        // Add table to PDF (use jsPDF autoTable plugin)
        doc.autoTable({
            head: [tableColumns],
            body: tableRows,
            startY: 30,  // Start below the title
            theme: "grid",
        });

        // Save the PDF
        doc.save("projects.pdf");
    };

    return (
        <button onClick={handleDownloadPDF} className="btn btn-success mt-4">
            Download Project Data as PDF
        </button>
    );
};

export default DownloadPDF;
