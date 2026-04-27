import React from 'react';
import { exportCsv } from "../../../common/utils";

export const noRowMessage = (<span>Upload the list of tasks by clicking the ( <span className="fa fa-upload" /> ) icon in top right corner.
    Click <span className="link" onClick={downloadTemplate}>here</span> to download a sample template.</span>);

function downloadTemplate() {
    const lines = [
        "Numero de ticket,Tipo,Fecha inicio prevista,Fecha inicio real,Fecha de entrega prevista,Fecha entrega real,Estimacion original,Estimacion restante,Responsable",
        "JA-1001,,2026-04-27,2026-04-27,2026-04-30,,2d,1d,admin",
        "JA-1002,,2026-05-04,,2026-05-08,,1w,1w,admin"
    ];
    exportCsv(lines.join("\n"), "sample_tasks");
}
