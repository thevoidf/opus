const { shuffle } = require('./');
const ChartjsNode = require('chartjs-node');
const chartjsLabels = require('chartjs-plugin-datalabels');
const chartjsNode = new ChartjsNode(600, 600);

chartjsNode.on('beforeDraw', chartJs => {
	chartJs.plugins.register(chartjsLabels);
});

const niceColors = [
	'#003f5c',
	'#58508d',
	'#bc5090',
	'#ff6361',
	'#ffa600',
	'#cf455c',
	'#ff8a5c',
	'#8ac6d1',
	'#ad1d45',
];

module.exports = {
	makePieChart: async ({ data, labels }) => {
		const labelColor = '#ffffff';
		const labelFontSize = 40;
		const randomColors = shuffle(niceColors);
		const colors = labels.map((v, i) => randomColors[i]);

		const options = {
			type: 'pie',
			data: {
				datasets: [{
					data,
					backgroundColor: colors,
					borderWidth: 0,
					labels
				}]
			},
			options: {
				plugins: {
					datalabels: {
						formatter: (value, ctx) => ctx.dataset.labels[ctx.dataIndex],
						color: labelColor,
						font: { size: labelFontSize }
					}
				}
			}
		};

		await chartjsNode.drawChart(options);
		return chartjsNode.getImageBuffer('image/png');
	},
	makeColumnChart: async ({ data, labels }) => {
		const labelColor = '#ffffff';
		const labelFontSize = 40;
		const randomColors = shuffle(niceColors);
		const colors = labels.map((v, i) => randomColors[i]);

		const options = {
			type: 'bar',
			data: {
				labels,
				datasets: [{
					data,
					backgroundColor: colors
				}]
			},
			options: {
				legend: { display: false },
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true
						}
					}]
				},
				plugins: {
					datalabels: {
						formatter: (value, ctx) => labels[ctx.dataIndex],
						color: labelColor,
						font: { size: labelFontSize }
					}
				}
			}
		};

		await chartjsNode.drawChart(options);
		return chartjsNode.getImageBuffer('image/png');
	},
	destroyChart: () => {
		chartjsNode.destroy();
	}
}
