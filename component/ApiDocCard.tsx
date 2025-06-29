// components/ApiDocCard.tsx
import React from "react";

type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

interface ApiDocCardProps {
    method: ApiMethod;
    path: string;
    description: string;
    exampleRequest?: object;
    exampleHeaders?: object;
    exampleResponse: object;
}

const methodColors: Record<ApiMethod, string> = {
    GET: "bg-green-100 text-green-700",
    POST: "bg-blue-100 text-blue-700",
    PUT: "bg-yellow-100 text-yellow-700",
    DELETE: "bg-red-100 text-red-700",
};

const ApiDocCard: React.FC<ApiDocCardProps> = ({
    method,
    path,
    description,
    exampleRequest,
    exampleHeaders,
    exampleResponse,
}) => {
    return (
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 border">
            <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-sm rounded ${methodColors[method]}`}>
                    {method}
                </span>
                <span className="text-sm font-mono">{path}</span>
            </div>
            <p className="text-gray-700 mb-4">{description}</p>

            {exampleRequest && (
                <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-800 mb-1">Request</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                        {JSON.stringify(exampleRequest, null, 2)}
                    </pre>
                </div>
            )}
            {exampleHeaders && (
                <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-800 mb-1">Headers</h4>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                        {JSON.stringify(exampleHeaders, null, 2)}
                    </pre>
                </div>
            )}

            <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Response</h4>
                <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                    {JSON.stringify(exampleResponse, null, 2)}
                </pre>
            </div>
        </div>
    );
};

export default ApiDocCard;