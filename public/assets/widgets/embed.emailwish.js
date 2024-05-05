const embed_widget_emailwish = function () {

    let elemDiv = document.createElement('div');
    const urlParams = new URLSearchParams(new URL(document.currentScript.src).search);
    elemDiv.id = "ew-widgets";
    let client_id = urlParams.get("client-id")
    elemDiv.setAttribute('data-client-id', client_id);

    document.body.appendChild(elemDiv);
    fetch("http://emailwish.localhost/_shopify/widgets?client_uid=" + client_id)
        .then(function (response) {
        return response.json();
    })
        .then(function (jsonResponse) {
            if(jsonResponse.current_version){
                let script = document.createElement("script");
                script.async = true;
                script.src = "http://popup.localhost/widget.emailwish.js?v=" + jsonResponse.current_version;
                document.head.appendChild(script);
            }

        })

};
embed_widget_emailwish();


