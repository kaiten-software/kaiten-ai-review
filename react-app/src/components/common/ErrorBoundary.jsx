
import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-red-100">
                        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ExclamationTriangleIcon className="w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
                        <p className="text-gray-600 mb-6">
                            {this.state.error?.message || "An unexpected error occurred."}
                        </p>
                        <details className="text-left bg-gray-50 p-4 rounded-lg text-sm text-gray-700 overflow-auto max-h-48 mb-6">
                            <summary className="cursor-pointer font-medium mb-2">Error Details</summary>
                            <pre className="whitespace-pre-wrap font-mono text-xs">
                                {this.state.error?.stack}
                            </pre>
                        </details>
                        <button
                            onClick={() => window.location.reload()}
                            className="btn btn-primary w-full py-3"
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
