import * as chrono from 'chrono-node';

export interface ParsedTask {
  title: string;
  due_date: string | null;
  due_time: string | null;
  project: string | null;
  priority: number;
  labels: string[];
}

export const parseTaskInput = (input: string): ParsedTask => {
  let text = input;

  // 1. Extract Priority (!p1, !p2, !p3, !p4)
  const priorityMatch = text.match(/!p([1-4])/i);
  const priority = priorityMatch ? parseInt(priorityMatch[1]) : 4;
  text = text.replace(/!p[1-4]/gi, '').trim();

  // 2. Extract Project (#ProjectName)
  const projectMatch = text.match(/#(\w+)/);
  const project = projectMatch ? projectMatch[1] : null;
  text = text.replace(/#\w+/g, '').trim();

  // 3. Extract Labels (@LabelName)
  const labels: string[] = [];
  const labelMatches = text.matchAll(/@(\w+)/g);
  for (const match of labelMatches) {
    labels.push(match[1]);
  }
  text = text.replace(/@\w+/g, '').trim();

  // 4. Extract Date/Time using Chrono
  const dateResults = chrono.parse(text);
  let due_date: string | null = null;
  let due_time: string | null = null;

  if (dateResults.length > 0) {
    const date = dateResults[0].start.date();
    due_date = date.toISOString().split('T')[0];
    
    // Check if time was specifically mentioned
    if (dateResults[0].start.isCertain('hour')) {
      due_time = date.toTimeString().split(' ')[0];
    }
    
    // Remove the date text from the title
    text = text.replace(dateResults[0].text, '').trim();
  }

  // Final text is the title
  return {
    title: text || "Untitled Task",
    due_date,
    due_time,
    project,
    priority,
    labels
  };
};