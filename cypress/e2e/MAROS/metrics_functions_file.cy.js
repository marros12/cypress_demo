// EVALUATION

let jsonData = {};
let combinedJsonData = []
let denominatorSum = 0;
let numeratorSum = 0;
    

//retrieve task data and calculate percentage for one student
export function retrieveEvaluationDataAndPushToJson() {
  cy.get('#LastName').invoke('text').as('lastNameText');

  //iterates through every completed task and retrieves data
  cy.get('.nazov-fade:contains("Automatický test"), .nazov-fade:contains("Doplňovačka"), .nazov-fade:contains("Párovačka"), .nazov-fade:contains("Preklad"), .nazov-fade:contains("Otvorený test"), .nazov-fade:contains("Zadanie"), .nazov-fade:contains("Projekt")').parent().parent().parent()
  .find('.green-bck, .orange-bck, .red-bck').then((percentBtn) => {
      for (let x = 0; x < percentBtn.length; x++) {
          cy.wrap(percentBtn[x]).invoke('text').then((buttonText) => {
              const percentage = parseInt(buttonText.match(/\d+/)[0]);
              const taskData = { evaluationPercentage: percentage };

              const buttonClass = percentBtn[x].classList.item(2);
              taskData.buttonClass = buttonClass; 


              cy.wrap(percentBtn[x]).parent().parent().parent().find('ma-xp').each(($span) => {
                  const text = $span.text();
                  const xpNumber = parseInt(text.match(/\d+/)[0], 10);
                  taskData.xpPoints = xpNumber;

                  cy.wrap(percentBtn[x]).parent().parent().parent().find('ma-difficulty').each(($span) => {
                      const difficultytext = $span.text().trim();
                      let difficultyNumber;
                  
                      const trimmedDifficultyText = difficultytext.substring(difficultytext.indexOf('Náročnosť') + 10).trim();
                  
                      if (trimmedDifficultyText === '1/3') {
                          difficultyNumber = 1;
                      } else if (trimmedDifficultyText === '2/3') {
                          difficultyNumber = 1.5;
                      } else if (trimmedDifficultyText === '3/3') {
                          difficultyNumber = 2;
                      }
                  
                      taskData.difficulty = difficultyNumber;
                 
                      
                      const denominator = xpNumber * difficultyNumber;
                      taskData.denominator = denominator;
                      denominatorSum += denominator;

                      const numerator = Math.round(percentage / 100 * difficultyNumber * xpNumber);
                      taskData.numerator = numerator;
                      numeratorSum += numerator;


                      // Update jsonData for each task
                      jsonData['@lastNameText' + '- exercise ' + x] = [taskData];
                  });
              });
          });
      }
  });    

  
        
        cy.get('@lastNameText').then(studentName => {
            if (studentName === 'student1') {
              cy.writeFile('cypress/fixtures/metrics_evaluation_student1.json', JSON.stringify(jsonData, null, 2));
          } else {
            cy.writeFile('cypress/fixtures/metrics_evaluation_student2.json', JSON.stringify(jsonData, null, 2));
            cy.fixture('metrics_evaluation_student1').then((studentJsonData) => {
              cy.fixture('metrics_evaluation_student2').then((studentJsonData2) => {
                  combinedJsonData.push(studentJsonData)
                  combinedJsonData.push(studentJsonData2)
      
                  cy.writeFile('cypress/fixtures/metrics_evaluation_combined.json', JSON.stringify(combinedJsonData, null, 2))
                })
              })
          }}) 

}
          

       


