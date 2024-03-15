document.addEventListener("DOMContentLoaded", function() {
    showNextChart();
    displayChartDescription(chartDescriptions[0].text);
});

const data = [
    { city: "Brasilia", crimeIndex: 61.29, country: "Brazil" },
    { city: "Rio de Janeiro", crimeIndex: 77.57, country: "Brazil" },
    { city: "Indore", crimeIndex: 49.88, country: "India" },
    { city: "Thrissur", crimeIndex: 21.98, country: "India" }
];
const chartDescriptions = [
    { selector: '#table-container',  text: 'Our group investigated the effects surveillance cameras can have on crime. Down below, is one of the main sets of data that we used in order to come to specific conclusions. This is a filtered/merged data set that looks at a country\'s total number of surveillance cameras, the country\'s crime index, and the country\'s overall happiness on a scale from 0-10. Our group also observed patterns in crime in America.'},
    { selector: '#chart', text: 'This is a Bar Graph that shows the number of surveillance cameras every city in our dataset has. By looking at our graph, a very clear observation can be made that China is the world leader in the number of surveillance cameras.' },
    { selector: '#chart2', text: 'This is a Bar Graph that shows the Crime Index for every city in our dataset.' },
    { selector: '#scatterplot2', text: 'In a Scatterplot comparing Surveillance Cameras in a Country Per 1000 people vs the Crime Index, We can see that there is a correlation coefficient -0.41. This shows that there is light negative correlation. The more cameras there are for 1000 people in a population, the less crime we see on average.'},
    { selector: '#scatterplot', text: 'However, When we look at a scatterplot comparing Surveillance Cameras per 1000 people vs a country\'s overall happiness. We can see that there is little to no correlation at all. We can come to the overall conclusion that it\'s not the ratio of cameras per area vs the crime index that matters, but rather the ratio of surveillance cameras vs population.'},
    { selector: '#scatterplot_outlier', text: 'When we include the outliers of the previous data, we find that there is almost no correlation at all!'},
    { selector: "scatterplot3", text: 'When we look at data comparing Surveillance Cameras per sq Mile vs the Crime Index, we can see that their is a -0.34 negative correlation coefficient. This means that as we have more Cameras per sq Mile, we can see that the Crime Index goes down.'},
    { selector: '#heatmap', text: ' What does crime even look like? What is responsible for the data that is used to calculate the crime index? While we can’t show everyone what Crime looks like on a global scale. We have information on this heat map that displays the type of crime that occurs in specific states of America. ' },
    { selector: '#sankey', text: 'This is a Sankey Chart that can be used to show the flow from the Happiness Index ->   The Number of Surveillance Cameras -> Crime Index -> Country Name.' },
    { selector: '#india', text: 'When we look at crime indexes at a country level, take India for example, we can see very clearly that the two of these cities in the country have different crime indexes. Idore has a much higher crime index than Thrissur. However based on our previous findings, the correlations of more cameras per Square Mile resulting in less crime isn’t being followed when we look at these two cities. Idore, a city with a much higher crime rate has a much higher value of cameras per Square Mile of 62 compared to Thrissur’s value of 0.08 cameras per Square Mile. Additionally, Idore in general has more cameras in their city. Idore has around 200,600 cameras compared to Thrissur’s 269 cameras.' },
    { selector: '#brazil', text: 'This pattern of overall inconsistency with our findings continues when we look at specific cities in Brazil. When comparing the Crime Index between cities Brasilia and Rio de Janeiro, we see something similar to our findings with India. Although the city Rio de Janeiro has an overall crime index of 77.5, the city has a pretty significant amount of surveillance cameras with a value of 3.34 cameras per 1,000 people, and a total of 45,571 cameras in the city. When we compare this to the city Brasilia with a crime index of 60.23. It’s confusing to see based on our results that Brasilia has only 0.8 cameras per 1,000 people and a small total of 3,832 surveillance cameras. This leads us to not only question our results on the crime index but the results on the happiness index as well. ' },
    { selector: '#end', text: 'END: ' }

];

const charts = document.querySelectorAll('#table-container, #chart, #chart2, #scatterplot2, #scatterplot, #scatterplot_outlier, #scatterplot3, #heatmap, svg#sankey, svg#conclusion, svg#india, svg#brazil, svg#end');
let currentChart = 0;
function updateProgressBar() {
    const numberOfCharts = charts.length;
    const progressBarWidth = (currentChart / numberOfCharts) * 100;
    document.getElementById('progress-bar').style.width = `${progressBarWidth}%`;
}
charts.forEach(chart => {
    chart.style.display = 'none';
});

function showNextChart() {
    if (currentChart > 0) {
        const previousChart = charts[currentChart - 1];
        previousChart.style.display = 'none';
        previousChart.classList.remove('in-view');
    }

    // Show the next chart if available
    if (currentChart < charts.length) {
        const currentChartElement = charts[currentChart];
        const descriptionText = chartDescriptions[currentChart].text;

        displayChartDescription(descriptionText);

        currentChartElement.style.display = 'block';
        currentChartElement.classList.add('in-view'); // Apply animations
        currentChart++;
    } else {
        currentChart = 0;
        showNextChart(); // Loop back to the first chart
    }
    updateProgressBar();
}


