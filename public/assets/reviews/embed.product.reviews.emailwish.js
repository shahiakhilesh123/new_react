const embed_review_emailwish_1 = function () {
    let version_number = 0.107;
    let script = document.createElement("script");
    script.async = true;
    const urlParams = new URLSearchParams(new URL(document.currentScript.src).search);
    let elemDiv=document.getElementById("ew-review-summary");
    if(elemDiv){

        elemDiv.setAttribute('data-client-id', urlParams.get("client-id"));
        script.src = "https://dashboard.emailwish.com/assets/reviews/dist/review.summary.emailwish.js?v=" + version_number;
        document.head.appendChild(script);
    }

};
embed_review_emailwish_1();

