const gradeMap = {
  "A+": 4.3,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.4,
  B: 3.1,
  "B-": 2.8,
  "C+": 2.5,
  C: 2.2,
  "C-": 1.9,
  "D+": 1.6,
  D: 1.3,
  "D-": 1.0,
  F: 0.7,
};

const colorMap = {
  "A+": "text-green-500",
  A: "text-green-500",
  "A-": "text-green-500",
  "B+": "text-amber-500",
  B: "text-amber-500",
  "B-": "text-amber-500",
  "C+": "text-red-500",
  C: "text-red-500",
  "C-": "text-red-500",
  "D+": "text-red-500",
  D: "text-red-500",
  "D-": "text-red-500",
  F: "text-red-500",
  "N/A": "text-gray-500",
};

function mapGrade(target) {
  if (!target) return "N/A";

  let closestGrade = null;
  let smallestDifference = Infinity;

  for (let [grade, value] of Object.entries(gradeMap)) {
    let difference = Math.abs(value - target);
    if (difference < smallestDifference) {
      smallestDifference = difference;
      closestGrade = grade;
    }
  }

  return closestGrade;
}

function mapColor(grade) {
  console.log(grade);
  console.log(colorMap[grade]);
  return colorMap[grade];
}

export { mapGrade, mapColor };
