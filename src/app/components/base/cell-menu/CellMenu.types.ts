export interface CellMenuAction {
  id?: string;
  label: string;
  handle: () => void | false; // Return false to prevent menu from closing
}
