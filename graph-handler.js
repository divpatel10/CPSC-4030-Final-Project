var isInflationData = false;
var fileName = "main-data.csv";
var isManned = false;
          document.addEventListener('DOMContentLoaded', function () {
            var checkbox = document.querySelector('input[class="inflation-slider"]');
            checkbox.addEventListener('change', function () {
      
              if (checkbox.checked) {
      
                isInflationData = true
                fileName = "main-data-inflation.csv";
                console.log('Checked');
              } else {
      
                isInflationData = false
                fileName = "main-data.csv"
                console.log('Not checked');
              }
              document.getElementById("main-graph").innerHTML = "";
              runMainGraph(isInflationData, fileName, isManned);
            });


          });


          document.addEventListener('DOMContentLoaded', function () {
            var checkbox = document.querySelector('input[class="apollo-slider"]');
            checkbox.addEventListener('change', function () {
      
              if (checkbox.checked) {
      
                isManned = true
                console.log('Checked');
              } else {
      
                isManned = false
                console.log('Not checked');
              }
              document.getElementById("main-graph").innerHTML = "";
              runMainGraph(isInflationData, fileName, isManned);
            });


          });
