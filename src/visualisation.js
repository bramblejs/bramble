import '../node_modules/chart.js/dist/Chart.bundle.min.js';

var ctx = $("#lineChart");
var data = [2000,3029,2500,3100,2700];
var threshold = [2700,2700,2700,2700,2700];
var labels = ["13h42 - Build 34", "14h42, Build 35", "15h42, Build 36","16h42, Build 37" ,"17h42, Build 38"];

var lineChart = new Chart(ctx, {
    type: 'line',
    data: {
    labels:labels,
    datasets: [{ 
        data: data,
        label: "Current Bundle Size",
        borderColor: "#3e95cd",
        fill: false
      }, { 
        data: threshold,
        label: "Threshold",
        borderColor: "#8e5ea2",
        fill: false
      }, 
     ]
    },
    options: {
        title: {
        display: true,
        text: 'Bundle size'
        }
    }
});
export default Chart;