function displayChartDescription(text) {
    const descriptionElement = document.getElementById('chart-description');
    descriptionElement.innerHTML = text;
    descriptionElement.style.opacity = 0; // Reset opacity
    descriptionElement.style.fontSize = 30;
    setTimeout(() => {
        descriptionElement.classList.add('in-view');
        descriptionElement.style.opacity = 1; // Fade in
    }, 10); // Adding a slight delay to ensure the class is added after opacity reset
}

updateProgressBar();

document.getElementById('nextChart').addEventListener('keypress', showNextChart);
document.body.addEventListener('keypress', showNextChart);

createTable();
drawBarChart("Cameras_V_Crime2.csv");
drawBarChart2("Cameras_V_Crime2.csv");
drawScatterPlot2('Cameras_V_Crime2.csv');
drawScatterPlot3('Cameras_V_Crime_outliers.csv')
drawHeatMap();
drawSankeyChart();
drawScatterPlot('condensed_CCTV_Happiness_2015.csv');
drawScatterPlot_outliter('condensed_CCTV_Happiness_2015_outlier.csv');  
// drawConclusion();
drawBarChartCountry("#india", "India");
drawBarChartCountry("#brazil", "Brazil");
drawEnd();

function drawBarChart(file) {
    d3.csv(file).then(function(data) {
        const margin = { top: 60, right: 20, bottom: 170, left: 200 },
            width = 1600 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        const svg = d3.select("#chart").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(d => d.City + ', ' + d.Country));
        y.domain([0, d3.max(data, d => +d["# of CCTV Cameras"])]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "underline")
            .text("Number of Surveillance Cameras for every City, sorted by Country name");
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",-100)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Number of Surveillance Cameras");


        svg.append("text")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.bottom - 30)
            .style("text-anchor", "middle")
            .text("Cities");

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.City + ', ' + d.Country))
            .attr("width", x.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .transition()
            .duration(4000)
            .attr("y", d => y(+d["# of CCTV Cameras"]))
            .attr("height", d => height - y(+d["# of CCTV Cameras"]));

        svg.selectAll(".bar")
            .on("mouseover", function(event, d) {
                const html = `City: ${d.City}, Country: ${d.Country}<br/>Crime Index: ${d["Crime Index"]}<br/>number of CCTV Cameras: ${d["# of CCTV Cameras"]}`;

                d3.select("#tooltip")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY + 10) + "px")
                    .style("opacity", 1)
                    .html(html);
            })
            .on("mouseout", function(d) {
                d3.select("#tooltip").style("opacity", 0);
            });

        d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("padding", "10px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "5px")
            .style("opacity", 0);
    }).catch(function(error) {
        console.error("Error loading the CSV file: ", error);
    });
}

function drawBarChart2(file) {
    d3.csv(file).then(function(data) {
        const margin = { top: 60, right: 20, bottom: 170, left: 200 },
            width = 1600 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        const x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);

        const svg = d3.select("#chart2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(data.map(d => d.City + ', ' + d.Country));
        y.domain([0, d3.max(data, d => +d["Crime Index"])]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)");
        svg.append("text")
            .attr("x", (width / 2))
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("font-size", "24px")
            .style("text-decoration", "underline")
            .text("Crime Index for every City, sorted by Country name");
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y",-100)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text("Crime Index (0-100)");


        svg.append("text")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.bottom - 30)
            .style("text-anchor", "middle")
            .text("Cities");

        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.City + ', ' + d.Country))
            .attr("width", x.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .transition()
            .duration(4000)
            .attr("y", d => y(+d["Crime Index"]))
            .attr("height", d => height - y(+d["Crime Index"]));

        svg.selectAll(".bar")
            .on("mouseover", function(event, d) {
                const html = `City: ${d.City}, Country: ${d.Country}<br/>Crime Index: ${d["Crime Index"]}<br/>number of CCTV Cameras: ${d["# of CCTV Cameras"]}`;

                d3.select("#tooltip")
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY + 10) + "px")
                    .style("opacity", 1)
                    .html(html);
            })
            .on("mouseout", function(d) {
                d3.select("#tooltip").style("opacity", 0);
            });

        d3.select("body").append("div")
            .attr("id", "tooltip")
            .style("position", "absolute")
            .style("background-color", "white")
            .style("padding", "10px")
            .style("border", "1px solid #ccc")
            .style("border-radius", "5px")
            .style("opacity", 0);
    }).catch(function(error) {
        console.error("Error loading the CSV file: ", error);
    });
}

