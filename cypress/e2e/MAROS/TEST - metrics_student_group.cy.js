import { retrieveEvaluationDataAndPushToJson } from '/cypress/e2e/MAROS/metrics_functions_file.cy.js';
import { compareCalculatedEvaluationDataWithDataOnPortalStudent } from '/cypress/e2e/MAROS/metrics_functions_file.cy.js';
import { compareCalculatedEvaluationDataWithDataOnPortalGroup } from '/cypress/e2e/MAROS/metrics_functions_file.cy.js';


describe('Student 1', function() {
  
    beforeEach(() => {
        // check out /comamands.js file where loginStudent is set up
        cy.loginStudent('', '');
        cy.visit('')

    })

    
    it('Metrics evaluation student 1', function() {
        //retrieves data and calculates Evaluation percentage
        retrieveEvaluationDataAndPushToJson()
        //compares calculated percentage with fe percentage
        compareCalculatedEvaluationDataWithDataOnPortalStudent()

    }); 

})  



describe('Student 2', function() {
  
    beforeEach(() => {
        cy.loginStudent('', '');
        cy.visit('')

    })

    
    it('Metrics evaluation student 2', function() {
        //retrieves data and calculates Evaluation percentage
        retrieveEvaluationDataAndPushToJson()
        //compares calculated percentage with fe percentage
        compareCalculatedEvaluationDataWithDataOnPortalStudent()
    })

 
})  




describe('Group', function() {
  
    beforeEach(() => {
        cy.loginStudent('', '');
        cy.visit('')

    })

    
    it('Metrics evaluation group', function() {
        //retrieves data, calculates Evaluation percentage, compares calculated percentage with fe percentage 
        compareCalculatedEvaluationDataWithDataOnPortalGroup()

    })

    
})  