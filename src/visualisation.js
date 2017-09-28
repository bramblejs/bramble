require('chart.js/dist/Chart.bundle.min.js');
const pjson = require('../package.json');
const mockData = require('../bramble-lock.json');

const ctx = $("#lineChart");
const data = Object.values(mockData).map((a) => a.size);
const maxData = Math.max(...data);
const labels = Object.keys(mockData);
const threshold = labels.map((a) => pjson.bramble.threshold);
const sub = (a1, a2) => a1.map((e, i) => e - a2[i]);
let pointBackgroundColors = [];
const difference = sub(data, threshold);
const pointColor = () => {
    difference.forEach((val) => {
        val < 0 ? pointBackgroundColors.push("#90cd8a"): pointBackgroundColors.push("#f58368");
    });
}
pointColor();

const lineChart = new Chart(ctx, {
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
        borderColor: "#ff9933",
        pointBackgroundColor: pointBackgroundColors,
        pointBorderColor: pointBackgroundColors,
        showLine: false,
        // hidden: true,
        fill: false
      }
     ]
    },
    options: {
        responsive: true,
        tooltips: {
            mode: 'label',
            intersect: true
        },
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Build Version vs Bundle Size'
        },
        hover: {
            mode: 'label'
        },
        scales: {
            xAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Build Version'
                    }
                }],
            yAxes: [{
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Bundle Size (Byte)'
                    },
                    ticks: {
                        beginAtZero: false,
                        steps: 500,
                        stepValue: 500,
                        max: maxData + 100
                    }
                }]
        },
        
    }
});
module.exports = Chart;