function drawScatterPlot3(csvFilePath) {

    d3.csv(csvFilePath).then(function(data) {
        data.forEach(function(d) {
            d.CCTV_Per_MILE = +d["Cameras per Square Mile"];
            d.Crime_Index = +d["Crime Index"];
        });

        
        // Calculation steps
        const n = data.length;
        const sum_x = d3.sum(data, d => d.CCTV_Per_MILE);
        const sum_y = d3.sum(data, d => d.Crime_Index);
        const sum_xy = d3.sum(data, d => d.CCTV_Per_MILE * d.Crime_Index);
        const sum_x2 = d3.sum(data, d => d.CCTV_Per_MILE ** 2);
        const sum_y2 = d3.sum(data, d => d.Crime_Index ** 2);

        // Pearson correlation coefficient formula
        const numerator = (n * sum_xy) - (sum_x * sum_y);
        const denominator = Math.sqrt((n * sum_x2 - sum_x ** 2) * (n * sum_y2 - sum_y ** 2));
        const correlationCoefficient = numerator / denominator;

        console.log("Correlation Coefficient: ", correlationCoefficient);

        //CALC li   ne of best fit: 

        const sum_x_2 = d3.sum(data, d => d.CCTV_Per_MILE);
        const sum_y_2 = d3.sum(data, d => d.Crime_Index);
        const sum_xy_2 = d3.sum(data, d => d.CCTV_Per_MILE * d.Crime_Index);
        const sum_x2_2 = d3.sum(data, d => d.CCTV_Per_MILE ** 2);
        const n_2 = data.length;
        const mean_x_2 = sum_x_2 / n_2;
        const mean_y_2 = sum_y_2 / n_2;

        const m_2 = (n_2 * sum_xy_2 - sum_x_2 * sum_y_2) / (n_2 * sum_x2_2 - sum_x_2 ** 2);
        const b_2 = mean_y_2 - m_2 * mean_x_2;

        // Now append your SVG elements...
        const margin = { top: 60, right: 20, bottom: 70, left: 50 },
            width = 1600 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        const svg = d3.select("#scatterplot3").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //coreelation coeffcient:

        const x1 = d3.min(data, d => d.CCTV_Per_MILE);
        const x2 = d3.max(data, d => d.CCTV_Per_MILE);
        const y1 = m_2 * x1 + b_2;
        const y2 = m_2 * x2 + b_2;


        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.CCTV_Per_MILE)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Crime_Index)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        const dots = svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.CCTV_Per_MILE))
            .attr("cy", height)
            .attr("r", 0)
            .style("z-index", "10")
            .style("fill", "#4CAF50")
            
            .on("mouseover", function(event, d) {
                console.log("HOVER");
                tooltip.style("opacity", 1)
                    .html(d.Country + ", " + d.City)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.style("opacity", 0);
            });
            dots.transition()
            .duration(4000)
            .attr("cy", d => y(d.Crime_Index))
            .attr("r", 5)
            

            const tooltip = d3.select("#scatterplot3").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2))
            .text("Surveillance Cameras per sq Mile vs. City Crime Index");

        svg.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 3)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .text("Crime Index");

        svg.append("text")
            .attr("class", "axis-title")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom / 2) + ")")
            .style("text-anchor", "middle")
            .text("Surveillance Cameras per sq Mile");

        // Add COREELATION COEFFICIENT
        svg.append("line")
            .style("stroke", "blue") // Choose a color for the line
            .style("stroke-width", 4) // Set the width of the line
            .attr("x1", x(x1))
            .attr("y1", y(y1))
            .attr("x2", x(x2))
            .attr("y2", y(y2));

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (width - 400) + "," + 20 + ")")
            .style("font-family", "Arial")

        //Correlation Coeffcientt:
        legend.append("text")
            .attr("class", "correlation-label")
            .attr("x", 0)
            .attr("y", 50)
            .attr("dy", "0.8em")    
            .style("font-size", "24px")
            .style("fill", "blue")
            .text('CORRELATION COEFFICIENT: ' + correlationCoefficient.toFixed(2));
    });
}
function drawScatterPlot2(csvFilePath) {

    d3.csv(csvFilePath).then(function(data) {
        data.forEach(function(d) {
            d.CCTV_Per_1000 = +d["# of CCTV Cameras per 1,000 People"];
            d.Crime_Index = +d["Crime Index"];
        });

        
        // Calculation steps
        const n = data.length;
        const sum_x = d3.sum(data, d => d.CCTV_Per_1000);
        const sum_y = d3.sum(data, d => d.Crime_Index);
        const sum_xy = d3.sum(data, d => d.CCTV_Per_1000 * d.Crime_Index);
        const sum_x2 = d3.sum(data, d => d.CCTV_Per_1000 ** 2);
        const sum_y2 = d3.sum(data, d => d.Crime_Index ** 2);

        // Pearson correlation coefficient formula
        const numerator = (n * sum_xy) - (sum_x * sum_y);
        const denominator = Math.sqrt((n * sum_x2 - sum_x ** 2) * (n * sum_y2 - sum_y ** 2));
        const correlationCoefficient = numerator / denominator;

        console.log("Correlation Coefficient: ", correlationCoefficient);

        //CALC li   ne of best fit: 

        const sum_x_2 = d3.sum(data, d => d.CCTV_Per_1000);
        const sum_y_2 = d3.sum(data, d => d.Crime_Index);
        const sum_xy_2 = d3.sum(data, d => d.CCTV_Per_1000 * d.Crime_Index);
        const sum_x2_2 = d3.sum(data, d => d.CCTV_Per_1000 ** 2);
        const n_2 = data.length;
        const mean_x_2 = sum_x_2 / n_2;
        const mean_y_2 = sum_y_2 / n_2;

        const m_2 = (n_2 * sum_xy_2 - sum_x_2 * sum_y_2) / (n_2 * sum_x2_2 - sum_x_2 ** 2);
        const b_2 = mean_y_2 - m_2 * mean_x_2;

        // Now append your SVG elements...
        const margin = { top: 60, right: 20, bottom: 70, left: 50 },
            width = 1600 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        const svg = d3.select("#scatterplot2").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //coreelation coeffcient:

        const x1 = d3.min(data, d => d.CCTV_Per_1000);
        const x2 = d3.max(data, d => d.CCTV_Per_1000);
        const y1 = m_2 * x1 + b_2;
        const y2 = m_2 * x2 + b_2;


        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.CCTV_Per_1000)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Crime_Index)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        const dots = svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.CCTV_Per_1000))
            .attr("cy", height)
            .attr("r", 0)
            .style("z-index", "10")
            .style("fill", "#4CAF50")
            
            .on("mouseover", function(event, d) {
                console.log("HOVER");
                tooltip.style("opacity", 1)
                    .html(d.Country + ", " + d.City)
                    .style("left", (event.pageX + 20) + "px")
                    .style("top", (event.pageY - 20) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.style("opacity", 0);
            });
            dots.transition()
            .duration(4000)
            .attr("cy", d => y(d.Crime_Index))
            .attr("r", 5)
            

            const tooltip = d3.select("#scatterplot2").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2))
            .text("Surveillance Cameras per 1000 People vs. City Crime Index");

        svg.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 3)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .text("Crime Index");

        svg.append("text")
            .attr("class", "axis-title")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom / 2) + ")")
            .style("text-anchor", "middle")
            .text("Surveillance Cameras per 1000 People");

        // Add COREELATION COEFFICIENT
        svg.append("line")
            .style("stroke", "blue") // Choose a color for the line
            .style("stroke-width", 4) // Set the width of the line
            .attr("x1", x(x1))
            .attr("y1", y(y1))
            .attr("x2", x(x2))
            .attr("y2", y(y2));

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (width - 400) + "," + 20 + ")")
            .style("font-family", "Arial")

        //Correlation Coeffcientt:
        legend.append("text")
            .attr("class", "correlation-label")
            .attr("x", 0)
            .attr("y", 50)
            .attr("dy", "0.8em")    
            .style("font-size", "24px")
            .style("fill", "blue")
            .text('CORRELATION COEFFICIENT: ' + correlationCoefficient.toFixed(2));
    });
}