//compares calculated percentage with fe percentage over chart student
export function compareCalculatedEvaluationDataWithDataOnPortalStudent() {
        cy.get('[title="Hodnotenie (moje) - Odovzdané a ohodnotené úlohy - berie hodnotenie najlepšieho odovzdania. Toto percento je hodnotením úloh, ktoré si odovzdal (nie percento, ktoré budeš mať uvedené na certifikáte). Systémové hodnotenie sa vzťahuje na čiastkové úlohy, a teda je pre nás iba podporným ukazovateľom pri celkovom hodnotení."]').invoke('text').then(($percentageAboveChartEvaluationStudentPM) => {
          const percentageAboveChartEvaluationStudentPM = parseInt($percentageAboveChartEvaluationStudentPM.match(/\d+/)[0]);

          const percentageAboveChartEvaluationStudentCalculated = Math.round(numeratorSum / denominatorSum * 100)

          expect(percentageAboveChartEvaluationStudentCalculated).to.equal(percentageAboveChartEvaluationStudentPM);
      })


//compares calculated percentage with fe percentage green chart student
cy.get('.ma-vertical-percent-bar-wrap').eq(1).find('ma-vertical-percent-bar').eq(1).then((evaluationChartStudent) => {
          cy.get(evaluationChartStudent).find('.green').invoke('attr', 'style').then((styleAttribute) => {
              const heightMatch = /height:\s*([\d.]+)%/.exec(styleAttribute);
              const heightGreenPercentageStudent = heightMatch ? Math.round(parseFloat(heightMatch[1])) : null;
              
              let totalDenominatorGreen = 0;

              Object.values(jsonData).forEach(tasks => {
                  tasks.forEach(task => {
                      if (task.buttonClass === "green-bck") {
                          totalDenominatorGreen += task.denominator || 0;
                      }
                  });
              });
          
          const percentageGreenEvaluationStudentCalculated = Math.round(totalDenominatorGreen / denominatorSum * 100)
  
          expect(heightGreenPercentageStudent).to.equal(percentageGreenEvaluationStudentCalculated);
         
  })
  })


//compares calculated percentage with fe percentage orange chart student
cy.get('.ma-vertical-percent-bar-wrap').eq(1).find('ma-vertical-percent-bar').eq(1).then((evaluationChartStudent) => {
      cy.get(evaluationChartStudent).find('.orange').invoke('attr', 'style').then((styleAttribute) => {
          const heightMatch = /height:\s*([\d.]+)%/.exec(styleAttribute);
          const heightOrangePercentageStudent = heightMatch ? Math.round(parseFloat(heightMatch[1])) : null;
          
          let totalDenominatorOrange = 0;

          Object.values(jsonData).forEach(tasks => {
              tasks.forEach(task => {
                  if (task.buttonClass === "orange-bck") {
                      totalDenominatorOrange += task.denominator || 0;
                  }
              });
          });
      
      const percentageOrangeEvaluationStudentCalculated = Math.round(totalDenominatorOrange / denominatorSum * 100)

      expect(heightOrangePercentageStudent).to.equal(percentageOrangeEvaluationStudentCalculated);
     
})
})


//compares calculated percentage with fe percentage red chart student
cy.get('.ma-vertical-percent-bar-wrap').eq(1).find('ma-vertical-percent-bar').eq(1).then((evaluationChartStudent) => {
      cy.get(evaluationChartStudent).find('.red').invoke('attr', 'style').then((styleAttribute) => {
          const heightMatch = /height:\s*([\d.]+)%/.exec(styleAttribute);
          const heightRedPercentageStudent = heightMatch ? Math.round(parseFloat(heightMatch[1])) : null;
          
          let totalDenominatorRed = 0;

          Object.values(jsonData).forEach(tasks => {
              tasks.forEach(task => {
                  if (task.buttonClass === "red-bck") {
                      totalDenominatorRed += task.denominator || 0;
                  }
              });
          });
      
      const percentageRedEvaluationStudentCalculated = Math.round(totalDenominatorRed / denominatorSum * 100)

      expect(heightRedPercentageStudent).to.equal(percentageRedEvaluationStudentCalculated);
     
})
})

}



let sumOfAllDenominators = 0;
let sumOfAllNumerators = 0;

