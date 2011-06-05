YAHOO.env.classMap = {"form": "refinerycms", "LinkDialog": "refinerycms", "ImageDialog": "refinerycms", "Editor": "refinerycms", "Dialog": "refinerycms", "Seo": "refinerycms", "REFINERYCMS": "refinerycms", "page": "refinerycms", "SettingsDialog": "refinerycms"};

YAHOO.env.resolveClass = function(className) {
    var a=className.split('.'), ns=YAHOO.env.classMap;

    for (var i=0; i<a.length; i=i+1) {
        if (ns[a[i]]) {
            ns = ns[a[i]];
        } else {
            return null;
        }
    }

    return ns;
};
