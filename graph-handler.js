var isInflationData = false;
var fileName = "main-data.csv";
          document.addEventListener('DOMContentLoaded', function () {
            var checkbox = document.querySelector('input[type="checkbox"]');
          
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
              runMainGraph(isInflationData, fileName);
            });


          });
