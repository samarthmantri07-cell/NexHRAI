import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';

const prisma = new PrismaClient();

export const generateReport = catchAsync(async (req: Request, res: Response) => {
  const { type, format } = req.body;
  
  if (format === 'CSV') {
    // Generate CSV
    const employees = await prisma.employee.findMany({
      select: {
        employeeNumber: true,
        age: true,
        gender: true,
        department: { select: { name: true } },
        jobRole: true,
        monthlyIncome: true,
        yearsAtCompany: true,
        attrition: true
      },
      take: 1000 // Limit for performance if needed, or all.
    });

    const csvData = employees.map(emp => ({
      EmployeeNumber: emp.employeeNumber,
      Age: emp.age,
      Gender: emp.gender,
      Department: emp.department.name,
      Role: emp.jobRole,
      MonthlyIncome: emp.monthlyIncome,
      YearsAtCompany: emp.yearsAtCompany,
      Attrition: emp.attrition ? 'Yes' : 'No'
    }));

    const json2csvParser = new Parser();
    const csv = json2csvParser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=NexHR_${type.replace(/\s+/g, '_')}_Report.csv`);
    return res.status(200).send(csv);
  } else if (format === 'PDF') {
    // Generate PDF
    const employeeCount = await prisma.employee.count();
    const highRiskCount = await prisma.employee.count({ where: { attrition: true } });
    
    const doc = new PDFDocument({ margin: 50 });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=NexHR_${type.replace(/\s+/g, '_')}_Report.pdf`);
    
    doc.pipe(res);
    
    doc.fontSize(20).text(`NexHR-AI ${type} Report`, { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(12).text(`Generated At: ${new Date().toLocaleString()}`);
    doc.moveDown();
    
    doc.fontSize(14).text('Overview Statistics', { underline: true });
    doc.fontSize(12).text(`Total Employees: ${employeeCount}`);
    doc.fontSize(12).text(`High Attrition Risk Employees: ${highRiskCount}`);
    doc.moveDown();
    
    // Some extra metrics
    const aggregates = await prisma.employee.aggregate({
      _avg: { monthlyIncome: true, yearsAtCompany: true }
    });
    
    doc.fontSize(12).text(`Average Monthly Income: $${Math.round(aggregates._avg.monthlyIncome || 0)}`);
    doc.fontSize(12).text(`Average Tenure: ${Math.round(aggregates._avg.yearsAtCompany || 0)} Years`);
    
    doc.end();
    return;
  } else {
    return res.status(400).json({ status: 'fail', message: 'Invalid format requested.' });
  }
});
