const fieldTicketNo = "issuekey";
const parentKey = "parent";
const fieldProject = "project";
const fieldIssueType = "issuetype";
const fieldAssignee = "assignee";
const fieldReporter = "reporter";
const originalEstimate = "timetracking.originalEstimate";
const remainingEstimate = "timetracking.remainingEstimate";

const fieldMapping = {
    issuekey: fieldTicketNo,
    ticketno: fieldTicketNo,
    numerodeticket: fieldTicketNo,
    numeroticket: fieldTicketNo,
    numeroincidencia: fieldTicketNo,
    numerodelticket: fieldTicketNo,
    ticket: fieldTicketNo,
    issue: fieldTicketNo,
    key: fieldTicketNo,
    id: fieldTicketNo,

    project: fieldProject,
    projectkey: fieldProject,
    projectid: fieldProject,
    proyecto: fieldProject,
    claveproyecto: fieldProject,

    parent: parentKey,
    parentkey: parentKey,
    parentticket: parentKey,
    parentticketno: parentKey,
    parentissue: parentKey,
    parentid: parentKey,

    status: "status",
    issuestatus: "status",

    summary: "summary",
    resumen: "summary",
    titulo: "summary",
    priority: "priority",
    resolution: "resolution",
    description: "description",

    estimate: originalEstimate,
    originalestimate: originalEstimate,
    timetrackingoriginalestimate: originalEstimate,
    initialestimate: originalEstimate,
    estimacionoriginal: originalEstimate,
    estimacioninicial: originalEstimate,
    remaining: remainingEstimate,
    remainingestimate: remainingEstimate,
    timetrackingremainingestimate: remainingEstimate,
    currentestimate: remainingEstimate,
    estimacionrestante: remainingEstimate,

    assignee: fieldAssignee,
    assignto: fieldAssignee,
    assignedto: fieldAssignee,
    responsable: fieldAssignee,
    asignadoa: fieldAssignee,

    reporter: fieldReporter,
    reported: fieldReporter,
    reportedby: fieldReporter,
    informador: fieldReporter,

    issuetype: fieldIssueType,
    type: fieldIssueType,
    tipo: fieldIssueType,
    tipotarea: fieldIssueType,
    tipoincidencia: fieldIssueType,

    label: "labels"
};

function normalizeHeader(value) {
    return (value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[ "._-]/g, '')
        .toLowerCase();
}

function normalizeHeaderLoose(value) {
    return normalizeHeader(value).replace(/de/g, "");
}

function getFieldNames(field) {
    return [field.id, field.name, ...(field.clauseNames || [])].filter(Boolean);
}

function findField(customFields, fieldName) {
    const normalizedFieldName = normalizeHeader(fieldName);
    const looseFieldName = normalizeHeaderLoose(fieldName);

    return customFields.first(cf => getFieldNames(cf).some(name =>
        normalizeHeader(name) === normalizedFieldName
        || normalizeHeaderLoose(name) === looseFieldName
    ));
}

function findAliasField(customFields, aliases, header) {
    const candidates = aliases?.[header] || aliases?.[normalizeHeaderLoose(header)];

    if (!candidates?.length) {
        return null;
    }

    for (let i = 0; i < candidates.length; i++) {
        const field = findField(customFields, candidates[i]);
        if (field) {
            return field;
        }
    }

    return null;
}

export function transformHeader(customFields = [], aliases) {
    return (c) => {
        // As prototype functions of array are passed to this function, need to check if this is string
        if (!c || typeof c !== 'string') {
            return null;
        }

        c = normalizeHeader(c);
        const looseHeader = normalizeHeaderLoose(c);
        let fieldName = fieldMapping[c] || null;

        if (!fieldName) {
            const field = findField(customFields, c) || findAliasField(customFields, aliases, c);

            if (field) {
                fieldName = field.id;
            }
        }

        return fieldName || c;
    };
}
