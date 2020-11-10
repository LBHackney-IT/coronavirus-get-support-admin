var expect = require("chai").expect;
require("mocha");
const { isJSON } = require("../helpers/notes");

describe("isJSON", () => {
  it("should return true when given a JSON string", () => {
    expect(isJSON(`{"foo":"bar"}`)).to.be.true;
  });
  it("should return false when given an empty string", () => {
    expect(isJSON(``)).to.be.false;
  });
  it("should return false when given a null", () => {
    expect(isJSON(null)).to.be.false;
  });
  it("should return false when given a string", () => {
    expect(isJSON("testing")).to.be.false;
  });
});

describe("appendNote", () => {
  it("should append a case note when there is no history", () => {});
  it("should append a case note when the history is in string format", () => {});
  it("should append a case note when the history is in JSON format", () => {});
});
