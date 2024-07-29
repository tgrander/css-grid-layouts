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
  key: keyof TableData;
  label: string;
}

export interface TableConfig {
  columns: ColumnConfig[];
  data: TableData[];
}

interface CellFormat {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textColor?: boolean;
  backgroundColor?: boolean;
}

interface CellState {
  value: string;
  format: CellFormat;
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

  private initManagers(): void {
    this.viewManager = new TableViewManager(this.container, this.config);
  }
}

class TableStateManager {
  private cellStates!: CellState[][];
  private columns: ColumnConfig[];

  constructor(config: TableConfig) {
    this.columns = config.columns;
    this.initCellStates(config);
  }

  private initCellStates(config: TableConfig) {
    this.cellStates = config.data.map((row) =>
      this.columns.map((column) => ({
        value: row[column.key],
        format: {},
      }))
    );
  }

  public getColumns() {
    return this.columns;
  }

  public getCellStates() {
    return this.cellStates;
  }

  public updateCellValue(
    rowIndex: number,
    cellIndex: number,
    newValue: string
  ) {
    this.cellStates[rowIndex][cellIndex].value = newValue;
  }

  public updateCellFormat(
    rowIndex: number,
    cellIndex: number,
    format: Partial<CellFormat>
  ) {
    this.cellStates[rowIndex][cellIndex].format = {
      ...this.cellStates[rowIndex][cellIndex].format,
      ...format,
    };
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
    this.createTableHeader();
    this.createTableBody();
  }

  private createTableHeader() {
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
        const td = document.createElement("td");
        td.textContent = value;
        td.contentEditable = "true";

        tr.appendChild(td);
      });
      tBody.append(tr);
    });

    this.container.appendChild(tBody);
  }
}
