function ajaxFetch(method, url, cb, options = null) {

    let data = null;
    
    if (options !== null) {
        if (options.header) {
            // xhr.setRequestHeader(options.header.key , options.header.value);
            ct = options.header.value;
            data = options.data;
        }
    }

    const jqueryParameters = {}

    jqueryParameters.method = method;
    jqueryParameters.url = url;
    jqueryParameters.data = data;

    $.ajax(jqueryParameters)
        .done(function (result, status, xhr) {
            cb(xhr)
        })
        .fail( function (xhr, status, error) {
            console.log("Error!!!", error)
        }  )

}