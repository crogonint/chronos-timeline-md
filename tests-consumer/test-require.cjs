// Test script to simulate consuming the package from a CommonJS project
console.log("Testing import from CommonJS project...");

try {
  // Test CommonJS require
  console.log("1. Testing require...");
  const chronos = require("../dist/cjs-entry.cjs");
  console.log("✅ require works:", typeof chronos.ChronosTimeline);

  // Test destructuring require
  const { ChronosTimeline } = require("../dist/cjs-entry.cjs");
  console.log("✅ destructuring require works:", typeof ChronosTimeline);
} catch (error) {
  console.error("❌ require failed:", error.message);
}
