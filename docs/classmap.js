YAHOO.env.classMap = {"ImageDialog": "refinerycms", "LinkDialog": "refinerycms", "REFINERYCMS": "refinerycms", "TestDialog": "refinerycms", "Dialog": "refinerycms"};

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
