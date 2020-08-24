const appendNote = (author, newNote, noteHistory, ) => {
    const noteDate = new Date().toGMTString();
    let updatedNotes = noteHistory;

    if(newNote && newNote.trim().length) {

        if(noteHistory.length > 0 && noteHistory.startsWith('[')){
            // handle json (new format)
            let newItem = {
                author: author,
                noteDate: noteDate,
                note: newNote
            }
            let jsonNoteHistory = JSON.parse(noteHistory) || []
            jsonNoteHistory.push(newItem)
            updatedNotes = JSON.stringify(jsonNoteHistory)
        } else {
            // handle text (old format)
            updatedNotes = author + " : " + noteDate + "\n------------\n" + newNote + "\n------\n\n\n" + noteHistory;
        }
    }

    return updatedNotes;
}

module.exports = {
    appendNote
}