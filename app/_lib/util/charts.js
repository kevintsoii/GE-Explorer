import * as d3 from "d3";

const createGradeChart = (filteredGrades, gradeChartRef) => {
  const grades = ["A", "B", "C", "D", "F"];
  const gradeCount = grades.map(
    (grade) => filteredGrades.filter((g) => g === grade).length
  );

  d3.select(gradeChartRef.current).selectAll("*").remove();

  // Create SVG with specific size
  const svg = d3
    .select(gradeChartRef.current)
    .append("svg")
    .attr("width", 350)
    .attr("height", 350)
    .append("g")
    .attr("transform", `translate(40,20)`);

  // Scales
  const x = d3.scaleBand().range([0, 320]).padding(0.4);
  const y = d3.scaleLinear().range([310, 0]);
  x.domain(grades);
  y.domain([0, Math.max(5, d3.max(gradeCount))]);

  // Bars
  svg
    .selectAll(".bar")
    .data(gradeCount)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => x(grades[i]))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d))
    .attr("height", (d) => 310 - y(d))
    .attr("fill", "rgba(86, 149, 226, 0.6)");

  // Axes
  svg
    .append("g")
    .attr("transform", `translate(0,310)`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "14px");

  svg
    .append("g")
    .call(
      d3.axisLeft(y).ticks(Math.min(7, Math.max(5, d3.max(gradeCount) / 2)))
    )
    .selectAll("text")
    .style("font-size", "14px");

  // Grid lines
  svg
    .append("g")
    .attr("class", "grid")
    .attr("opacity", 0.15)
    .call(d3.axisLeft(y).tickSize(-350).tickFormat(""))
    .call((g) => g.select(".domain").remove())
    .selectAll("line")
    .attr("stroke-dasharray", "3,3");
};

const createRatingChart = (ratings, ratingChartRef) => {
  const ratingValues = [1, 2, 3, 4, 5];
  const ratingCount = ratingValues.map(
    (value) => ratings.filter((r) => Math.round(r) === value).length
  );

  d3.select(ratingChartRef.current).selectAll("*").remove();

  // Create SVG with specific size
  const svg = d3
    .select(ratingChartRef.current)
    .append("svg")
    .attr("width", 350)
    .attr("height", 350)
    .append("g")
    .attr("transform", `translate(40,20)`);

  // Scales
  const x = d3.scaleBand().range([0, 320]).padding(0.4);
  const y = d3.scaleLinear().range([310, 0]);
  x.domain(ratingValues);
  y.domain([0, Math.max(5, d3.max(ratingCount))]);

  // Bars
  svg
    .selectAll(".bar")
    .data(ratingCount)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => x(ratingValues[i]))
    .attr("width", x.bandwidth())
    .attr("y", (d) => y(d))
    .attr("height", (d) => 310 - y(d))
    .attr("fill", "rgba(86, 149, 226, 0.6)");

  // Axes
  svg
    .append("g")
    .attr("transform", `translate(0,310)`)
    .call(d3.axisBottom(x))
    .selectAll("text")
    .style("font-size", "14px");

  svg
    .append("g")
    .call(
      d3.axisLeft(y).ticks(Math.min(7, Math.max(5, d3.max(ratingCount) / 2)))
    )
    .selectAll("text")
    .style("font-size", "14px");

  // Grid lines
  svg
    .append("g")
    .attr("class", "grid")
    .attr("opacity", 0.15)
    .call(d3.axisLeft(y).tickSize(-350).tickFormat(""))
    .call((g) => g.select(".domain").remove())
    .selectAll("line")
    .attr("stroke-dasharray", "3,3");
};

export { createGradeChart, createRatingChart };
