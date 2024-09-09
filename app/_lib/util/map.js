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

const mapPercent = (percent) => {
  if (!percent) return "text-gray-200";

  if (percent >= 90) {
    return "bg-green-200";
  } else if (percent >= 80) {
    return "bg-blue-200";
  } else if (percent >= 60) {
    return "bg-amber-200";
  } else {
    return "bg-red-200";
  }
};

const mapDifficulty = (difficulty) => {
  if (!difficulty) return "text-gray-200";

  if (difficulty <= 2) {
    return "bg-green-200";
  } else if (difficulty <= 3) {
    return "bg-blue-200";
  } else if (difficulty <= 4) {
    return "bg-amber-200";
  } else {
    return "bg-red-200";
  }
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
  return colorMap[grade] || "text-gray-500";
}

export { mapGrade, mapColor, mapPercent, mapDifficulty };
