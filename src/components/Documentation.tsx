import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Documentation() {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-green-400">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-6 h-6" />
        <h2 className="text-xl font-bold">SimpleOS Documentation</h2>
      </div>

      <div className="space-y-4">
        <section>
          <h3 className="text-lg font-semibold mb-2">About SimpleOS</h3>
          <p className="text-sm leading-relaxed">
            SimpleOS is a web-based operating system simulator designed to demonstrate basic OS concepts
            like file systems, process management, and command-line interfaces. It provides a hands-on
            way to learn about operating system fundamentals in a safe, sandboxed environment.
          </p>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Available Commands</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">File System Commands</h4>
              <ul className="text-sm space-y-1">
                <li><code className="bg-gray-700 px-1 rounded">ls</code> - List directory contents</li>
                <li><code className="bg-gray-700 px-1 rounded">cd &lt;dir&gt;</code> - Change directory</li>
                <li><code className="bg-gray-700 px-1 rounded">cat &lt;file&gt;</code> - Display file contents</li>
                <li><code className="bg-gray-700 px-1 rounded">mkdir &lt;name&gt;</code> - Create directory</li>
                <li><code className="bg-gray-700 px-1 rounded">touch &lt;name&gt;</code> - Create empty file</li>
                <li><code className="bg-gray-700 px-1 rounded">edit &lt;file&gt;</code> - Edit file contents</li>
                <li><code className="bg-gray-700 px-1 rounded">write &lt;file&gt; &lt;content&gt;</code> - Write content to file</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">System Commands</h4>
              <ul className="text-sm space-y-1">
                <li><code className="bg-gray-700 px-1 rounded">help</code> - Show available commands</li>
                <li><code className="bg-gray-700 px-1 rounded">ps</code> - List running processes</li>
                <li><code className="bg-gray-700 px-1 rounded">clear</code> - Clear terminal screen</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Working with Files</h3>
          <div className="text-sm space-y-3">
            <div>
              <h4 className="font-medium mb-1">Creating Files</h4>
              <p className="mb-2">Use <code className="bg-gray-700 px-1 rounded">touch</code> to create empty files:</p>
              <pre className="bg-gray-700 p-2 rounded">
$ touch myfile.txt
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-1">Writing to Files</h4>
              <p className="mb-2">Use <code className="bg-gray-700 px-1 rounded">write</code> to add content to files:</p>
              <pre className="bg-gray-700 p-2 rounded">
$ write myfile.txt Hello, this is some content!
              </pre>
            </div>

            <div>
              <h4 className="font-medium mb-1">Interactive Editing</h4>
              <p className="mb-2">Use <code className="bg-gray-700 px-1 rounded">edit</code> to open the interactive editor:</p>
              <pre className="bg-gray-700 p-2 rounded">
$ edit myfile.txt
[Enter your text and press Ctrl+S to save]
              </pre>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold mb-2">Examples</h3>
          <div className="text-sm space-y-2">
            <p>1. Create and edit a file:</p>
            <pre className="bg-gray-700 p-2 rounded">
$ touch notes.txt
$ write notes.txt This is my first note
$ cat notes.txt
            </pre>
            
            <p>2. Create directory and manage files:</p>
            <pre className="bg-gray-700 p-2 rounded">
$ mkdir projects
$ cd projects
$ touch README.md
$ write README.md # My Projects\nThis is my workspace
$ cat README.md
            </pre>
            
            <p>3. Interactive file editing:</p>
            <pre className="bg-gray-700 p-2 rounded">
$ edit config.txt
[Enter configuration details]
$ cat config.txt
            </pre>
          </div>
        </section>
      </div>
    </div>
  );
}