export interface DropEvent {
  source: string;
  target: string;
  type: 'before' | 'after';
}
