export interface CellMenuAction {
  label: string;
  handle: () => void | false; // Return false to prevent menu from closing
}
