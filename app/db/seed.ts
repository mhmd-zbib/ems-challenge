import { getDB } from "./getDB";
import { faker } from "@faker-js/faker";

const DEPARTMENTS = [
  "Engineering",
  "Sales",
  "Marketing",
  "Human Resources",
  "Finance",
  "Operations",
  "Customer Support",
  "Product",
  "Legal",
  "Research"
];

const JOB_TITLES = {
  Engineering: ["Software Engineer", "Senior Engineer", "Tech Lead", "DevOps Engineer", "QA Engineer"],
  Sales: ["Sales Representative", "Account Executive", "Sales Manager", "Sales Director"],
  Marketing: ["Marketing Specialist", "Content Writer", "Marketing Manager", "SEO Specialist"],
  "Human Resources": ["HR Specialist", "Recruiter", "HR Manager", "Training Coordinator"],
  Finance: ["Accountant", "Financial Analyst", "Finance Manager", "Bookkeeper"],
  Operations: ["Operations Manager", "Project Manager", "Business Analyst", "Operations Coordinator"],
  "Customer Support": ["Support Specialist", "Customer Success Manager", "Support Team Lead"],
  Product: ["Product Manager", "Product Owner", "UX Designer", "Product Analyst"],
  Legal: ["Legal Counsel", "Compliance Officer", "Legal Assistant"],
  Research: ["Research Analyst", "Data Scientist", "Research Engineer"]
} as const;

async function seed() {
  const db = await getDB();
  
  try {
    // Clear existing data
    await db.run("DELETE FROM employees");
    
    // Reset auto-increment
    await db.run("DELETE FROM sqlite_sequence WHERE name='employees'");
    
    // Generate 50 employees
    for (let i = 0; i < 50; i++) {
      const department = faker.helpers.arrayElement(DEPARTMENTS);
      const jobTitle = faker.helpers.arrayElement(JOB_TITLES[department]);
      
      const startDate = faker.date.between({
        from: new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
        to: new Date()
      });
      
      const dateOfBirth = faker.date.between({
        from: new Date(Date.now() - 65 * 365 * 24 * 60 * 60 * 1000),
        to: new Date(Date.now() - 21 * 365 * 24 * 60 * 60 * 1000)
      });

      // Insert each employee directly
      await db.run(`
        INSERT INTO employees (
          full_name, email, date_of_birth, 
          job_title, department, salary, 
          start_date, is_active
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        faker.person.fullName(),
        faker.internet.email().toLowerCase(),
        dateOfBirth.toISOString().split('T')[0],
        jobTitle,
        department,
        faker.number.int({ min: 45000, max: 150000 }),
        startDate.toISOString().split('T')[0],
        true
      ]);
    }
    
    console.log("✅ Database seeded with 50 employees");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .catch((error) => {
    console.error("Failed to seed database:", error);
    process.exit(1);
  }); 