//Correlation graph 
function drawScatterPlot(csvFilePath) {

    d3.csv(csvFilePath).then(function(data) {
        data.forEach(function(d) {
            d.CCTV_Per_1000 = +d.CCTV_Per_1000;
            d.Happiness_Score = +d.Happiness_Score;
        });

        
        // Calculation steps
        const n = data.length;
        const sum_x = d3.sum(data, d => d.CCTV_Per_1000);
        const sum_y = d3.sum(data, d => d.Happiness_Score);
        const sum_xy = d3.sum(data, d => d.CCTV_Per_1000 * d.Happiness_Score);
        const sum_x2 = d3.sum(data, d => d.CCTV_Per_1000 ** 2);
        const sum_y2 = d3.sum(data, d => d.Happiness_Score ** 2);

        // Pearson correlation coefficient formula
        const numerator = (n * sum_xy) - (sum_x * sum_y);
        const denominator = Math.sqrt((n * sum_x2 - sum_x ** 2) * (n * sum_y2 - sum_y ** 2));
        const correlationCoefficient = numerator / denominator;

        console.log("Correlation Coefficient: ", correlationCoefficient);

        //CALC li   ne of best fit: 

        const sum_x_2 = d3.sum(data, d => d.CCTV_Per_1000);
        const sum_y_2 = d3.sum(data, d => d.Happiness_Score);
        const sum_xy_2 = d3.sum(data, d => d.CCTV_Per_1000 * d.Happiness_Score);
        const sum_x2_2 = d3.sum(data, d => d.CCTV_Per_1000 ** 2);
        const n_2 = data.length;
        const mean_x_2 = sum_x_2 / n_2;
        const mean_y_2 = sum_y_2 / n_2;

        const m_2 = (n_2 * sum_xy_2 - sum_x_2 * sum_y_2) / (n_2 * sum_x2_2 - sum_x_2 ** 2);
        const b_2 = mean_y_2 - m_2 * mean_x_2;

        // Now append your SVG elements...
        const margin = { top: 60, right: 20, bottom: 70, left: 50 },
            width = 1600 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        const svg = d3.select("#scatterplot").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //coreelation coeffcient:

        const x1 = d3.min(data, d => d.CCTV_Per_1000);
        const x2 = d3.max(data, d => d.CCTV_Per_1000);
        const y1 = m_2 * x1 + b_2;
        const y2 = m_2 * x2 + b_2;


        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.CCTV_Per_1000)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Happiness_Score)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        const dots = svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.CCTV_Per_1000))
            .attr("cy", height)
            .attr("r", 0)
            .style("fill", function(d) { return d.Happiness_Score > 5 ? "#4CAF50" : "#f44336"; })
            .on("mouseover", function(event, d) {
                tooltip.style("opacity", 1)
                    .html(d.Country)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.style("opacity", 0);
            });
        dots.transition()
            .duration(4000)
            .attr("cy", d => y(d.Happiness_Score))
            .attr("r", 5);


        const tooltip = d3.select("#scatterplot").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2))
            .text("Surveillance Cameras per 1000 People vs. Happiness Score of each city");

        svg.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .text("Happiness Score");

        svg.append("text")
            .attr("class", "axis-title")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom / 2) + ")")
            .style("text-anchor", "middle")
            .text("Surveillance Cameras per 1000 People");

        // Add COREELATION COEFFICIENT
        svg.append("line")
            .style("stroke", "blue") // Choose a color for the line
            .style("stroke-width", 4) // Set the width of the line
            .attr("x1", x(x1))
            .attr("y1", y(y1))
            .attr("x2", x(x2))
            .attr("y2", y(y2));


        

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (width - 400) + "," + 20 + ")")
            .style("font-family", "Arial")

        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", -30)
            .attr("r", 5)
            .style("fill", "#4CAF50");
        legend.append("text")
            .attr("x", 10)
            .attr("y", -30)
            .attr("dy", "0.32em")
            .style("font-size", "12px")
            .text("Happiness Score > 5");

        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", -10)
            .attr("r", 5)
            .style("fill", "#f44336");
        legend.append("text")
            .attr("x", 10)
            .attr("y", -10)
            .attr("dy", "0.32em")
            .style("font-size", "12px")
            .text("Happiness Score ≤ 5");

        //Correlation Coeffcientt:
        legend.append("text")
            .attr("class", "correlation-label")
            .attr("x", 0)
            .attr("y", 50)
            .attr("dy", "0.8em")    
            .style("font-size", "24px")
            .style("fill", "blue")
            .text('CORRELATION COEFFICIENT: ' + correlationCoefficient.toFixed(2));
    });
}


