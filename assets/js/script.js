// On page load this function will load already added csv files list
window.addEventListener("load", () => {
  const csvFile = document.querySelector("#input-file");
  const submitBtn = document.querySelector("#submit-btn");

  submitBtn.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log(csvFile.files[0]);

    const filename = csvFile.files[0].name;
    const extension = filename
      .substring(filename.lastIndexOf("."))
      .toUpperCase();

    if (extension == ".CSV") {
      //Here calling another method to read CSV file into json
      csvToJSON(csvFile.files[0]);
    } else {
      alert("Please select a valid csv file.");
    }
  });
});

// function to convert csv file to json format
function csvToJSON(file) {
  try {
    const file_size = file.size;
    const filename = file.name;
    const reader = new FileReader();
    reader.readAsBinaryString(file);
    reader.onload = function (e) {
      const jsonData = [];
      const headers = [];
      const rows = e.target.result.split("\n");

      for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].split(",");
        const rowData = {};
        for (let j = 0; j < cells.length; j++) {
          if (i == 0) {
            const headerName = cells[j].trim();
            headers.push(headerName);
          } else {
            const key = headers[j];
            if (key) {
              rowData[key] = cells[j].trim();
            }
          }
        }

        if (i != 0) {
          jsonData.push(rowData);
        }
      }

      const data = {
        filename,
        file_size,
        headers,
        file_data: jsonData,
      };
      addFileToDB(data);
    };
  } catch (e) {
    console.error(e);
  }
}

// function to add csv files to db
async function addFileToDB(data) {
  await axios.post("http://localhost:9000/add-file-data", data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  window.location.reload();
}

// function to sort each column asc and desc order
const sortTableByColumn = (table, column, asc = true) => {
  const dirModifier = asc ? 1 : -1;

  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));

  const filteredRows = rows.filter((el) => el.innerHTML !== "");

  const sortedRows = filteredRows.sort((a, b) => {
    const aColText = a
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();
    const bColText = b
      .querySelector(`td:nth-child(${column + 1})`)
      .textContent.trim();

    return aColText > bColText ? 1 * dirModifier : -1 * dirModifier;
  });

  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  tBody.append(...sortedRows);

  table
    .querySelectorAll("th")
    .forEach((th) => th.classList.remove("th-sort-asc", "th-sort-desc"));

  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-asc", asc);
  table
    .querySelector(`th:nth-child(${column + 1})`)
    .classList.toggle("th-sort-desc", !asc);
};

document.querySelectorAll(".table-sortable th").forEach((headerCell) => {
  headerCell.addEventListener("click", () => {
    const tableContent = headerCell.parentElement.parentElement.parentElement;

    const headerIndex = Array.prototype.indexOf.call(
      headerCell.parentElement.children,
      headerCell
    );

    const currentIsAscending = headerCell.classList.contains("th-sort-asc");

    sortTableByColumn(tableContent, headerIndex, !currentIsAscending);
  });
});

// function to filter and search records
const searchData = () => {
  const searchInput = document.getElementById("myInput").value.toUpperCase();

  const table = document.getElementById("table");

  const tr = table.getElementsByTagName("tr");

  for (let i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td")[0];

    if (td) {
      let textValue = td.textContent || td.innerHTML;

      if (textValue.toUpperCase().indexOf(searchInput) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};
