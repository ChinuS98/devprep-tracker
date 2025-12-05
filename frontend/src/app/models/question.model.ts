export interface Question {
  _id?: string;
  topic: string;
  questionText: string;
  type: 'subjective' | 'mcq';
  answer?: string;
  options: string[];                    // not optional -> avoids undefined issues
  correctOptionIndex?: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  status: 'To Learn' | 'In Progress' | 'Mastered';
  category?: string;
  tags?: string[];                      // always array in DB
  resourceLink?: string;
  sourceType?: string;
  uiPattern?: string;
  figmaUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
