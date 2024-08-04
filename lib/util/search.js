function anyOrderRegex(query) {
  const terms = query.split(" ");
  const patterns = terms.map((term) => `(?=.*${term})`);
  const regexPattern = patterns.join("");
  return regexPattern;
}

export { anyOrderRegex };
