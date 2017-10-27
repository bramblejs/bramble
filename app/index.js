require("chart.js/dist/Chart.bundle.min.js");

const pjson = require("../package.json");
const mockData = require("../bramble-lock.json");

const ctx = $("#lineChart");
const data = Object.values(mockData).map(a => a.size);
const maxData = Math.max(...data);
const labelsArr = Object.keys(mockData);
const labels = labelsArr.includes("unreleased")
  ? [...labelsArr.filter(item => item !== "unreleased"), "unreleased"]
  : labelsArr;
const threshold = labels.map(a => pjson.bramble.threshold);
const sub = (a1, a2) => a1.map((e, i) => e - a2[i]);
const difference = sub(data, threshold);
let pointBackgroundColors = [];
let upperT = [];
let lowerT = [];
const splitData = () => {
  data.forEach(val => {
    if (val >= threshold[0]) {
      upperT.push(val);
      lowerT.push(null);
    } else {
      lowerT.push(val);
      upperT.push(null);
    }
  });
};
splitData();

const pointColor = () => {
  difference.forEach(val => {
    val >= 0
      ? pointBackgroundColors.push("#f58368")
      : pointBackgroundColors.push("#90cd8a");
  });
};
pointColor();
const lineChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: labels,
    datasets: [
      {
        backgroundColor: "transparent",
        borderColor: "#3e95cd",
        data: data,
        fill: false,
        label: "Current Bundle Size",
        pointBackgroundColor: pointBackgroundColors
      },
      {
        backgroundColor: "rgba(255,0,0,0.3)",
        data: upperT,
        fill: 3,
        label: "Upper Bundle Values"
      },
      {
        backgroundColor: "rgba(0,255,0,0.3)",
        data: lowerT,
        fill: 3,
        label: "Lower Bundle Values"
      },
      {
        backgroundColor: "transparent",
        borderColor: "#8e5ea2",
        data: threshold,
        fill: false,
        label: "Threshold"
      },
      {
        backgroundColor: "transparent",
        data: difference,
        fill: false,
        label: "Difference",
        pointBackgroundColor: pointBackgroundColors,
        pointBorderColor: pointBackgroundColors,
        showLine: false
      }
    ]
  },
  options: {
    hover: {
      mode: "label"
    },
    legend: {
      position: "top"
    },
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      xAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Build Version"
          }
        }
      ],
      yAxes: [
        {
          display: true,
          scaleLabel: {
            display: true,
            labelString: "Bundle Size (Byte)"
          },
          ticks: {
            beginAtZero: false,
            steps: 500,
            stepValue: 500,
            max: maxData + 200
          }
        }
      ]
    },
    title: {
      display: true,
      text: "Build Version vs Bundle Size"
    },
    tooltips: {
      mode: "label",
      intersect: true
    }
  }
});
module.exports = Chart;
