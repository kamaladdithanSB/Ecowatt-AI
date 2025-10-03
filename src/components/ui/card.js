import React from "react";

export function Card({ children, className = "" }) {
  return <div className={`bg-white shadow rounded ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardHeader({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return <h2 className={className}>{children}</h2>;
}
