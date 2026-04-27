import ImportIssue from '../issue/BulkImportIssue';
import { noRowMessage } from './helpers';

class ImportTask extends ImportIssue { }

ImportTask.importConfig = {
    importType: "Task",
    icon: "fa fa-tasks",
    className: "import-issue import-task",
    itemLabel: "Tasks",
    editOnly: true,
    optionalFieldsOnUpdate: ['issuetype'],
    ignoreFieldsOnUpdate: ['issuetype'],
    fieldAliases: {
        fechainicioprevista: [
            'Fecha inicio prevista',
            'Fecha de inicio prevista',
            'Inicio previsto',
            'Planned start date',
            'Target start',
            'Start date'
        ],
        fechainicioreal: [
            'Fecha inicio real',
            'Fecha de inicio real',
            'Inicio real',
            'Actual start date',
            'Actual start'
        ],
        fechaentregaprevista: [
            'Fecha prevista de entrega',
            'Fecha prevista entrega',
            'Fecha entrega prevista',
            'Fecha de entrega prevista',
            'Entrega prevista',
            'Planned delivery date',
            'Planned end date',
            'Target end'
        ],
        fechaentregaprevistam: [
            'Fecha prevista de entrega',
            'Fecha prevista entrega',
            'Fecha entrega prevista',
            'Fecha de entrega prevista',
            'Entrega prevista'
        ],
        fechaentregareal: [
            'Fecha real de entrega',
            'Fecha entrega real',
            'Fecha de entrega real',
            'Entrega real',
            'Actual delivery date',
            'Actual end date',
            'Fecha fin real'
        ]
    },
    noRowMessage
};

export default ImportTask;
