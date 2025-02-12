import React, { useState, useEffect } from 'react';
import { Terminal, User, Briefcase, FileText, Mail, Code, Server, Shield, Github, Cpu, Globe } from 'lucide-react';

// Circuit Board Background Component
const CircuitBoard = () => (
  <div className="fixed inset-0 pointer-events-none opacity-10">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <pattern id="circuit" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
        <path d="M10 10h30M25 10v30M40 25h-30" stroke="currentColor" strokeWidth="0.5" fill="none"/>
        <circle cx="10" cy="10" r="2" fill="currentColor"/>
        <circle cx="25" cy="25" r="2" fill="currentColor"/>
        <circle cx="40" cy="25" r="2" fill="currentColor"/>
        <circle cx="25" cy="40" r="2" fill="currentColor"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#circuit)"/>
    </svg>
  </div>
);

// Terminal Command Line Component
const CommandLine = () => {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState([]);
  
  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const newOutput = [...output, { cmd: command, response: processCommand(command) }];
      setOutput(newOutput);
      setCommand('');
    }
  };

  const processCommand = (cmd) => {
    const commands = {
      help: 'Available commands: help, about, skills, contact, clear',
      about: 'Gabriel Tampu - Computer Science Student & DevOps Enthusiast',
      skills: 'HTML, CSS, Python, SQL, JavaScript, C#, Linux, Networking',
      clear: '',
      contact: 'GitHub: https://github.com/j33fo'
    };

    return commands[cmd.toLowerCase()] || `Command not found: ${cmd}`;
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm">
      <div className="mb-2">
        {output.map((item, i) => (
          <div key={i} className="mb-1">
            <div className="text-green-400">$ {item.cmd}</div>
            <div className="text-gray-300">{item.response}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center">
        <span className="text-green-400 mr-2">$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleCommand}
          className="bg-transparent focus:outline-none text-green-400 w-full"
          placeholder="Type 'help' for commands..."
        />
      </div>
    </div>
  );
};

// Glitch Text Effect Component
const GlitchText = ({ text }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  return (
    <div
      className={`relative inline-block ${isGlitching ? 'animate-glitch' : ''}`}
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
    >
      <span className="relative inline-block">
        {text}
        {isGlitching && (
          <>
            <span className="absolute top-0 left-0.5 text-red-500 opacity-75 animate-glitch-1">{text}</span>
            <span className="absolute top-0 -left-0.5 text-blue-500 opacity-75 animate-glitch-2">{text}</span>
          </>
        )}
      </span>
    </div>
  );
};

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('whoami');
  const [isTyping, setIsTyping] = useState(true);

  const personalInfo = {
    name: 'Gabriel Tampu',
    title: 'Computer Science Student & DevOps Enthusiast',
    education: 'Year 2 - University of Bedfordshire, UK',
    background: 'Self-taught in computing since 2000s',
    languages: ['Romanian (Native)', 'English', 'Others (Basic)'],
    interests: ['DevOps', 'SecOps', 'Cybersecurity', 'Networking'],
    github: 'https://github.com/j33fo',
  };

  const skills = {
    programming: ['HTML', 'CSS', 'Python', 'SQL', 'JavaScript', 'C#'],
    technologies: ['Linux', 'Cisco', 'Networking', 'Cybersecurity'],
    infrastructure: ['Raspberry Pi', 'Home Lab Setup', 'Networking'],
    certifications: ['NCFE Level 3 Certificate in Cybersecurity Practices']
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 font-mono relative">
      <CircuitBoard />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-gray-800/90 backdrop-blur-sm p-4 z-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <GlitchText text="~/portfolio" />
          <div className="flex space-x-6">
            {[
              { id: 'whoami', icon: User, label: 'whoami' },
              { id: 'skills', icon: Code, label: 'skills.sh' },
              { id: 'projects', icon: Briefcase, label: 'projects.js' },
              { id: 'lab', icon: Cpu, label: 'lab.md' },
              { id: 'contact', icon: Mail, label: 'contact.txt' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center space-x-2 hover:text-green-300 transition-colors ${
                  activeSection === id ? 'text-green-300 border-b-2 border-green-300' : ''
                }`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20 max-w-6xl mx-auto p-6">
        {/* WhoAmI Section */}
        {activeSection === 'whoami' && (
          <div className="space-y-6">
            <div className="terminal-window bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg">
              <div className="flex items-center space-x-4 mb-6">
                <Shield size={24} className="text-green-400" />
                <GlitchText text={personalInfo.name} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-green-300 mb-2">> Status</h3>
                    <p>{personalInfo.education}</p>
                    <p>{personalInfo.background}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-green-300 mb-2">> Career Objectives</h3>
                    <p>Aspiring {personalInfo.interests.join(', ')} Professional</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-green-300 mb-2">> Languages</h3>
                    <ul>
                      {personalInfo.languages.map((lang, i) => (
                        <li key={i}>{lang}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-green-300 mb-2">> Connect</h3>
                    <a 
                      href={personalInfo.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 hover:text-green-300"
                    >
                      <Github size={16} />
                      <span>GitHub</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-green-300 mb-2">> Terminal</h3>
                <CommandLine />
              </div>
            </div>
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="flex items-center space-x-2 mb-4">
                  <Code size={20} />
                  <GlitchText text={category.charAt(0).toUpperCase() + category.slice(1)} />
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {items.map((item) => (
                    <div key={item} className="flex items-center space-x-2">
                      <span className="text-green-400">$</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lab Section */}
        {activeSection === 'lab' && (
          <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg">
            <h2 className="text-xl mb-4 flex items-center space-x-2">
              <Cpu size={24} />
              <GlitchText text="Home Lab Setup" />
            </h2>
            <div className="space-y-4">
              <div className="border border-green-400/20 p-4 rounded-lg">
                <h3 className="text-green-300 mb-2">Infrastructure</h3>
                <ul className="space-y-2">
                  <li>• 2x Raspberry Pi 3B</li>
                  <li>• 1x Raspberry Pi 5</li>
                  <li>• Network Configuration</li>
                </ul>
              </div>
              <div className="border border-green-400/20 p-4 rounded-lg">
                <h3 className="text-green-300 mb-2">Learning Focus</h3>
                <ul className="space-y-2">
                  <li>• Cisco Networking</li>
                  <li>• Cybersecurity Practices</li>
                  <li>• Linux System Administration</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Contact Section */}
        {activeSection === 'contact' && (
          <div className="bg-gray-800/90 backdrop-blur-sm p-6 rounded-lg">
            <form className="space-y-4">
              <div>
                <label className="block mb-2">Name:</label>
                <input
                  type="text"
                  className="w-full bg-gray-700 p-2 rounded text-white border border-green-400/20 focus:border-green-400 transition-colors"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block mb-2">Email:</label>
                <input
                  type="email"
                  className="w-full bg-gray-700 p-2 rounded text-white border border-green-400/20 focus:border-green-400 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block mb-2">Message:</label>
                <textarea
                  className="w-full bg-gray-700 p-2 rounded text-white border border-green-400/20 focus:border-green-400 transition-colors h-32"
                  placeholder="Your message here..."
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
