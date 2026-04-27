import React from 'react';
import BaseGadget from '../../gadgets/BaseGadget';
import Papa from "papaparse";
import Excel from "exceljs";
import { Button } from '../../controls';
import { inject } from '../../services/injector-service';
import Link from '../../controls/Link';

class BaseImport extends BaseGadget {
    constructor(props, importType, icon) {
        super(props, `Bulk import - [${importType}]`, icon);
        inject(this, "UserUtilsService");
        this.isGadget = false;
        this.hideRefresh = true;
    }

    fileSelected = () => {
        const selector = this.fileSelector;
        const file = selector.files[0];

        if (file) {
            const fileName = file.name.toLowerCase();

            if (fileName.endsWith('.csv')) {
                this.parseCsvFile(file);
            }
            else if (fileName.endsWith('.xlsx')) {
                this.parseExcelFile(file).catch((err) => {
                    console.error("Error parsing excel file", err);
                    this.$message.error("Could not read selected excel file", "Import failed");
                });
            }
            else {
                this.$message.warning("Unknown file selected to import. Select a valid file to import");
                selector.value = '';
                return;
            }
        }
        selector.value = '';
    };

    parseCsvFile(file) {
        Papa.parse(file, {
            header: true,
            delimiter: "",
            delimitersToGuess: [';', ',', '\t', '|'],
            transformHeader: this.transformHeader,
            skipEmptyLines: 'greedy',
            complete: (result) => this.onCsvParsed(file, result)
        });
    }

    onCsvParsed(file, result) {
        const fields = result.meta?.fields || [];

        if (fields.length === 1 && fields[0]?.includes(';') && result.meta?.delimiter !== ';') {
            Papa.parse(file, {
                header: true,
                delimiter: ';',
                transformHeader: this.transformHeader,
                skipEmptyLines: 'greedy',
                complete: (retryResult) => this.onFileParsed(retryResult.data)
            });
            return;
        }

        this.onFileParsed(result.data);
    }

    async parseExcelFile(file) {
        const workbook = new Excel.Workbook();
        await workbook.xlsx.load(await file.arrayBuffer());

        const worksheet = workbook.worksheets[0];

        if (!worksheet) {
            this.onFileParsed([]);
            return;
        }

        const headers = this.getExcelHeaders(worksheet);
        const data = [];

        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (rowNumber === 1) { return; }

            const record = {};
            let hasValue = false;

            headers.forEach((header, index) => {
                if (!header) { return; }

                const value = this.getExcelCellValue(row.getCell(index));
                record[header] = value;
                hasValue = hasValue || !!value;
            });

            if (hasValue) {
                data.push(record);
            }
        });

        this.onFileParsed(data);
    }

    getExcelHeaders(worksheet) {
        const headerRow = worksheet.getRow(1);
        const columnCount = worksheet.columnCount || headerRow.cellCount;
        const headers = [];

        for (let i = 1; i <= columnCount; i++) {
            const value = this.getExcelCellValue(headerRow.getCell(i));
            headers[i] = this.transformHeader ? this.transformHeader(value) : value;
        }

        return headers;
    }

    getExcelCellValue(cell) {
        if (!cell) { return ""; }

        let value = cell.value;

        if (value === null || value === undefined) {
            return "";
        }

        if (value instanceof Date) {
            return this.formatDate(value);
        }

        if (typeof value === "object") {
            if (value.result !== undefined) {
                value = value.result;
            }
            else if (value.text !== undefined) {
                value = value.text;
            }
            else if (value.richText) {
                value = value.richText.map(v => v.text).join("");
            }
            else {
                value = cell.text;
            }
        }

        return (value || "").toString().trim();
    }

    onFileParsed(data) {
        if (!data || !data.length) {
            this.$message.warning("No rows found to import", "No records exists");
            return;
        }

        this.processData(data);
    }

    formatDate(value) {
        if (value instanceof Date) {
            return this.$userutils.formatDateTime(value);
        }
        else {
            return value;
        }
    }

    getTicketLink = (ticketNo) => <Link className="link" href={this.$userutils.getTicketUrl(ticketNo)}>{ticketNo}</Link>;

    setFileSelector = (f) => this.fileSelector = f;
    chooseFileForImport = () => this.fileSelector.click();

    renderCustomActions() {
        return <>
            <input ref={this.setFileSelector} type="file" className="hide" accept=".csv,.xlsx" onChange={this.fileSelected} />
            <Button text icon="fa fa-upload" onClick={this.chooseFileForImport} title="Choose file to import" />
        </>;
    }
}

export default BaseImport;
