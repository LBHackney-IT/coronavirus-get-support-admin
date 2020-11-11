var expect = require("chai").expect;
require("mocha");
const { isJSON, appendNote } = require("../helpers/notes");

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
  const expectedJSONNotes = JSON.stringify([
    {
      author: "author",
      noteDate: new Date().toGMTString(),
      note: "newNote"
    }
  ]);

  it("should append a case note when there is an empty string", () => {
    const updatedNotes = appendNote("author", "newNote", "");
    expect(updatedNotes).to.eq(expectedJSONNotes);
  });

  it("should append a case note when there is null", () => {
    const updatedNotes = appendNote("author", "newNote", null);
    expect(updatedNotes).to.eq(expectedJSONNotes);
  });

  it("should append a case note when the history is in string format", () => {
    const expectedNotes =
      "author" +
      " : " +
      new Date().toGMTString() +
      "\n------------\n" +
      "newNote" +
      "\n------\n\n\n" +
      "noteHistory";

    const updatedNotes = appendNote("author", "newNote", "noteHistory");
    expect(updatedNotes).to.eq(expectedNotes);
  });
  it("should append a case note when the history is in JSON format", () => {
    const noteHistory = {
      author: "author",
      noteDate: new Date().toGMTString(),
      note: "newNote"
    };
    const expectedNotes = JSON.stringify([
      {
        author: "author",
        noteDate: new Date().toGMTString(),
        note: "newNote"
      },
      noteHistory
    ]);

    const updatedNotes = appendNote(
      "author",
      "newNote",
      JSON.stringify([noteHistory])
    );
    expect(updatedNotes).to.eq(expectedNotes);
  });
});