//Correlation graph 
function drawScatterPlot_outliter(csvFilePath) {

    d3.csv(csvFilePath).then(function(data) {
        data.forEach(function(d) {
            d.CCTV_Per_1000 = +d.CCTV_Per_1000;
            d.Happiness_Score = +d.Happiness_Score;
        });

        
        // Calculation steps
        const n = data.length;
        const sum_x = d3.sum(data, d => d.CCTV_Per_1000);
        const sum_y = d3.sum(data, d => d.Happiness_Score);
        const sum_xy = d3.sum(data, d => d.CCTV_Per_1000 * d.Happiness_Score);
        const sum_x2 = d3.sum(data, d => d.CCTV_Per_1000 ** 2);
        const sum_y2 = d3.sum(data, d => d.Happiness_Score ** 2);

        // Pearson correlation coefficient formula
        const numerator = (n * sum_xy) - (sum_x * sum_y);
        const denominator = Math.sqrt((n * sum_x2 - sum_x ** 2) * (n * sum_y2 - sum_y ** 2));
        const correlationCoefficient = numerator / denominator;

        // console.log("Correlation Coefficient: ", correlationCoefficient);

        //CALC line of best fit: 

        const sum_x_2 = d3.sum(data, d => d.CCTV_Per_1000);
        const sum_y_2 = d3.sum(data, d => d.Happiness_Score);
        const sum_xy_2 = d3.sum(data, d => d.CCTV_Per_1000 * d.Happiness_Score);
        const sum_x2_2 = d3.sum(data, d => d.CCTV_Per_1000 ** 2);
        const n_2 = data.length;
        const mean_x_2 = sum_x_2 / n_2;
        const mean_y_2 = sum_y_2 / n_2;

        const m_2 = (n_2 * sum_xy_2 - sum_x_2 * sum_y_2) / (n_2 * sum_x2_2 - sum_x_2 ** 2);
        const b_2 = mean_y_2 - m_2 * mean_x_2;

        // Now append your SVG elements...
        const margin = { top: 60, right: 20, bottom: 70, left: 50 },
            width = 1600 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        const svg = d3.select("#scatterplot_outlier").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        //coreelation coeffcient:

        const x1 = d3.min(data, d => d.CCTV_Per_1000);
        const x2 = d3.max(data, d => d.CCTV_Per_1000);
        const y1 = m_2 * x1 + b_2;
        const y2 = m_2 * x2 + b_2;


        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.CCTV_Per_1000)])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.Happiness_Score)])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        const dots = svg.selectAll(".dot")
            .data(data)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("cx", d => x(d.CCTV_Per_1000))
            .attr("cy", height)
            .attr("r", 0)
            .style("fill", function(d) { return d.Happiness_Score > 5 ? "#4CAF50" : "#f44336"; })
            .on("mouseover", function(event, d) {
                tooltip.style("opacity", 1)
                    .html(d.Country)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 10) + "px");
            })
            .on("mouseout", function(d) {
                tooltip.style("opacity", 0);
            });
        dots.transition()
            .duration(4000)
            .attr("cy", d => y(d.Happiness_Score))
            .attr("r", 5);


        const tooltip = d3.select("#scatterplot_outlier").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        svg.append("text")
            .attr("class", "chart-title")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2))
            .text("CCTV per 1000 People vs. Happiness Score of each city");

        svg.append("text")
            .attr("class", "axis-title")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left)
            .attr("x",0 - (height / 2))
            .attr("dy", "1em")
            .text("Happiness Score");

        svg.append("text")
            .attr("class", "axis-title")
            .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.bottom / 2) + ")")
            .style("text-anchor", "middle")
            .text("CCTV per 1000 People");

        // Add COREELATION COEFFICIENT
        svg.append("line")
            .style("stroke", "blue") // Choose a color for the line
            .style("stroke-width", 4) // Set the width of the line
            .attr("x1", x(x1))
            .attr("y1", y(y1))
            .attr("x2", x(x2))
            .attr("y2", y(y2));


        

        const legend = svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(" + (width - 400) + "," + 20 + ")")
            .style("font-family", "Arial")

        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 5)
            .style("fill", "#4CAF50");
        legend.append("text")
            .attr("x", 10)
            .attr("y", 0)
            .attr("dy", "0.32em")
            .style("font-size", "12px")
            .text("Happiness Score > 5");

        legend.append("circle")
            .attr("cx", 0)
            .attr("cy", 20)
            .attr("r", 5)
            .style("fill", "#f44336");
        legend.append("text")
            .attr("x", 10)
            .attr("y", 20)
            .attr("dy", "0.32em")
            .style("font-size", "12px")
            .text("Happiness Score ≤ 5");

        //Correlation Coeffcientt:
        legend.append("text")
            .attr("class", "correlation-label")
            .attr("x", 0)
            .attr("y", 50)
            .attr("dy", "0.8em")    
            .style("font-size", "24px")
            .style("fill", "blue")
            .text('CORRELATION COEFFICIENT: ' + correlationCoefficient.toFixed(2));
    });
}


