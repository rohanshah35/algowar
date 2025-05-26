import { create } from 'zustand';

export interface TestCase {
  case: number;
  error: string | null;
  expected: any;
  output: any;
  passed: boolean;
  [key: string]: any;
}

export interface SubmissionResult {
  all_passed: boolean;
  runtime_ms: number;
  test_cases_passed: number;
  total_test_cases: number;
  first_case_failed?: TestCase;
  error?: string;
}

interface SubmissionStore {
  submissionResult: SubmissionResult | null;
  submittedCode: string;
  problemTitle: string;
  language: string;
  setSubmission: (result: SubmissionResult, code: string, title: string, lang: string) => void;
  clearSubmission: () => void;
}

export const useSubmissionStore = create<SubmissionStore>((set) => ({
  submissionResult: null,
  submittedCode: '',
  problemTitle: '',
  language: '',
  setSubmission: (result: SubmissionResult, code: string, title: string, lang: string) => {
    console.log(result);
    set({
      submissionResult: result,
      submittedCode: code,
      problemTitle: title,
      language: lang,
    });
  },
  clearSubmission: () => {
    set({
      submissionResult: null,
      submittedCode: '',
      problemTitle: '',
      language: '',
    });
  },
}));