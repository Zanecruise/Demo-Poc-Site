import React from 'react';

interface CodeSnippetProps {
  title: string;
  code: string;
  visible: boolean;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({ title, code, visible }) => {
    
  const highlightedCode = code.replace(/"([^"]+)":/g, (match, key) => {
    return `<span class="text-cyan-400">"${key}"</span>:`;
  }).replace(/: "([^"]*)"/g, (match, value) => {
    return `: <span class="text-amber-400">"${value}"</span>`;
  }).replace(/: (\d+\.?\d*)/g, (match, number) => {
    return `: <span class="text-fuchsia-400">${number}</span>`;
  });

  return (
    <div className={`bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 flex flex-col transition-all duration-700 ease-in-out ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <h3 className="text-md font-semibold text-gray-300 p-3 border-b border-gray-700/50">{title}</h3>
      <pre className="text-xs p-4 overflow-x-auto h-full">
        <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
      </pre>
    </div>
  );
};

export default CodeSnippet;