function drawHeatMap() {
    d3.csv("aggregated_total_crimes_by_state_and_type.csv").then(function(data) {
        const margin = {top: 30, right: 30, bottom: 100, left: 120},
            width = 1600 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        const svg = d3.select("#heatmap")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const years = [...new Set(data.map(d => d.crime_type))];
        const jurisdictions = [...new Set(data.map(d => d.State))];

        const x = d3.scaleBand()
            .range([0, width])
            .domain(years)
            .padding(0.01);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-65)")
            .style("text-anchor", "end");

        svg.append("text")
            .attr("x", width / 2 + margin.left)
            .attr("y", height + margin.bottom - 30)
            .style("text-anchor", "middle")
            .text("Types of Crimes");

        const y = d3.scaleBand()
            .range([height, 0])
            .domain(jurisdictions)
            .padding(0.01);
        svg.append("g")
            .call(d3.axisLeft(y));

        const myColor = d3.scaleSequential()
            .interpolator(d3.interpolateViridis)
            .domain([0, d3.max(data, function(d) { return +d.account; })]);


        svg.selectAll()
            .data(data, function(d) {return d.State+':'+d.crime_type;})
            .enter()
            .append("rect")
            .attr("x", function(d) { return x(d.crime_type); })
            .attr("y", function(d) { return y(d.State); })
            .attr("width", x.bandwidth() )
            .attr("height", y.bandwidth() )
            .style("fill", function(d) { return myColor(d.account); })
        svg.selectAll()
            .data(data)
            .enter()
            .append("text")
            .text(function(d) { return Math.round(d.account); })
            .attr("x", function(d) { return x(d.crime_type) + x.bandwidth() / 2; })
            .attr("y", function(d) { return y(d.State) + y.bandwidth() / 2; })
            .attr("dy", ".35em")
            .attr("text-anchor", "middle")
            .style("fill", "white")
            .style("font-size", "10px");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .attr("class", "heatmap-title")
            .text("Different Types of Crimes in Each State in the U.S.");

        svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", -margin.left / 2)
            .attr("y", -50)
            .attr("transform", "rotate(-90)")
            .attr("class", "axis-title")
            .text("State");

        const legendWidth = 300, legendHeight = 20, numSegments = 10;
        const legend = svg.append("g")
            .attr("transform", `translate(${width - legendWidth - 20}, ${height + 70})`);

        Array.from({ length: numSegments }).forEach((_, i) => {
            legend.append("rect")
                .attr("x", i * legendWidth / numSegments)
                .attr("width", legendWidth / numSegments)
                .attr("height", legendHeight)
                .attr("fill", d3.interpolateViridis(i / numSegments));
        });

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", 0)
            .attr("y", -10)
            .style("text-anchor", "start")
            .text(d3.min(data, function(d) { return +d.account; }));

        legend.append("text")
            .attr("class", "legend-text")
            .attr("x", legendWidth)
            .attr("y", -10)
            .style("text-anchor", "end")
            .text(d3.max(data, function(d) { return +d.account; }));

        svg.append("text")
            .attr("class", "legend-title")
            .attr("x", width - legendWidth / 2 - 20)
            .attr("y", height + 100)
            .attr("text-anchor", "middle")
            .text("Crime Account Scale");

    });

}

