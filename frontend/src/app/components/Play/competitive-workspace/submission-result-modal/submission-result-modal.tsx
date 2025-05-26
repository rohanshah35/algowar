import React from 'react';
import { Card, Text, Grid, Alert, Title } from '@mantine/core';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { python } from '@codemirror/lang-python';
import { Modal } from '@mantine/core';

interface SubmissionResult {
    error?: string;
    all_passed?: boolean;
    test_cases_passed?: number;
    total_test_cases?: number;
    runtime_ms?: number;
    first_case_failed?: {
      case?: string;
      passed?: boolean;
      error?: string;
      output?: unknown;
      expected?: unknown;
      [key: string]: unknown;
    };
  }
  
  interface SubmissionResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    submissionResult?: SubmissionResult;
    submittedCode: string;
    problemTitle?: string;
    language?: string;
  }
  
  const formatValue = (value: unknown): string => {
    if (Array.isArray(value)) {
      return `[${value.join(', ')}]`;
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };
  
  const SubmissionResultModal: React.FC<SubmissionResultModalProps> = ({
    isOpen,
    onClose,
    submissionResult,
    submittedCode,
    problemTitle,
    language = 'python3'
  }) => {
  if (!submissionResult) return null;

  const getLanguageExtension = () => {
    switch (language) {
      case 'python3':
        return [python()];
      default:
        return [python()];
    }
  };

  const handleError = () => {
    if (submissionResult.error) {
      return (
        <Card shadow="sm" p="lg" className="mb-6" style={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#f4f4f5" }}>
          <Text fw={700} size="lg" className="mb-4" style={{ color: "#f4f4f5" }}>
            Error
          </Text>
          <Text style={{ color: "#f87171" }}>
            {submissionResult.error}
          </Text>
        </Card>
      );
    }
    return null;
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="xl"
      centered
      styles={{
        content: {
          backgroundColor: "#18181b",
          color: "#f4f4f5",
          border: "1px solid #27272a",
          borderRadius: "16px",
          padding: "0",
          maxWidth: "90vw",
          width: "1200px",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh"
        },
        header: {
          backgroundColor: "#18181b",
          color: "#f4f4f5",
          borderBottom: "1px solid #27272a",
          padding: "20px",
          margin: 0,
          position: "sticky",
          top: 0,
          zIndex: 10
        },
        title: {
          color: "#f4f4f5",
          fontSize: "24px",
          fontWeight: "600"
        },
        body: {
          padding: "20px",
          overflow: "auto"
        }
      }}
      title={problemTitle}
    >
      <div className="flex-1 overflow-auto">
        {handleError()}

        {!submissionResult.error && (
          <Alert
            color={submissionResult.all_passed ? 'green' : 'red'}
            title={submissionResult.all_passed ? 'Accepted' : 'Wrong Answer'}
            className="mb-6"
            style={{
              backgroundColor: "#18181b",
              borderColor: "#27272a",
              color: "#f4f4f5",
            }}
          >
            <Text style={{ color: "#f4f4f5" }}>
              {submissionResult.test_cases_passed} / {submissionResult.total_test_cases} test cases passed
            </Text>
            <Text style={{ color: "#f4f4f5" }}>
              Runtime: {submissionResult.runtime_ms}ms
            </Text>
          </Alert>
        )}

        {!submissionResult.error && submissionResult.first_case_failed && (
          <Card shadow="sm" p="lg" className="mb-6" style={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#f4f4f5" }}>
            <Text fw={700} size="lg" className="mb-4" style={{ color: "#f4f4f5" }}>
              First Failed Test Case
            </Text>
            <Grid>
              {Object.entries(submissionResult.first_case_failed).map(([key, value]) => {
                if (['case', 'passed', 'error', 'output', 'expected'].includes(key)) return null;
                return (
                  <Grid.Col key={key} span={6}>
                    <div className="font-medium">{key}:</div>
                    <div className="font-mono p-2 rounded" style={{ backgroundColor: "#27272a", color: "#f4f4f5" }}>
                      {formatValue(value)}
                    </div>
                  </Grid.Col>
                );
              })}
            </Grid>

            <Grid className="mt-6">
              <Grid.Col span={6}>
                <Text fw={600} size="sm" className="mb-2" style={{ color: "#f4f4f5" }}>
                  Your Output:
                </Text>
                <div
                  className="font-mono p-2 rounded"
                  style={{
                    backgroundColor: "#27272a",
                    color: "#f4f4f5",
                    border: submissionResult.first_case_failed.output === submissionResult.first_case_failed.expected ? "1px solid #34d399" : "1px solid #f87171"
                  }}
                >
                  {formatValue(submissionResult.first_case_failed.output)}
                </div>
              </Grid.Col>
              <Grid.Col span={6}>
                <Text fw={600} size="sm" className="mb-2" style={{ color: "#f4f4f5" }}>
                  Expected:
                </Text>
                <div
                  className="font-mono p-2 rounded"
                  style={{
                    backgroundColor: "#27272a",
                    color: "#f4f4f5",
                    border: submissionResult.first_case_failed.expected === submissionResult.first_case_failed.output ? "1px solid #34d399" : "1px solid #f87171"
                  }}
                >
                  {formatValue(submissionResult.first_case_failed.expected)}
                </div>
              </Grid.Col>
            </Grid>
          </Card>
        )}

        <Card shadow="sm" p="lg" style={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#f4f4f5" }}>
          <Text fw={700} size="lg" className="mb-4" style={{ color: "#f4f4f5" }}>
            Submitted Code
          </Text>
          <CodeMirror
            value={submittedCode}
            theme={vscodeDark}
            extensions={getLanguageExtension()}
            editable={false}
            className="h-64 w-full"
          />
        </Card>
      </div>
    </Modal>
  );
};

export default SubmissionResultModal;