import React from 'react';
import { Card, Text, Container, Grid, Alert, Title } from '@mantine/core';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { python } from '@codemirror/lang-python';
import { useSubmission } from '@/context/submission-context';

const formatValue = (value: any): string => {
  if (Array.isArray(value)) {
    return `[${value.join(', ')}]`;
  }
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

const SubmissionResultView: React.FC = () => {
  const { submissionResult, submittedCode, problemTitle, language } = useSubmission();
  
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
        <Card shadow="sm" p="lg" style={{ backgroundColor: "#18181b", borderColor: "#27272a", color: "#f4f4f5" }} className="mb-6">
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
    <Container size="lg" className="py-8">
      <Title order={1} className="mb-4" style={{ color: "#f4f4f5" }}>
        {problemTitle}
      </Title>

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
          className="h-[300px] w-full"
        />
      </Card>
    </Container>
  );
};

export default SubmissionResultView;