function drawSankeyChart() {
    d3.json("new_sankey.json").then(function(graph) {
        const svg = d3.select("#sankey"),
            width = +svg.attr("width"),
            height = +svg.attr("height");
        const margin = {top: 60, right: 30, bottom: 30, left: 30};

        const sankey = d3.sankey()
            .nodeWidth(15)
            .nodePadding(10)
            .extent([[margin.left, margin.top], [width - margin.right, height - margin.bottom - 6]]);

        // Compute the Sankey diagram layout.
        sankey(graph);
        
        // Draw the links (the paths that connect nodes)
        svg.append("g")
            .selectAll("path")
            .data(graph.links)
            .enter().append("path")
            .attr("d", d3.sankeyLinkHorizontal())
            .style("stroke-width", function(d) { return Math.max(1, d.width); })
            .style("fill", "none")
            .style("stroke", "#000")
            .style("stroke-opacity", 0.5);
        
        // const colors = ["#de1414", "#de1414", "#de1414", "#de1414", "#dec014", "#14de4d", /* add more colors as needed */];

        // Draw the nodes (the rectangles)
        const node = svg.append("g")
            .selectAll("rect")
            .data(graph.nodes)
            .enter().append("rect")
            .attr("x", function(d) { return d.x0; })
            .attr("y", function(d) { return d.y0; })
            .attr("height", function(d) { return d.y1 - d.y0; })
            .attr("width", sankey.nodeWidth())
            .attr("fill", (d, i) => d3.interpolateRainbow(i / graph.nodes.length))
            .style("stroke", "#000");

        // Add titles to nodes for tooltip information
        node.append("title")
            .text(function(d) { return `${d.name}\n${d.value}`; });

        // Add the node labels
        svg.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 20)
            .selectAll("text")
            .data(graph.nodes)
            .enter().append("text")
            .attr("x", function(d) { return d.x0 - 6; })
            .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
            .attr("dy", "0.35em")
            .attr("text-anchor", "end")
            .text(function(d) { return d.name; })
            .filter(function(d) { return d.x0 < width / 2; })
            .attr("x", function(d) { return d.x1 + 6; })
            .attr("text-anchor", "start");
    });
}


function drawConclusion() {
    const data = [
        {"city": "Mumbai (India)", "cctvPerCity": 68988, "crimeIndex": 43.15},
        {"city": "kozhikode (India)", "cctvPerCity": 76, "crimeIndex": 45.3},
        {"city": "Beijing (China)", "cctvPerCity": 1150000, "crimeIndex": 34.45},
        {"city": "Dalian (China)", "cctvPerCity": 32000, "crimeIndex": 16.92},
        {"city": "New York (US)", "cctvPerCity": 58190, "crimeIndex": 47.01},
        {"city": "Los Angeles (US)", "cctvPerCity": 34959, "crimeIndex": 48.84}
    ];

    const margin = {top: 50, right: 100, bottom: 300, left: 100},
        width = 1500 - margin.left - margin.right,
        height = 1000 - margin.top - margin.bottom;

    const svg = d3.select("#conclusion").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3.scaleBand().range([0, width]).padding(0.1),
        yScaleLeft = d3.scaleLinear().range([height, 0]),
        yScaleRight = d3.scaleLinear().range([height, 0]);

    xScale.domain(data.map(d => d.city));
    yScaleLeft.domain([0, d3.max(data, d => d.cctvPerCity)]);
    yScaleRight.domain([0, d3.max(data, d => d.crimeIndex)]);

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));



    svg.append("g")
        .call(d3.axisLeft(yScaleLeft));

    svg.append("g")
        .attr("transform", "translate(" + width + ",0)")
        .call(d3.axisRight(yScaleRight));

    svg.selectAll(".bar-cctv")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar-cctv")
        .attr("x", d => xScale(d.city))
        .attr("width", xScale.bandwidth() / 2)
        .attr("y", height)
        .attr("height", 0)
        .attr("fill", "blue")
        .transition()
        .duration(5000)
        .attr("y", d => yScaleLeft(d.cctvPerCity))
        .attr("height", d => height - yScaleLeft(d.cctvPerCity));

    svg.selectAll(".bar-crime")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar-crime")
        .attr("x", d => xScale(d.city) + xScale.bandwidth() / 2)
        .attr("width", xScale.bandwidth() / 2)
        .attr("y", height)
        .attr("height", 0)
        .attr("fill", "red")
        .transition()
        .duration(5000)
        .attr("y", d => yScaleRight(d.crimeIndex))
        .attr("height", d => height - yScaleRight(d.crimeIndex));


    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("text-decoration", "underline")
        .text("CCTV per City and Crime Index Comparison");

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", margin.top +650 )
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Cities");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("CCTV per City");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", width + margin.right - 20)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Crime Index");

    const legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .selectAll("g")
        .data(["CCTV per City", "Crime Index"])
        .enter().append("g")
        .attr("transform", (d, i) => `translate(40,${i * 20})`);

    legend.append("rect")
        .attr("x", width + 35)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", (d, i) => i === 0 ? "blue" : "red");

    legend.append("text")
        .attr("x", width + 34)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(d => d);

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px");

    svg.selectAll(".bar-cctv")
        .on("mouseover", (event, d) => {
            tooltip.html(`City: ${d.city}<br>CCTV: ${d.cctvPerCity}`)
                .style("visibility", "visible");
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
        });

    svg.selectAll(".bar-crime")
        .on("mouseover", (event, d) => {
            tooltip.html(`City: ${d.city}<br>Crime Index: ${d.crimeIndex}`)
                .style("visibility", "visible");
        })
        .on("mousemove", (event) => {
            tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
        })
        .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
        });
}
function drawBarChartCountry(svgId, country) {
    const svg = d3.select(svgId),
        width = 750,
        height = 400,
        margin = { top: 40, right: 20, bottom: 60, left: 60 }, // Adjusted for axis titles
        chartWidth = width - margin.left - margin.right,
        chartHeight = height - margin.top - margin.bottom;

    const filteredData = data.filter(d => d.country === country);

    const x = d3.scaleBand()
        .rangeRound([0, chartWidth])
        .padding(0.2)
        .domain(filteredData.map(d => d.city));

    const y = d3.scaleLinear()
        .rangeRound([chartHeight, 0])
        .domain([0, d3.max(filteredData, d => d.crimeIndex)]);

    const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + chartHeight + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("y", margin.bottom / 2)
        .attr("x", chartWidth / 2)
        .attr("text-anchor", "middle")
        .attr("fill", "#000")
        .text("City");

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10).tickFormat(d3.format("~s")))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left / 1.5)
        .attr("x", -(chartHeight / 2))
        .attr("dy", "1em")
        .attr("text-anchor", "middle")
        .attr("fill", "#000")
        .text("Crime Index");

    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "lightsteelblue")
        .style("padding", "5px")
        .style("border-radius", "5px");

    g.selectAll(".bar")
        .data(filteredData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.city))
        .attr("y", d => y(d.crimeIndex))
        .attr("width", x.bandwidth())
        .attr("fill", "#000")
        .attr("height", d => chartHeight - y(d.crimeIndex))
        .on("mouseover", function(event, d) {
            tooltip.style("visibility", "visible")
                .text(`Crime Index: ${d.crimeIndex}`)
                .style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mousemove", function(event) {
            tooltip.style("top", (event.pageY - 10) + "px")
                .style("left", (event.pageX + 10) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("visibility", "hidden");
        });


    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", margin.top / 2)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")

        .text(`${country} Crime Index by City`);
}

