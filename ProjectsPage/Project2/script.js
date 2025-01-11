// Dimensions and margins
const margin = { top: 20, right: 30, bottom: 50, left: 50 };
const width = document.querySelector(".graph-container").clientWidth;
const height = document.querySelector(".graph-container").clientHeight;

// Append the SVG container
const svg = d3.select("#background")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

const color = d3.scaleOrdinal(d3.schemeCategory10);

// Load the data
d3.csv("streamgraph_data.csv").then(data => {
    const keys = data.columns.slice(1); // Get category names

    // Parse the data
    data.forEach(d => {
        d.week = +d.week; // Ensure week is numeric
        keys.forEach(key => {
            d[key] = +d[key]; // Ensure values are numeric
        });
    });

    // Create a stack generator
    const stack = d3.stack()
        .keys(keys)
        .offset(d3.stackOffsetWiggle);

    const stackedData = stack(data);

    // Scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.week))
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([
            d3.min(stackedData, layer => d3.min(layer, d => d[0])),
            d3.max(stackedData, layer => d3.max(layer, d => d[1]))
        ])
        .range([height - margin.bottom, margin.top]);

    // Area generator
    const area = d3.area()
        .x(d => x(d.data.week))
        .y0(d => y(d[0]))
        .y1(d => y(d[1]))
        .curve(d3.curveBasis);

    // Draw paths
    svg.selectAll("path")
        .data(stackedData)
        .join("path")
        .attr("fill", (d, i) => color(i))
        .attr("d", area);

    // Tooltip
    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("padding", "10px")
        .style("background", "rgba(0,0,0,0.7)")
        .style("color", "#fff")
        .style("border-radius", "5px")
        .style("pointer-events", "none")
        .style("opacity", 0);

    svg.selectAll("path")
        .on("mouseover", function (event, d) {
            tooltip.style("opacity", 1)
                .html(`<b>Category:</b> ${d.key}`);
        })
        .on("mousemove", function (event) {
            tooltip.style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function () {
            tooltip.style("opacity", 0);
        });

    // Update animation
    function updateData() {
        const jitteredData = data.map(d => {
            const jitter = Math.sin(d.week * 0.3) * 5; // Jitter factor
            const updated = {};
            keys.forEach(key => {
                updated[key] = d[key] + jitter * Math.random();
            });
            return { ...d, ...updated };
        });

        const updatedStackedData = stack(jitteredData);

        svg.selectAll("path")
            .data(updatedStackedData)
            .transition()
            .duration(1500)
            .attr("d", area);
    }

    setInterval(updateData, 3000); // Update every 3 seconds
});
