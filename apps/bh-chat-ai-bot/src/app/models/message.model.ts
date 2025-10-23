export interface Message {
  user: string;
  type: 'sent' | 'received';
  text: string;
  time: string;
  avatar: string;
}
