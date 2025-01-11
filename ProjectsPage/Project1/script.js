const width = 800; // Canvas width
const height = 400; // Canvas height
const margin = { top: 20, right: 20, bottom: 40, left: 50 };

// Define scales for the field
const xScale = d3.scaleBand()
    .domain(["left", "middle", "right"]) // Horizontal zones
    .range([margin.left, width - margin.right]);

const yScale = d3.scaleLinear()
    .domain([0, 50]) // Air yards range (adjust as needed)
    .range([height - margin.bottom, margin.top]);

// Map pass locations to horizontal coordinates
const locationMapping = {
    left: xScale("left") + xScale.bandwidth() / 2,
    middle: xScale("middle") + xScale.bandwidth() / 2,
    right: xScale("right") + xScale.bandwidth() / 2,
};

d3.csv("c_williams_pass_data_2024.csv").then(data => {
    // Log raw data for debugging
    console.log("Raw Data:", data);

    // Transform data into field coordinates
    const transformedData = data.map(d => ({
        x: locationMapping[d.pass_location.trim().toLowerCase()],
        y: +d.air_yards
    })).filter(d => d.x !== undefined && !isNaN(d.y));

    console.log("Transformed Data:", transformedData);

    // Calculate density for contours
    const density = (x, y) => {
        let sum = 0;
        for (const point of transformedData) {
            const dist = Math.hypot(point.x - x, point.y - y);
            sum += Math.exp(-dist * 0.01); // Gaussian decay
        }
        return sum;
    };

    // Create a grid for density values
    const gridSize = 10;
    const n = Math.ceil(width / gridSize);
    const m = Math.ceil(height / gridSize);
    const grid = new Array(n * m);
    for (let j = 0; j < m; j++) {
        for (let i = 0; i < n; i++) {
            grid[j * n + i] = density(i * gridSize, j * gridSize);
        }
    }
    grid.x = 0;
    grid.y = 0;
    grid.k = gridSize;
    grid.n = n;
    grid.m = m;

    console.log("Grid Data:", grid);

    // Generate contours
    const thresholds = d3.range(1, 20); // Hot zone thresholds
    const contours = d3.contours()
        .size([n, m])
        .thresholds(thresholds)(grid);

    console.log("Contours:", contours);

    // Define color scale
    const color = d3.scaleSequential(d3.interpolateTurbo)
        .domain([1, thresholds[thresholds.length - 1]]);

    // Create SVG container
    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add field lines for context
    svg.append("g")
        .selectAll("line")
        .data([10, 20, 30, 40])
        .join("line")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d))
        .attr("stroke", "white")
        .attr("stroke-dasharray", "4");

    svg.append("g")
        .selectAll("text")
        .data([10, 20, 30, 40])
        .join("text")
        .attr("x", margin.left - 10)
        .attr("y", d => yScale(d))
        .attr("dy", "0.35em")
        .attr("fill", "white")
        .text(d => `${d} yards`);

    // Add axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis)
        .selectAll("text")
        .style("fill", "white");

    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(yAxis)
        .selectAll("text")
        .style("fill", "white");

    // Draw contours
    svg.selectAll("path")
        .data(contours)
        .join("path")
        .attr("d", d3.geoPath(d3.geoIdentity().scale(gridSize)))
        .attr("fill", d => color(d.value))
        .attr("stroke", "#fff")
        .attr("stroke-opacity", 0.5);

    // Add tooltips
    const tooltip = d3.select("#tooltip");

    svg.selectAll("path")
        .on("mouseover", function (event, d) {
            d3.select(this).attr("stroke", "#000").attr("stroke-width", 2);
            tooltip.style("opacity", 1)
                .html(`
                    <b>Hot Zone Value:</b> ${d.value.toFixed(1)}<br>
                    <b>Meaning:</b> Frequently targeted or effective area
                `)
                .style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mousemove", function (event) {
            tooltip.style("left", `${event.pageX + 10}px`)
                .style("top", `${event.pageY - 10}px`);
        })
        .on("mouseout", function () {
            d3.select(this).attr("stroke", "#fff").attr("stroke-width", 1);
            tooltip.style("opacity", 0);
        });
}).catch(error => {
    console.error("Error loading or processing the CSV file:", error);
});
