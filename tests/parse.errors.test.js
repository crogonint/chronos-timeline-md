const assert = require("node:assert");
const test = require("node:test");

const { parseChronos } = require("..");

test("Parse — Errors", async (t) => {
  await t.test("throws on invalid month in date", () => {
    const src = "- [2020-13-01] Bad Month";
    assert.throws(() => parseChronos(src), {
      name: "Error",
      message: /Invalid month: 13/,
    });
  });

  await t.test("throws on unrecognized format line", () => {
    const src = "This line is not valid";
    assert.throws(() => parseChronos(src), {
      name: "Error",
      message: /Unrecognized format/i,
    });
  });

  await t.test("throws on invalid marker format", () => {
    const src = "= 2020-01-01 Missing brackets";
    assert.throws(() => parseChronos(src), {
      name: "Error",
      message: /Invalid marker format/i,
    });
  });

  await t.test("throws when DEFAULTVIEW flag missing end date", () => {
    const src = "> defaultview 2020-01-01";
    assert.throws(() => parseChronos(src), {
      name: "Error",
      message: /DEFAULTVIEW|start and end date/i,
    });
  });
});
