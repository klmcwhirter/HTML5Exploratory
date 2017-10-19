function updateOrderedList(srcSelector,trgSelector) {
    var list = $(srcSelector).sortable("toArray");
    $(trgSelector).val(srcSelector + ": " + list);
}
function updateOrderedLists() {
    updateOrderedList("#sortable1","#ordered-list1");
    updateOrderedList("#sortable2","#ordered-list2");
}
$(function() {
    $("#sortable1").sortable({
        connectWith: "#sortable1",
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        //placeholder: "portlet-placeholder ui-corner-all",
        update: updateOrderedLists
    });
    $("#sortable2").sortable({
        connectWith: "#sortable2",
        handle: ".portlet-header",
        cancel: ".portlet-toggle",
        //placeholder: "portlet-placeholder ui-corner-all",
        update: updateOrderedLists
    });

    $(".portlet,.portlet-two-column")
        .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all")
        .find(".portlet-header")
        .addClass("ui-widget-header ui-corner-all")
        .prepend("<span class='ui-icon ui-icon-minusthick portlet-toggle'></span>")
        .disableSelection();

    $(".portlet-toggle").click(function() {
        var icon = $(this);
        icon.toggleClass("ui-icon-minusthick ui-icon-plusthick");
        var portlet = icon.closest(".portlet,*.portlet-two-column");
        portlet.find(".portlet-content").toggle();
        portlet.css("height", "auto");
    });

    $(".portlet,.portlet-two-column")
        .resizable({
            // containment: "parent", ICK! This causes the portlet to forget its height
            // stop: function(event, ui) {
                //alert(ui.size.width + ", " + ui.size.height);
            // }
        });


    $("footer .section")
        .addClass("ui-widget ui-helper-clearfix ui-corner-all")

    $("footer .col")
        .addClass("ui-widget-content ui-corner-all")

    updateOrderedLists();

    $("#fnews").rss("//feeds.finance.yahoo.com/rss/2.0/headline?s=aapl,goog,msft&region=US&lang=en-US", {
        limit: 7,
        layoutTemplate: '<dl class="dl-horizontal">{entries}</dl>',
        entryTemplate: '<dt><a href="{url}" target="_blank">{title}</a></dt><dd>{shortBodyPlain}[{author}@{date}]</dd>'
        // ssl: true
    }).show();
});
