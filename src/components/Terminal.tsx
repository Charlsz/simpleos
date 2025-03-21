import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Cpu, HardDrive } from 'lucide-react';
import { Command, Process, File, SystemStats } from '../types';

const initialFileSystem: File = {
  name: 'root',
  type: 'directory',
  createdAt: new Date(),
  children: [
    {
      name: 'home',
      type: 'directory',
      createdAt: new Date(),
      children: [
        {
          name: 'welcome.txt',
          type: 'file',
          content: 'Welcome to SimpleOS!\nType "help" to see available commands.',
          createdAt: new Date(),
        },
      ],
    },
  ],
};

const initialProcesses: Process[] = [
  {
    id: 1,
    name: 'system',
    status: 'running',
    cpu: 2,
    memory: 128,
    startTime: new Date(),
  },
];

export default function Terminal() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>(['Welcome to SimpleOS v1.0', 'Type "help" for available commands']);
  const [currentPath, setCurrentPath] = useState('/');
  const [processes, setProcesses] = useState<Process[]>(initialProcesses);
  const [fileSystem, setFileSystem] = useState<File>(initialFileSystem);
  const [stats, setStats] = useState<SystemStats>({
    cpuUsage: 5,
    memoryUsed: 256,
    memoryTotal: 1024,
    storageUsed: 128,
    storageTotal: 1024,
    uptime: 0,
  });
  const [editingFile, setEditingFile] = useState<{ name: string; content: string } | null>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);

  const getCurrentDirectory = (): File => {
    let current = fileSystem;
    const parts = currentPath.split('/').filter(Boolean);
    for (const part of parts) {
      const next = current.children?.find(c => c.name === part && c.type === 'directory');
      if (!next) return current;
      current = next;
    }
    return current;
  };

  const updateStats = () => {
    setStats(prev => ({
      ...prev,
      cpuUsage: Math.min(100, Math.max(1, prev.cpuUsage + (Math.random() - 0.5) * 10)),
      memoryUsed: Math.min(prev.memoryTotal, Math.max(128, prev.memoryUsed + (Math.random() - 0.5) * 50)),
      storageUsed: calculateStorageUsed(fileSystem),
      uptime: Math.floor(Date.now() / 1000),
    }));
  };

  const calculateStorageUsed = (dir: File): number => {
    let size = 0;
    if (dir.content) size += dir.content.length;
    if (dir.children) {
      size += dir.children.reduce((acc, child) => acc + calculateStorageUsed(child), 0);
    }
    return size;
  };

  const updateFileContent = (filename: string, content: string) => {
    setFileSystem(prev => {
      const updateChildren = (dir: File): File => {
        if (dir.children) {
          const fileIndex = dir.children.findIndex(f => f.name === filename && f.type === 'file');
          if (fileIndex !== -1) {
            const updatedChildren = [...dir.children];
            updatedChildren[fileIndex] = {
              ...updatedChildren[fileIndex],
              content,
            };
            return { ...dir, children: updatedChildren };
          }
          return {
            ...dir,
            children: dir.children.map(updateChildren),
          };
        }
        return dir;
      };
      return updateChildren(prev);
    });
  };

  useEffect(() => {
    const interval = setInterval(updateStats, 2000);
    return () => clearInterval(interval);
  }, [fileSystem]);

  const commands: Record<string, Command> = {
    help: {
      name: 'help',
      description: 'Show available commands',
      execute: () => `Available commands:
  help - Show this help message
  ls - List directory contents
  cd <dir> - Change directory
  cat <file> - Show file contents
  ps - List running processes
  clear - Clear terminal
  mkdir <name> - Create directory
  touch <name> - Create file
  edit <file> - Edit file contents
  write <file> <content> - Write content to file`,
    },
    ls: {
      name: 'ls',
      description: 'List directory contents',
      execute: () => {
        const currentDir = getCurrentDirectory();
        return (currentDir.children || [])
          .map(f => `${f.type === 'directory' ? '📁' : '📄'} ${f.name}`)
          .join('\n');
      },
    },
    cd: {
      name: 'cd',
      description: 'Change directory',
      execute: (args) => {
        if (!args.length) {
          setCurrentPath('/');
          return '';
        }

        const path = args[0];
        if (path === '..') {
          const parts = currentPath.split('/').filter(Boolean);
          parts.pop();
          setCurrentPath('/' + parts.join('/'));
          return '';
        }

        const currentDir = getCurrentDirectory();
        const targetDir = currentDir.children?.find(
          c => c.name === path && c.type === 'directory'
        );

        if (!targetDir) {
          return `cd: ${path}: No such directory`;
        }

        setCurrentPath(currentPath === '/' ? `/${path}` : `${currentPath}/${path}`);
        return '';
      },
    },
    cat: {
      name: 'cat',
      description: 'Show file contents',
      execute: (args) => {
        if (!args.length) return 'Usage: cat <filename>';

        const currentDir = getCurrentDirectory();
        const file = currentDir.children?.find(
          f => f.name === args[0] && f.type === 'file'
        );

        if (!file) return `cat: ${args[0]}: No such file`;
        return file.content || '';
      },
    },
    clear: {
      name: 'clear',
      description: 'Clear terminal',
      execute: () => {
        setOutput([]);
        return '';
      },
    },
    ps: {
      name: 'ps',
      description: 'List processes',
      execute: () => {
        return 'PID\tNAME\t\tSTATUS\t\tCPU\tMEM\n' +
          processes
            .map(p => `${p.id}\t${p.name}\t\t${p.status}\t\t${p.cpu}%\t${p.memory}MB`)
            .join('\n');
      },
    },
    mkdir: {
      name: 'mkdir',
      description: 'Create directory',
      execute: (args) => {
        if (!args.length) return 'Usage: mkdir <dirname>';

        const dirname = args[0];
        const currentDir = getCurrentDirectory();
        
        if (currentDir.children?.some(c => c.name === dirname)) {
          return `mkdir: ${dirname}: Directory already exists`;
        }

        const newDir: File = {
          name: dirname,
          type: 'directory',
          createdAt: new Date(),
          children: [],
        };

        setFileSystem(prev => {
          const updateChildren = (dir: File): File => {
            if (dir === currentDir) {
              return {
                ...dir,
                children: [...(dir.children || []), newDir],
              };
            }
            return {
              ...dir,
              children: dir.children?.map(updateChildren),
            };
          };
          return updateChildren(prev);
        });

        return '';
      },
    },
    touch: {
      name: 'touch',
      description: 'Create file',
      execute: (args) => {
        if (!args.length) return 'Usage: touch <filename>';

        const filename = args[0];
        const currentDir = getCurrentDirectory();
        
        if (currentDir.children?.some(c => c.name === filename)) {
          return `touch: ${filename}: File already exists`;
        }

        const newFile: File = {
          name: filename,
          type: 'file',
          content: '',
          createdAt: new Date(),
        };

        setFileSystem(prev => {
          const updateChildren = (dir: File): File => {
            if (dir === currentDir) {
              return {
                ...dir,
                children: [...(dir.children || []), newFile],
              };
            }
            return {
              ...dir,
              children: dir.children?.map(updateChildren),
            };
          };
          return updateChildren(prev);
        });

        return '';
      },
    },
    edit: {
      name: 'edit',
      description: 'Edit file contents',
      execute: (args) => {
        if (!args.length) return 'Usage: edit <filename>';

        const filename = args[0];
        const currentDir = getCurrentDirectory();
        const file = currentDir.children?.find(
          f => f.name === filename && f.type === 'file'
        );

        if (!file) return `edit: ${filename}: No such file`;

        setEditingFile({ name: filename, content: file.content || '' });
        return 'Entering edit mode. Type your content and press Ctrl+S to save:';
      },
    },
    write: {
      name: 'write',
      description: 'Write content to file',
      execute: (args) => {
        if (args.length < 2) return 'Usage: write <filename> <content>';

        const [filename, ...contentParts] = args;
        const content = contentParts.join(' ');
        const currentDir = getCurrentDirectory();
        const file = currentDir.children?.find(
          f => f.name === filename && f.type === 'file'
        );

        if (!file) return `write: ${filename}: No such file`;

        updateFileContent(filename, content);
        return `Written ${content.length} bytes to ${filename}`;
      },
    },
  };

  const handleCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().split(' ');
    const commandObj = commands[command];

    if (!commandObj) {
      return `Command not found: ${command}`;
    }

    return commandObj.execute(args);
  };

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const result = handleCommand(input);
      setOutput([...output, `\n${currentPath}$ ${input}`, result]);
      setInput('');
    }
  };

  const handleEditingKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey && e.key === 's' && editingFile) {
      e.preventDefault();
      updateFileContent(editingFile.name, editingFile.content);
      setOutput([...output, `\nSaved ${editingFile.name}`]);
      setEditingFile(null);
    }
  };

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <TerminalIcon className="w-8 h-8" />
          <h1 className="text-2xl font-mono">SimpleOS Terminal</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-5 h-5" />
              <h2>System Status</h2>
            </div>
            <div className="text-sm">
              <p>CPU Usage: {stats.cpuUsage.toFixed(1)}%</p>
              <p>Memory: {stats.memoryUsed}MB/{stats.memoryTotal}MB</p>
              <p>Uptime: {stats.uptime}s</p>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-5 h-5" />
              <h2>Storage</h2>
            </div>
            <div className="text-sm">
              <p>Total: {stats.storageTotal}MB</p>
              <p>Used: {stats.storageUsed}MB</p>
              <p>Free: {(stats.storageTotal - stats.storageUsed)}MB</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div 
            ref={terminalRef}
            className="font-mono text-sm h-96 overflow-y-auto mb-4 whitespace-pre-wrap"
          >
            {output.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
            {editingFile && (
              <div className="mt-2">
                <textarea
                  value={editingFile.content}
                  onChange={(e) => setEditingFile({ ...editingFile, content: e.target.value })}
                  onKeyDown={handleEditingKeyDown}
                  className="w-full h-32 bg-gray-900 text-green-400 p-2 rounded border border-green-400 focus:outline-none font-mono"
                  placeholder="Enter your text here. Press Ctrl+S to save."
                />
              </div>
            )}
          </div>
          
          {!editingFile && (
            <div className="flex items-center gap-2">
              <span>{currentPath}$</span>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleSubmit}
                className="flex-1 bg-transparent border-none outline-none font-mono"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}