
"use client";

import React, { useContext } from "react";
import Workspace from "@/components/Practice/workspace";
import ProblemData from "@/components/Practice/ProblemData";
import { useParams } from "next/navigation";

const ProblemPage = () => {
    const { pid } = useParams();
    const { problems, loading, error } = useContext(ProblemData);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    console.log(pid);
    console.log(problems);
    const selectedProblem = problems?.find((problem) => problem.slug === pid);
    console.log(selectedProblem);

    if (!selectedProblem) {
        return <div>Problem not found</div>;
    }

    return (
        <Workspace problem={selectedProblem} />
    );
};

export default ProblemPage;
