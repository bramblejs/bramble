import '../node_modules/chart.js/dist/Chart.bundle.min.js';

var ctx = $("#lineChart");
var data = [2000,3029,2500,3100,2700];
var threshold = [2700,2700,2700,2700,2700];
var labels = ["13h42 - Build 34", "14h42, Build 35", "15h42, Build 36","16h42, Build 37" ,"17h42, Build 38"];
var sub = (a1, a2) => a1.map((e, i) => e - a2[i]);
var pointBackgroundColors = [];
var difference = sub(data, threshold);
function pointColor() {
    difference.forEach(function(val){
        val > 0 ? pointBackgroundColors.push("#90cd8a"): pointBackgroundColors.push("#f58368");
    });
}
pointColor();

var lineChart = new Chart(ctx, {
    type: 'line',
    data: {
    labels:labels,
    datasets: [{ 
        data: data,
        label: "Current Bundle Size",
        borderColor: "#3e95cd",
        pointBackgroundColor: pointBackgroundColors,
        fill: false
      }, { 
        data: threshold,
        label: "Threshold",
        borderColor: "#8e5ea2",
        fill: false
      }, 
      { 
        data: difference,
        label: "Difference",
        borderColor: "#ffce56",
        pointBackgroundColor: pointBackgroundColors,
        fill: false
      }
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
