
const ProblemDescription = ({ problem }: { problem: any }) => (
  <div className="bg-dark-layer-1 p-4 h-full overflow-y-auto">
    <h1 className="text-white text-2xl font-bold mb-4">{problem.title}</h1>
    <div className="mb-4">
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
    <p className="text-white text-sm mb-4">{problem.description}</p>
    <h2 className="text-white text-lg font-semibold mb-2">Examples:</h2>
    {problem.examples.map((example: any, index: number) => (
      <div key={index} className="mb-4">
        <p className="text-white font-medium p-2">{index + 1}:</p>
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
    <ul className="ml-5 list-disc ">
      {problem.constraints.map((constraint: string, index: number) => (
        <li
          key={index}
          className="text-sm text-gray-300 bg-gray-900 rounded p-2 mb-2 font-mono"
          dangerouslySetInnerHTML={{
            __html: `<span class="mr-2 text-orange-400">⚡</span>` + 
                    constraint.replace(/(\d+)\^(\d+)/g, '$1<sup>$2</sup>'),
          }}
        ></li>
      ))}
    </ul>
  </div>
);

export default ProblemDescription;

