import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error("Application crash captured by ErrorBoundary", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "var(--text)" }}>
          Something went wrong
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
