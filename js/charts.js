(function ($) {
    $("input[name='opt_speed'], input[name='opt_traversal']"
    ).on("change", function () {
        tree.createTree();
    });
    $("#visualModal_treetraverse").on("show.bs.modal", function () {
        setTimeout(function () { tree.createTree(); }, 500);
        
    });

    $("#array_minus").on("click", function () {
        sort.setArraySize(Math.max(Number($("#array_size").text()) - 10, 10));
        sort.sortItems();
    });

    $("#array_plus").on("click", function () {
        sort.setArraySize(Math.min(Number($("#array_size").text()) + 10, 50));
        sort.sortItems();
    });

    $("#visualModal_sorting, input[name='opt_sort']").on("change show.bs.modal",
        function () {
            if ($("input[name='opt_sort']:checked").val() == "quicksort")
                $("#alert_quicksort").show();
            else $("#alert_quicksort").hide();
            sort.setArraySize(Number($("#array_size").text()));
            setTimeout(function () { sort.sortItems(); }, 100);
        }
    );

    $("#fib_minus").on("click", function () {
        $("#fib_iteration").text(
            Math.max(Number($("#fib_iteration").text()) - 5, 5)
        );
        fibonacci.drawSpiral();
    });

    $("#fib_plus").on("click", function () {
        $("#fib_iteration").text(
            Math.min(Number($("#fib_iteration").text()) + 5, 20)
        );
        fibonacci.drawSpiral();
    });

    $("#visualModal_fibonacci").on("show.bs.modal", function () {
        setTimeout(function () { fibonacci.drawSpiral(); }, 100);
    });
})(jQuery);
