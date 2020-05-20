const appendNote = (author, newNote, noteHistory, ) => {
    const noteDate = new Date().toGMTString();

    return author + " : " + noteDate + "\n------------\n" + newNote + "\n------\n\n\n" + noteHistory;
}

module.exports = {
    appendNote
}