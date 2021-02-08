import { readString, jsonToCSV } from "react-papaparse";
import * as XLSX from "xlsx";

export const downloadCSVFromJSON = (
  jsonData,
  fileName = "Prospect Template.csv"
) => {
  return new Promise((resolver) => {
    const data = jsonToCSV(jsonData);
    const blob = new Blob([data], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();
    return resolver(true);
  });
};

export const downloadXlsxFromJSON = (
  jsonData,
  fileName = "Prospect Template.xlsx"
) => {
  return new Promise((resolver) => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const ws = XLSX.utils.json_to_sheet(jsonData);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: fileType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();
    return resolver(true);
  });
};

export const getJsonFromFile = (file) => {
  return new Promise((resolver) => {
    const reader = new FileReader();
    reader.addEventListener("load", (event) => {
      const dt = readString(event.target.result).data;
      const dataField = [
        "firstName",
        "lastName",
        "company",
        "address1",
        "city",
        "state",
        "zip",
        "phone",
        "email",
        "facebook",
      ];
      let data = [];
      for (let i = 1; i < dt.length; i++) {
        let row = {},
          cnt = 0;
        for (let j = 0; j < dataField.length; j++) {
          if (j >= dt[i].length) break;
          row[dataField[j]] = String(dt[i][j]).trim();
          if (dt[i][j]) {
            cnt++;
          }
        }
        if (cnt > 0) {
          data.push(row);
        }
      }
      return resolver(data);
    });
    reader.readAsText(file);
  });
};
