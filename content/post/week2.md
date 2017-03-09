+++
date = "2017-03-09"
title = "week 2 - Activity tracker"
draft = false

+++
For this week I've created a visuzliation using the `cal-heatmap` library to show my progress over the next year

```javascript
var cal = new CalHeatMap();
cal.init({
    itemSelector: "#cal-heatmap",
    data: "/tracker_data/2017_cal_data.json",
    domain: "week",
    subDomain: "x_day",
    start: new Date(2017, 2),
    cellSize: 16,
    range: 10,
    legend: [20, 40, 60, 80],
    verticalOrientation: true,
    domainLabelFormat: "%b - %d",
    label: {
        align: "left",
        position: "left",
        width: 70,
    },
    displayLegend: false
});
```

<br>

<style>
.flex-container {
    display: -webkit-flex;
    display: flex;
    width: 700px;
}

.flex-item {
    margin: 10px;
}
</style>

<div class="flex-container">
<div class="flex-item">
<p>Cal-heatmap is a wrapper around the d3.js. BACK IN MY DAY I had to handroll d3.js code with it's complicated data binding mechanisms to get something half as functional as what I have here on the right</p>
</div>
<div class="flex-item">
<div id="cal-heatmap"></div>
</div>
</div>

<script type="text/javascript" src="//d3js.org/d3.v3.min.js"></script>
<script type="text/javascript" src="//cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.min.js"></script>
<link rel="stylesheet" href="//cdn.jsdelivr.net/cal-heatmap/3.3.10/cal-heatmap.css" />
<br>

<script type="text/javascript">
var cal = new CalHeatMap();
cal.init({
    itemSelector: "#cal-heatmap",
    data: "/tracker_data/2017_cal_data.json",
    domain: "week",
    subDomain: "x_day",
    start: new Date(2017, 2),
    cellSize: 16,
    range: 10,
    legend: [20, 40, 60, 80],
    verticalOrientation: true,
    domainLabelFormat: "%b - %d",
    label: {
        align: "left",
        position: "left",
        width: 70,
    },
    displayLegend: false
});
</script>


### Flexbox

I didn't want to add a large front end ui framework so I decided to learn a bit of flexbox to help position things around the site. It didn't require me to write a stupid amount of css and html so pretty happy with using it going forward.

```html
<style>
.flex-container {
    display: -webkit-flex;
    display: flex;
    width: 700px;
}

.flex-item {
    margin: 10px;
}
</style>

<div class="flex-container">
    <div class="flex-item">
        <p>test blah blah</p>
    </div>
    <div class="flex-item">
        <div id="cal-heatmap"></div>
    </div>
</div>

```

