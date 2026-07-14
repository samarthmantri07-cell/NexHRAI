-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "roleId" TEXT NOT NULL,
    "employeeId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" TEXT NOT NULL,
    "employeeNumber" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "maritalStatus" TEXT NOT NULL,
    "over18" BOOLEAN NOT NULL DEFAULT true,
    "departmentId" TEXT NOT NULL,
    "jobRole" TEXT NOT NULL,
    "jobLevel" INTEGER NOT NULL,
    "businessTravel" TEXT NOT NULL,
    "overTime" BOOLEAN NOT NULL,
    "education" INTEGER NOT NULL,
    "educationField" TEXT NOT NULL,
    "monthlyIncome" INTEGER NOT NULL,
    "monthlyRate" INTEGER NOT NULL,
    "dailyRate" INTEGER NOT NULL,
    "hourlyRate" INTEGER NOT NULL,
    "percentSalaryHike" INTEGER NOT NULL,
    "stockOptionLevel" INTEGER NOT NULL,
    "performanceRating" INTEGER NOT NULL,
    "jobSatisfaction" INTEGER NOT NULL,
    "environmentSatisfaction" INTEGER NOT NULL,
    "relationshipSatisfaction" INTEGER NOT NULL,
    "workLifeBalance" INTEGER NOT NULL,
    "jobInvolvement" INTEGER NOT NULL,
    "totalWorkingYears" INTEGER NOT NULL,
    "numCompaniesWorked" INTEGER NOT NULL,
    "yearsAtCompany" INTEGER NOT NULL,
    "yearsInCurrentRole" INTEGER NOT NULL,
    "yearsSinceLastPromotion" INTEGER NOT NULL,
    "yearsWithCurrManager" INTEGER NOT NULL,
    "distanceFromHome" INTEGER NOT NULL,
    "employeeCount" INTEGER NOT NULL DEFAULT 1,
    "standardHours" INTEGER NOT NULL DEFAULT 80,
    "trainingTimesLastYear" INTEGER NOT NULL,
    "attrition" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_employeeId_key" ON "users"("employeeId");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_roleId_idx" ON "users"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "departments_name_key" ON "departments"("name");

-- CreateIndex
CREATE UNIQUE INDEX "employees_employeeNumber_key" ON "employees"("employeeNumber");

-- CreateIndex
CREATE INDEX "employees_departmentId_idx" ON "employees"("departmentId");

-- CreateIndex
CREATE INDEX "employees_jobRole_idx" ON "employees"("jobRole");

-- CreateIndex
CREATE INDEX "employees_attrition_idx" ON "employees"("attrition");

-- CreateIndex
CREATE INDEX "employees_performanceRating_idx" ON "employees"("performanceRating");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
