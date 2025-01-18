
"use client";

import React, { useContext } from "react";
import Workspace from "@/components/Practice/workspace";
import ProblemData from "@/components/Practice/ProblemData";
import { useParams } from "next/navigation";

const ProblemPage = () => {
    const { pid } = useParams();
    const { problems, loading, error } = useContext(ProblemData);

    if (error) return <div>Error: {error}</div>;

    const selectedProblem = problems?.find((problem) => problem.slug === pid);

    if (!selectedProblem) {
        return <div></div>;
    }

    return (
        <Workspace problem={selectedProblem} />
    );
};

export default ProblemPage;
