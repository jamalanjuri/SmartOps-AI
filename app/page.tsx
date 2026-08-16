"use client";

import Layout from "../components/Layout";
import ProtectedRoute from "./components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <Layout />
    </ProtectedRoute>
  );
}