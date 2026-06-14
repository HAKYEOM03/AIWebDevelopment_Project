export interface Question {
  id: number;
  part: number;
  set: number;
  question: string;
  options: string[];
  answer: string;
  imageUrl?: string;
  conversation?: string;
}
