const isJSON = text => {
  if (!text) return false;
  try {
    JSON.parse(text);
  } catch (e) {
    return false;
  }
  return true;
};

const appendNote = (author, newNote, noteHistory) => {
  const noteDate = new Date().toGMTString();
  let updatedNotes = noteHistory;

  if (newNote && newNote.trim().length) {
    if (isJSON(noteHistory) || !noteHistory) {
      // handle json (new format)
      let newItem = {
        author: author,
        noteDate: noteDate,
        note: newNote
      };
      const jsonNoteHistory = !noteHistory ? [] : JSON.parse(noteHistory);

      jsonNoteHistory.push(newItem);
      updatedNotes = JSON.stringify(jsonNoteHistory);
    } else {
      // handle text (old format)
      updatedNotes =
        author +
        " : " +
        noteDate +
        "\n------------\n" +
        newNote +
        "\n------\n\n\n" +
        noteHistory;
    }
  }

  return updatedNotes;
};

module.exports = {
  appendNote,
  isJSON
};
