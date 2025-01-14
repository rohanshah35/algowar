import React, { createContext, useContext, useState } from 'react';

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

interface SubmissionContextType {
  submissionResult: SubmissionResult | null;
  problemTitle: string;
  submittedCode: string;
  language: string;
  setSubmission: (result: SubmissionResult, code: string, title: string, lang: string) => void;
  clearSubmission: () => void;
}

const SubmissionContext = createContext<SubmissionContextType | null>(null);

export const useSubmission = () => {
  const context = useContext(SubmissionContext);
  if (!context) {
    throw new Error('useSubmission must be used within a SubmissionProvider');
  }
  return context;
};

export const SubmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [submissionResult, setSubmissionResult] = useState<SubmissionResult | null>(null);
  const [submittedCode, setSubmittedCode] = useState<string>('');
  const [problemTitle, setProblemTitle] = useState<string>('');
  const [language, setLanguage] = useState<string>('');

  const setSubmission = (
    result: SubmissionResult,
    code: string,
    title: string,
    lang: string
  ) => {
    console.log(result);
    setSubmissionResult(result);
    setSubmittedCode(code);
    setProblemTitle(title);
    setLanguage(lang);
  };

  const clearSubmission = () => {
    setSubmissionResult(null);
    setSubmittedCode('');
    setProblemTitle('');
    setLanguage('');
  };

  return (
    <SubmissionContext.Provider
      value={{
        submissionResult,
        submittedCode,
        problemTitle,
        language,
        setSubmission,
        clearSubmission,
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};