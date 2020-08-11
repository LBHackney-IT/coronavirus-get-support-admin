/**
 * @description Creates a set of error fields with error messages for views
 * @returns Array
 */
const mapFieldErrors = (errors) => {
    let extractedErrors = {};

    errors
        .array()
        .map(err => (extractedErrors["error_" + err.param] = err.msg));
           
    return extractedErrors;
};

/**
 * Maps the validation errors into a plain html description.
 * 
 * @param {*} errors 
 */
const mapDescriptionHtml = (errors) => {
    return errors.array().map(item => item.msg).join('<br>')
};

module.exports = {
    mapFieldErrors, mapDescriptionHtml
};