function drawEnd() {
    // Select the SVG container for the concluding thoughts
    var svgConcluding = d3.select("#end")
        .attr("width",1800)
        .attr("height", 600);

// Add a background rectangle for visual appeal (optional)
    svgConcluding.append("rect")
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("fill", "#f5f5f5");

// Append a text element to the SVG, serving as a container for tspans or multiple text elements
    var textConcluding = svgConcluding.append("text")
        .attr("x", 20)
        .attr("y", 20)
        .attr("dy", "1em")
        .style("font-size", "14px")
        .style("font-family", "Arial, sans-serif");

// Add multiple tspan elements for multi-line text
    textConcluding.selectAll("tspan.text-part")
        .data([
            "Based on our results, we can see that there are multiple correlations (although minor) that suggest surveillance cameras have positive impacts on both the crime index",
            "in specific countries/cities and people’s overall happiness index.\n",
            "                             ",
            "However, our findings as mentioned show correlation of values less than |0.5|. It wouldn’t be responsible to come to the conclusion that surveillance cameras completely shut down crime.",
            "We saw examples from India and Brazil that further prove this point.\n",
            
            "For these reasons, should businesses be allowed to have security cameras exempted from taxes? We aren’t sure if there is any benefit.",
             "As a result, we should focus on more effective and sustainable solutions, whether it be city-based planning, investment in law enforcement, or social cohesion. By working together,",
             "we can create a safer society for all of us!",
        ])
        .enter()
        .append("tspan")
        .attr("class", "text-part")
        .attr("x", 30)
        .attr("dy", "2em")
        .style("font-size", "20px")
        .text(function(d) { return d; });

}
function createTable() {
    const csvFilePath = 'merged.csv';

    d3.csv(csvFilePath).then(function(data) {
        const table = d3.select('#table-container').append('table').attr('class', 'table table-striped');
        const thead = table.append('thead');
        const tbody = table.append('tbody');

        thead.append('tr')
            .selectAll('th')
            .data(Object.keys(data[0])).enter()
            .append('th')
            .text(d => d);

        const rows = tbody.selectAll('tr')
            .data(data)
            .enter()
            .append('tr');

        const cells = rows.selectAll('td')
            .data(row => Object.values(row))
            .enter()
            .append('td')
            .text(d => d);

        const imageUrl = 'img.png';
        d3.select('#image-container')
            .append('img')
            .attr('src', imageUrl)
            .attr('alt', 'tap to continue');
    });
}