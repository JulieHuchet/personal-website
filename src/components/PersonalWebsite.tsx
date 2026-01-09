import React from 'react';
import { AuthButton } from './AuthButton';

export const PersonalWebsite: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-gray-900">Julie Huchet</h1>
            </div>
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex space-x-8">
                <a href="#about" className="text-gray-500 hover:text-gray-900 transition-colors">About</a>
                <a href="#experience" className="text-gray-500 hover:text-gray-900 transition-colors">Experience</a>
                <a href="#projects" className="text-gray-500 hover:text-gray-900 transition-colors">Projects</a>
                <a href="#contact" className="text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
              </nav>
              <AuthButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Welcome to my personal website
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              I'm a passionate developer and designer creating meaningful digital experiences. 
              Explore my work, learn about my journey, and let's connect.
            </p>
            <div className="flex justify-center space-x-4">
              <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
                View My Work
              </button>
              <button className="border border-indigo-600 text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors">
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">About Me</h3>
              <p className="text-gray-600 mb-6">
                I'm a creative professional with a passion for building innovative solutions 
                that make a difference. With expertise in modern web technologies and a keen 
                eye for design, I bring ideas to life through code.
              </p>
              <p className="text-gray-600 mb-6">
                When I'm not coding, you can find me exploring new technologies, contributing 
                to open source projects, or enjoying the great outdoors.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">React</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">TypeScript</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">Node.js</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">Cloudflare Workers</span>
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">UI/UX Design</span>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <span className="text-gray-500">Profile Photo Placeholder</span>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Featured Projects</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here are some of the projects I've worked on recently. Each one represents 
              a unique challenge and learning opportunity.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((project) => (
              <div key={project} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="bg-gray-200 h-48 flex items-center justify-center">
                  <span className="text-gray-500">Project {project} Preview</span>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">Project {project}</h4>
                  <p className="text-gray-600 mb-4">
                    A brief description of this amazing project and the technologies used to build it.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">React</span>
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">TypeScript</span>
                    </div>
                    <a href="#" className="text-indigo-600 hover:text-indigo-800 font-medium">View →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Let's Connect</h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              I'm always interested in new opportunities and collaborations. 
              Feel free to reach out if you'd like to work together.
            </p>
            <div className="flex justify-center space-x-6">
              <a href="mailto:julie@example.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <span className="sr-only">Email</span>
                📧 Email
              </a>
              <a href="https://linkedin.com/in/juliehuchet" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <span className="sr-only">LinkedIn</span>
                💼 LinkedIn
              </a>
              <a href="https://github.com/juliehuchet" className="text-gray-600 hover:text-indigo-600 transition-colors">
                <span className="sr-only">GitHub</span>
                🐙 GitHub
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p>&copy; 2025 Julie Huchet. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
