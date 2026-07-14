const fs = require('fs');
const path = require('path');
const csv = require('../../backend/node_modules/csv-parser');
const { PrismaClient } = require('../../backend/node_modules/@prisma/client');

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres:nexhr123@localhost:5432/nexhrai_db?schema=public"
    }
  }
});

const DATASET_PATH = path.resolve(__dirname, '../../datasets/raw/WA_Fn-UseC_-HR-Employee-Attrition.csv');



// Since the CSV is only 1470 rows (~220KB), it's completely safe and much easier to read the entire file into memory, then process sequentially.
async function importDatasetSync() {
  console.log('🚀 Starting IBM HR Dataset Import...');
  console.log(`📂 Dataset Path: ${DATASET_PATH}`);

  if (!fs.existsSync(DATASET_PATH)) {
    console.error(`❌ Dataset file not found at ${DATASET_PATH}`);
    process.exit(1);
  }

  const results = [];
  
  await new Promise((resolve, reject) => {
    fs.createReadStream(DATASET_PATH)
      .pipe(csv({ mapHeaders: ({ header }) => header.trim().replace(/^[\uFEFF]/, '') }))
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(true))
      .on('error', reject);
  });

  console.log(`📄 Read ${results.length} rows from CSV.`);

  const departmentCache = new Map(); // Name -> ID

  let rowCount = 0;
  const batchSize = 100;
  
  for (let i = 0; i < results.length; i += batchSize) {
    const batch = results.slice(i, i + batchSize);
    
    const validBatch = batch.filter(row => row.Age && !isNaN(parseInt(row.Age, 10)));
    
    // Process relations (Departments)
    for (const row of validBatch) {
      if (!departmentCache.has(row.Department)) {
        const dept = await prisma.department.upsert({
          where: { name: row.Department },
          update: {},
          create: { name: row.Department },
        });
        departmentCache.set(row.Department, dept.id);
      }
    }

    // Map batch
    const employeesData = validBatch.map((row) => ({
      employeeNumber: parseInt(row.EmployeeNumber, 10),
      age: parseInt(row.Age, 10),
      attrition: row.Attrition === 'Yes',
      businessTravel: row.BusinessTravel,
      dailyRate: parseInt(row.DailyRate, 10),
      departmentId: departmentCache.get(row.Department),
      distanceFromHome: parseInt(row.DistanceFromHome, 10),
      education: parseInt(row.Education, 10),
      educationField: row.EducationField,
      employeeCount: parseInt(row.EmployeeCount, 10),
      environmentSatisfaction: parseInt(row.EnvironmentSatisfaction, 10),
      gender: row.Gender,
      hourlyRate: parseInt(row.HourlyRate, 10),
      jobInvolvement: parseInt(row.JobInvolvement, 10),
      jobLevel: parseInt(row.JobLevel, 10),
      jobRole: row.JobRole,
      jobSatisfaction: parseInt(row.JobSatisfaction, 10),
      maritalStatus: row.MaritalStatus,
      monthlyIncome: parseInt(row.MonthlyIncome, 10),
      monthlyRate: parseInt(row.MonthlyRate, 10),
      numCompaniesWorked: parseInt(row.NumCompaniesWorked, 10),
      over18: row.Over18 === 'Y',
      overTime: row.OverTime === 'Yes',
      percentSalaryHike: parseInt(row.PercentSalaryHike, 10),
      performanceRating: parseInt(row.PerformanceRating, 10),
      relationshipSatisfaction: parseInt(row.RelationshipSatisfaction, 10),
      standardHours: parseInt(row.StandardHours, 10),
      stockOptionLevel: parseInt(row.StockOptionLevel, 10),
      totalWorkingYears: parseInt(row.TotalWorkingYears, 10),
      trainingTimesLastYear: parseInt(row.TrainingTimesLastYear, 10),
      workLifeBalance: parseInt(row.WorkLifeBalance, 10),
      yearsAtCompany: parseInt(row.YearsAtCompany, 10),
      yearsInCurrentRole: parseInt(row.YearsInCurrentRole, 10),
      yearsSinceLastPromotion: parseInt(row.YearsSinceLastPromotion, 10),
      yearsWithCurrManager: parseInt(row.YearsWithCurrManager, 10),
    }));

    await prisma.employee.createMany({
      data: employeesData,
      skipDuplicates: true,
    });
    
    rowCount += employeesData.length;
    process.stdout.write(`\r✅ Processed ${rowCount}/${results.length} records...`);
  }

  console.log('\n🎉 Dataset imported successfully!');
}

importDatasetSync()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
