import React from 'react';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-boundary">Error: {this.state.error.message}</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;