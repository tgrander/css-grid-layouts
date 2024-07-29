enum TableEventType {
  CellSelect = "cell:select",
  CellFocus = "cell:focus",
  CellBlur = "cell:blur",
  CellKeypressEnter = "cell:keypress:enter",
}

class EventEmitter {
  private on(): void {}
  private emit(): void {}
  private off(): void {}
}

export interface TableData {
  //   id: number;
  firstName: string;
  lastName: string;
  email: string;
  jobTitle: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  // sortable?: boolean;
  // filterable?: boolean;
}

export interface TableConfig {
  columns: ColumnConfig[];
  data: TableData[];
}

export default class EditableTable {
  private container: HTMLElement;
  private config: Required<TableConfig>;
  private viewManager: TableViewManager;

  constructor(container: HTMLElement, config: TableConfig) {
    this.container = container;
    this.config = config;
    this.initManagers();
  }

  private initManagers() {
    this.viewManager = new TableViewManager(this.container, this.config);
  }
}

class TableViewManager {
  private container: HTMLElement;
  private config: TableConfig;

  constructor(container: HTMLElement, config: TableConfig) {
    this.container = container;
    this.config = config;
    this.init();
  }

  private init() {
    this.createHeader();
    this.createTableBody();
  }

  private createHeader() {
    const header = document.createElement("thead");
    header.classList.add("editableTable__header");
    const tr = document.createElement("tr");

    this.config.columns.forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column.label;
      th.dataset.key = column.key;
      th.scope = "col";
      tr.appendChild(th);
    });

    header.appendChild(tr);
    this.container.appendChild(header);
  }

  private createTableBody() {
    const tBody = document.createElement("tbody");
    tBody.classList.add("editableTable__body");

    this.config.data.forEach((rowData) => {
      const tr = document.createElement("tr");
      Object.values(rowData).forEach((value) => {
        console.log("row data value :>> ", value);
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });
      tBody.append(tr);
    });

    this.container.appendChild(tBody);
  }
}