export function compareCalculatedEvaluationDataWithDataOnPortalGroup() {
cy.then(() => {
    
  const data = require('/cypress/fixtures/metrics_evaluation_combined.json');
  
  data.forEach(studentData => {
      Object.values(studentData).forEach(taskData => {
          taskData.forEach(task => {
              sumOfAllDenominators += task.denominator;
              sumOfAllNumerators += task.numerator;
          });
      });
  });
  
  console.log("Total denominator:", sumOfAllDenominators);
  console.log("Total numerator:", sumOfAllNumerators);
  
})


      //porovnanie percenta nad grafom hodnotenie skupina 
      cy.get('[title="Hodnotenie (Skupina) - Odovzdané a ohodnotené úlohy - berie hodnotenie najlepšieho odovzdania"]').invoke('text').then(($percentageAboveChartEvaluationGroupPM) => {
        const percentageAboveChartEvaluationGroupPM = parseInt($percentageAboveChartEvaluationGroupPM.match(/\d+/)[0]);

        const percentageAboveChartEvaluationGroupCalculated = Math.round(sumOfAllNumerators / sumOfAllDenominators * 100)

        expect(percentageAboveChartEvaluationGroupCalculated).to.equal(percentageAboveChartEvaluationGroupPM);
      })
        


//compares calculated percentage with fe percentage green chart group
cy.get('.ma-vertical-percent-bar-wrap').eq(1).find('ma-vertical-percent-bar').eq(0).then((evaluationChartGroup) => {
        cy.get(evaluationChartGroup).find('.green').invoke('attr', 'style').then((styleAttribute) => {
            const heightMatch = /height:\s*([\d.]+)%/.exec(styleAttribute);
            const heightGreenPercentageGroup = heightMatch ? Math.round(parseFloat(heightMatch[1])) : null;
            
            let totalDenominatorGreen = 0;

            const data = require('/cypress/fixtures/metrics_evaluation_combined.json');

            data.forEach(studentData => {
                Object.values(studentData).forEach(taskData => {
                    taskData.forEach(task => {
                        if (task.buttonClass === "green-bck") {
                            totalDenominatorGreen += task.denominator || 0;
                        }
                    });
                });
            });

            
        
        const percentageGreenEvaluationGroupCalculated = Math.round(totalDenominatorGreen / sumOfAllDenominators * 100)

        expect(heightGreenPercentageGroup).to.equal(percentageGreenEvaluationGroupCalculated);
      
      })
      })


//compares calculated percentage with fe percentage orange chart group
      cy.get('.ma-vertical-percent-bar-wrap').eq(1).find('ma-vertical-percent-bar').eq(0).then((evaluationChartGroup) => {
        cy.get(evaluationChartGroup).find('.orange').invoke('attr', 'style').then((styleAttribute) => {
            const heightMatch = /height:\s*([\d.]+)%/.exec(styleAttribute);
            const heightOrangePercentageGroup = heightMatch ? Math.round(parseFloat(heightMatch[1])) : null;
            
            let totalDenominatorOrange = 0;

            const data = require('/cypress/fixtures/metrics_evaluation_combined.json');

            data.forEach(studentData => {
                Object.values(studentData).forEach(taskData => {
                    taskData.forEach(task => {
                        if (task.buttonClass === "orange-bck") {
                            totalDenominatorOrange += task.denominator || 0;
                        }
                    });
                });
            });

        const percentageOrangeEvaluationGroupCalculated = Math.round(totalDenominatorOrange / sumOfAllDenominators * 100)

        expect(heightOrangePercentageGroup).to.equal(percentageOrangeEvaluationGroupCalculated);

      })
      })


//compares calculated percentage with fe percentage red chart group
      cy.get('.ma-vertical-percent-bar-wrap').eq(1).find('ma-vertical-percent-bar').eq(0).then((evaluationChartGroup) => {
        cy.get(evaluationChartGroup).find('.red').invoke('attr', 'style').then((styleAttribute) => {
            const heightMatch = /height:\s*([\d.]+)%/.exec(styleAttribute);
            const heightRedPercentageGroup = heightMatch ? Math.round(parseFloat(heightMatch[1])) : null;
            
            let totalDenominatorRed = 0;

            const data = require('/cypress/fixtures/metrics_evaluation_combined.json');

            data.forEach(studentData => {
                Object.values(studentData).forEach(taskData => {
                    taskData.forEach(task => {
                        if (task.buttonClass === "red-bck") {
                            totalDenominatorRed += task.denominator || 0;
                        }
                    });
                });
            });
        
        const percentageRedEvaluationGroupCalculated = Math.round(totalDenominatorRed / sumOfAllDenominators * 100)

        expect(heightRedPercentageGroup).to.equal(percentageRedEvaluationGroupCalculated);

      })
      })

}




