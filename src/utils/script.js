
export function injectScript(source, callback) {
    var script = document.createElement('script');
    var prior = document.getElementsByTagName('script')[0];
    script.async = 1;

    script.onload = script.onreadystatechange = function( _, isAbort ) {
        if(isAbort || !script.readyState || /loaded|complete/.test(script.readyState) ) {
            script.onload = script.onreadystatechange = script.onerror = null;
            script = undefined;

            if(!isAbort) { if(callback) callback(); }
        }
    };

    script.onerror = function(evt) {
        script.onload = script.onreadystatechange = script.onerror = null;
        script = undefined;

        if(callback) callback(true);
    }

    script.src = source;
    prior.parentNode.insertBefore(script, prior);
}
