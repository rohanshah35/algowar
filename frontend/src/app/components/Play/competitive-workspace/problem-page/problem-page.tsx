
"use client";

import React from "react";
import Workspace from "@/components/Practice/workspace";
import { useParams } from "next/navigation";

const ProblemPage = () => {
    const { pid } = useParams();

    return (
        <Workspace slug={pid} />
    );
};

export default ProblemPage;
