"use client";

import React from "react";
import Workspace from "@/components/Practice/workspace";
import { mockProblem } from "@/components/Practice/mockdata";

const ProblemPage = () => {
    return (
        <Workspace problem={mockProblem} />
    );
};

export default ProblemPage;
