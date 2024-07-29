import type { ColumnConfig, TableData } from "./editable-table";

import EditableTable from "./editable-table";

const columns = ["First Name", "Last Name", "Email", "Job Title"];
const columnsConfig: ColumnConfig[] = columns.map((col) => ({
  label: col,
  key: col
    .trim()
    .split(" ")
    .map((c) => c.toLocaleLowerCase())
    .join("-"),
}));

const data: TableData[] = [
  {
    id: 1,
    firstName: "Amy",
    lastName: "Smith",
    email: "amy.smith@squarespace.com",
    jobTitle: "Software Engineer",
  },
  {
    id: 2,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    jobTitle: "Product Manager",
  },
  {
    id: 3,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    jobTitle: "UX Designer",
  },
  {
    id: 4,
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.johnson@example.com",
    jobTitle: "Data Analyst",
  },
  {
    id: 5,
    firstName: "Emily",
    lastName: "Brown",
    email: "emily.brown@example.com",
    jobTitle: "Marketing Specialist",
  },
  {
    id: 6,
    firstName: "David",
    lastName: "Wilson",
    email: "david.wilson@example.com",
    jobTitle: "Sales Representative",
  },
  {
    id: 7,
    firstName: "Olivia",
    lastName: "Taylor",
    email: "olivia.taylor@example.com",
    jobTitle: "Graphic Designer",
  },
  {
    id: 8,
    firstName: "James",
    lastName: "Anderson",
    email: "james.anderson@example.com",
    jobTitle: "Project Manager",
  },
  {
    id: 9,
    firstName: "Sophia",
    lastName: "Thomas",
    email: "sophia.thomas@example.com",
    jobTitle: "Software Developer",
  },
  {
    id: 10,
    firstName: "Daniel",
    lastName: "Robinson",
    email: "daniel.robinson@example.com",
    jobTitle: "Quality Assurance",
  },
  {
    id: 11,
    firstName: "Ava",
    lastName: "Harris",
    email: "ava.harris@example.com",
    jobTitle: "Content Writer",
  },
];

const container = document.getElementById("editableTable") as HTMLElement;

const table = new EditableTable(container, {
  columns: columnsConfig,
  data,
});
