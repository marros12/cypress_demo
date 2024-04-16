# **GitHub Repository: cypress_demo**

## **Purpose:**
The primary objective of this repository is to showcase proficiency in Cypress testing. Cypress test suite aims at evaluating and validating metrics calculation functionalities within a web application. The test suite is designed to ensure accuracy and consistency in the calculation and display of metrics data, comparing it with the frontend representation on the application's portal.

## **Key Features:**

### Data Retrieval and Calculation
The test suite retrieves evaluation data for individual students from the web application, calculates percentages based on specific criteria, and aggregates data for group evaluation.

### Comparison with Frontend Data 
It compares the calculated percentages with the frontend percentages displayed on the application's portal for both individual students and groups.

### Assertions 
Utilizing Cypress assertions, the test suite verifies that the calculated percentages match the frontend data, ensuring the accuracy of metrics representation.

## **Files and Structure:**

### Test File (TEST - metrics_student_group.cy.js)
Contains test cases structured into three describe blocks - student1, student2, and group. Each block represents a different aspect of metrics evaluation within the application.

### Support File (metrics_functions_file.cy.js)
Hosts all the exported functions utilized within the test file. These functions ensure modularity and maintainability of the test scenarios.

### Fixtures Folder 
Contains three JSON files - student1.json, student2.json, and group.json. These files store data retrieved during test execution and are used in the calculation phase of the test file.

### Screenshots Folder
Includes screenshots depicting the testing environment setup and execution. It provides insights into the testing environment and showcases the Cypress dashboard setup and pipeline configuration using GitHub Actions.

### **Author:**
Maroš Roško
