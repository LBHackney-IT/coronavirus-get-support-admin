
// https://github.com/douglascrockford/JSON-js/blob/master/json2.js
const isJSON = (text) => {
    if (/^[\],:{}\s]*$/.test(text.replace(/\\["\\\/bfnrtu]/g, '@').
    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
        return true
    }
    return false
}


const appendNote = (author, newNote, noteHistory, ) => {
    const noteDate = new Date().toGMTString();
    let updatedNotes = noteHistory;

    if(newNote && newNote.trim().length) {

        if(isJSON(noteHistory)){
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
    appendNote, isJSON
}