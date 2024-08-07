enum TableEventType {
  CellSelect = "cell:select",
  CellFocus = "cell:focus",
  CellBlur = "cell:blur",
  CellKeypressEnter = "cell:keypress:enter",
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
  textColor?: string;
  backgroundColor?: string;
}

interface CellState {
  value: string;
  format: CellFormat;
}

export default class EditableTable {
  private container: HTMLElement;
  private config: Required<TableConfig>;
  private stateManager: TableStateManager;
  private viewManager: TableViewManager;

  constructor(container: HTMLElement, config: TableConfig) {
    this.container = container;
    this.config = config;
    this.stateManager = new TableStateManager(this.config);
    this.viewManager = new TableViewManager(this.container, this.stateManager);

    this.init();
  }

  private init() {
    this.viewManager.render();
  }

  private attachEventListeners() {}
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
  private stateManager: TableStateManager;
  private cellMap: Map<string, HTMLTableCellElement> = new Map();

  constructor(container: HTMLElement, stateManager: TableStateManager) {
    this.container = container;
    this.stateManager = stateManager;
  }

  public render() {
    this.container.innerHTML = "";
    this.createTable();
  }

  private createTable() {
    const table = document.createElement("table") as HTMLTableElement;
    table.classList.add("editable-table");
    this.createTableHeader(table);
    this.createTableBody(table);
    this.container.appendChild(table);
  }

  private createTableHeader(table: HTMLTableElement) {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    this.stateManager.getColumns().forEach((column) => {
      const th = document.createElement("th");
      th.textContent = column.label;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
  }

  private createTableBody(table: HTMLTableElement) {
    const tbody = document.createElement("tbody");
    const cellStates = this.stateManager.getCellStates();
    cellStates.forEach((row, rowIndex) => {
      const tr = document.createElement("tr");
      row.forEach((cellState, cellIndex) => {
        const td = this.createCell(cellState, rowIndex, cellIndex);
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
  }

  private createCell(
    cellState: CellState,
    rowIndex: number,
    cellIndex: number
  ) {
    const td = document.createElement("td");
    td.textContent = cellState.value;
    td.contentEditable = "true";
    this.applyCellFormat(td, cellState.format);
    // Add td ref to cellMap
    this.cellMap.set(this.getCellMapKey(rowIndex, cellIndex), td);

    return td;
  }

  private applyCellFormat(td: HTMLTableCellElement, format: CellFormat) {
    if (format.bold) td.style.fontWeight = "bold";
    if (format.italic) td.style.fontStyle = "italic";
    if (format.underline) td.style.textDecoration = "underline";
    if (format.textColor) td.style.color = format.textColor;
    if (format.backgroundColor)
      td.style.backgroundColor = format.backgroundColor;
  }

  public updateCell(rowIndex: number, cellIndex: number): void {
    const cellStates = this.stateManager.getCellStates();
    const cell = cellStates[rowIndex][cellIndex];
    const td = this.cellMap.get(this.getCellMapKey(rowIndex, cellIndex));
    if (td) {
      td.textContent = cell.value;
      this.applyCellFormat(td, cell.format);
    }
  }

  private getCellMapKey(rowIndex: number, cellIndex: number) {
    return `${rowIndex}-${cellIndex}`;
  }
}
