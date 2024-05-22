'use strict';
// $(document).ready(() => {})

const url = 'https://rti2dss.com:3400/api';

function refreshPage() {
  location.reload(true);
}

var api = "https://dataapi.moc.go.th/export-commodity-countries";


fetch(url + "/getgreenbycom").then(res => res.json()).then(r => {
  let dat = r.data;
  let datArr = [];
  dat.map(x => {
    var dat = {
      category: x.commu,
      value1: x.gccode1,
      value2: x.gccode2,
      value3: x.gccode3,
      value4: x.gccode4,
      value5: x.gccode5,
      value6: x.gccode6
    }
    datArr.push(dat)
  })
  radiusChart(datArr);
})

fetch(url + "/getgreenarea").then(res => res.json()).then(r => {
  let dat = r.data;
  let datArr = [];
  dat.map(x => {
    console.log(x)
    var dat = {
      gtype: x.pk_gcname,
      area: x.sum
    }
    datArr.push(dat)
  })
  console.log(datArr)
  barChart(datArr);
})

// console.log(datArr)

function radiusChart(a) {
  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);

    var chart = am4core.create("greenByCom", am4charts.RadarChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.responsive.enabled = true;

    var label = chart.createChild(am4core.Label);
    label.text = "เลื่อนซ้าย-ขวาเพื่อเปลี่ยนมุมมอง";
    label.exportable = false;

    chart.data = a;

    chart.radius = am4core.percent(55);
    chart.startAngle = 270 - 180;
    chart.endAngle = 270 + 180;
    chart.innerRadius = am4core.percent(50);

    var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "category";
    categoryAxis.renderer.labels.template.location = 0.5;
    categoryAxis.renderer.grid.template.strokeOpacity = 0.1;
    categoryAxis.renderer.axisFills.template.disabled = true;
    categoryAxis.mouseEnabled = false;

    var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.grid.template.strokeOpacity = 0.05;
    valueAxis.renderer.axisFills.template.disabled = true;
    valueAxis.renderer.axisAngle = 260;
    valueAxis.renderer.labels.template.horizontalCenter = "right";
    valueAxis.min = 0;

    var series1 = chart.series.push(new am4charts.RadarColumnSeries());
    series1.columns.template.radarColumn.strokeOpacity = 1;
    series1.name = "ชุมชน 1";
    series1.dataFields.categoryX = "category";
    series1.columns.template.tooltipText = "{name}: {valueY.value}";
    series1.dataFields.valueY = "value1";
    series1.stacked = true;

    var series2 = chart.series.push(new am4charts.RadarColumnSeries());
    series2.columns.template.radarColumn.strokeOpacity = 1;
    series2.columns.template.tooltipText = "{name}: {valueY.value}";
    series2.name = "ชุมชน 2";
    series2.dataFields.categoryX = "category";
    series2.dataFields.valueY = "value2";
    series2.stacked = true;

    var series3 = chart.series.push(new am4charts.RadarColumnSeries());
    series3.columns.template.radarColumn.strokeOpacity = 1;
    series3.columns.template.tooltipText = "{name}: {valueY.value}";
    series3.name = "ชุมชน 3";
    series3.dataFields.categoryX = "category";
    series3.dataFields.valueY = "value3";
    series3.stacked = true;

    var series4 = chart.series.push(new am4charts.RadarColumnSeries());
    series4.columns.template.radarColumn.strokeOpacity = 1;
    series4.columns.template.tooltipText = "{name}: {valueY.value}";
    series4.name = "ชุมชน 4";
    series4.dataFields.categoryX = "category";
    series4.dataFields.valueY = "value4";
    series4.stacked = true;

    var series5 = chart.series.push(new am4charts.RadarColumnSeries());
    series5.columns.template.radarColumn.strokeOpacity = 1;
    series5.columns.template.tooltipText = "{name}: {valueY.value}";
    series5.name = "ชุมชน 5";
    series5.dataFields.categoryX = "category";
    series5.dataFields.valueY = "value5";
    series5.stacked = true;

    var series6 = chart.series.push(new am4charts.RadarColumnSeries());
    series6.columns.template.radarColumn.strokeOpacity = 1;
    series6.columns.template.tooltipText = "{name}: {valueY.value}";
    series6.name = "ชุมชน 6";
    series6.dataFields.categoryX = "category";
    series6.dataFields.valueY = "value6";
    series6.stacked = true;

    chart.seriesContainer.zIndex = -1;

    var slider = chart.createChild(am4core.Slider);
    slider.start = 0.7;
    slider.exportable = false;
    slider.events.on("rangechanged", function () {
      var start = slider.start;

      chart.startAngle = 270 - start * 179 - 1;
      chart.endAngle = 270 + start * 179 + 1;

      valueAxis.renderer.axisAngle = chart.startAngle;
    });

  });

}

function barChart(datArr) {
  am4core.ready(function () {

    // Themes begin
    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("greenCom", am4charts.PieChart3D);
    chart.responsive.enabled = true;
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.data = datArr;

    chart.innerRadius = am4core.percent(40);
    chart.depth = 120;

    chart.legend = new am4charts.Legend();

    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "area";
    series.dataFields.depthValue = "area";
    series.dataFields.category = "gtype";
    series.slices.template.cornerRadius = 5;
    series.colors.step = 3;

  }); // end am4core.ready()
}
