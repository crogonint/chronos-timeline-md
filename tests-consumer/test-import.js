// Test using import syntax in CommonJS (this should fail like in Obsidian)
console.log("Testing import syntax in CommonJS context...");

// This is what's failing in the Obsidian plugin
import { ChronosTimeline } from "../dist/index.js";
console.log("ChronosTimeline:", typeof ChronosTimeline);
