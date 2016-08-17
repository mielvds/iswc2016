$(function() {

  $(".rtable").each(function () {
    var headertext = [],
    $headers = $(this).find("thead th"),
    $tablerows = $(this).children("th"),
    $tablebody = $(this).children("tbody");

    $headers.each(function () {
      headertext.push($(this).text().replace(/\r?\n|\r/,""));
    });

    $tablebody.each(function (i, tablebody) {
      for (var i = 0, row; row = tablebody.rows[i]; i++) {
        for (var j = 0, col; col = row.cells[j]; j++) {
          if (j > 0)
            $(col).attr("data-th", headertext[j]);
        }
      }
    });

  });
});
