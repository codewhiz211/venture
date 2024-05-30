export interface JobDetailInfo {
  subdivision: string;
  lotNumber: string;
  projectManager: string;
  scheduleDate?: string;
  description?: string;
}

// jobDetailInfo keys and field displaying name
export const fieldDisplayNames = {
  subdivision: 'subdivition',
  lotNumber: 'lot#',
  projectManager: 'project manager',
  scheduleDate: 'schedule date',
  description: 'job description',
};
