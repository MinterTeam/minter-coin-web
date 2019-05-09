<script>
    import Chart from 'chart.js/dist/Chart.min.js';
    import {prettyUsd} from '~/assets/utils';

    let historyChart;

    export default {
        props: {
            dataset: {
                type: Object,
                required: true,
            },
        },
        computed: {
            hasData() {
                return this.dataset && this.dataset.data && this.dataset.data.length > 1 && this.dataset.labels && this.dataset.labels.length > 1;
            },
            chartConfig() {
                if (!this.hasData) {
                    return;
                }

                return {
                    type: 'line',
                    data: {
                        labels: this.dataset.labels,
                        datasets: [{
                            data: this.dataset.data,
                            borderColor: '#d15c22',
                            borderWidth: 3,
                            fill: false,
                            lineTension: 0,
                        }],
                    },
                    options: {
                        chartArea: {
                            backgroundColor: '#2c2c2c',
                        },
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            xAxes: [{
                                ticks: {
                                    maxRotation: 0,
                                    autoSkipPadding: 2,
                                    padding: 8,
                                    fontColor: '#fff',
                                    callback: (value, index, values) => {
                                        return index === 0 ? this.$td('Blocks', 'index.price-chart-block-label') : value;
                                    },
                                },
                                gridLines: {
                                    color: '#4e4e4e',
                                    zeroLineColor: '#4e4e4e',
                                    tickMarkLength: 0,
                                },
                                // scaleLabel: {
                                //     display: true,
                                //     labelString: 'Days',
                                //     padding: 0,
                                // },
                            }],
                            yAxes: [{
                                ticks: {
                                    // callback: (value, index, values) => value + 'k',
                                    // min: 0,
                                    padding: 8,
                                    fontColor: '#fff',
                                    callback: function(value, index, values) {
                                        return index === values.length - 1 ? '$' : value;
                                    },
                                },
                                gridLines: {
                                    color: '#4e4e4e',
                                    zeroLineColor: '#4e4e4e',
                                    tickMarkLength: 0,
                                },
                            }],
                        },
                        legend: {
                            display: false,
                        },
                        elements: {
                            point: {
                                radius: 0,
                                hitRadius: 10,
                            },
                        },
                        tooltips: {
                            displayColors: false,
                            bodyFontStyle: 'bold',
                            callbacks: {
                                title: () => '',
                                label: function(tooltipItem, data) {
                                    let value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                                    value = prettyUsd(value);
                                    return `$${value}`; // &thinsp;
                                },
                            },
                        },
                    },
                };
            },
        },
        watch: {
            dataset(newVal) {
                if (!newVal || !this.hasData) {
                    return;
                }
                if (historyChart) {
                    historyChart.update();
                } else {
                    this.initChart();
                }
            },
        },
        mounted() {
            if (!this.hasData) {
                return;
            }
            this.initChart();
        },
        methods: {
            initChart() {
                Chart.pluginService.register({
                    beforeDraw: function(chart, easing) {
                        if (chart.config.options.chartArea && chart.config.options.chartArea.backgroundColor) {
                            var ctx = chart.chart.ctx;
                            var chartArea = chart.chartArea;

                            ctx.save();
                            ctx.fillStyle = chart.config.options.chartArea.backgroundColor;
                            ctx.fillRect(chartArea.left, chartArea.top, chartArea.right - chartArea.left, chartArea.bottom - chartArea.top);
                            ctx.restore();
                        }
                    },
                });
                let ctx = this.$el.querySelector('[data-history-chart]').getContext('2d');
                historyChart = new Chart(ctx, this.chartConfig);
            },
        },
    };
</script>

<template>
    <transition name="v-transition-fade">
        <div class="history__chart-wrap" v-show="hasData">
            <canvas class="history__chart" data-history-chart></canvas>
        </div>
    </transition>
</template>
