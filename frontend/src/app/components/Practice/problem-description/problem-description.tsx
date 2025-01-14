"use client";

import React from "react";
import { Badge, Group } from "@mantine/core";

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}k`;
  } else {
    return num.toString();
  }
};

const ProblemDescription = ({ problem }: { problem: any }) => {
  const { datatypes, strategies } = problem.categories || { datatypes: [], strategies: [] };
  const { acceptedSubmissions, totalSubmissions, acceptanceRate } = problem;

  return (
    <div className="bg-dark-layer-1 p-4 h-full overflow-y-auto">
      <h1 className="text-white text-2xl font-bold mb-4">{problem.title}</h1>

      <div className="mb-8 ">
        <span
          className={`text-sm px-2 py-1 rounded ${
            problem.difficulty === "Easy"
              ? "bg-green-700 text-green-300"
              : problem.difficulty === "Medium"
              ? "bg-yellow-700 text-yellow-300"
              : "bg-red-700 text-red-300"
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <h3 className="text-white text-sm font-bold mr-2 font-mono">DATA STRUCTURES:</h3>
          <Group >
            {datatypes.map((datatype: string, idx: number) => (
              <Badge
                key={idx}
                style={{
                  backgroundColor: "#3a3a3c",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {datatype.toUpperCase()}
              </Badge>
            ))}
          </Group>
        </div>

        <div className="flex items-center">
          <h3 className="text-white text-sm font-bold mr-2 font-mono">STRATEGIES:</h3>
          <Group >
            {strategies.map((strategy: string, idx: number) => (
              <Badge
                key={idx}
                style={{
                  backgroundColor: "#3a3a3c",
                  color: "white",
                  fontWeight: "bold",
                }}
              >
                {strategy.toUpperCase()}
              </Badge>
            ))}
          </Group>
        </div>
      </div>

      <p className="text-white text-sm mb-4">{problem.description}</p>

      <h2 className="text-white text-lg font-semibold mb-2">Examples:</h2>
      {problem.examples?.map((example: any, index: number) => (
        <div key={index} className="mb-4">
          <p className="text-white font-medium p-2">Case {index + 1}</p>
          <div className="bg-gray-800 p-3 rounded">
            <pre className="text-white text-sm">
              <strong>Input:</strong> {example.inputText}
              <br />
              <strong>Output:</strong> {example.outputText}
            </pre>
          </div>
        </div>
      ))}

      <h2 className="text-white text-lg font-semibold mt-6 p-1">Constraints:</h2>
      <ul className="ml-5 list-disc">
        {problem.constraints?.map((constraint: string, index: number) => (
          <li
            key={index}
            className="text-sm text-gray-300 bg-gray-900 rounded p-2 mb-2 font-mono"
            dangerouslySetInnerHTML={{
              __html:
                constraint.replace(/(\d+)\^(\d+)/g, "$1<sup>$2</sup>"),
            }}
          ></li>
        ))}
      </ul>

      <div className="justify-between items-center mt-6 border-t border-gray-700 pt-5">
        <div className="text-gray-400 text-sm">
          <span className="font-semibold text-white">Accepted:</span>{" "}
          {formatNumber(acceptedSubmissions)}
        </div>
        <div className="text-gray-400 text-sm">
          <span className="font-semibold text-white">Submissions:</span>{" "}
          {formatNumber(totalSubmissions)}
        </div>
        <div className="text-gray-400 text-sm">
          <span className="font-semibold text-white">Acceptance Rate:</span>{" "}
          {acceptanceRate}%
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;
