const appendNote = (author, newNote, noteHistory, ) => {
    const noteDate = new Date().toGMTString();
    let updatedNotes = "";

    if(newNote.trim().length) {
        updatedNotes = author + " : " + noteDate + "\n------------\n" + newNote + "\n------\n\n\n" + noteHistory;
    } else {
        updatedNotes = noteHistory;
    }

    return updatedNotes;
}

module.exports = {
    appendNote
}