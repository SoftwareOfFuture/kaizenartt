import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminLayout from './components/admin/AdminLayout.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import BlogManagement from './pages/admin/BlogManagement.jsx'
import BlogEditor from './pages/admin/BlogEditor.jsx'
import ContentManagement from './pages/admin/ContentManagement.jsx'
import Settings from './pages/admin/Settings.jsx'
import Blog from './pages/Blog.jsx'
import BlogDetail from './pages/BlogDetail.jsx'
import Home from './pages/Home'
import About from './pages/About'
import Services from './pages/Services'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import './index.css'

// App core
function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <div className="font-sans antialiased text-secondary bg-white flex flex-col min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="flex-grow">
                <Home />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/about" element={
            <div className="font-sans antialiased text-secondary bg-white flex flex-col min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="flex-grow">
                <About />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/services" element={
            <div className="font-sans antialiased text-secondary bg-white flex flex-col min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="flex-grow">
                <Services />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/projects" element={
            <div className="font-sans antialiased text-secondary bg-white flex flex-col min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="flex-grow">
                <Projects />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/projects/:slug" element={
            <div className="font-sans antialiased text-secondary bg-white flex flex-col min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="flex-grow">
                <ProjectDetail />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/contact" element={
            <div className="font-sans antialiased text-secondary bg-white flex flex-col min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="flex-grow">
                <Contact />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/blog" element={
            <div className="font-sans antialiased text-secondary bg-white flex flex-col min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="flex-grow">
                <Blog />
              </main>
              <Footer />
            </div>
          } />
          <Route path="/blog/:id" element={
            <div className="font-sans antialiased text-secondary bg-white flex flex-col min-h-screen overflow-x-hidden">
              <Navbar />
              <main className="flex-grow">
                <BlogDetail />
              </main>
              <Footer />
            </div>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="blog/new" element={<BlogEditor />} />
            <Route path="blog/:id/edit" element={<BlogEditor />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
